import { Controller, Post, Inject, Body } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { UserService } from './user.service';
import { HttpException, HttpStatus } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(
    private readonly appService: UserService,
    @Inject('USER_SERVICE') private client: ClientProxy,
  ) {}

  @Post('register')
  async register(@Body() user: any): Promise<any> {
    try {
      return await firstValueFrom(this.client.send({ cmd: 'register' }, user));
    } catch (error: unknown) {
      let message = 'Internal server error';

      // Try to safely extract message from common error shapes]'
      if (
        error &&
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message?: unknown }).message === 'string'
      ) {
        message = (error as { message: string }).message;
      } else if (typeof error === 'string') {
        message = error;
      }

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('login')
  async login(@Body() user: any): Promise<any> {
    try {
      return await firstValueFrom(this.client.send({ cmd: 'login' }, user));
    } catch (error: unknown) {
      let message = 'Internal server error';

      // Try to safely extract message from common error shapes
      if (
        error &&
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message?: unknown }).message === 'string'
      ) {
        message = (error as { message: string }).message;
      } else if (typeof error === 'string') {
        message = error;
      }

      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
