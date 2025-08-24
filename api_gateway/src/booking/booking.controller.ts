import {
  BookingRequestDto,
  BookingSlot,
  CheckServiceTimeAvailabilityDto,
  GetAvailableSlotsRequestDto,
} from '@charmbooking/common';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('booking')
export class BookingController {
  constructor(@Inject('BOOKING_SERVICE') private client: ClientProxy) {}

  @Get(':salonId/checkServiceTimeAvailability')
  async checkServiceTimeAvailability(
    @Param('salonId') salonId: string,
    @Query('serviceId') serviceId: string,
    @Query('date') date: string,
    @Query('startTime') startTime: string,
  ): Promise<BookingSlot[]> {
    const pattern = { cmd: 'check_service_time_availability' };
    const request: CheckServiceTimeAvailabilityDto = {
      salonId,
      serviceId,
      date,
      startTime,
    };
    return firstValueFrom(this.client.send<BookingSlot[]>(pattern, request));
  }

  @Get(':salonId/getAvailableSlots')
  async getAvailableSlots(
    @Param('salonId') salonId: string,
    @Query('serviceId') serviceId: string,
    @Query('date') date: string,
  ): Promise<BookingSlot[]> {
    const pattern = { cmd: 'get_available_slots' };
    const request: GetAvailableSlotsRequestDto = {
      salonId,
      serviceId,
      date,
    };
    return firstValueFrom(this.client.send<BookingSlot[]>(pattern, request));
  }

  @Post(':salonId/book')
  async bookSlot(@Body() bookingData: BookingRequestDto): Promise<any> {
    const pattern = { cmd: 'book_slot' };
    return firstValueFrom(this.client.send(pattern, bookingData));
  }
}
