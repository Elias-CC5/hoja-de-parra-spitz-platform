import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { CateringService } from '../services-catalog/entities/catering-service.entity';
import { Order } from '../orders/entities/order.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { ChatbotService } from './services/chatbot.service';
import { ChatbotController } from './controllers/chatbot.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, CateringService, Order, Reservation])],
  controllers: [ChatbotController],
  providers: [ChatbotService],
})
export class ChatbotModule {}
