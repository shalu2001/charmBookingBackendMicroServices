import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSalonServiceDto } from './dto/create-salon_service.dto';
import { UpdateSalonServiceDto } from './dto/update-salon_service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GenericError,
  Salon,
  SalonCategory,
  SalonService,
  Booking,
} from '@charmbooking/common';
import { In, Repository } from 'typeorm';

@Injectable()
export class SalonServiceService {
  constructor(
    @InjectRepository(SalonService)
    private salonServiceRepository: Repository<SalonService>,
    @InjectRepository(Salon)
    private salonRepository: Repository<Salon>,
    @InjectRepository(SalonCategory)
    private salonCategoryRepository: Repository<SalonCategory>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  private async checkSalonExists(salonId: string): Promise<Salon> {
    const salon = await this.salonRepository.findOne({
      where: { id: salonId },
    });
    if (!salon) {
      throw new GenericError(
        `Salon with ID ${salonId} does not exist.`,
        HttpStatus.NOT_FOUND,
      );
    }
    return salon;
  }

  async create(createSalonServiceDto: CreateSalonServiceDto) {
    await this.checkSalonExists(createSalonServiceDto.salonId);
    const categories = await this.salonCategoryRepository.findBy({
      categoryId: In(createSalonServiceDto.categoryIds),
    });
    if (categories.length !== createSalonServiceDto.categoryIds.length) {
      throw new GenericError(
        'You need to provide one or more valid category IDs.',
        HttpStatus.BAD_REQUEST,
      );
    }
    console.log(categories);
    const newService = this.salonServiceRepository.create({
      ...createSalonServiceDto,
      categories,
    });
    return this.salonServiceRepository.save(newService);
  }

  findAll() {
    return this.salonServiceRepository.find({
      relations: ['salon', 'categories'],
    });
  }

  findOne(serviceId: string) {
    return this.salonServiceRepository.findOne({
      where: { serviceId },
      relations: ['salon', 'categories'],
    });
  }

  async findBySalon(salonId: string) {
    await this.checkSalonExists(salonId);
    return this.salonServiceRepository.find({
      where: { salonId },
      relations: ['salon', 'categories'],
    });
  }

  async update(
    serviceId: string,
    updateSalonServiceDto: UpdateSalonServiceDto,
  ) {
    // Find the existing service first
    const existingService = await this.salonServiceRepository.findOne({
      where: { serviceId },
      relations: ['categories'],
    });

    if (!existingService) {
      throw new GenericError(
        `Service with ID ${serviceId} does not exist.`,
        HttpStatus.NOT_FOUND,
      );
    }

    // If categoryIds are provided, update the categories
    if (updateSalonServiceDto.categoryIds) {
      const categories = await this.salonCategoryRepository.findBy({
        categoryId: In(updateSalonServiceDto.categoryIds),
      });

      if (categories.length !== updateSalonServiceDto.categoryIds.length) {
        throw new GenericError(
          'One or more category IDs are invalid.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Update the categories relation
      existingService.categories = categories;
    }

    // Update other service properties
    Object.assign(existingService, updateSalonServiceDto);

    // Save the updated service with its relations
    return this.salonServiceRepository.save(existingService);
  }

  async remove(serviceId: string) {
    // Find the service first to check if it exists
    const service = await this.salonServiceRepository.findOne({
      where: { serviceId },
      relations: ['categories'],
    });

    if (!service) {
      throw new GenericError(
        `Service with ID ${serviceId} does not exist.`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Check for existing bookings
    const existingBookings = await this.bookingRepository.count({
      where: { salon_service_id: serviceId },
    });

    if (existingBookings > 0) {
      throw new GenericError(
        `Cannot delete service with ID ${serviceId} as it has ${existingBookings} existing bookings.`,
        HttpStatus.CONFLICT,
      );
    }

    // Clear the categories relation
    service.categories = [];
    await this.salonServiceRepository.save(service);

    // Now delete the service
    const result = await this.salonServiceRepository.delete({ serviceId });

    if (result.affected === 0) {
      throw new GenericError(
        `Failed to delete service with ID ${serviceId}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return {
      message: `Service with ID ${serviceId} has been deleted successfully`,
    };
  }
}
