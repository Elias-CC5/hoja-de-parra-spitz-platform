import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Payment } from './payment.entity';

/**
 * Bitácora inmutable de cada intento/evento de pago (Culqi charge attempt,
 * webhook recibido, reintento, etc.). Permite auditar todo el ciclo de vida
 * de un pago sin perder historial cuando el Payment cambia de estado.
 */
@Entity('transactions')
export class Transaction extends BaseEntity {
  @ManyToOne(() => Payment, (payment) => payment.transactions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;

  @Column({ name: 'payment_id' })
  paymentId: string;

  @Column()
  event: string; // ej. "charge.attempt", "webhook.charge.succeeded", "retry"

  @Column({ type: 'jsonb', nullable: true })
  rawResponse?: Record<string, unknown>; // respuesta cruda de Culqi para auditoría

  @Column({ default: false })
  success: boolean;
}
