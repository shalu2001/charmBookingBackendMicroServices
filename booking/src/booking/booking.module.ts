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
  User,
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
      User,
    ]),
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
