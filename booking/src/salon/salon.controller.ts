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
  async registerSalon({
    salonData,
    images,
  }: {
    salonData: SalonRegisterDTO;
    images: Array<Express.Multer.File>;
  }): Promise<any> {
    console.log('Received salon data:', salonData);
    const newSalon = await this.salonService.createSalon(salonData, images);
    return newSalon;
  }

  @MessagePattern({ cmd: 'login_salon' })
  async loginSalon({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<any> {
    // console.log('Received login data:', { email });
    const salon = await this.salonService.salonLogin(email, password);
    return salon;
  }

  @MessagePattern({ cmd: 'get_salon_by_id' })
  async getSalonById(id: string): Promise<any> {
    try {
      const salon = await this.salonService.findById(id);
      return salon;
    } catch (error) {
      console.error('Error fetching salon by ID:', error);
      throw new Error('Failed to fetch salon by ID');
    }
  }
}
