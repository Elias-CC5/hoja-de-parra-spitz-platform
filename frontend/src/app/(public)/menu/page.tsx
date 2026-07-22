"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/features/menu/hooks/useProducts";
import { ProductFilters } from "@/features/menu/components/ProductFilters";
import { ProductCard } from "@/features/menu/components/ProductCard";
import { Button } from "@/components/ui/button";
import type { ProductQuery } from "@/features/menu/services/products.service";

function MenuContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState<ProductQuery>({
    categoryId: searchParams.get("categoryId") ?? undefined,
    page: 1,
    limit: 12,
  });
  const { result, isLoading, setQuery: updateQuery } = useProducts(query);

  const handleChange = (newQuery: ProductQuery) => {
    setQuery(newQuery);
    updateQuery(newQuery);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">Nuestro menú</p>
        <h1 className="font-display text-3xl font-medium">Platos, combos y más</h1>
      </div>

      <ProductFilters query={query} onChange={handleChange} />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : result && result.items.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {result.items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {result.totalPages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: result.totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant={query.page === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleChange({ ...query, page: i + 1 })}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          )}
        </>
      ) : (
        <p className="py-20 text-center text-muted-foreground">
          No encontramos productos con estos filtros.
        </p>
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center">Cargando menú...</div>}>
      <MenuContent />
    </Suspense>
  );
}
