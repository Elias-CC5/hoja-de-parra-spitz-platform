import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { OrderConfirmationEmail, QuotationEmail } from '../interfaces/mail-payload.interface';

/**
 * Encapsula el envío de correos transaccionales.
 * Usa nodemailer con SMTP; en desarrollo, si no hay credenciales SMTP
 * configuradas, solo loguea el correo en vez de fallar.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor(private readonly configService: ConfigService) {
    const host = this.configService.get<string>('mail.host');
    const user = this.configService.get<string>('mail.user');
    const password = this.configService.get<string>('mail.password');

    if (host && user && password) {
      this.transporter = nodemailer.createTransport({
        host,
        port: this.configService.get<number>('mail.port'),
        secure: false,
        auth: { user, pass: password },
      });
    }
  }

  private async send(to: string, subject: string, html: string): Promise<void> {
    const from = this.configService.get<string>('mail.from');

    if (!this.transporter) {
      this.logger.warn(
        `SMTP no configurado. Simulando envío de correo a ${to} — asunto: "${subject}"`,
      );
      return;
    }

    await this.transporter.sendMail({ from, to, subject, html });
  }

  async sendOrderConfirmation(payload: OrderConfirmationEmail): Promise<void> {
    const html = `
      <h2>¡Gracias por tu pedido, ${payload.fullName}!</h2>
      <p>Tu pedido <strong>${payload.orderNumber}</strong> fue confirmado.</p>
      <p>Total: <strong>S/ ${payload.total.toFixed(2)}</strong></p>
      <p>Nuestro equipo se pondrá en contacto para coordinar la entrega.</p>
    `;
    await this.send(payload.to, `Confirmación de pedido ${payload.orderNumber}`, html);
  }

  async sendQuotationUpdate(payload: QuotationEmail): Promise<void> {
    const html = `
      <h2>Actualización de tu cotización</h2>
      <p>Hola ${payload.fullName}, tu solicitud para <strong>${payload.eventType}</strong>
      del ${payload.eventDate} fue marcada como <strong>${payload.status}</strong>.</p>
      ${payload.finalPrice ? `<p>Precio propuesto: <strong>S/ ${payload.finalPrice.toFixed(2)}</strong></p>` : ''}
      ${payload.adminNotes ? `<p>Notas: ${payload.adminNotes}</p>` : ''}
    `;
    await this.send(payload.to, 'Actualización de tu cotización — Hoja de Parra Spitz', html);
  }
}
