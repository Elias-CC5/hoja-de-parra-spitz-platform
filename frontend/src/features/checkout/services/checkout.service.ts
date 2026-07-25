import { api } from "@/lib/axios";
import type { Order } from "@/types";
import type { CheckoutFormValues } from "./checkout.schemas";

interface Payment {
  id: string;
  status: string;
  orderId: string;
}

export const checkoutService = {
  createOrder: async (dto: CheckoutFormValues): Promise<Order> => {
    // Apunta exactamente a @Post('checkout') en OrdersController
    const response = await api.post<Order>("/orders/checkout", dto);
    return response.data ?? response;
  },

  payOrder: async (orderId: string, culqiToken: string, email: string): Promise<Payment> => {
    // Apunta a @Post('charge') en PaymentsController
    const response = await api.post<Payment>("/payments/charge", {
      orderId,
      culqiToken,
      email,
    });
    return response.data ?? response;
  },
};