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
    // Si tu instancia de Axios "api" NO tiene un interceptor que extraiga response.data,
    // asegúrate de retornar la propiedad .data
    const response = await api.post<Order>("/orders/checkout", dto);
    return response.data ?? response; 
  },
  
  payOrder: async (orderId: string, culqiToken: string, email: string): Promise<Payment> => {
    const response = await api.post<Payment>("/payments/charge", { orderId, culqiToken, email });
    return response.data ?? response;
  },
};