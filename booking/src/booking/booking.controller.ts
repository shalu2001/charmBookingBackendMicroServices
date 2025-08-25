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
}
