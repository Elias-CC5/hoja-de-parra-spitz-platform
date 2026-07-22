import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Quotation } from './entities/quotation.entity';
import { Order } from '../orders/entities/order.entity';
import { QuotationsService } from './services/quotations.service';
import { QuotationsController } from './controllers/quotations.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Quotation, Order])],
  controllers: [QuotationsController],
  providers: [QuotationsService],
  exports: [QuotationsService],
})
export class QuotationsModule {}
