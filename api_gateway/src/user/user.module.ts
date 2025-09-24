import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SuperAdminController } from './super-admin.controller';
import { JwtModule } from '@nestjs/jwt/dist/jwt.module';
import { getConfig } from '@charmbooking/common';

const config = getConfig();
@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 3002,
        },
      },
    ]),
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [UserController, SuperAdminController],
})
export class UserModule {}
