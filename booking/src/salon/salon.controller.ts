import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { SalonService } from './salon.service';
import {
  SalonRegisterDTO,
  SalonReviewRequestDto,
  SalonWeeklyHoursDTO,
} from 'src/dto/salonResponse';
import {
  SalonRankedRequestDto,
  SalonSubmitDetailsRequestDto,
  SalonWithRank,
} from '@charmbooking/common';

@Controller('salon')
export class SalonController {
  constructor(private readonly salonService: SalonService) {}

  @MessagePattern({ cmd: 'get_salons' })
  async getSalons(): Promise<any> {
    const salons = await this.salonService.findAll();
    return salons;
  }

  @MessagePattern({ cmd: 'get_salons_ranked' })
  async getSalonsRanked(
    request: SalonRankedRequestDto,
  ): Promise<SalonWithRank[]> {
    const salons = await this.salonService.findAllRanked(request);
    return salons;
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
    const salon = await this.salonService.findById(id);
    return salon;
  }

  @MessagePattern({ cmd: 'get_salon_profile' })
  async getSalonProfile(id: string): Promise<any> {
    const salon = await this.salonService.findSalonProfileById(id);
    return salon;
  }

  @MessagePattern({ cmd: 'add_salon_review' })
  async addSalonReview({
    reviewData,
  }: {
    reviewData: SalonReviewRequestDto;
  }): Promise<any> {
    console.log('Received salon review data:', reviewData);
    const review = await this.salonService.addReview(reviewData);
    return review;
  }

  @MessagePattern({ cmd: 'add_salon_weekly_hours' })
  async addSalonWeeklyHours({
    salonID,
    weeklyHoursData,
  }: {
    salonID: string;
    weeklyHoursData: SalonWeeklyHoursDTO[];
  }): Promise<any> {
    console.log('Received salon weekly hours data:', weeklyHoursData);
    const result = await this.salonService.addSalonWeeklyHours(
      salonID,
      weeklyHoursData,
    );
    return result;
  }

  @MessagePattern({ cmd: 'get_salon_weekly_hours' })
  async getSalonWeeklyHours(salonID: string): Promise<any> {
    const result = await this.salonService.getSalonWeeklyHours(salonID);
    return result;
  }

  @MessagePattern({ cmd: 'submit_salon_details' })
  async submitSalonDetails(
    request: SalonSubmitDetailsRequestDto<Express.Multer.File>,
  ) {
    const result = await this.salonService.submitSalonDetails(request);
    return result;
  }
}
