import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { BookingService } from './booking.service';
import { BookingRequestDTO, GetAvailableSlotsDto } from '@charmbooking/common';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}
  @MessagePattern({ cmd: 'get_available_slots' })
  async getAvailableSlots(data: GetAvailableSlotsDto): Promise<any> {
    console.log(data);
    const { salonId, serviceId, date, startTime } = data;
    return this.bookingService.getAvailableSlots(
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
