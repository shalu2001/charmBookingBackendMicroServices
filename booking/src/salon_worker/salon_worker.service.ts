import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GenericError,
  Salon,
  SalonService,
  SalonWorker,
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
}
