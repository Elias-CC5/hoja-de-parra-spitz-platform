import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Payment } from './entities/payment.entity';
import { Transaction } from './entities/transaction.entity';
import { CulqiService } from './services/culqi.service';
import { PaymentsService } from './services/payments.service';
import { PaymentsController } from './controllers/payments.controller';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Transaction]), HttpModule, OrdersModule],
  controllers: [PaymentsController],
  providers: [CulqiService, PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
