import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { CateringService } from '../../services-catalog/entities/catering-service.entity';
import { Order } from '../../orders/entities/order.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';

export interface ChatbotReply {
  reply: string;
  suggestedProducts?: { id: string; name: string; price: number }[];
}

/**
 * Chatbot basado en reglas + consultas a la base de datos (sin LLM externo).
 * Detecta intención por palabras clave y responde con datos reales del negocio.
 * Se puede reemplazar fácilmente por un proveedor de IA externo manteniendo
 * la misma interfaz (handleMessage).
 */
@Injectable()
export class ChatbotService {
  constructor(
    @InjectRepository(Product) private readonly productsRepository: Repository<Product>,
    @InjectRepository(CateringService)
    private readonly servicesRepository: Repository<CateringService>,
    @InjectRepository(Order) private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
  ) {}

  async handleMessage(message: string, userId?: string): Promise<ChatbotReply> {
    const text = message.toLowerCase();

    if (this.matches(text, ['horario', 'atienden', 'hora de atención'])) {
      return {
        reply:
          'Atendemos de lunes a sábado de 8:00 a.m. a 8:00 p.m. Los pedidos para eventos deben coordinarse con al menos 48 horas de anticipación.',
      };
    }

    if (this.matches(text, ['pedido', 'orden', 'mi compra']) && userId) {
      const lastOrder = await this.ordersRepository.findOne({
        where: { userId },
        order: { createdAt: 'DESC' },
      });
      if (lastOrder) {
        return {
          reply: `Tu último pedido ${lastOrder.orderNumber} está en estado "${lastOrder.status}". Total: S/ ${Number(lastOrder.total).toFixed(2)}.`,
        };
      }
      return { reply: 'No encontré pedidos recientes asociados a tu cuenta.' };
    }

    if (this.matches(text, ['reserva', 'evento reservado']) && userId) {
      const nextReservation = await this.reservationsRepository.findOne({
        where: { userId },
        order: { eventDate: 'ASC' },
      });
      if (nextReservation) {
        return {
          reply: `Tu próxima reserva es para el ${nextReservation.eventDate} a las ${nextReservation.eventTime}, estado: ${nextReservation.status}.`,
        };
      }
      return { reply: 'No tienes reservas activas por el momento.' };
    }

    if (this.matches(text, ['servicio', 'catering', 'matrimonio', 'cumpleaños', 'corporativo'])) {
      const services = await this.servicesRepository.find({ where: { isActive: true }, take: 3 });
      return {
        reply:
          services.length > 0
            ? `Ofrecemos servicios como: ${services.map((s) => s.name).join(', ')}. ¿Quieres que te ayude a solicitar una cotización?`
            : 'Contamos con servicios de catering para todo tipo de eventos. ¿Para qué ocasión lo necesitas?',
      };
    }

    if (this.matches(text, ['producto', 'menú', 'menu', 'plato', 'combo', 'coffee break', 'buffet'])) {
      const products = await this.productsRepository.find({
        where: { isAvailable: true, isFeatured: true },
        take: 4,
      });
      return {
        reply: 'Estos son algunos de nuestros productos destacados:',
        suggestedProducts: products.map((p) => ({ id: p.id, name: p.name, price: Number(p.price) })),
      };
    }

    return {
      reply:
        'Puedo ayudarte con información sobre productos, servicios de catering, pedidos, reservas y horarios. ¿Sobre qué te gustaría saber más?',
    };
  }

  private matches(text: string, keywords: string[]): boolean {
    return keywords.some((keyword) => text.includes(keyword));
  }
}
