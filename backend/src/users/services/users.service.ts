import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';

const SALT_ROUNDS = 10;

/**
 * Toda la lógica de negocio relacionada a usuarios vive aquí.
 * El controller solo delega; nunca contiene lógica de negocio.
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('Ya existe un usuario con este correo');
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = this.usersRepository.create({
      ...dto,
      password: hashedPassword,
    });

    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, dto);
    return this.usersRepository.save(user);
  }

  async changePassword(id: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.findById(id);

    const isCurrentPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new ConflictException('La contraseña actual es incorrecta');
    }

    user.password = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);
    await this.usersRepository.save(user);
  }

  async updateRefreshTokenHash(
    id: string,
    refreshTokenHash: string | null,
  ): Promise<void> {
    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ refreshTokenHash: refreshTokenHash as string | undefined })
      .where('id = :id', { id })
      .execute();
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepository.softRemove(user);
  }

  /**
   * Incrementa el contador de intentos fallidos. Al llegar a 5,
   * bloquea la cuenta 15 minutos (sin importar la IP del atacante).
   */
  async registerFailedLoginAttempt(id: string): Promise<void> {
    const MAX_ATTEMPTS = 5;
    const LOCKOUT_MINUTES = 15;

    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) return;

    const attempts = user.failedLoginAttempts + 1;
    const lockedUntil =
      attempts >= MAX_ATTEMPTS
        ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000)
        : user.lockedUntil;

    await this.usersRepository.update(id, {
      failedLoginAttempts: attempts,
      lockedUntil,
    });
  }

  /**
   * Usa createQueryBuilder (en vez de Repository.update) porque necesitamos
   * escribir NULL real en la base de datos. Repository.update con `null`
   * no tipa contra `Date | undefined` de la entidad, y con `undefined`
   * TypeORM directamente omite la columna del UPDATE (no la limpia).
   */
  async resetFailedLoginAttempts(id: string): Promise<void> {
    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ failedLoginAttempts: 0, lockedUntil: null as unknown as Date })
      .where('id = :id', { id })
      .execute();
  }

  isAccountLocked(user: User): boolean {
    return !!user.lockedUntil && user.lockedUntil.getTime() > Date.now();
  }
}