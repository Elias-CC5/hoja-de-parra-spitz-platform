import { Role } from '../../common/constants/role.enum';

/**
 * Forma del usuario que queda disponible en `request.user`
 * después de que JwtStrategy valida el access token.
 */
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
}

/**
 * Payload que se firma dentro del JWT (access y refresh token).
 */
export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: Role;
}
