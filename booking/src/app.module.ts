import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SalonModule } from './salon/salon.module';
import { CommonModule } from '@charmbooking/common';

@Module({
  imports: [CommonModule, SalonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
