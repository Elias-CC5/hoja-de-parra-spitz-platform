import { SetMetadata } from '@nestjs/common';
import { Role } from '../constants/role.enum';

export const ROLES_KEY = 'roles';

/**
 * Marca un endpoint como accesible solo para los roles indicados.
 * Uso: @Roles(Role.ADMIN) sobre un controller o handler.
 * Requiere JwtAuthGuard + RolesGuard aplicados (ver auth/guards).
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
