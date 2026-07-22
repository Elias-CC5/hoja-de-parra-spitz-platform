import { Column, Entity, Index } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseEntity } from '../../common/entities/base.entity';
import { Role } from '../../common/constants/role.enum';

@Entity('users')
export class User extends BaseEntity {
  @Column({ length: 120 })
  fullName: string;

  @Index({ unique: true })
  @Column({ length: 160 })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ length: 20, nullable: true })
  phone?: string;

  @Column({ type: 'enum', enum: Role, default: Role.CLIENTE })
  role: Role;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  refreshTokenHash?: string;
}
