import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from '../../orders/entities/order.entity';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';
import { Reservation, ReservationStatus } from '../../reservations/entities/reservation.entity';
import { Quotation, QuotationStatus } from '../../quotations/entities/quotation.entity';

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalProducts: number;
  pendingReservations: number;
  pendingQuotations: number;
  ordersByStatus: Record<string, number>;
  revenueLast30Days: { date: string; total: number }[];
  topProducts: { productId: string; name: string; unitsSold: number }[];
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Order) private readonly ordersRepository: Repository<Order>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Product) private readonly productsRepository: Repository<Product>,
    @InjectRepository(Reservation)
    private readonly reservationsRepository: Repository<Reservation>,
    @InjectRepository(Quotation)
    private readonly quotationsRepository: Repository<Quotation>,
  ) {}

  async getStats(): Promise<DashboardStats> {
    const [
      totalRevenueResult,
      totalOrders,
      totalUsers,
      totalProducts,
      pendingReservations,
      pendingQuotations,
      ordersByStatusRaw,
      revenueLast30Days,
      topProducts,
    ] = await Promise.all([
      this.ordersRepository
        .createQueryBuilder('order')
        .select('SUM(order.total)', 'sum')
        .where('order.status != :cancelado', { cancelado: OrderStatus.CANCELADO })
        .getRawOne<{ sum: string }>(),
      this.ordersRepository.count(),
      this.usersRepository.count(),
      this.productsRepository.count(),
      this.reservationsRepository.count({ where: { status: ReservationStatus.PENDIENTE } }),
      this.quotationsRepository.count({ where: { status: QuotationStatus.PENDIENTE } }),
      this.ordersRepository
        .createQueryBuilder('order')
        .select('order.status', 'status')
        .addSelect('COUNT(order.id)', 'count')
        .groupBy('order.status')
        .getRawMany<{ status: string; count: string }>(),
      this.ordersRepository
        .createQueryBuilder('order')
        .select("DATE_TRUNC('day', order.createdAt)", 'date')
        .addSelect('SUM(order.total)', 'total')
        .where("order.createdAt >= NOW() - INTERVAL '30 days'")
        .groupBy("DATE_TRUNC('day', order.createdAt)")
        .orderBy('date', 'ASC')
        .getRawMany<{ date: string; total: string }>(),
      this.ordersRepository
        .createQueryBuilder('order')
        .innerJoin('order.items', 'item')
        .select('item.productId', 'productId')
        .addSelect('item.productNameSnapshot', 'name')
        .addSelect('SUM(item.quantity)', 'unitsSold')
        .groupBy('item.productId')
        .addGroupBy('item.productNameSnapshot')
        .orderBy('SUM(item.quantity)', 'DESC')
        .limit(5)
        .getRawMany<{ productId: string; name: string; unitsSold: string }>(),
    ]);

    const ordersByStatus: Record<string, number> = {};
    ordersByStatusRaw.forEach((row) => {
      ordersByStatus[row.status] = Number(row.count);
    });

    return {
      totalRevenue: Number(totalRevenueResult?.sum ?? 0),
      totalOrders,
      totalUsers,
      totalProducts,
      pendingReservations,
      pendingQuotations,
      ordersByStatus,
      revenueLast30Days: revenueLast30Days.map((row) => ({
        date: row.date,
        total: Number(row.total),
      })),
      topProducts: topProducts.map((row) => ({
        productId: row.productId,
        name: row.name,
        unitsSold: Number(row.unitsSold),
      })),
    };
  }
}
