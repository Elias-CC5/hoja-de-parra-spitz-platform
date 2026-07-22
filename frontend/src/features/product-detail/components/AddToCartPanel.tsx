"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/features/cart/hooks/useAddToCart";

export function AddToCartPanel({ productId }: { productId: string }) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isAdding } = useAddToCart();

  return (
    <div className="mt-8 flex items-center gap-4">
      <div className="flex items-center gap-3 rounded-md border border-border px-3 py-2">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          aria-label="Reducir cantidad"
        >
          <Minus size={16} />
        </button>
        <span className="w-6 text-center">{quantity}</span>
        <button onClick={() => setQuantity((q) => q + 1)} aria-label="Aumentar cantidad">
          <Plus size={16} />
        </button>
      </div>

      <Button
        size="lg"
        className="flex-1"
        onClick={() => addToCart(productId, quantity)}
        disabled={isAdding === productId}
      >
        Agregar al carrito
      </Button>
    </div>
  );
}
