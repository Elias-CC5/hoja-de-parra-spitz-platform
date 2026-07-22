import { create } from "zustand";
import { api } from "@/lib/axios";
import type { CartSummary } from "@/types";

interface CartState {
  summary: CartSummary | null;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity: number, notes?: string) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clear: () => Promise<void>;
}

/**
 * El carrito vive en el backend (persistente por usuario), este store
 * solo cachea el resultado en el cliente para no refetch en cada render.
 */
export const useCartStore = create<CartState>((set) => ({
  summary: null,
  isLoading: false,

  fetchCart: async () => {
    set({ isLoading: true });
    try {
      const summary = await api.get<never, CartSummary>("/cart");
      set({ summary, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  addItem: async (productId, quantity, notes) => {
    const summary = await api.post<never, CartSummary>("/cart/items", { productId, quantity, notes });
    set({ summary });
  },

  updateItem: async (itemId, quantity) => {
    const summary = await api.patch<never, CartSummary>(`/cart/items/${itemId}`, { quantity });
    set({ summary });
  },

  removeItem: async (itemId) => {
    const summary = await api.delete<never, CartSummary>(`/cart/items/${itemId}`);
    set({ summary });
  },

  clear: async () => {
    const summary = await api.delete<never, CartSummary>("/cart");
    set({ summary });
  },
}));
