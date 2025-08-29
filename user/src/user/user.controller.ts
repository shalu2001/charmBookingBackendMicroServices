import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern } from '@nestjs/microservices';
import { CreateUserDto } from 'src/dto/createUserDTO';
import {
  LoginUserDto,
  UpdatePasswordDto,
  UserDetailsDTO,
} from 'src/dto/userDTO';

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

  @MessagePattern({ cmd: 'get_user_by_id' })
  async getUserById(userId: string): Promise<any> {
    return this.userService.getUserById(userId);
  }

  @MessagePattern({ cmd: 'update_user_by_id' })
  async updateUserById(
    userId: string,
    updateUserDto: UserDetailsDTO,
  ): Promise<any> {
    return this.userService.updateUserById(userId, updateUserDto);
  }

  @MessagePattern({ cmd: 'update_password' })
  async updatePassword(
    userId: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<any> {
    return this.userService.updateUserPassword(userId, updatePasswordDto);
  }
}
