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
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SalonAdminGuard } from 'src/auth/auth.guard';

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

  @UseGuards(SalonAdminGuard)
  @Get(':salonId/bookings')
  async getBookings(@Param('salonId') salonId: string): Promise<any> {
    const pattern = { cmd: 'get_bookings' };
    return firstValueFrom(this.client.send(pattern, salonId));
  }

  @Post('cancel/:bookingId')
  async cancelBooking(
    @Param('bookingId') bookingId: string,
    @Body() data: { userId: string },
  ): Promise<any> {
    const pattern = { cmd: 'cancel_booking' };
    return firstValueFrom(this.client.send(pattern, { ...data, bookingId }));
  }

  @Post('salonCancel/:bookingId')
  async salonCancelBooking(
    @Param('bookingId') bookingId: string,
    @Body() data: { salonId: string },
  ): Promise<any> {
    const pattern = { cmd: 'salon_cancel_booking' };
    return firstValueFrom(this.client.send(pattern, { ...data, bookingId }));
  }

  @Post('userCancel/:bookingId')
  async userCancelBooking(
    @Param('bookingId') bookingId: string,
    @Body() data: { userId: string; reason: string },
  ): Promise<any> {
    const pattern = { cmd: 'user_cancel_booking' };
    return firstValueFrom(this.client.send(pattern, { ...data, bookingId }));
  }

  @Post('updateCompletedBookingStatus/:bookingId')
  async updateCompletedBookingStatus(
    @Param('bookingId') bookingId: string,
  ): Promise<any> {
    const pattern = { cmd: 'update_completed_booking_status' };
    return firstValueFrom(this.client.send(pattern, { bookingId }));
  }
}
