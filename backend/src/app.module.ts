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

    // Módulos de dominio
    AuthModule,
    UsersModule,
    // Los siguientes módulos se irán agregando de forma incremental:
    // CategoriesModule, ProductsModule, ServicesCatalogModule, CartModule,
    // OrdersModule, QuotationsModule, ReservationsModule, PaymentsModule,
    // AdvertisementsModule, ReviewsModule, FavoritesModule, UploadsModule,
    // MailModule, ChatbotModule, DashboardModule
  ],
  providers: [
    // Autenticación JWT aplicada globalmente; se libera con @Public()
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // Formato de respuesta consistente en toda la API
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    // Formato de error consistente en toda la API
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
