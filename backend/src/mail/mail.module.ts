import { Global, Module } from '@nestjs/common';
import { MailService } from './services/mail.service';

/**
 * Módulo global: cualquier módulo puede inyectar MailService
 * sin necesidad de importar MailModule explícitamente.
 */
@Global()
@Module({
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
