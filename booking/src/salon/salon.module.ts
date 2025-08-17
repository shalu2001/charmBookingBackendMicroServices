import { Module } from '@nestjs/common';
import { SalonController } from './salon.controller';
import { SalonService } from './salon.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Salon, SalonImage } from '@charmbooking/common';

@Module({
  imports: [TypeOrmModule.forFeature([Salon, SalonImage])],
  controllers: [SalonController],
  providers: [SalonService],
})
export class SalonModule {}
