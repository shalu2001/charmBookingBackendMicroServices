import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SalonCategoryService } from './salon_category.service';
import { CreateSalonCategoryDto } from './dto/create-salon_category.dto';
import { UpdateSalonCategoryDto } from './dto/update-salon_category.dto';

@Controller()
export class SalonCategoryController {
  constructor(private readonly salonCategoryService: SalonCategoryService) {}

  @MessagePattern({ cmd: 'create_salon_category' })
  createCategory(@Payload() createSalonCategoryDto: CreateSalonCategoryDto) {
    return this.salonCategoryService.create(createSalonCategoryDto);
  }

  @MessagePattern({ cmd: 'find_all_salon_categories' })
  findAll() {
    return this.salonCategoryService.findAllCategories();
  }

  @MessagePattern({ cmd: 'find_one_salon_category' })
  findOne(@Payload() id: number) {
    return this.salonCategoryService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_salon_category' })
  update(@Payload() updateSalonCategoryDto: UpdateSalonCategoryDto) {
    return this.salonCategoryService.update(updateSalonCategoryDto);
  }

  @MessagePattern({ cmd: 'remove_salon_category' })
  remove(@Payload() id: number) {
    return this.salonCategoryService.remove(id);
  }
}
