import { registerAs } from '@nestjs/config';

export default registerAs('database', (): Record<string, any> => ({
  type: 'postgres',
  host: process.env.DB_HOST || 'ep-long-mouse-ay2bnuun-pooler.c-5.us-east-2.aws.neon.tech',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USERNAME || 'neondb_owner',
  password: process.env.DB_PASSWORD || 'npg_J7y9MFhHKGzR',
  database: process.env.DB_NAME || 'neondb',
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  autoLoadEntities: true,
  ssl: {
    rejectUnauthorized: false,
  },
  extra: {
    ssl: {
      rejectUnauthorized: false,
    },
  },
}));