import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookingModule } from './booking/booking.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [BookingModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
