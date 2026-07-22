import { api } from "@/lib/axios";
import type { Order, Reservation, Quotation, Product } from "@/types";

interface Favorite {
  id: string;
  productId: string;
  product: Product;
}

export const profileService = {
  findMyOrders: () => api.get<never, Order[]>("/orders/my-orders"),
  findMyReservations: () => api.get<never, Reservation[]>("/reservations/my-reservations"),
  findMyQuotations: () => api.get<never, Quotation[]>("/quotations/my-quotations"),
  findMyFavorites: () => api.get<never, Favorite[]>("/favorites"),
  removeFavorite: (productId: string) => api.delete(`/favorites/${productId}`),
  updateProfile: (data: { fullName?: string; phone?: string }) => api.patch("/users/me", data),
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.patch("/users/me/password", data),
};
