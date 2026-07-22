import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { CateringService } from './catering-service.entity';

@Entity('service_faqs')
export class ServiceFaq extends BaseEntity {
  @Column()
  question: string;

  @Column({ type: 'text' })
  answer: string;

  @Column({ default: 0 })
  displayOrder: number;

  @ManyToOne(() => CateringService, (service) => service.faqs, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'service_id' })
  service: CateringService;

  @Column({ name: 'service_id' })
  serviceId: string;
}
