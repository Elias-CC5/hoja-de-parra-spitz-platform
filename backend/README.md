# Hoja de Parra Spitz — Backend (NestJS)

API REST del sistema de e-commerce de catering, buffet, coffee break, box lunch
y eventos corporativos de Hoja de Parra Spitz.

## Requisitos

- Node.js 20+
- Docker (para PostgreSQL local) o una instancia de PostgreSQL 14+

## Puesta en marcha

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno y completar secretos (JWT, Cloudinary, Culqi)
cp .env.example .env

# 3. Levantar PostgreSQL local
docker compose up -d

# 4. Ejecutar migraciones
npm run migration:run

# 5. Arrancar en modo desarrollo
npm run start:dev
```

La API queda disponible en `http://localhost:3001/api/v1`
y la documentación Swagger en `http://localhost:3001/api/v1/docs`.

## Scripts de migraciones

```bash
npm run migration:generate -- src/database/migrations/NombreMigracion  # genera a partir de cambios en entidades
npm run migration:create -- src/database/migrations/NombreMigracion   # crea una migración vacía
npm run migration:run                                                  # ejecuta migraciones pendientes
npm run migration:revert                                               # revierte la última migración
```

## Módulos implementados hasta ahora

- ✅ `config` — variables de entorno tipadas y validadas (Joi)
- ✅ `database` — conexión TypeORM + migraciones
- ✅ `common` — entidad base, guards, decoradores, filtro de excepciones, interceptor de respuesta
- ✅ `auth` — registro, login, JWT access/refresh, logout, roles
- ✅ `users` — CRUD de usuarios, perfil, cambio de contraseña

## Próximos módulos

`categories` → `products` (+ Cloudinary) → `cart` → `orders` → `payments` (Culqi)
→ `quotations` → `reservations` → `advertisements` / `reviews` / `favorites`
→ `dashboard` → `chatbot`

## Probar el flujo de autenticación

```bash
# Registro
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Juan Pérez","email":"juan@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@example.com","password":"password123"}'

# Perfil (usar accessToken devuelto por login)
curl http://localhost:3001/api/v1/users/me \
  -H "Authorization: Bearer <accessToken>"
```
