import { config } from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Try multiple possible locations for .env
const possiblePaths = [
  path.resolve(process.cwd(), '.env'), // Current directory
  path.resolve(process.cwd(), '../.env'), // Parent directory
  path.resolve(process.cwd(), '../../.env'), // Grandparent directory
  path.resolve(__dirname, '../../../.env'), // Relative to this file
];

// Find the first path that exists
const envPath = possiblePaths.find((p) => fs.existsSync(p));

if (envPath) {
  console.log(`Loading .env from: ${envPath}`);
  config({ path: envPath });
} else {
  console.warn('No .env file found! Using default environment variables.');
  config(); // Try to load from process.env anyway
}

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

type PayHereConfig = {
  merchantId: string | undefined;
  merchantSecret: string | undefined;
  frontendUrl: string | undefined;
  backendUrl: string | undefined;
};

type AppConfig = {
  database: DatabaseConfig;
  services: ServiceConfig;
  jwt: JwtConfig;
  payHere: PayHereConfig;
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
  payHere: {
    merchantId: process.env.PH_MERCHANT_ID,
    merchantSecret: process.env.PH_MERCHANT_SECRET,
    frontendUrl: process.env.FRONTEND_URL,
    backendUrl: process.env.BACKEND_URL,
  },
});
