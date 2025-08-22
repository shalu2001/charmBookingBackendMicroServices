import {
  Booking,
  BookingRequestDTO,
  BookingSlot,
  BookingStatus,
  SalonService,
  SalonWorker,
} from '@charmbooking/common';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    @InjectRepository(SalonWorker)
    private readonly workerRepository: Repository<SalonWorker>,
    @InjectRepository(SalonService)
    private readonly serviceRepository: Repository<SalonService>,
  ) {}

  /**
   * Checks availability for a given salon service, date, and time range.
   * Returns true if the slot is available, false otherwise.
   */
  async getAvailableSlots(
    salonId: string,
    salonServiceId: string,
    bookingDate: string,
    startTime: string,
  ): Promise<BookingSlot[]> {
    const service = await this.serviceRepository.findOne({
      where: { serviceId: salonServiceId },
    });

    // Calculate endTime using startTime, service duration, and buffer (assume buffer is in minutes)
    const buffer = service?.bufferTime ?? 0; // fallback to 0 if buffer is undefined
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const totalMinutes =
      startHour * 60 + startMinute + (service?.duration ?? 0) + buffer;
    const endHour = Math.floor(totalMinutes / 60);
    const endMinute = totalMinutes % 60;
    const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute
      .toString()
      .padStart(2, '0')}`;

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
      .andWhere('leave.id IS NULL') // Exclude workers who have leave in the range
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

    return availableSlots;
  }

  async createBooking(data: BookingRequestDTO): Promise<any> {
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
}
