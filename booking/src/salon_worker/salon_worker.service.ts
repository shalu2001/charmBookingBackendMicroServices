import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import {
  GenericError,
  Salon,
  SalonService,
  SalonWorker,
  SalonWorkerLeave,
  SalonHoliday,
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
    // Extract just the salonId and workerId for the query
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

    // Save each leave date as a separate SalonWorkerLeave record
    for (const leave of leaveInputs) {
      const dateStr =
        typeof leave.date === 'string'
          ? leave.date
          : new Date(leave.date).toISOString().split('T')[0];

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
}
