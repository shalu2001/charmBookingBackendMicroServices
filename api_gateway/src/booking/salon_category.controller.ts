import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { SalonAdminGuard } from 'src/auth/auth.guard';

@Controller('salonCategory')
export class SalonCategoryController {
  constructor(@Inject('BOOKING_SERVICE') private client: ClientProxy) {}

  @UseGuards(SalonAdminGuard)
  @Post('createCategory')
  async create(@Body() createSalonCategoryDto: any): Promise<any> {
    const pattern = { cmd: 'create_salon_category' };
    return firstValueFrom(
      this.client.send<any>(pattern, createSalonCategoryDto),
    );
  }

  @Get('findAll')
  async findAll(): Promise<any> {
    const pattern = { cmd: 'find_all_salon_categories' };
    return firstValueFrom(this.client.send<any>(pattern, {}));
  }

  @Get('findOne/:id')
  async findOne(@Param('id') id: number): Promise<any> {
    const pattern = { cmd: 'find_one_salon_category' };
    return firstValueFrom(this.client.send<any>(pattern, id));
  }

  @Post('update')
  async update(@Body() updateSalonCategoryDto: any): Promise<any> {
    const pattern = { cmd: 'update_salon_category' };
    return firstValueFrom(
      this.client.send<any>(pattern, updateSalonCategoryDto),
    );
  }

  @Post('remove')
  async remove(@Body() removeSalonCategoryDto: any): Promise<any> {
    const pattern = { cmd: 'remove_salon_category' };
    return firstValueFrom(
      this.client.send<any>(pattern, removeSalonCategoryDto),
    );
  }
}
