import {
  Controller,
  Post,
  Inject,
  Body,
  Get,
  Query,
  Put,
  Param,
} from '@nestjs/common';
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

  @Put('updateCustomerByID/:id')
  async updateCustomerByID(
    @Param('id') id: string,
    @Body() updateData: any,
  ): Promise<any> {
    console.log('Updating user:', id, updateData);
    return await firstValueFrom(
      this.client.send(
        { cmd: 'update_user_by_id' },
        { userId: id, updateUserDto: updateData },
      ),
    );
  }

  @Put('updatePassword/:id')
  async updatePassword(
    @Param('id') id: string,
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

  @Get(':id/getUserBookingsByID')
  async getUserBookingsByID(@Param('id') id: string): Promise<any> {
    return await firstValueFrom(
      this.client.send({ cmd: 'get_user_bookings_by_id' }, id),
    );
  }

  @Post(':userId/createReview/:bookingId')
  async createReview(
    @Param('userId') userId: string,
    @Param('bookingId') bookingId: string,
    @Body() reviewDto: any,
  ): Promise<any> {
    return await firstValueFrom(
      this.client.send(
        { cmd: 'create_review' },
        { userId, bookingId, reviewDto },
      ),
    );
  }
}
