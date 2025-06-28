import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../../libs/common/src/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'src/dto/createUserDTO';
import * as bcrypt from 'bcrypt';
import { RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import { LoginUserResponseDTO } from 'src/dto/loginUserResponseDTO';
import { LoginUserDto } from 'src/dto/loginUserRequestDTO';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  //-----------------------Register a new user
  async register(createUserDto: CreateUserDto): Promise<User> {
    // Check if the user already exists
    try {
      // console.log('Registering user:', createUserDto);
      if (
        !createUserDto.email ||
        !createUserDto.password ||
        !createUserDto.firstName ||
        !createUserDto.lastName ||
        !createUserDto.dateofBirth
      ) {
        throw new RpcException('All fields are required - BE');
      }
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
      if (existingUser) {
        throw new RpcException('User with this email already exists');
      }
      if (!createUserDto.role) {
        createUserDto.role = 'user';
      }
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      // Create a new user instance
      const newUser = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
        role: createUserDto.role || 'user',
      });
      return this.userRepository.save(newUser);
    } catch (error) {
      // Re-throw RpcException if already thrown
      if (error instanceof RpcException) {
        throw error;
      }

      // Wrap unexpected errors
      throw new RpcException(`Error registering user: ${error}`);
    }
  }

  //-----------------------User logging
  async login(loginUserDto: LoginUserDto): Promise<LoginUserResponseDTO> {
    try {
      const { email, password } = loginUserDto;
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user) {
        throw new RpcException('User not found');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new RpcException('Invalid Credentials');
      }
      const token = this.jwtService.sign({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      });
      user.token = token;
      await this.userRepository.save(user);
      return {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        token: user.token,
      };
    } catch (error) {
      // Re-throw RpcException if already thrown
      if (error instanceof RpcException) {
        throw error;
      }

      // Wrap unexpected errors
      throw new RpcException(`Error logging in user: ${error}`);
    }
  }
}
