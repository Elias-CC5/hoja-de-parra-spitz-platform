import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

export interface CulqiChargeResponse {
  id: string;
  amount: number;
  currency_code: string;
  outcome: { type: string; code: string; user_message: string };
  source: { card_number?: string; brand?: string };
  reference_code?: string;
}

/**
 * Cliente HTTP crudo contra la API de Culqi (https://api.culqi.com).
 * Ningún otro módulo debe llamar a Culqi directamente: siempre a través de este servicio.
 */
@Injectable()
export class CulqiService {
  private readonly logger = new Logger(CulqiService.name);
  private readonly baseUrl = 'https://api.culqi.com/v2';

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private get secretKey(): string {
    return this.configService.get<string>('culqi.secretKey') as string;
  }

  /**
   * Crea un cargo (charge) a partir del token generado por Culqi.js en el frontend.
   * amount va en céntimos (ej. S/ 100.50 = 10050).
   */
  async createCharge(params: {
    amountInCents: number;
    currencyCode?: string;
    email: string;
    sourceToken: string;
    orderNumber: string;
  }): Promise<CulqiChargeResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<CulqiChargeResponse>(
          `${this.baseUrl}/charges`,
          {
            amount: params.amountInCents,
            currency_code: params.currencyCode ?? 'PEN',
            email: params.email,
            source_id: params.sourceToken,
            capture: true,
            reference_code: params.orderNumber,
            metadata: { orderNumber: params.orderNumber },
          },
          {
            headers: {
              Authorization: `Bearer ${this.secretKey}`,
              'Content-Type': 'application/json',
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<{ user_message?: string; merchant_message?: string }>;
      this.logger.error('Error al crear cargo en Culqi', axiosError.response?.data);
      throw new BadRequestException(
        axiosError.response?.data?.user_message ??
          axiosError.response?.data?.merchant_message ??
          'No se pudo procesar el pago con Culqi',
      );
    }
  }

  /**
   * Verifica la firma del webhook de Culqi para asegurar que la notificación
   * proviene realmente de Culqi y no de un tercero malicioso.
   * Culqi firma con el webhook secret configurado en el panel de Culqi.
   */
  verifyWebhookSignature(receivedSignature: string, webhookSecret: string): boolean {
    return receivedSignature === webhookSecret;
  }
}
