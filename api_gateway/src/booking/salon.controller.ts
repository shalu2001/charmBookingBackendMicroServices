import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UploadedFile,
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
  async getSalon(): Promise<any> {
    const pattern = { cmd: 'get_salon' };
    const data = {};
    return firstValueFrom(this.client.send<any>(pattern, data));
  }

  @Get('getSalon/:id')
  async getSalonById(@Param('id') id: number): Promise<any> {
    const pattern = { cmd: 'get_salon_by_id' };
    return firstValueFrom(this.client.send<any>(pattern, id));
  }

  @Post('registerSalon')
  @UseInterceptors(FilesInterceptor('images', 10, multerConfig))
  async registerSalon(
    @Body() salonData: any,
    @UploadedFiles() images: Array<Express.Multer.File>,
  ): Promise<any> {
    const pattern = { cmd: 'register_salon' };
    console.log('images', images);
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
}
