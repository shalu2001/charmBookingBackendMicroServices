import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getConfig } from '@charmbooking/common';
import { RpcToHttpFilter } from './rcp-exception-filter';
import { RpcErrorInterceptor } from './rcp-interceptor';

const config = getConfig();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new RpcToHttpFilter());
  app.useGlobalInterceptors(new RpcErrorInterceptor());
  app.enableCors();
  await app.listen(config.services.apiGateway.port);
}
bootstrap();
