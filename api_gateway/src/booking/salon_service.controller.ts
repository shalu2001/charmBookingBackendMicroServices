import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('salonService')
export class SalonServiceController {
  constructor(@Inject('BOOKING_SERVICE') private client: ClientProxy) {}

  @Post('create')
  async createSalonService(@Body() createSalonServiceDto: any): Promise<any> {
    console.log('Creating salon service with data:', createSalonServiceDto);
    const pattern = { cmd: 'createSalonService' };
    return await firstValueFrom(
      this.client.send<any>(pattern, createSalonServiceDto),
    );
  }

  @Get('findAll')
  async findAllSalonServices(): Promise<any> {
    const pattern = { cmd: 'findAllSalonService' };
    return await firstValueFrom(this.client.send<any>(pattern, {}));
  }

  @Get('findOne/:id')
  async findOneSalonService(@Param('id') id: string): Promise<any> {
    const pattern = { cmd: 'findOneSalonService' };
    return await firstValueFrom(this.client.send<any>(pattern, id));
  }

  @Get('findBySalon/:salonId')
  async findSalonServicesBySalonId(
    @Param('salonId') salonId: string,
  ): Promise<any> {
    const pattern = { cmd: 'findSalonServiceBySalonId' };
    return await firstValueFrom(this.client.send<any>(pattern, salonId));
  }

  @Put('update')
  async updateSalonService(@Body() updateSalonServiceDto: any): Promise<any> {
    const pattern = { cmd: 'updateSalonService' };
    return await firstValueFrom(
      this.client.send<any>(pattern, updateSalonServiceDto),
    );
  }

  @Delete('remove/:id')
  async removeSalonService(@Param('id') id: string): Promise<any> {
    console.log('Removing salon service with ID:', id);
    const pattern = { cmd: 'removeSalonService' };
    return await firstValueFrom(this.client.send<any>(pattern, id));
  }
}
