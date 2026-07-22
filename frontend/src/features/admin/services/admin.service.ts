import { api } from "@/lib/axios";
import type { Order, Quotation, Reservation, Product } from "@/types";

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

export const adminService = {
  getStats: () => api.get<never, DashboardStats>("/dashboard/stats"),
  findAllOrders: () => api.get<never, Order[]>("/orders"),
  updateOrderStatus: (id: string, status: string) =>
    api.patch<never, Order>(`/orders/${id}/status`, { status }),
  findAllQuotations: () => api.get<never, Quotation[]>("/quotations"),
  reviewQuotation: (id: string, data: { status: string; finalPrice?: number; adminNotes?: string }) =>
    api.patch<never, Quotation>(`/quotations/${id}/review`, data),
  convertQuotationToOrder: (id: string) => api.post<never, Order>(`/quotations/${id}/convert-to-order`),
  findAllReservations: () => api.get<never, Reservation[]>("/reservations"),
  updateReservationStatus: (id: string, status: string) =>
    api.patch<never, Reservation>(`/reservations/${id}/status`, { status }),
  findAllProducts: () => api.get<never, { items: Product[] }>("/products", { params: { limit: 100 } }),
};
