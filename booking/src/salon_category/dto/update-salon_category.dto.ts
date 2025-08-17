import { PartialType } from '@nestjs/mapped-types';
import { CreateSalonCategoryDto } from './create-salon_category.dto';

export class UpdateSalonCategoryDto extends PartialType(CreateSalonCategoryDto) {
  id: number;
}
