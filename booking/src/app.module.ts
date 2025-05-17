import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SalonModule } from './salon/salon.module';

@Module({
  imports: [SalonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
