import {
  Booking,
  Salon,
  SalonHoliday,
  SalonService,
  SalonWorker,
  SalonWorkerLeave,
} from '@charmbooking/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalonWorkerController } from './salon_worker.controller';
import { SalonWorkerService } from './salon_worker.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Salon,
      SalonService,
      SalonWorker,
      SalonWorkerLeave,
      SalonHoliday,
      Booking,
    ]),
  ],
  controllers: [SalonWorkerController],
  providers: [SalonWorkerService],
})
export class SalonWorkerModule {}
