import {
  Booking,
  BookingRequestDto,
  BookingSlot,
  BookingStatus,
  CheckServiceTimeAvailabilityResponseDto,
  DayOfWeek,
  GenericError,
  GetAvailableSlotsResponseDto,
  SalonHoliday,
  SalonService,
  SalonWeeklyHours,
  SalonWorker,
  SalonWorkerLeave,
  TimeString,
} from '@charmbooking/common';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';

type Event = { t: TimeString; delta: number };

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(SalonWorker)
    private readonly workerRepository: Repository<SalonWorker>,
    @InjectRepository(SalonWorkerLeave)
    private readonly workerLeaveRepository: Repository<SalonWorkerLeave>,
    @InjectRepository(SalonService)
    private readonly serviceRepository: Repository<SalonService>,
    @InjectRepository(SalonWeeklyHours)
    private readonly weeklyHoursRepository: Repository<SalonWeeklyHours>,
    @InjectRepository(SalonHoliday)
    private readonly holidayRepository: Repository<SalonHoliday>,
  ) {}

  async findById(id: string): Promise<Booking | null> {
    return this.bookingRepository.findOne({ where: { id } });
  }

  async update(id: string, updateData: Partial<Booking>): Promise<Booking> {
    await this.bookingRepository.update(id, updateData);
    const booking = await this.bookingRepository.findOne({ where: { id } });
    if (!booking) {
      throw new GenericError('Booking not found', HttpStatus.NOT_FOUND);
    }
    return booking;
  }

  /**
   * Checks availability for a given salon service, date, and time range.
   * Returns true if the slot is available, false otherwise.
   */
  async checkServiceTimeAvailability(
    salonId: string,
    salonServiceId: string,
    bookingDate: string,
    startTime: string,
  ): Promise<CheckServiceTimeAvailabilityResponseDto> {
    const service = await this.serviceRepository.findOne({
      where: { serviceId: salonServiceId },
    });

    if (!service) {
      throw new GenericError('Service not found', HttpStatus.NOT_FOUND);
    }

    // Calculate endTime using TimeString, service duration, and buffer
    const buffer = service.bufferTime ?? 0;
    const endTime = new TimeString(startTime)
      .add(0, (service.duration ?? 0) + buffer)
      .toString();

    const workers = await this.workerRepository
      .createQueryBuilder('worker')
      .leftJoinAndSelect('worker.services', 'service')
      .leftJoinAndSelect('worker.salon', 'salon')
      .leftJoin(
        'worker.leaves',
        'leave',
        'leave.date = :bookingDate AND ((leave.startTime < :endTime AND leave.endTime > :startTime))',
        { bookingDate, startTime, endTime },
      )
      .where('salon.id = :salonId', { salonId: salonId.toString() })
      .andWhere('service.serviceId = :salonServiceId', {
        salonServiceId: salonServiceId.toString(),
      })
      .andWhere('leave.id IS NULL')
      .getMany();

    const bookings = await this.bookingRepository.find({
      where: {
        salon_id: salonId,
        salon_service_id: salonServiceId,
        booking_date: bookingDate,
        start_time: Between(startTime, endTime),
        status: In([BookingStatus.PENDING, BookingStatus.CONFIRMED]),
      },
    });
    const bookedWorkerIds = new Set(bookings.map((b) => b.worker_id));

    const availableSlots: BookingSlot[] = workers
      .filter((worker) => !bookedWorkerIds.has(worker.workerId))
      .map((worker) => ({
        serviceId: salonServiceId,
        date: bookingDate,
        startTime,
        duration:
          worker.services.find(
            (s) => String(s.serviceId) === String(salonServiceId),
          )?.duration || 0,
        workerId: worker.workerId,
      }));

    let nextAvailableSlot: BookingSlot | undefined = undefined;

    if (availableSlots.length === 0) {
      // Try to find the next available slot on the same day, checking every 15 minutes until closing
      // Get salon's open/close time for the day
      const weeklyHours = await this.weeklyHoursRepository.findOne({
        where: {
          salon_id: service.salon.id,
          day_of_week: this.getDayOfWeek(bookingDate),
        },
      });

      if (weeklyHours) {
        const salonCloseTime = weeklyHours.close_time;
        const serviceDuration = service.duration + (service.bufferTime || 0);

        let current = new TimeString(startTime).add(0, 15);
        const close = new TimeString(salonCloseTime);

        while (current.isBefore(close)) {
          const slotEnd = current.add(0, serviceDuration);
          if (slotEnd.isAfter(close)) break;

          // Find available workers for this slot
          const slotBookings = await this.bookingRepository.find({
            where: {
              salon_id: salonId,
              salon_service_id: salonServiceId,
              booking_date: bookingDate,
              start_time: Between(current.toString(), slotEnd.toString()),
              status: In([BookingStatus.PENDING, BookingStatus.CONFIRMED]),
            },
          });
          const slotBookedWorkerIds = new Set(
            slotBookings.map((b) => b.worker_id),
          );

          const slotWorkers = await this.workerRepository
            .createQueryBuilder('worker')
            .leftJoinAndSelect('worker.services', 'service')
            .leftJoinAndSelect('worker.salon', 'salon')
            .leftJoin(
              'worker.leaves',
              'leave',
              'leave.date = :bookingDate AND ((leave.startTime < :slotEnd AND leave.endTime > :slotStart))',
              {
                bookingDate,
                slotStart: current.toString(),
                slotEnd: slotEnd.toString(),
              },
            )
            .where('salon.id = :salonId', { salonId: salonId.toString() })
            .andWhere('service.serviceId = :salonServiceId', {
              salonServiceId: salonServiceId.toString(),
            })
            .andWhere('leave.id IS NULL')
            .getMany();

          const slotAvailableWorker = slotWorkers.find(
            (worker) => !slotBookedWorkerIds.has(worker.workerId),
          );

          if (slotAvailableWorker) {
            nextAvailableSlot = {
              serviceId: salonServiceId,
              date: bookingDate,
              startTime: current.toString(),
              duration: service.duration,
              workerId: slotAvailableWorker.workerId,
            };
            break;
          }

          current = current.add(0, 15);
        }
      }
    }

    return {
      slots: availableSlots,
      nextAvailableSlot,
    };
  }

  async getAvailableSlots(
    salonId: string,
    serviceId: string,
    date: string,
  ): Promise<GetAvailableSlotsResponseDto> {
    const isHoliday = await this.holidayRepository.findOne({
      where: { salonId, date },
    });
    if (isHoliday) {
      return {
        salonId,
        serviceId,
        date,
        isHoliday: true,
        times: [],
      };
    }

    const service = await this.serviceRepository.findOne({
      where: { serviceId },
    });

    if (!service) {
      throw new GenericError('Service not found', HttpStatus.NOT_FOUND);
    }

    const serviceWorkers = service.workers;
    const workerIds = serviceWorkers.map((w) => w.workerId);
    const salon = service.salon;

    if (serviceWorkers.length === 0) {
      throw new GenericError(
        'No workers available for this service',
        HttpStatus.BAD_REQUEST,
      );
    }

    const weeklyHours = await this.weeklyHoursRepository.findOne({
      where: { salon_id: salon.id, day_of_week: this.getDayOfWeek(date) },
    });

    const salonOpenTime = weeklyHours?.open_time;
    const salonCloseTime = weeklyHours?.close_time;

    if (!salonOpenTime || !salonCloseTime) {
      throw new GenericError('Salon hours not found', HttpStatus.BAD_REQUEST);
    }

    const bookings = await this.bookingRepository.find({
      where: {
        worker_id: In(workerIds),
        booking_date: date,
        status: In([BookingStatus.PENDING, BookingStatus.CONFIRMED]),
      },
      relations: ['salonService'],
    });

    const workerLeaves = await this.workerLeaveRepository.find({
      where: {
        workerId: In(workerIds),
        date,
      },
    });

    const workerUnavailability: Record<
      string,
      Array<{ start: TimeString; end: TimeString }>
    > = {};

    workerIds.forEach((workerId) => {
      workerUnavailability[workerId] = [];
    });

    bookings.forEach((booking) => {
      if (!booking.worker_id) return;

      const bookingService = booking.salonService;
      if (!bookingService) return;

      const startTime = new TimeString(booking.start_time);
      const endTime = startTime.add(
        0,
        bookingService.duration + bookingService.bufferTime,
      );

      workerUnavailability[booking.worker_id].push({
        start: startTime,
        end: endTime,
      });
    });

    workerLeaves.forEach((leave) => {
      const workerId = leave.workerId;
      if (!workerUnavailability[workerId]) return;

      workerUnavailability[workerId].push({
        start: new TimeString(leave.startTime),
        end: new TimeString(leave.endTime),
      });
    });

    const events: Event[] = [];

    Object.values(workerUnavailability).forEach((ranges) => {
      ranges.forEach((r) => {
        events.push({ t: r.start, delta: 1 });
        events.push({ t: r.end, delta: -1 });
      });
    });

    // sort by time; if same time prefer start (+1) before end (-1) so zero-length overlaps count correctly
    events.sort((a, b) => {
      const diff = a.t.toSeconds() - b.t.toSeconds();
      if (diff !== 0) return diff;
      return b.delta - a.delta; // start (+1) before end (-1)
    });

    const serviceBusyRanges: Array<{ start: TimeString; end: TimeString }> = [];
    let active = 0;
    let busyStart: TimeString | null = null;
    const workerCount = workerIds.length;

    for (const ev of events) {
      const prevActive = active;
      active += ev.delta;

      // we just entered "all workers busy"
      if (prevActive < workerCount && active === workerCount) {
        busyStart = ev.t;
      }

      // we just left "all workers busy"
      if (prevActive === workerCount && active < workerCount && busyStart) {
        // push range [busyStart, ev.t)
        serviceBusyRanges.push({ start: busyStart, end: ev.t });
        busyStart = null;
      }
    }

    let currentTime = new TimeString(salonOpenTime);
    const closeTime = new TimeString(salonCloseTime);
    const times: string[] = [];

    const serviceDuration = service.duration + (service.bufferTime || 0);

    while (currentTime.isBefore(closeTime)) {
      const slotEndTime = currentTime.add(0, serviceDuration);

      // Ensure the slot fits within salon hours
      if (slotEndTime.isAfter(closeTime)) {
        break;
      }

      // Check if this slot overlaps with any busy range
      const overlaps = serviceBusyRanges.some(
        (range) =>
          // slot starts before busy ends AND slot ends after busy starts
          currentTime.isBefore(range.end) && slotEndTime.isAfter(range.start),
      );

      if (!overlaps) {
        times.push(currentTime.toString());
      }

      currentTime = currentTime.add(0, 15); // Check every 15 minutes
    }

    return {
      salonId,
      serviceId,
      date,
      isHoliday: false,
      times,
    };
  }

  async createBooking(data: BookingRequestDto): Promise<any> {
    const booking: Partial<Booking> = {
      salon_id: data.salonId,
      user_id: data.userId,
      salon_service_id: data.serviceId,
      booking_date: data.date,
      worker_id: data.workerId,
      start_time: data.startTime,
      status: BookingStatus.PENDING,
    };
    return this.bookingRepository.save(booking);
  }

  private getDayOfWeek(date: string): DayOfWeek {
    const days: DayOfWeek[] = [
      DayOfWeek.Sunday,
      DayOfWeek.Monday,
      DayOfWeek.Tuesday,
      DayOfWeek.Wednesday,
      DayOfWeek.Thursday,
      DayOfWeek.Friday,
      DayOfWeek.Saturday,
    ];
    const day = new Date(date).getUTCDay();
    return days[day];
  }
}
