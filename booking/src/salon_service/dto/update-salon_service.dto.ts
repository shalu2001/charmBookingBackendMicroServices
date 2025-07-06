import { PartialType } from '@nestjs/mapped-types';
import { CreateSalonServiceDto } from './create-salon_service.dto';

export class UpdateSalonServiceDto extends PartialType(CreateSalonServiceDto) {
  serviceId: string;
}
