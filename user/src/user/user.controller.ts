import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto } from 'src/dto/createUserDTO';
import { LoginUserDto } from 'src/dto/loginUserRequestDTO';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern({ cmd: 'register' })
  async register(createUserDto: CreateUserDto): Promise<any> {
    return this.userService.register(createUserDto);
  }

  @MessagePattern({ cmd: 'login' })
  async login(loginUserDto: LoginUserDto): Promise<any> {
    return this.userService.login(loginUserDto);
  }
}
