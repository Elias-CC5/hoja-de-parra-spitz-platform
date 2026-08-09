import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const apiPrefix = configService.get<string>('app.apiPrefix') ?? 'api/v1';
  
  // --- CAMBIO CLAVE AQUÍ PARA RENDER ---
  const port = process.env.PORT || configService.get<number>('app.port') || 3001;
  
  const frontendUrl = configService.get<string>('app.frontendUrl');

  // Prefijo global de la API (ej. /api/v1/products)
  app.setGlobalPrefix(apiPrefix);
  app.use(helmet());
  
  // CORS: solo el frontend autorizado puede consumir la API
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });

  // Validación automática de DTOs con class-validator en toda la app
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades no declaradas en el DTO
      forbidNonWhitelisted: true, // rechaza requests con propiedades extra
      transform: true, // transforma payloads a instancias de clase (para class-transformer)
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Documentación Swagger, disponible en /api/v1/docs
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Hoja de Parra Spitz API')
    .setDescription(
      'API REST oficial de Hoja de Parra Spitz — catering, buffet, coffee break, box lunch y eventos corporativos.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document);

  // Escuchar en 0.0.0.0 es indispensable para entornos cloud como Render
  await app.listen(port, '0.0.0.0');
  
  console.log(`🚀 API corriendo en el puerto ${port}`);
  console.log(`📚 Swagger docs en /${apiPrefix}/docs`);
}
bootstrap();