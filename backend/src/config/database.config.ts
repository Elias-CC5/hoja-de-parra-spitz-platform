import { registerAs } from '@nestjs/config';

export default registerAs('database', (): Record<string, any> => ({
  type: 'postgres',
  // Usamos la URL directa de Neon para garantizar que tome el SSL y el puerto del pooler
  url: 'postgresql://neondb_owner:npg_J7y9MFhHKGzR@ep-long-mouse-ay2bnuun-pooler.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require',
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