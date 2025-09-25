import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { SalonServiceService } from './salon_service.service';
import { CreateSalonServiceDto } from './dto/create-salon_service.dto';
import { UpdateSalonServiceDto } from './dto/update-salon_service.dto';

@Controller()
export class SalonServiceController {
  constructor(private readonly salonServiceService: SalonServiceService) {}

  @MessagePattern({ cmd: 'createSalonService' })
  create(@Payload() createSalonServiceDto: CreateSalonServiceDto) {
    return this.salonServiceService.create(createSalonServiceDto);
  }

  @MessagePattern({ cmd: 'findAllSalonService' })
  findAll() {
    return this.salonServiceService.findAll();
  }

  @MessagePattern({ cmd: 'findOneSalonService' })
  findOne(@Payload() id: string) {
    return this.salonServiceService.findOne(id);
  }

  @MessagePattern({ cmd: 'findSalonServiceBySalonId' })
  findBySalon(@Payload() salonId: string) {
    return this.salonServiceService.findBySalon(salonId);
  }

  @MessagePattern({ cmd: 'updateSalonService' })
  update(@Payload() updateSalonServiceDto: UpdateSalonServiceDto) {
    console.log('Updating salon service with data:', updateSalonServiceDto);
    return this.salonServiceService.update(
      updateSalonServiceDto.serviceId,
      updateSalonServiceDto,
    );
  }

  @MessagePattern({ cmd: 'removeSalonService' })
  remove(@Payload() id: string) {
    return this.salonServiceService.remove(id);
  }
}
