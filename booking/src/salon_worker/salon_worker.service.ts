import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, MoreThanOrEqual, Repository } from 'typeorm';
import {
  GenericError,
  SalonService,
  SalonWorker,
  SalonWorkerLeave,
  SalonHoliday,
  SalonWeeklyHours,
  DayOfWeek,
  Booking,
} from '@charmbooking/common';
import {
  CreateSalonWorkerDto,
  SalonWorkerLeaveDto,
} from './dto/salon_worker.dto';
import { UUID } from 'crypto';

@Injectable()
export class SalonWorkerService {
  constructor(
    @InjectRepository(SalonWorker)
    private salonWorkerRepository: Repository<SalonWorker>,
    @InjectRepository(SalonService)
    private salonServiceRepository: Repository<SalonService>,
    @InjectRepository(SalonWorkerLeave)
    private salonWorkerLeaveRepository: Repository<SalonWorkerLeave>,
    @InjectRepository(SalonHoliday)
    private salonHolidayRepository: Repository<SalonHoliday>,
    @InjectRepository(SalonWeeklyHours)
    private salonWeeklyHoursRepository: Repository<SalonWeeklyHours>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async createSalonWorker(data: CreateSalonWorkerDto): Promise<SalonWorker> {
    const servicesData = data.services
      ? await Promise.all(
          data.services.map(
            async (name) =>
              await this.salonServiceRepository.findOneBy({ name: name }),
          ),
        )
      : [];

    // Only include services that belong to the same salon as the worker
    const filteredServices = servicesData.filter(
      (service): service is SalonService =>
        service !== null && service.salonId === data.salonId,
    );

    if (!filteredServices.length) {
      throw new GenericError('Service not found', HttpStatus.NOT_FOUND);
    }

    const salonWorker = this.salonWorkerRepository.create({
      ...data,
      services: filteredServices,
    });
    return this.salonWorkerRepository.save(salonWorker);
  }

  async getSalonWorker(salonId: UUID): Promise<SalonWorker | null> {
    return this.salonWorkerRepository.findOne({
      where: {
        salonId: salonId,
      },
    });
  }

  async getWorkersByService(serviceId: UUID): Promise<SalonWorker[]> {
    return this.salonWorkerRepository.find({
      where: {
        services: {
          serviceId: serviceId,
        },
      },
    });
  }

  async getSalonWorkers(salonId: UUID): Promise<any[]> {
    const workers = await this.salonWorkerRepository.find({
      where: { salonId },
      relations: ['services'],
    });

    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format

    // Get all leaves for today
    const workerLeaves = await this.salonWorkerLeaveRepository.find({
      where: { date: currentDate },
    });

    // Get salon holiday for today
    const salonHoliday = await this.salonHolidayRepository.findOne({
      where: {
        salonId: salonId,
        date: currentDate,
      },
    });

    return workers.map((worker) => ({
      ...worker,
      services:
        worker.services?.map((service) => ({
          id: service.serviceId,
          name: service.name,
        })) || [],
      status: salonHoliday
        ? 'on-leave' // If salon is on holiday, all workers are on leave
        : workerLeaves.some((leave) => leave.workerId === worker.workerId)
          ? 'on-leave'
          : 'active',
    }));
  }

  async addSalonWorkerLeave(
    salonId: UUID,
    workerId: UUID,
    leaveInputs: { date: string; startTime: string; endTime: string }[],
  ): Promise<any> {
    const worker = await this.salonWorkerRepository.findOne({
      where: {
        workerId,
        salonId,
      },
    });

    if (!worker) {
      throw new GenericError('Worker not found', HttpStatus.NOT_FOUND);
    }

    const savedLeaves: SalonWorkerLeave[] = [];

    for (const leave of leaveInputs) {
      const dateStr =
        typeof leave.date === 'string'
          ? leave.date
          : new Date(leave.date).toISOString().split('T')[0];

      // Check for existing bookings in the time period
      const existingBookings = await this.bookingRepository
        .createQueryBuilder('booking')
        .where('booking.worker_id = :workerId', { workerId })
        .andWhere('booking.booking_date = :dateStr', { dateStr })
        .andWhere('booking.status NOT IN (:...statuses)', {
          statuses: ['CANCELLED', 'COMPLETED'],
        })
        .andWhere(
          `
          (
            TIME(booking.start_time) < :leaveEnd
            AND
            ADDTIME(booking.start_time, SEC_TO_TIME(booking.duration * 60)) > :leaveStart
          )
        `,
          {
            leaveStart: leave.startTime,
            leaveEnd: leave.endTime,
          },
        )
        .getMany();

      if (existingBookings.length > 0) {
        throw new GenericError(
          `Worker has existing bookings on ${dateStr} between ${leave.startTime} and ${leave.endTime}`,
          HttpStatus.CONFLICT,
        );
      }

      const leaveEntity = this.salonWorkerLeaveRepository.create({
        workerId: workerId,
        worker: worker,
        date: dateStr,
        startTime: leave.startTime,
        endTime: leave.endTime,
      });

      const savedLeave =
        await this.salonWorkerLeaveRepository.save(leaveEntity);
      savedLeaves.push(savedLeave);
    }

    return {
      success: true,
      message: `Added ${savedLeaves.length} leave records successfully`,
      leaves: savedLeaves,
    };
  }

  async getSalonWorkerLeaves(salonId: UUID, workerId: UUID): Promise<any> {
    return this.salonWorkerLeaveRepository.find({
      where: {
        workerId: workerId,
        worker: {
          salonId: salonId,
        },
      },
    });
  }

  async getSalonWorkersLeaves(salonId: UUID): Promise<any> {
    console.log('Fetching leaves for salonId:', salonId);
    const workers = await this.salonWorkerRepository.find({
      where: {
        salonId: salonId,
      },
    });
    if (workers.length === 0) {
      throw new GenericError(
        'No workers found for this salon',
        HttpStatus.NOT_FOUND,
      );
    }

    const today = new Date().toISOString().split('T')[0];

    const result: {
      workerId: string;
      name: string;
      leaves: SalonWorkerLeaveDto[];
    }[] = [];
    for (const worker of workers) {
      const leaves = await this.salonWorkerLeaveRepository.find({
        where: {
          worker: { workerId: worker.workerId },
          date: MoreThanOrEqual(today),
        },
        relations: ['worker'],
        order: { date: 'ASC' },
      });
      if (leaves.length > 0) {
        result.push({
          workerId: worker.workerId,
          name: worker.name,
          leaves,
        });
      }
    }
    return result;
  }

  async updateSalonWorker(data: any): Promise<SalonWorker> {
    const worker = await this.salonWorkerRepository.findOne({
      where: {
        workerId: data.id,
      },
    });

    if (!worker) {
      throw new GenericError('Worker not found', HttpStatus.NOT_FOUND);
    }

    this.salonWorkerRepository.merge(worker, data);
    return this.salonWorkerRepository.save(worker);
  }

  async getSalonWorkerSchedules(salonId: UUID): Promise<any> {
    const workers = await this.salonWorkerRepository.find({
      where: {
        salonId: salonId,
      },
    });
    if (workers.length === 0) {
      throw new GenericError(
        'No workers found for this salon',
        HttpStatus.NOT_FOUND,
      );
    }

    // Get the current week's Monday and Sunday
    const today = new Date();
    const monday = new Date(today);
    monday.setDate(today.getDate() - today.getDay() + 1);
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay() + 7);

    const mondayStr = monday.toISOString().split('T')[0];
    const sundayStr = sunday.toISOString().split('T')[0];

    const schedules = await Promise.all(
      workers.map(async (worker) => {
        // Get leaves for the week
        const leaves = await this.salonWorkerLeaveRepository.find({
          where: {
            worker: { workerId: worker.workerId },
            date: Between(mondayStr, sundayStr),
          },
        });

        // Get bookings for the week
        const bookings = await this.bookingRepository.find({
          where: {
            worker_id: worker.workerId,
            booking_date: Between(mondayStr, sundayStr),
            status: In(['PENDING', 'CONFIRMED']),
          },
          relations: ['salonService'],
        });

        // Get salon weekly hours for the week
        const weeklyHours = await this.salonWeeklyHoursRepository.find({
          where: {
            salon_id: salonId,
          },
        });

        // Get salon holidays for the week
        const holidays = await this.salonHolidayRepository.find({
          where: {
            salonId: salonId,
            date: Between(mondayStr, sundayStr),
          },
        });

        // Generate daily schedule for the week
        const dailySchedules: any[] = [];
        const current = new Date(monday);

        // Map JavaScript day numbers to DayOfWeek enum
        const dayMap = [
          DayOfWeek.Sunday, // 0
          DayOfWeek.Monday, // 1
          DayOfWeek.Tuesday, // 2
          DayOfWeek.Wednesday, // 3
          DayOfWeek.Thursday, // 4
          DayOfWeek.Friday, // 5
          DayOfWeek.Saturday, // 6
        ];

        while (current <= sunday) {
          const dateStr = current.toISOString().split('T')[0];
          const dayOfWeek = current.getDay(); // 0 = Sunday, 1 = Monday, etc.
          const dayName = dayMap[dayOfWeek];

          // Check if it's a holiday
          const isHoliday = holidays.some(
            (holiday) => holiday.date === dateStr,
          );

          // Get salon hours for this day
          const dayHours = weeklyHours.find((wh) => wh.day_of_week === dayName);

          // Get leaves for this day
          const dayLeaves = leaves.filter((leave) => leave.date === dateStr);

          // Get bookings for this day
          const dayBookings = bookings.filter(
            (booking) => booking.booking_date === dateStr,
          );

          dailySchedules.push({
            date: dateStr,
            dayOfWeek: dayOfWeek,
            dayName: dayName,
            isHoliday: isHoliday,
            salonHours: dayHours
              ? {
                  openTime: dayHours.open_time,
                  closeTime: dayHours.close_time,
                }
              : null,
            leaves: dayLeaves.map((leave) => ({
              startTime: leave.startTime,
              endTime: leave.endTime,
            })),
            bookings: dayBookings.map((booking) => ({
              startTime: booking.start_time,
              duration: booking.salonService?.duration || 60,
              status: booking.status,
            })),
          });

          current.setDate(current.getDate() + 1);
        }

        return {
          workerId: worker.workerId,
          name: worker.name,
          weekSchedule: {
            startDate: mondayStr,
            endDate: sundayStr,
            dailySchedules: dailySchedules,
          },
        };
      }),
    );

    // Define interfaces for better type safety
    interface DailySchedule {
      date: string;
      isHoliday: boolean;
      salonHours: { openTime: string; closeTime: string } | null;
      leaves: Array<{ startTime: string; endTime: string }>;
      bookings: Array<{ startTime: string; duration: number; status: string }>;
    }

    interface ScheduleEvent {
      id: string;
      title: string;
      start: string;
      end: string;
      type: 'HOLIDAY' | 'AVAILABLE' | 'LEAVE' | 'BOOKING';
      status?: string;
    }

    const formattedSchedules = schedules.flatMap((worker) =>
      worker.weekSchedule.dailySchedules.flatMap(
        (day: DailySchedule): ScheduleEvent[] => {
          const events: ScheduleEvent[] = [];

          // Add holidays (when worker is not available due to salon closure)
          if (day.isHoliday) {
            events.push({
              id: `${worker.workerId}-${day.date}-holiday`,
              title: `${worker.name}`,
              start: `${day.date}T00:00:00`,
              end: `${day.date}T23:59:59`,
              type: 'HOLIDAY',
            });
            return events;
          }

          // Skip adding available blocks - only show non-available times

          // Add leaves (when worker is not available due to personal leave)
          day.leaves.forEach((leave) => {
            events.push({
              id: `${worker.workerId}`,
              title: `${worker.name}`,
              start: `${day.date}T${leave.startTime}`,
              end: `${day.date}T${leave.endTime}`,
              type: 'LEAVE',
            });
          });

          // Add bookings (when worker is not available due to appointments)
          day.bookings.forEach((booking) => {
            // Calculate end time based on start time and duration
            const startTime = new Date(`${day.date}T${booking.startTime}`);
            const durationMinutes = booking.duration || 60; // Default to 60 minutes if no duration
            const endTime = new Date(
              startTime.getTime() + durationMinutes * 60000,
            );
            const endTimeString = endTime.toTimeString().slice(0, 8); // Format as HH:MM:SS

            events.push({
              id: `${worker.workerId}`,
              title: `${worker.name}`,
              start: `${day.date}T${booking.startTime}`,
              end: `${day.date}T${endTimeString}`,
              type: 'BOOKING',
              status: booking.status,
            });
          });

          return events;
        },
      ),
    );

    // Extract unique workers for filtering
    const workersInfo = workers.map((worker) => ({
      workerId: worker.workerId,
      name: worker.name,
    }));

    return {
      events: formattedSchedules,
      workers: workersInfo,
    };
  }
}
