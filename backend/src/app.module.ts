import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import cloudinaryConfig from './config/cloudinary.config';
import culqiConfig from './config/culqi.config';
import mailConfig from './config/mail.config';
import { envValidationSchema } from './config/env.validation';

import { DatabaseModule } from './database/database.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';

import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UsersModule } from './users/users.module';

// 🚀 IMPORTACIONES DE DOMINIO
import { CategoriesModule } from './categories/categories.module'; // 👈 IMPORTANTE
import { ProductsModule } from './products/products.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [
        appConfig,
        databaseConfig,
        jwtConfig,
        cloudinaryConfig,
        culqiConfig,
        mailConfig,
      ],
      validationSchema: envValidationSchema,
      validationOptions: { abortEarly: false },
    }),
    DatabaseModule,

    // Módulos de dominio activos
    AuthModule,
    UsersModule,
    CategoriesModule, // 👈 1. Agrégalo aquí antes de ProductsModule
    ProductsModule,   // 👈 2. Ya no lanzará el error de "Entity metadata for Product#category was not found"
    UploadsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}