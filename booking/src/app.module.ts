import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SalonModule } from './salon/salon.module';
import { CommonModule } from '@charmbooking/common';
import { SalonServiceModule } from './salon_service/salon_service.module';

@Module({
  imports: [CommonModule, SalonModule, SalonServiceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
