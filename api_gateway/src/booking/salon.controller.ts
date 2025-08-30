import { SalonRankedRequestDto } from '@charmbooking/common';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { FilesInterceptor } from '@nestjs/platform-express';
import { firstValueFrom } from 'rxjs';
import { multerConfig } from 'src/file-upload/multer.config';

@Controller('salon')
export class SalonController {
  constructor(@Inject('BOOKING_SERVICE') private client: ClientProxy) {}

  @Get('getSalons')
  async getSalons(): Promise<any> {
    const pattern = { cmd: 'get_salons' };
    const data = {};
    return firstValueFrom(this.client.send<any>(pattern, data));
  }

  @Get('getSalonsRanked')
  async getSalonsRanked(
    @Query('categoryId') categoryId: number,
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
    @Query('date') date: string,
    @Query('time') time: string,
  ): Promise<any> {
    const request: SalonRankedRequestDto = {
      categoryId: Number(categoryId),
      longitude: Number(longitude),
      latitude: Number(latitude),
      date,
      time,
    };
    const pattern = { cmd: 'get_salons_ranked' };
    return firstValueFrom(this.client.send<any>(pattern, request));
  }

  @Get('getSalon/:id')
  async getSalonById(@Param('id') id: number): Promise<any> {
    const pattern = { cmd: 'get_salon_by_id' };
    return firstValueFrom(this.client.send<any>(pattern, id));
  }

  @Post('registerSalon')
  @UseInterceptors(FilesInterceptor('salonImages', 10, multerConfig))
  async registerSalon(
    @Body() salonData: any,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ): Promise<any> {
    const pattern = { cmd: 'register_salon' };
    return firstValueFrom(
      this.client.send<any>(pattern, { salonData, images }),
    );
  }

  @Post('loginSalon')
  async loginSalon(@Body() loginData: any): Promise<any> {
    const pattern = { cmd: 'login_salon' };
    return firstValueFrom(this.client.send<any>(pattern, loginData));
  }

  @Get('findAllSalonCategories')
  async findAllSalonCategories(): Promise<any> {
    const pattern = { cmd: 'findAllSalonCategories' };
    return firstValueFrom(this.client.send<any>(pattern, {}));
  }

  @Get('getSalonProfile/:id')
  async getSalonProfile(@Param('id') id: number): Promise<any> {
    console.log('Fetching salon profile for ID:', id);
    const pattern = { cmd: 'get_salon_profile' };
    return firstValueFrom(this.client.send<any>(pattern, id));
  }

  @Post('addSalonReview')
  async addSalonReview(@Body() reviewData: any): Promise<any> {
    console.log('Received salon review data:', reviewData);
    const pattern = { cmd: 'add_salon_review' };
    return firstValueFrom(this.client.send<any>(pattern, { reviewData }));
  }

  @Post(':id/addSalonWeeklyHours')
  async addSalonWeeklyHours(
    @Param('id') salonID: string,
    @Body() data: any,
  ): Promise<any> {
    const pattern = { cmd: 'add_salon_weekly_hours' };
    return firstValueFrom(
      this.client.send<any>(pattern, {
        salonID,
        weeklyHoursData: data.weeklyHours,
      }),
    );
  }

  @Put(':id/updateSalonWeeklyHours')
  async updateSalonWeeklyHours(
    @Param('id') salonID: string,
    @Body() data: any,
  ): Promise<any> {
    console.log('Received salon weekly hours update data:', data);
    const pattern = { cmd: 'update_salon_weekly_hours' };
    return firstValueFrom(
      this.client.send<any>(pattern, {
        salonID,
        weeklyHoursData: data.weeklyHours,
      }),
    );
  }

  @Get(':id/getSalonWeeklyHours')
  async getSalonWeeklyHours(@Param('id') salonID: string): Promise<any> {
    const pattern = { cmd: 'get_salon_weekly_hours' };
    return firstValueFrom(this.client.send<any>(pattern, salonID));
  }
}
