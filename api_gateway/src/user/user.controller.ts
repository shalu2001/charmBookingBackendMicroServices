import { Controller, Post, Inject, Body, Get, Query } from '@nestjs/common';
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

  @Get('getCustomerByID')
  async getCustomerByID(@Query('id') id: string): Promise<any> {
    return await firstValueFrom(
      this.client.send({ cmd: 'get_user_by_id' }, id),
    );
  }

  @Post('updateCustomerByID')
  async updateCustomerByID(
    @Query('id') id: string,
    @Body() user: any,
  ): Promise<any> {
    return await firstValueFrom(
      this.client.send({ cmd: 'update_user_by_id' }, { id, ...user }),
    );
  }

  @Post('updatePassword')
  async updatePassword(
    @Query('id') id: string,
    @Body()
    { oldPassword, newPassword }: { oldPassword: string; newPassword: string },
  ): Promise<any> {
    return await firstValueFrom(
      this.client.send(
        { cmd: 'update_password' },
        { id, oldPassword, newPassword },
      ),
    );
  }
}
