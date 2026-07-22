import { registerAs } from '@nestjs/config';

export default registerAs('culqi', () => ({
  publicKey: process.env.CULQI_PUBLIC_KEY,
  secretKey: process.env.CULQI_SECRET_KEY,
  webhookSecret: process.env.CULQI_WEBHOOK_SECRET,
}));
