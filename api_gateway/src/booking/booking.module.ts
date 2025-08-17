import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { BookingService } from './booking.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SalonServiceController } from './salon_service.controller';
import { SalonController } from './salon.controller';
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'BOOKING_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3001 },
      },
    ]),
  ],
  controllers: [BookingController, SalonServiceController, SalonController],
  providers: [BookingService],
})
export class BookingModule {}
