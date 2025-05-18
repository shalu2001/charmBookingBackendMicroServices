import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SalonService } from './salon.service';

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
}
