// backend/src/chatbot/services/chatbot.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Product } from '../../products/entities/product.entity';
import { CateringService } from '../../services-catalog/entities/catering-service.entity';
import { Order } from '../../orders/entities/order.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';

export interface ChatbotReply {
  reply: string;
  suggestedProducts?: { id: string; name: string; price: number }[];
}

@Injectable()
export class ChatbotService {
  private readonly logger = new Logger(ChatbotService.name);
  private genAI: GoogleGenerativeAI;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    @InjectRepository(CateringService)
    private readonly servicesRepository: Repository<CateringService>,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(apiKey || '');
  }

  async handleMessage(message: string, userId?: string): Promise<ChatbotReply> {
    try {
      // 1. Cargar datos del negocio
      const [products, services, lastOrder, nextReservation] = await Promise.all([
        this.productsRepository.find({
          where: { isAvailable: true, isFeatured: true },
          take: 5,
        }),
        this.servicesRepository.find({
          where: { isActive: true },
          take: 5,
        }),
        userId
          ? this.ordersRepository.findOne({
              where: { userId },
              order: { createdAt: 'DESC' },
            })
          : null,
        userId
          ? this.reservationsRepository.findOne({
              where: { userId },
              order: { eventDate: 'ASC' },
            })
          : null,
      ]);

      // 2. Contextos
      const menuContext = products
        .map((p) => `- ${p.name}: S/ ${Number(p.price).toFixed(2)} (${p.description || 'Plato especial'})`)
        .join('\n');

      const servicesContext = services
        .map((s) => `- ${s.name}: ${s.description || 'Servicio de catering'}`)
        .join('\n');

      const userContext = `
        - Estado de usuario: ${userId ? 'Autenticado' : 'Invitado'}
        - Último pedido: ${lastOrder ? `N° ${lastOrder.orderNumber}, Estado: ${lastOrder.status}, Total: S/ ${Number(lastOrder.total).toFixed(2)}` : 'Sin pedidos'}
        - Próxima reserva: ${nextReservation ? `Fecha: ${nextReservation.eventDate}, Hora: ${nextReservation.eventTime}` : 'Sin reservas'}
      `;

      // 3. Prompt de sistema
      const systemInstruction = `
        Eres el asistente virtual elegante y profesional de "Hoja de Parra Spitz", catering y gastronomía.
        
        REGLAS:
        - Horario: Lunes a Sábado de 8:00 a.m. a 8:00 p.m.
        - Pedidos de eventos: 48 horas de anticipación.
        
        MENÚ DESTACADO:
        ${menuContext || 'Consulta la sección de catálogo.'}

        SERVICIOS:
        ${servicesContext || 'Servicios de catering integral.'}

        DATOS CLIENTE:
        ${userContext}

        RESPONDE SIEMPRE EN ESPAÑOL, DE FORMA BREVE, AMABLE Y CONCISA (Máximo 3 oraciones).
      `;

      // 4. Inicializar Gemini con el modelo oficial
      const model = this.genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-lite', 
        systemInstruction,
      });

      const result = await model.generateContent(message);
      const response = await result.response;
      const replyText = response.text();

      return {
        reply: replyText || '¿En qué puedo ayudarte sobre nuestros productos o catering?',
        suggestedProducts: products.map((p) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
        })),
      };
    } catch (error) {
      this.logger.error('Error procesando mensaje con Gemini AI:', error);
      
      // Respuesta amigable cuando salte el límite de tasa (Rate limit)
      return {
        reply: 'Hola, actualmente tengo un volumen alto de consultas. Por favor, inténtalo de nuevo en unos segundos.',
      };
    }
  }
}