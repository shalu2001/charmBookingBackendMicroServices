import { Salon, SalonService, SalonWorker } from '@charmbooking/common';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalonWorkerController } from './salon_worker.controller';
import { SalonWorkerService } from './salon_worker.service';

@Module({
  imports: [TypeOrmModule.forFeature([Salon, SalonService, SalonWorker])],
  controllers: [SalonWorkerController],
  providers: [SalonWorkerService],
})
export class SalonWorkerModule {}
