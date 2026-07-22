import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quotation, QuotationStatus } from '../entities/quotation.entity';
import { CreateQuotationDto } from '../dto/create-quotation.dto';
import { ReviewQuotationDto } from '../dto/review-quotation.dto';
import { MailService } from '../../mail/services/mail.service';
import { Order, OrderStatus } from '../../orders/entities/order.entity';

@Injectable()
export class QuotationsService {
  constructor(
    @InjectRepository(Quotation)
    private readonly quotationsRepository: Repository<Quotation>,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly mailService: MailService,
  ) {}

  async create(userId: string, dto: CreateQuotationDto): Promise<Quotation> {
    const quotation = this.quotationsRepository.create({
      ...dto,
      userId,
      status: QuotationStatus.PENDIENTE,
    });
    return this.quotationsRepository.save(quotation);
  }

  async findAll(): Promise<Quotation[]> {
    return this.quotationsRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findByUser(userId: string): Promise<Quotation[]> {
    return this.quotationsRepository.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<Quotation> {
    const quotation = await this.quotationsRepository.findOne({ where: { id } });
    if (!quotation) {
      throw new NotFoundException('Cotización no encontrada');
    }
    return quotation;
  }

  /** El admin aprueba, rechaza o modifica (ajusta precio/notas) la cotización */
  async review(id: string, dto: ReviewQuotationDto): Promise<Quotation> {
    const quotation = await this.findById(id);

    if (quotation.status === QuotationStatus.CONVERTIDA_A_PEDIDO) {
      throw new BadRequestException('Esta cotización ya fue convertida en pedido');
    }

    Object.assign(quotation, dto);
    const saved = await this.quotationsRepository.save(quotation);

    await this.mailService.sendQuotationUpdate({
      to: quotation.user.email,
      fullName: quotation.user.fullName,
      eventType: quotation.eventType,
      eventDate: quotation.eventDate,
      finalPrice: quotation.finalPrice,
      adminNotes: quotation.adminNotes,
      status: quotation.status,
    });

    return saved;
  }

  /**
   * Convierte una cotización aprobada en un pedido formal.
   * A diferencia del checkout normal (que parte del carrito), este pedido
   * nace directamente del precio acordado en la cotización.
   */
  async convertToOrder(id: string): Promise<Order> {
    const quotation = await this.findById(id);

    if (quotation.status !== QuotationStatus.APROBADA) {
      throw new BadRequestException('Solo se pueden convertir cotizaciones aprobadas');
    }
    if (!quotation.finalPrice) {
      throw new BadRequestException('La cotización no tiene un precio final asignado');
    }

    const count = await this.ordersRepository.count();
    const orderNumber = `HDPS-${(count + 1).toString().padStart(6, '0')}`;

    const order = this.ordersRepository.create({
      orderNumber,
      userId: quotation.userId,
      deliveryAddress: quotation.location,
      eventDate: quotation.eventDate,
      numberOfPeople: quotation.numberOfGuests,
      notes: quotation.comments,
      subtotal: quotation.finalPrice,
      tax: 0,
      shipping: 0,
      total: quotation.finalPrice,
      status: OrderStatus.PENDIENTE_PAGO,
      items: [],
    });

    const savedOrder = await this.ordersRepository.save(order);

    quotation.status = QuotationStatus.CONVERTIDA_A_PEDIDO;
    await this.quotationsRepository.save(quotation);

    return savedOrder;
  }
}
