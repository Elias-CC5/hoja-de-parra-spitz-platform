"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { profileService } from "../services/profile.service";
import type { Product } from "@/types";

const PLACEHOLDER_IMAGE = "/product-placeholder.svg";

interface FavoriteItem {
  id: string;
  productId: string;
  product: Product;
}

export function FavoritesList() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = () => {
    profileService.findMyFavorites().then(setFavorites).finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  if (isLoading) return <p className="text-sm text-muted-foreground">Cargando favoritos...</p>;
  if (favorites.length === 0)
    return <p className="text-sm text-muted-foreground">Aún no tienes productos favoritos.</p>;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {favorites.map((favorite) => (
        <div key={favorite.id} className="flex gap-4 rounded-lg border border-border p-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
            <Image
              src={favorite.product?.images?.[0]?.url ?? PLACEHOLDER_IMAGE}
              alt={favorite.product?.name ?? "Producto"}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <Link href={`/menu/${favorite.product?.slug}`} className="text-sm font-medium hover:text-accent">
              {favorite.product?.name}
            </Link>
            <p className="text-sm text-muted-foreground">
              S/ {Number(favorite.product?.price ?? 0).toFixed(2)}
            </p>
            <button
              onClick={async () => {
                await profileService.removeFavorite(favorite.productId);
                load();
              }}
              className="mt-1 flex items-center gap-1 text-xs text-destructive"
            >
              <Heart size={12} className="fill-current" /> Quitar de favoritos
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
