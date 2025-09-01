import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BookingService } from './booking.service';
import {
  BookingRequestDto,
  CheckServiceTimeAvailabilityDto,
  CheckServiceTimeAvailabilityResponseDto,
  GetAvailableSlotsRequestDto,
} from '@charmbooking/common';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @MessagePattern({ cmd: 'check_service_time_availability' })
  async checkServiceTimeAvailability(
    data: CheckServiceTimeAvailabilityDto,
  ): Promise<CheckServiceTimeAvailabilityResponseDto> {
    const { salonId, serviceId, date, startTime } = data;
    return this.bookingService.checkServiceTimeAvailability(
      salonId,
      serviceId,
      date,
      startTime,
    );
  }

  @MessagePattern({ cmd: 'get_available_slots' })
  async getAvailableSlots(data: GetAvailableSlotsRequestDto): Promise<any> {
    const { salonId, serviceId, date } = data;
    console.log(data);
    return this.bookingService.getAvailableSlots(salonId, serviceId, date);
  }

  @MessagePattern({ cmd: 'book_slot' })
  async bookSlot(data: BookingRequestDto): Promise<any> {
    console.log(data);
    return this.bookingService.createBooking(data);
  }

  @MessagePattern({ cmd: 'get_bookings' })
  async getBookings(salonId: string): Promise<any> {
    return this.bookingService.getBookings(salonId);
  }

  @MessagePattern({ cmd: 'cancel_booking' })
  async cancelBooking(data: {
    bookingId: string;
    userId: string;
  }): Promise<any> {
    console.log(data);
    return this.bookingService.cancelPendingBooking(
      data.userId,
      data.bookingId,
    );
  }

  @MessagePattern({ cmd: 'salon_cancel_booking' })
  async salonCancelBooking(data: { bookingId: string }): Promise<any> {
    console.log(data);
    return this.bookingService.salonCancelBooking(data.bookingId);
  }

  @MessagePattern({ cmd: 'user_cancel_booking' })
  async userCancelBooking(data: {
    bookingId: string;
    userId: string;
    reason: string;
  }): Promise<any> {
    console.log(data);
    return this.bookingService.userCancelBooking(data.bookingId, data.reason);
  }

  @MessagePattern({ cmd: 'update_completed_booking_status' })
  async updateCompletedBookingStatus(data: {
    bookingId: string;
  }): Promise<any> {
    console.log(data.bookingId);
    return this.bookingService.updateCompletedBookingStatus(data.bookingId);
  }
}
