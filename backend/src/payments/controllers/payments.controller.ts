import { Body, Controller, Get, Headers, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from '../services/payments.service';
import { CreateChargeDto } from '../dto/create-charge.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiBearerAuth()
  @Post('charge')
  payOrder(@Body() dto: CreateChargeDto) {
    return this.paymentsService.payOrder(dto);
  }

  @ApiBearerAuth()
  @Post('retry')
  retryPayment(@Body() dto: CreateChargeDto) {
    return this.paymentsService.retryPayment(dto);
  }

  @ApiBearerAuth()
  @Get('order/:orderId')
  findByOrder(@Param('orderId') orderId: string) {
    return this.paymentsService.findByOrder(orderId);
  }

  @ApiBearerAuth()
  @Get('my-history')
  findMyHistory(@CurrentUser() user: AuthenticatedUser) {
    return this.paymentsService.findHistoryByUser(user.id);
  }

  /**
   * Endpoint público consumido por Culqi para notificar eventos de pago.
   * No usa JWT: Culqi no puede autenticarse con nuestro sistema de usuarios.
   * La validación de autenticidad se hace por header/firma (ver culqi.service).
   */
  @Public()
  @Post('webhook')
  handleWebhook(@Body() payload: any, @Headers() headers: Record<string, string>) {
    return this.paymentsService.handleWebhook(payload);
  }
}
