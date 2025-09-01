import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from '@charmbooking/common';
import { SuperAdminModule } from './super-admin/super-admin.module';

@Module({
  imports: [
    CommonModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SuperAdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
