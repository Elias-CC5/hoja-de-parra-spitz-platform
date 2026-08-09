import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Obtenemos los valores individuales de forma segura o armamos la URL directa
        const host = configService.get<string>('database.host') || process.env.DB_HOST;
        const port = configService.get<number>('database.port') || parseInt(process.env.DB_PORT || '5432', 10);
        const username = configService.get<string>('database.username') || process.env.DB_USERNAME;
        const password = configService.get<string>('database.password') || process.env.DB_PASSWORD;
        const database = configService.get<string>('database.name') || process.env.DB_NAME;

        return {
          type: 'postgres',
          // Construimos la URL completa para forzar el SSL y evitar el localhost
          url: `postgresql://${username}:${password}@${host}:${port}/${database}?sslmode=require`,
          autoLoadEntities: true,
          synchronize: configService.get<boolean>('database.synchronize') ?? true,
          ssl: {
            rejectUnauthorized: false,
          },
          extra: {
            ssl: {
              rejectUnauthorized: false,
            },
          },
        };
      },
    }),
  ],
})
export class DatabaseModule {}