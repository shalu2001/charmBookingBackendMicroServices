import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking, SalonService, SalonWorker } from '@charmbooking/common';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, SalonWorker, SalonService])],
  controllers: [BookingController],
  providers: [BookingService],
})
export class BookingModule {}
