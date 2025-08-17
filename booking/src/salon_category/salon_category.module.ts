import { Module } from '@nestjs/common';
import { SalonCategoryService } from './salon_category.service';
import { SalonCategoryController } from './salon_category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SalonCategory } from '@charmbooking/common';

@Module({
  imports: [TypeOrmModule.forFeature([SalonCategory])],
  controllers: [SalonCategoryController],
  providers: [SalonCategoryService],
  exports: [SalonCategoryService],
})
export class SalonCategoryModule {}
