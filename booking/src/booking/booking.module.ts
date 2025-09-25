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
import { ScheduleModule } from '@nestjs/schedule';

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
    ScheduleModule.forRoot(),
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
