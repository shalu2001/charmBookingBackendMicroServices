import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConfig, User, Booking, SalonReview } from '@charmbooking/common';

const config = getConfig();
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Booking, SalonReview]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        secret: config.jwt.secret,
        signOptions: { expiresIn: config.jwt.expiration },
      }),
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
