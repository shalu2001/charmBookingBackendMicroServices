import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalonModule } from './salon/salon.module';
import { dataSource } from './data-source';

@Module({
  imports: [TypeOrmModule.forRoot(dataSource.options), SalonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
