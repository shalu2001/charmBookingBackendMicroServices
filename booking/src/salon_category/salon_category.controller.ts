import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SalonCategoryService } from './salon_category.service';
import { CreateSalonCategoryDto } from './dto/create-salon_category.dto';
import { UpdateSalonCategoryDto } from './dto/update-salon_category.dto';

@Controller()
export class SalonCategoryController {
  constructor(private readonly salonCategoryService: SalonCategoryService) {}

  @MessagePattern('createSalonCategory')
  create(@Payload() createSalonCategoryDto: CreateSalonCategoryDto) {
    return this.salonCategoryService.create(createSalonCategoryDto);
  }

  @MessagePattern('findAllSalonCategories')
  findAll() {
    return this.salonCategoryService.findAllCategories();
  }

  @MessagePattern('findOneSalonCategory')
  findOne(@Payload() id: number) {
    return this.salonCategoryService.findOne(id);
  }

  @MessagePattern('updateSalonCategory')
  update(@Payload() updateSalonCategoryDto: UpdateSalonCategoryDto) {
    return this.salonCategoryService.update(
      updateSalonCategoryDto.id,
      updateSalonCategoryDto,
    );
  }

  @MessagePattern('removeSalonCategory')
  remove(@Payload() id: number) {
    return this.salonCategoryService.remove(id);
  }
}
