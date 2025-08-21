import { Module } from '@nestjs/common';
import { BookingController } from './booking.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SalonServiceController } from './salon_service.controller';
import { SalonController } from './salon.controller';
import { SalonCategoryController } from './salon_category.controller';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { getConfig } from '@charmbooking/common';
import { SalonWorkerController } from './salon_worker.controller';

const config = getConfig();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'BOOKING_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3001 },
      },
    ]),
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [
    BookingController,
    SalonServiceController,
    SalonController,
    SalonCategoryController,
    SalonWorkerController,
  ],
})
export class BookingModule {}
