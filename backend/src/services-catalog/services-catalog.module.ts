import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CateringService } from './entities/catering-service.entity';
import { ServiceFaq } from './entities/service-faq.entity';
import { ServicesCatalogService } from './services/services-catalog.service';
import { ServicesCatalogController } from './controllers/services-catalog.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CateringService, ServiceFaq])],
  controllers: [ServicesCatalogController],
  providers: [ServicesCatalogService],
  exports: [ServicesCatalogService],
})
export class ServicesCatalogModule {}
