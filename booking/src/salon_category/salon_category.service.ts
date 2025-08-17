import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateSalonCategoryDto } from './dto/create-salon_category.dto';
import { UpdateSalonCategoryDto } from './dto/update-salon_category.dto';
import { SalonCategory } from '@charmbooking/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GenericError } from '@charmbooking/common';

@Injectable()
export class SalonCategoryService {
  constructor(
    @InjectRepository(SalonCategory)
    private salonCategoryRepository: Repository<SalonCategory>,
  ) {}

  create(createSalonCategoryDto: CreateSalonCategoryDto) {
    return 'This action adds a new salonCategory';
  }

  findAllCategories() {
    const categories = this.salonCategoryRepository.find();
    if (!categories) {
      throw new GenericError(
        'No salon categories found.',
        HttpStatus.NOT_FOUND,
      );
    }
    return categories;
  }

  findOne(id: number) {
    return `This action returns a #${id} salonCategory`;
  }

  update(id: number, updateSalonCategoryDto: UpdateSalonCategoryDto) {
    return `This action updates a #${id} salonCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} salonCategory`;
  }
}
