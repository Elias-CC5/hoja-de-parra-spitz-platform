import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const apiPrefix = configService.get<string>('app.apiPrefix') ?? 'api/v1';
  const port = configService.get<number>('app.port') ?? 3001;
  const frontendUrl = configService.get<string>('app.frontendUrl');

  // Prefijo global de la API (ej. /api/v1/products)
  app.setGlobalPrefix(apiPrefix);

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

  await app.listen(port);
  console.log(`🚀 API corriendo en http://localhost:${port}/${apiPrefix}`);
  console.log(`📚 Swagger docs en http://localhost:${port}/${apiPrefix}/docs`);
}
bootstrap();
