import { IsString, IsUUID, MinLength } from 'class-validator';

export class CreateChargeDto {
  @IsUUID()
  orderId: string;

  /** Token de tarjeta generado en el frontend por Culqi.js (Checkout Culqi) */
  @IsString()
  @MinLength(10)
  culqiToken: string;

  @IsString()
  email: string;
}
