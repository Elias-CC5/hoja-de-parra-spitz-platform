import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../entities/order.entity';
import { OrderItem } from '../entities/order-item.entity';
import { CreateOrderDto } from '../dto/create-order.dto';
import { CartService } from '../../cart/services/cart.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly orderItemsRepository: Repository<OrderItem>,
    private readonly cartService: CartService,
  ) {}

  /**
   * Convierte el carrito actual del usuario en un pedido (checkout).
   * El pedido nace en estado PENDIENTE_PAGO; PaymentsService lo actualiza
   * a PAGADO cuando Culqi confirma el pago vía webhook.
   */
  async createFromCart(userId: string, dto: CreateOrderDto): Promise<Order> {
    const { cart, subtotal, tax, shipping, total } = await this.cartService.getSummary(userId);

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('El carrito está vacío');
    }

    const orderNumber = await this.generateOrderNumber();

    const order = this.ordersRepository.create({
      orderNumber,
      userId,
      deliveryAddress: dto.deliveryAddress,
      eventDate: dto.eventDate,
      numberOfPeople: dto.numberOfPeople,
      notes: dto.notes,
      subtotal,
      tax,
      shipping,
      total,
      status: OrderStatus.PENDIENTE_PAGO,
    });

    const savedOrder = await this.ordersRepository.save(order);

    const orderItems = cart.items.map((item) =>
      this.orderItemsRepository.create({
        orderId: savedOrder.id,
        productId: item.productId,
        productNameSnapshot: item.product?.name ?? 'Producto',
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: Number((item.unitPrice * item.quantity).toFixed(2)),
      }),
    );
    await this.orderItemsRepository.save(orderItems);

    await this.cartService.clear(userId);

    return this.findById(savedOrder.id);
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findByUser(userId: string): Promise<Order[]> {
    return this.ordersRepository.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }

  async findById(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException('Pedido no encontrado');
    }
    return order;
  }

  async findByOrderNumber(orderNumber: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { orderNumber } });
    if (!order) {
      throw new NotFoundException('Pedido no encontrado');
    }
    return order;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const order = await this.findById(id);
    order.status = status;
    return this.ordersRepository.save(order);
  }

  async markAsPaid(id: string): Promise<Order> {
    return this.updateStatus(id, OrderStatus.PAGADO);
  }

  private async generateOrderNumber(): Promise<string> {
    const count = await this.ordersRepository.count();
    const nextNumber = (count + 1).toString().padStart(6, '0');
    return `HDPS-${nextNumber}`;
  }
}
