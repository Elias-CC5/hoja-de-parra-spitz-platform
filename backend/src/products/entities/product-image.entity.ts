import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { Product } from './product.entity';

@Entity('product_images')
export class ProductImage extends BaseEntity {
  @Column()
  url: string;

  @Column({ nullable: true })
  publicId?: string;

  @Column({ default: 0 }) // 👈 ASEGÚRATE DE QUE ESTA LÍNEA EXISTA
  displayOrder: number;

  @ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'product_id' })
  productId: string;
}