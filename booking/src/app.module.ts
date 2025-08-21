import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SalonModule } from './salon/salon.module';
import { CommonModule } from '@charmbooking/common';
import { SalonServiceModule } from './salon_service/salon_service.module';
import { SalonCategoryModule } from './salon_category/salon_category.module';
import { SalonWorkerModule } from './salon_worker/salon_worker.module';
import { BookingModule } from './booking/booking.module';

@Module({
  imports: [
    CommonModule,
    SalonModule,
    SalonServiceModule,
    SalonCategoryModule,
    SalonWorkerModule,
    BookingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
