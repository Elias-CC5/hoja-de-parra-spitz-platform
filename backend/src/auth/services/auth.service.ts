import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/services/users.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { JwtPayload, AuthenticatedUser } from '../interfaces/authenticated-user.interface';
import { Role } from '../../common/constants/role.enum';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

const REFRESH_TOKEN_SALT_ROUNDS = 10;

/**
 * Contiene toda la lógica de negocio de autenticación.
 * El controller solo expone endpoints y delega aquí.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const user = await this.usersService.create({
      ...dto,
      role: Role.CLIENTE,
    });

    const tokens = await this.generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    await this.persistRefreshToken(user.id, tokens.refreshToken);

    return {
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
      ...tokens,
    };
  }

async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    if (this.usersService.isAccountLocked(user)) {
      throw new UnauthorizedException(
        'Cuenta bloqueada temporalmente por demasiados intentos fallidos. Intenta en unos minutos.',
      );
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      await this.usersService.registerFailedLoginAttempt(user.id);
      throw new UnauthorizedException('Credenciales inválidas');
    }

    await this.usersService.resetFailedLoginAttempts(user.id);

    const tokens = await this.generateTokens({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    await this.persistRefreshToken(user.id, tokens.refreshToken);

    return {
      user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
      ...tokens,
    };
  }
  async refresh(user: AuthenticatedUser) {
    const tokens = await this.generateTokens(user);
    await this.persistRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async logout(userId: string): Promise<void> {
    await this.usersService.updateRefreshTokenHash(userId, null);
  }

  private async generateTokens(
    user: AuthenticatedUser,
  ): Promise<AuthTokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.accessSecret'),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expiresIn: this.configService.get<string>('jwt.accessExpiresIn') as any,
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn') as any,
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async persistRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hash = await bcrypt.hash(refreshToken, REFRESH_TOKEN_SALT_ROUNDS);
    await this.usersService.updateRefreshTokenHash(userId, hash);
  }
}
