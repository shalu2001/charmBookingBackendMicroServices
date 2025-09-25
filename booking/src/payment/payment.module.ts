import { PaymentDetails } from '@charmbooking/common';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentsController } from './payment.controller';
import { PayHereService } from './payment.service';
import { BookingModule } from 'src/booking/booking.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentDetails]),
    HttpModule,
    BookingModule,
  ],
  providers: [PayHereService],
  controllers: [PaymentsController],
})
export class PaymentModule {}
