import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SalonService } from './salon.service';
import { SalonRegisterDTO } from 'src/dto/salonResponse';

@Controller('salon')
export class SalonController {
  constructor(private readonly salonService: SalonService) {}

  @MessagePattern({ cmd: 'get_salon' })
  async getSalon(): Promise<any> {
    try {
      const salons = await this.salonService.findAll();
      return salons;
    } catch (error) {
      console.error('Error fetching salons:', error);
      throw new Error('Failed to fetch salons');
    }
  }

  @MessagePattern({ cmd: 'register_salon' })
  async registerSalon(salonData: SalonRegisterDTO): Promise<any> {
    try {
      const newSalon = await this.salonService.createSalon(salonData);
      return newSalon;
    } catch (error) {
      console.error('Error registering salon:', error);
      throw new Error('Failed to register salon');
    }
  }

  @MessagePattern({ cmd: 'get_salon_by_id' })
  async getSalonById(id: number): Promise<any> {
    try {
      const salon = await this.salonService.findById(id);
      return salon;
    } catch (error) {
      console.error('Error fetching salon by ID:', error);
      throw new Error('Failed to fetch salon by ID');
    }
  }
}
