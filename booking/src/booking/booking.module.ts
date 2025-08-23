import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  Booking,
  SalonHoliday,
  SalonService,
  SalonWeeklyHours,
  SalonWorker,
  SalonWorkerLeave,
} from '@charmbooking/common';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Booking,
      SalonWorker,
      SalonWorkerLeave,
      SalonService,
      SalonWeeklyHours,
      SalonHoliday,
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
