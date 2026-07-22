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

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  category?: string;
  isAvailable?: boolean;
  images?: { url: string }[];
}

// 📦 DTO para actualizar productos (hace que todos los campos sean opcionales)
export type UpdateProductDto = Partial<CreateProductDto>;

// 🏷️ Interfaces para Categorías
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  type: 'producto' | 'servicio';
  imageUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  type: 'producto' | 'servicio';
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

  // 🛠️ Productos
  createProduct: (data: CreateProductDto) => api.post<never, Product>("/products", data),
  
  // ✏️ Método para actualizar el producto (PATCH)
  updateProduct: (id: string, data: UpdateProductDto) => api.patch<never, Product>(`/products/${id}`, data),

  deleteProduct: (id: string) => api.delete<never, void>(`/products/${id}`),

  // 🏷️ Métodos de Categorías
  findAllCategories: () => api.get<never, Category[]>("/categories"),
  createCategory: (data: CreateCategoryDto) => api.post<never, Category>("/categories", data),
  deleteCategory: (id: string) => api.delete<never, void>(`/categories/${id}`),
};