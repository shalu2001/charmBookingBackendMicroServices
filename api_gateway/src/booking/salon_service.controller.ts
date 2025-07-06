import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('salonService')
export class SalonServiceController {
  constructor(@Inject('BOOKING_SERVICE') private client: ClientProxy) {}

  @Post('create')
  async createSalonService(@Body() createSalonServiceDto: any): Promise<any> {
    return await firstValueFrom(
      this.client.send<any>('createSalonService', createSalonServiceDto),
    );
  }

  @Get('findAll')
  async findAllSalonServices(): Promise<any> {
    return await firstValueFrom(
      this.client.send<any>('findAllSalonService', {}),
    );
  }

  @Get('findOne/:id')
  async findOneSalonService(@Param('id') id: string): Promise<any> {
    return await firstValueFrom(
      this.client.send<any>('findOneSalonService', id),
    );
  }

  @Get('findBySalon/:salonId')
  async findSalonServicesBySalonId(
    @Param('salonId') salonId: string,
  ): Promise<any> {
    return await firstValueFrom(
      this.client.send<any>('findSalonServiceBySalonId', salonId),
    );
  }

  @Post('update')
  async updateSalonService(@Body() updateSalonServiceDto: any): Promise<any> {
    return await firstValueFrom(
      this.client.send<any>('updateSalonService', updateSalonServiceDto),
    );
  }

  @Post('remove/:id')
  async removeSalonService(@Param('id') id: string): Promise<any> {
    return await firstValueFrom(
      this.client.send<any>('removeSalonService', id),
    );
  }
}
