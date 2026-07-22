"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useUiStore } from "@/store/ui.store";

/**
 * Encapsula el flujo de "agregar al carrito": si no hay sesión, redirige
 * a login; si la hay, agrega el ítem y abre el drawer del carrito.
 */
export function useAddToCart() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useUiStore((state) => state.openCart);
  const [isAdding, setIsAdding] = useState<string | null>(null);

  const addToCart = async (productId: string, quantity = 1) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setIsAdding(productId);
    try {
      await addItem(productId, quantity);
      openCart();
    } finally {
      setIsAdding(null);
    }
  };

  return { addToCart, isAdding };
}
