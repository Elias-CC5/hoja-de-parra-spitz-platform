"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useProducts } from "@/features/menu/hooks/useProducts";
import { MenuHero } from "@/features/menu/components/MenuHero";
import { ProductFilters } from "@/features/menu/components/ProductFilters";
import { ProductCard } from "@/features/menu/components/ProductCard";
import { Button } from "@/components/ui/button";
import type { ProductQuery } from "@/features/menu/services/products.service";
import { ChevronLeft, ChevronRight, Search, UtensilsCrossed } from "lucide-react";

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

  const totalItemsCount = result
    ? "totalItems" in result
      ? (result as { totalItems?: number }).totalItems
      : result.items.length
    : 0;

  return (
    <div className="relative min-h-screen bg-neutral-950 text-neutral-100 overflow-x-hidden">
      {/* Textura ambiente: un resplandor cálido fijo detrás de todo, para que el fondo
          no se sienta como un vacío absoluto cuando hay poco contenido. */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-amber-500/[0.06] blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.025)_1px,transparent_0)] bg-[length:28px_28px]" />
      </div>

      <MenuHero totalItems={totalItemsCount} isLoading={isLoading} />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* --- BARRA DE FILTROS --- */}
        <div className="mb-10 rounded-3xl border border-neutral-800/80 bg-neutral-900/40 p-2 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_20px_40px_-24px_rgba(0,0,0,0.8)] backdrop-blur-sm">
          <ProductFilters query={query} onChange={handleChange} />
        </div>

        {/* --- ENCABEZADO DE SECCIÓN --- */}
        {!isLoading && result && result.items.length > 0 && (
          <div className="mb-6 flex items-end justify-between border-b border-neutral-800/70 pb-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-amber-400/80">
                Nuestra carta
              </span>
              <h2 className="mt-1 font-serif text-2xl font-bold text-white">
                Platos disponibles
              </h2>
            </div>
            <span className="text-xs font-semibold text-neutral-500">
              {totalItemsCount} {totalItemsCount === 1 ? "producto" : "productos"}
            </span>
          </div>
        )}

        {/* --- GRILLA / ESTADOS --- */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-[380px] animate-pulse rounded-[28px] border border-neutral-800 bg-neutral-900/40 p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="h-48 w-full rounded-xl bg-neutral-800/60" />
                  <div className="mt-4 h-5 w-3/4 rounded-lg bg-neutral-800/60" />
                  <div className="mt-2 h-4 w-1/2 rounded-lg bg-neutral-800/40" />
                </div>
                <div className="flex justify-between items-center border-t border-neutral-800/60 pt-4">
                  <div className="h-6 w-16 bg-neutral-800/60 rounded-md" />
                  <div className="h-9 w-24 bg-neutral-800/80 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : result && result.items.length > 0 ? (
          <>
            {/* Cuando hay pocos ítems, la grilla no se estira: las cards mantienen su
                ancho natural y quedan alineadas a la izquierda en vez de flotar sueltas
                en un mar de negro. */}
            <div className="grid gap-6 [grid-template-columns:repeat(auto-fill,minmax(260px,320px))]">
              {result.items.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {result.totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-2 border-t border-neutral-800/80 pt-8">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={query.page === 1}
                  onClick={() => handleChange({ ...query, page: (query.page || 1) - 1 })}
                  className="rounded-xl border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-amber-400 hover:text-amber-400 transition-all active:scale-95 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: result.totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = query.page === pageNum;
                  return (
                    <Button
                      key={i}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleChange({ ...query, page: pageNum })}
                      className={`h-9 w-9 rounded-xl font-bold text-xs transition-all active:scale-95 ${
                        isActive
                          ? "bg-amber-500 text-neutral-950 hover:bg-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.3)] scale-105"
                          : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700 hover:text-white"
                      }`}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="icon"
                  disabled={query.page === result.totalPages}
                  onClick={() => handleChange({ ...query, page: (query.page || 1) + 1 })}
                  className="rounded-xl border-neutral-800 bg-neutral-900 text-neutral-300 hover:border-amber-400 hover:text-amber-400 transition-all active:scale-95 disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-[28px] border border-neutral-800 bg-neutral-900/30 py-24 text-center backdrop-blur-sm shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-800/60 ring-1 ring-neutral-700/60">
              <Search className="h-6 w-6 text-neutral-500" />
            </div>
            <h3 className="text-base font-bold text-white">No encontramos coincidencias</h3>
            <p className="mt-1 text-xs text-neutral-400">
              Prueba con otro término de búsqueda o limpia los filtros.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-neutral-950 text-neutral-400">
          <UtensilsCrossed className="h-6 w-6 animate-pulse text-amber-500" />
          <span className="text-sm font-semibold animate-pulse">Cargando menú...</span>
        </div>
      }
    >
      <MenuContent />
    </Suspense>
  );
}