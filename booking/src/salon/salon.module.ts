import { Module } from '@nestjs/common';
import { SalonController } from './salon.controller';
import { SalonService } from './salon.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Salon } from '../../../libs/common/src/entities/salon.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Salon])],
  controllers: [SalonController],
  providers: [SalonService],
})
export class SalonModule {}
