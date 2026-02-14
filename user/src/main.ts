import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { getConfig, loadAllSecrets } from '@charmbooking/common';

async function bootstrap() {
  // Load secrets from Azure Key Vault before initializing the application
  try {
    await loadAllSecrets();
    console.log('✓ Secrets loaded successfully');
  } catch (error) {
    console.error('Failed to load secrets:', error);
    process.exit(1);
  }

  // Get configuration (will validate that all required secrets are present)
  const config = getConfig();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: 'localhost',
        port: config.services.user.port,
      },
    },
  );
  await app.listen();
  console.log(`✓ User service running on port ${config.services.user.port}`);
}
bootstrap();
