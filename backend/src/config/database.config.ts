import { registerAs } from '@nestjs/config';

export default registerAs('database', (): Record<string, any> => ({
  type: 'postgres',
  url: process.env.DATABASE_URL || `postgresql://${process.env.DB_USERNAME || 'neondb_owner'}:${process.env.DB_PASSWORD || 'npg_J7y9MFhHKGzR'}@${process.env.DB_HOST || 'ep-long-mouse-ay2bnuun-pooler.c-5.us-east-2.aws.neon.tech'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'neondb'}?sslmode=require`,
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