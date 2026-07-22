"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAddToCart } from "@/features/cart/hooks/useAddToCart";
import type { Product } from "@/types";

const PLACEHOLDER_IMAGE = "/product-placeholder.svg";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, isAdding } = useAddToCart();

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md">
      <Link href={`/menu/${product.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={product.images?.[0]?.url ?? PLACEHOLDER_IMAGE}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {product.isFeatured && (
          <Badge variant="accent" className="absolute left-3 top-3">Destacado</Badge>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/menu/${product.slug}`}>
          <h3 className="font-display text-base font-medium leading-snug hover:text-accent">
            {product.name}
          </h3>
        </Link>
        <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>

        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="font-display text-lg font-semibold">S/ {Number(product.price).toFixed(2)}</span>
          <Button
            size="sm"
            onClick={() => addToCart(product.id)}
            disabled={isAdding === product.id}
            aria-label={`Agregar ${product.name} al carrito`}
          >
            <Plus size={16} />
            Agregar
          </Button>
        </div>
      </div>
    </div>
  );
}
