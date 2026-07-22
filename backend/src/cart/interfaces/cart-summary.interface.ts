import { Cart } from '../entities/cart.entity';

export interface CartSummary {
  cart: Cart;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}
