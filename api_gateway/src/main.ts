import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getConfig } from '@charmbooking/common';

const config = getConfig();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(config.services.apiGateway.port);
}
bootstrap();
