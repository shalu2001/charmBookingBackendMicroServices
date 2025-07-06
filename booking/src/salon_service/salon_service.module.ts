import { Module } from '@nestjs/common';
import { SalonServiceService } from './salon_service.service';
import { SalonServiceController } from './salon_service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Salon, SalonCategory, SalonService } from '@charmbooking/common';

@Module({
  imports: [TypeOrmModule.forFeature([Salon, SalonService, SalonCategory])],
  controllers: [SalonServiceController],
  providers: [SalonServiceService],
})
export class SalonServiceModule {}
