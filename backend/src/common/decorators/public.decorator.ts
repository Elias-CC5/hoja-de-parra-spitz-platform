import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marca una ruta como pública, saltando el JwtAuthGuard global.
 * Uso: @Public() sobre un handler (ej. login, register, webhooks).
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
