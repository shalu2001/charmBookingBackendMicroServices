import {
  BookingRequestDTO,
  BookingSlot,
  GetAvailableSlotsDto,
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

  @Get(':salonId/getAvailableSlots')
  async getAvailableSlots(
    @Param('salonId') salonId: string,
    @Query('serviceId') serviceId: string,
    @Query('date') date: string,
    @Query('startTime') startTime: string,
  ): Promise<BookingSlot[]> {
    const pattern = { cmd: 'get_available_slots' };
    const request: GetAvailableSlotsDto = {
      salonId,
      serviceId,
      date,
      startTime,
    };
    return firstValueFrom(this.client.send<BookingSlot[]>(pattern, request));
  }

  @Post(':salonId/book')
  async bookSlot(@Body() bookingData: BookingRequestDTO): Promise<any> {
    const pattern = { cmd: 'book_slot' };
    return firstValueFrom(this.client.send(pattern, bookingData));
  }
}
