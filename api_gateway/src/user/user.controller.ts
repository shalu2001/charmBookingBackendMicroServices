import { Controller, Post, Inject, Body } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('user')
export class UserController {
  constructor(@Inject('USER_SERVICE') private client: ClientProxy) {}

  @Post('register')
  async register(@Body() user: any): Promise<any> {
    return await firstValueFrom(this.client.send({ cmd: 'register' }, user));
  }

  @Post('login')
  async login(@Body() user: any): Promise<any> {
    return await firstValueFrom(this.client.send({ cmd: 'login' }, user));
  }
}
