import { LoginSuperAdminDto } from '@charmbooking/common';
import { Controller, Post, Inject, Body, Get, Param } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('super-admin')
export class SuperAdminController {
  constructor(@Inject('USER_SERVICE') private client: ClientProxy) {}

  @Post('login')
  async login(@Body() request: LoginSuperAdminDto): Promise<any> {
    return await firstValueFrom(
      this.client.send({ cmd: 'super_admin_login' }, request),
    );
  }

  @Get('all-salons')
  async getAllSalons(): Promise<any> {
    return await firstValueFrom(
      this.client.send({ cmd: 'get_all_salons' }, {}),
    );
  }

  @Get('salon-documents/:salonId')
  async getSalonDocuments(@Param('salonId') salonId: string): Promise<any> {
    return await firstValueFrom(
      this.client.send({ cmd: 'get_salon_documents' }, salonId),
    );
  }

  @Get('salon-details/:salonId')
  async getSalonDetails(@Param('salonId') salonId: string): Promise<any> {
    return await firstValueFrom(
      this.client.send({ cmd: 'get_salon_details' }, salonId),
    );
  }

  @Post('verify-salon')
  async verifySalon(@Body('salonId') salonId: string): Promise<any> {
    return await firstValueFrom(
      this.client.send({ cmd: 'verify_salon' }, salonId),
    );
  }

  @Post('fail-verification')
  async failVerification(@Body('salonId') salonId: string): Promise<any> {
    return await firstValueFrom(
      this.client.send({ cmd: 'fail_verification' }, salonId),
    );
  }
}
