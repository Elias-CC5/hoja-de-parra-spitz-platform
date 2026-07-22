import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { ServiceFaq } from './service-faq.entity';

export enum EventType {
  MATRIMONIO = 'matrimonio',
  CUMPLEANOS = 'cumpleanos',
  EMPRESARIAL = 'empresarial',
  CONFERENCIA = 'conferencia',
  COFFEE_BREAK = 'coffee_break',
  ANIVERSARIO = 'aniversario',
  GRADUACION = 'graduacion',
  EVENTO_PRIVADO = 'evento_privado',
}

@Entity('catering_services')
export class CateringService extends BaseEntity {
  @Column({ length: 160 })
  name: string;

  @Index({ unique: true })
  @Column({ length: 180 })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: EventType })
  eventType: EventType;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  referencePrice?: number;

  @Column('simple-array', { nullable: true })
  galleryUrls?: string[];

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => ServiceFaq, (faq) => faq.service, { cascade: true })
  faqs: ServiceFaq[];
}
