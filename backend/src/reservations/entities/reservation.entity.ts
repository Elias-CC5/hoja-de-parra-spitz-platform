import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../users/entities/user.entity';
import { EventType } from '../../services-catalog/entities/catering-service.entity';

export enum ReservationStatus {
  PENDIENTE = 'pendiente',
  CONFIRMADA = 'confirmada',
  CANCELADA = 'cancelada',
  COMPLETADA = 'completada',
}

@Entity('reservations')
export class Reservation extends BaseEntity {
  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ type: 'date' })
  eventDate: string;

  @Column({ type: 'time' })
  eventTime: string;

  @Column({ type: 'int' })
  numberOfPeople: number;

  @Column({ type: 'enum', enum: EventType })
  eventType: EventType;

  @Column()
  address: string;

  @Column({ type: 'text', nullable: true })
  comments?: string;

  @Column({ type: 'enum', enum: ReservationStatus, default: ReservationStatus.PENDIENTE })
  status: ReservationStatus;
}
