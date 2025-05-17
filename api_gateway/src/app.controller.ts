import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('BOOKING_SERVICE') private client: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('math')
  async getMath(): Promise<number> {
    const pattern = { cmd: 'sum' };
    const data = [1, 2];
    return firstValueFrom(this.client.send<number>(pattern, data));
  }
}
