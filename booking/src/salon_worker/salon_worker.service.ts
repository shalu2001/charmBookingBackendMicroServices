import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GenericError,
  Salon,
  SalonService,
  SalonWorker,
  SalonWorkerLeave,
} from '@charmbooking/common';
import { CreateSalonWorkerDto } from './dto/salon_worker.dto';
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

  async getSalonWorkers(salonId: UUID): Promise<SalonWorker[]> {
    return this.salonWorkerRepository.find({
      where: {
        salonId: salonId,
      },
    });
  }

  async addSalonWorkerLeave(
    salonId: UUID,
    workerId: UUID,
    leaveDates: Date[],
  ): Promise<void> {
    const worker = await this.salonWorkerRepository.findOne({
      where: {
        workerId: workerId,
        salonId: salonId,
      },
    });

    if (!worker) {
      throw new GenericError('Worker not found', HttpStatus.NOT_FOUND);
    }

    // Save each leave date as a separate SalonWorkerLeave record
    for (const leaveDate of leaveDates) {
      const leave = this.salonWorkerLeaveRepository.create({
        workerId: workerId,
        worker: worker,
        date: leaveDate.toISOString().split('T')[0], // 'YYYY-MM-DD'
        startTime: '00:00:00', // or accept as param
        endTime: '23:59:59', // or accept as param
      });
      await this.salonWorkerLeaveRepository.save(leave);
    }
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
