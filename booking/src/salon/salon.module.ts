import { Module } from '@nestjs/common';
import { SalonController } from './salon.controller';
import { SalonService } from './salon.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Salon, SalonAdmin, SalonImage } from '@charmbooking/common';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConfig } from '@charmbooking/common';

const config = getConfig();
@Module({
  imports: [
    TypeOrmModule.forFeature([Salon, SalonImage, SalonAdmin]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        secret: config.jwt.secret,
        signOptions: { expiresIn: config.jwt.expiration },
      }),
    }),
  ],
  controllers: [SalonController],
  providers: [SalonService],
})
export class SalonModule {}
