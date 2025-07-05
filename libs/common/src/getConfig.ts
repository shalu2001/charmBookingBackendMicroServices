import { config } from 'dotenv';
import * as path from 'path';

// Load .env from root directory
config({ path: path.resolve(process.cwd(), '.../../../.env') });

type DatabaseConfig = {
  host: string | undefined;
  port: number;
  username: string | undefined;
  password: string | undefined;
};

type ServiceConfig = {
  apiGateway: { port: number };
  booking: { port: number };
  user: { port: number };
};

type JwtConfig = {
  secret: string | undefined;
  expiration: string | undefined;
};

type AppConfig = {
  database: DatabaseConfig;
  services: ServiceConfig;
  jwt: JwtConfig;
};

export const getConfig = (): AppConfig => ({
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
  services: {
    apiGateway: {
      port: parseInt(process.env.API_GATEWAY_PORT || '3000', 10),
    },
    booking: {
      port: parseInt(process.env.BOOKING_SERVICE_PORT || '3001', 10),
    },
    user: {
      port: parseInt(process.env.USER_SERVICE_PORT || '3002', 10),
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiration: process.env.JWT_EXPIRATION,
  },
});
