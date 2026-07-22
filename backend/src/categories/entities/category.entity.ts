import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Product } from '../../products/entities/product.entity';

export enum CategoryType {
  PRODUCTO = 'producto', // platos, combos, postres, bebidas, etc.
  SERVICIO = 'servicio', // catering para eventos
}

@Entity('categories')
export class Category extends BaseEntity {
  @Index({ unique: true })
  @Column({ length: 120 })
  name: string;

  @Index({ unique: true })
  @Column({ length: 140 })
  slug: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ type: 'enum', enum: CategoryType, default: CategoryType.PRODUCTO })
  type: CategoryType;

  @Column({ default: 0 })
  displayOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
