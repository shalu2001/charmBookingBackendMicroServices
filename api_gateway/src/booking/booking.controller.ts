import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { BookingService } from './booking.service';

@Controller('booking')
export class BookingController {
  constructor(
    private readonly appService: BookingService,
    @Inject('BOOKING_SERVICE') private client: ClientProxy,
  ) {}

  @Get('math')
  async getMath(): Promise<number> {
    const pattern = { cmd: 'sum' };
    const data = [1, 2];
    return firstValueFrom(this.client.send<number>(pattern, data));
  }
}
