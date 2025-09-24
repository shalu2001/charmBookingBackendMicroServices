import { LoginSuperAdminDto } from '@charmbooking/common';
import {
  Controller,
  Post,
  Inject,
  Body,
  Get,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SuperAdminGuard } from 'src/auth/auth.guard';

@Controller('super-admin')
export class SuperAdminController {
  constructor(@Inject('USER_SERVICE') private client: ClientProxy) {}

  @Post('login')
  async login(@Body() request: LoginSuperAdminDto): Promise<any> {
    return await firstValueFrom(
      this.client.send({ cmd: 'super_admin_login' }, request),
    );
  }

  @UseGuards(SuperAdminGuard)
  @Get('all-salons')
  async getAllSalons(): Promise<any> {
    return await firstValueFrom(
      this.client.send({ cmd: 'get_all_salons' }, {}),
    );
  }

  @UseGuards(SuperAdminGuard)
  @Get('salon-documents/:salonId')
  async getSalonDocuments(@Param('salonId') salonId: string): Promise<any> {
    return await firstValueFrom(
      this.client.send({ cmd: 'get_salon_documents' }, salonId),
    );
  }

  @UseGuards(SuperAdminGuard)
  @Get('salon-details/:salonId')
  async getSalonDetails(@Param('salonId') salonId: string): Promise<any> {
    return await firstValueFrom(
      this.client.send({ cmd: 'get_salon_details' }, salonId),
    );
  }

  @UseGuards(SuperAdminGuard)
  @Post('verify-salon')
  async verifySalon(@Body('salonId') salonId: string): Promise<any> {
    return await firstValueFrom(
      this.client.send({ cmd: 'verify_salon' }, salonId),
    );
  }

  @UseGuards(SuperAdminGuard)
  @Post('fail-verification')
  async failVerification(@Body('salonId') salonId: string): Promise<any> {
    return await firstValueFrom(
      this.client.send({ cmd: 'fail_verification' }, salonId),
    );
  }
}
