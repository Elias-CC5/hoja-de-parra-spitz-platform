import { registerAs } from '@nestjs/config';

/**
 * Configuración general de la aplicación.
 * Se accede mediante ConfigService.get('app.port'), etc.
 */
export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3001', 10),
  apiPrefix: process.env.API_PREFIX ?? 'api/v1',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
}));
