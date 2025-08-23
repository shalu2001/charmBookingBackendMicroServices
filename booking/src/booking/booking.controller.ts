import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BookingService } from './booking.service';
import {
  BookingRequestDTO,
  CheckServiceTimeAvailabilityDto,
} from '@charmbooking/common';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @MessagePattern({ cmd: 'check_service_time_availability' })
  async checkServiceTimeAvailability(
    data: CheckServiceTimeAvailabilityDto,
  ): Promise<any> {
    console.log(data);
    const { salonId, serviceId, date, startTime } = data;
    return this.bookingService.checkServiceTimeAvailability(
      salonId,
      serviceId,
      date,
      startTime,
    );
  }

  @MessagePattern({ cmd: 'book_slot' })
  async bookSlot(data: BookingRequestDTO): Promise<any> {
    console.log(data);
    return this.bookingService.createBooking(data);
  }
}
