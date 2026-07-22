import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Category } from '../../categories/entities/category.entity';
import { ProductImage } from './product-image.entity';

export enum ProductType {
  PLATO = 'plato',
  COMBO = 'combo',
  PAQUETE_CORPORATIVO = 'paquete_corporativo',
  COFFEE_BREAK = 'coffee_break',
  BUFFET = 'buffet',
  BOX_LUNCH = 'box_lunch',
  POSTRE = 'postre',
  BEBIDA = 'bebida',
}

@Entity('products')
export class Product extends BaseEntity {
  @Column({ length: 160 })
  name: string;

  @Index({ unique: true })
  @Column({ length: 180 })
  slug: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: ProductType, default: ProductType.PLATO })
  type: ProductType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int', default: 1 })
  minPeoplePerOrder: number;

  @Column({ type: 'int', nullable: true })
  maxPeoplePerOrder?: number;

  @Column({ default: true })
  isAvailable: boolean;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ type: 'int', default: 0 })
  stock: number; // 0 = sin control de stock (bajo pedido)

  @ManyToOne(() => Category, (category) => category.products, { eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'category_id' })
  categoryId: string;

  @OneToMany(() => ProductImage, (image) => image.product, { cascade: true })
  images: ProductImage[];
}