import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSalonServiceDto } from './dto/create-salon_service.dto';
import { UpdateSalonServiceDto } from './dto/update-salon_service.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  GenericError,
  Salon,
  SalonCategory,
  SalonService,
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

  update(serviceId: string, updateSalonServiceDto: UpdateSalonServiceDto) {
    return this.salonServiceRepository.update(
      { serviceId },
      updateSalonServiceDto,
    );
  }

  remove(serviceId: string) {
    return this.salonServiceRepository.delete({ serviceId });
  }
}
