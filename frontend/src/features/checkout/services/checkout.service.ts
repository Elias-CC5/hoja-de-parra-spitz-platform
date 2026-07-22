import { api } from "@/lib/axios";
import type { Order } from "@/types";
import type { CheckoutFormValues } from "./checkout.schemas";

interface Payment {
  id: string;
  status: string;
  orderId: string;
}

export const checkoutService = {
  createOrder: (dto: CheckoutFormValues) => api.post<never, Order>("/orders/checkout", dto),
  payOrder: (orderId: string, culqiToken: string, email: string) =>
    api.post<never, Payment>("/payments/charge", { orderId, culqiToken, email }),
};
