import { Module } from '@nestjs/common';
import { SuperAdminController } from './super-admin.controller';
import { SuperAdminService } from './super-admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  getConfig,
  Salon,
  SalonDetails,
  SalonDocuments,
  SuperAdmin,
} from '@charmbooking/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

const config = getConfig();

@Module({
  imports: [
    TypeOrmModule.forFeature([SalonDetails, SuperAdmin, Salon, SalonDocuments]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => ({
        secret: config.jwt.secret,
        signOptions: { expiresIn: config.jwt.expiration },
      }),
    }),
  ],

  controllers: [SuperAdminController],
  providers: [SuperAdminService],
})
export class SuperAdminModule {}
