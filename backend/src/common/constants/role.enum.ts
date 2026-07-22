/**
 * Roles disponibles en el sistema.
 * Se almacena en la entidad User y se usa junto con @Roles() + RolesGuard.
 */
export enum Role {
  ADMIN = 'admin',
  EMPLEADO = 'empleado',
  CLIENTE = 'cliente',
}
