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

  async create(createSalonCategoryDto: CreateSalonCategoryDto) {
    const newCategory = this.salonCategoryRepository.create(
      createSalonCategoryDto,
    );
    if (!newCategory) {
      throw new GenericError(
        'Error creating salon category.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return await this.salonCategoryRepository.save(newCategory);
  }

  async findAllCategories() {
    const categories = await this.salonCategoryRepository.find();
    if (!categories) {
      throw new GenericError(
        'No salon categories found.',
        HttpStatus.NOT_FOUND,
      );
    }
    return categories;
  }

  async findOne(id: number) {
    const category = await this.salonCategoryRepository.findOne({
      where: { categoryId: id },
    });
    if (!category) {
      throw new GenericError(
        `Salon category with id ${id} not found.`,
        HttpStatus.NOT_FOUND,
      );
    }
    return category;
  }

  async update(updateSalonCategoryDto: UpdateSalonCategoryDto) {
    const updateResult = await this.salonCategoryRepository.update(
      { categoryId: updateSalonCategoryDto.id }, // criteria
      { name: updateSalonCategoryDto.name },
    );
    if (updateResult.affected === 0) {
      throw new GenericError(`Salon category not found.`, HttpStatus.NOT_FOUND);
    }
    return this.findOne(updateSalonCategoryDto.id);
  }

  async remove(id: number) {
    const deleteResult = await this.salonCategoryRepository.delete({
      categoryId: id,
    });
    if (!deleteResult) {
      throw new GenericError(`Salon category not found.`, HttpStatus.NOT_FOUND);
    }
    return { message: `Salon category with id ${id} removed successfully.` };
  }
}
