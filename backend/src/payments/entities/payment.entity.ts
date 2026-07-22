import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Order } from '../../orders/entities/order.entity';
import { Transaction } from './transaction.entity';

export enum PaymentStatus {
  PENDIENTE = 'pendiente',
  APROBADO = 'aprobado',
  RECHAZADO = 'rechazado',
  REEMBOLSADO = 'reembolsado',
}

export enum PaymentMethod {
  TARJETA_VISA = 'tarjeta_visa',
  TARJETA_MASTERCARD = 'tarjeta_mastercard',
}

@Entity('payments')
export class Payment extends BaseEntity {
  @ManyToOne(() => Order, { eager: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column({ name: 'order_id' })
  orderId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ length: 3, default: 'PEN' })
  currency: string;

  @Column({ type: 'enum', enum: PaymentMethod, nullable: true })
  method?: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.PENDIENTE })
  status: PaymentStatus;

  @Column({ nullable: true })
  culqiChargeId?: string; // id de cargo devuelto por Culqi

  @Column({ nullable: true })
  culqiToken?: string; // token de tarjeta enviado por el frontend

  @Column({ type: 'text', nullable: true })
  failureReason?: string;

  @Column({ nullable: true })
  receiptUrl?: string;

  @OneToMany(() => Transaction, (transaction) => transaction.payment, { cascade: true })
  transactions: Transaction[];
}
