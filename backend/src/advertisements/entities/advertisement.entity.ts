import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';

export enum AdvertisementPlacement {
  HOME_BANNER = 'home_banner',
  HOME_POPUP = 'home_popup',
  MENU_TOP = 'menu_top',
  PROMOCION = 'promocion',
}

@Entity('advertisements')
export class Advertisement extends BaseEntity {
  @Column({ length: 160 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  linkUrl?: string;

  @Column({ type: 'enum', enum: AdvertisementPlacement })
  placement: AdvertisementPlacement;

  @Column({ type: 'date', nullable: true })
  startsAt?: string;

  @Column({ type: 'date', nullable: true })
  endsAt?: string;

  @Column({ default: 0 })
  displayOrder: number;

  @Column({ default: true })
  isActive: boolean;
}
