import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { EventType } from '../../services-catalog/entities/catering-service.entity';

export enum QuotationStatus {
  PENDIENTE = 'pendiente',
  APROBADA = 'aprobada',
  RECHAZADA = 'rechazada',
  CONVERTIDA_A_PEDIDO = 'convertida_a_pedido',
}

@Entity('quotations')
export class Quotation extends BaseEntity {
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'enum', enum: EventType })
  eventType: EventType;

  @Column({ type: 'date' })
  eventDate: string;

  @Column({ type: 'time' })
  eventTime: string;

  @Column()
  location: string;

  @Column({ type: 'int' })
  numberOfGuests: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedBudget?: number;

  @Column({ type: 'text', nullable: true })
  additionalServices?: string;

  @Column({ type: 'text', nullable: true })
  comments?: string;

  @Column({ type: 'enum', enum: QuotationStatus, default: QuotationStatus.PENDIENTE })
  status: QuotationStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  finalPrice?: number; // precio que el admin fija al aprobar

  @Column({ type: 'text', nullable: true })
  adminNotes?: string;
}
