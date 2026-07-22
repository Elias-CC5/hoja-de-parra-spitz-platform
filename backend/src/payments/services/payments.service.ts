import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from '../entities/payment.entity';
import { Transaction } from '../entities/transaction.entity';
import { CulqiService } from './culqi.service';
import { CreateChargeDto } from '../dto/create-charge.dto';
import { OrdersService } from '../../orders/services/orders.service';
import { OrderStatus } from '../../orders/entities/order.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentsRepository: Repository<Payment>,
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    private readonly culqiService: CulqiService,
    private readonly ordersService: OrdersService,
  ) {}

  /**
   * Procesa el pago de un pedido: crea el cargo en Culqi, registra el
   * Payment y la Transaction, y actualiza el pedido a PAGADO si Culqi aprueba.
   * La confirmación definitiva también llega por webhook (ver handleWebhook),
   * que es la fuente de verdad ante fallos de red en la respuesta síncrona.
   */
  async payOrder(dto: CreateChargeDto): Promise<Payment> {
    const order = await this.ordersService.findById(dto.orderId);

    if (order.status === OrderStatus.PAGADO) {
      throw new BadRequestException('Este pedido ya fue pagado');
    }

    const amountInCents = Math.round(Number(order.total) * 100);

    let payment = await this.paymentsRepository.findOne({ where: { orderId: order.id } });
    if (!payment) {
      payment = this.paymentsRepository.create({
        orderId: order.id,
        amount: order.total,
        currency: 'PEN',
        status: PaymentStatus.PENDIENTE,
        culqiToken: dto.culqiToken,
      });
      payment = await this.paymentsRepository.save(payment);
    }

    try {
      const charge = await this.culqiService.createCharge({
        amountInCents,
        email: dto.email,
        sourceToken: dto.culqiToken,
        orderNumber: order.orderNumber,
      });

      const approved = charge.outcome?.type === 'venta_exitosa';

      payment.culqiChargeId = charge.id;
      payment.status = approved ? PaymentStatus.APROBADO : PaymentStatus.RECHAZADO;
      payment.failureReason = approved ? undefined : charge.outcome?.user_message;
      await this.paymentsRepository.save(payment);

      await this.transactionsRepository.save(
        this.transactionsRepository.create({
          paymentId: payment.id,
          event: 'charge.attempt',
          rawResponse: charge as unknown as Record<string, unknown>,
          success: approved,
        }),
      );

      if (approved) {
        await this.ordersService.markAsPaid(order.id);
      }

      return payment;
    } catch (error) {
      payment.status = PaymentStatus.RECHAZADO;
      payment.failureReason = error instanceof Error ? error.message : 'Error desconocido';
      await this.paymentsRepository.save(payment);

      await this.transactionsRepository.save(
        this.transactionsRepository.create({
          paymentId: payment.id,
          event: 'charge.attempt',
          rawResponse: { error: payment.failureReason },
          success: false,
        }),
      );

      throw error;
    }
  }

  /** Reintento de pago con un nuevo token de tarjeta sobre el mismo pedido */
  async retryPayment(dto: CreateChargeDto): Promise<Payment> {
    return this.payOrder(dto);
  }

  async findByOrder(orderId: string): Promise<Payment> {
    const payment = await this.paymentsRepository.findOne({
      where: { orderId },
      relations: { transactions: true },
    });
    if (!payment) {
      throw new NotFoundException('No se encontró un pago para este pedido');
    }
    return payment;
  }

  async findHistoryByUser(userId: string): Promise<Payment[]> {
    return this.paymentsRepository
      .createQueryBuilder('payment')
      .innerJoin('payment.order', 'order')
      .where('order.userId = :userId', { userId })
      .orderBy('payment.createdAt', 'DESC')
      .getMany();
  }

  /**
   * Procesa notificaciones asíncronas de Culqi (webhooks). Es la fuente
   * de verdad definitiva sobre el estado de un cargo.
   */
  async handleWebhook(payload: {
    type: string;
    data: { id: string; reference_code?: string; outcome?: { type: string } };
  }): Promise<void> {
    const chargeId = payload.data?.id;
    if (!chargeId) return;

    const payment = await this.paymentsRepository.findOne({ where: { culqiChargeId: chargeId } });
    if (!payment) return;

    const approved = payload.data.outcome?.type === 'venta_exitosa';

    await this.transactionsRepository.save(
      this.transactionsRepository.create({
        paymentId: payment.id,
        event: `webhook.${payload.type}`,
        rawResponse: payload as unknown as Record<string, unknown>,
        success: approved,
      }),
    );

    if (approved && payment.status !== PaymentStatus.APROBADO) {
      payment.status = PaymentStatus.APROBADO;
      await this.paymentsRepository.save(payment);
      await this.ordersService.markAsPaid(payment.orderId);
    }
  }
}
