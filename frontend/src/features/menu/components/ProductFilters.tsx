"use client";

import { Search, ChevronDown, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ProductQuery } from "../services/products.service";
import { ProductType } from "@/types";

const TYPE_LABELS: Record<ProductType, string> = {
  [ProductType.PLATO]: "Platos",
  [ProductType.COMBO]: "Combos",
  [ProductType.PAQUETE_CORPORATIVO]: "Paquetes corporativos",
  [ProductType.COFFEE_BREAK]: "Coffee break",
  [ProductType.BUFFET]: "Buffet",
  [ProductType.BOX_LUNCH]: "Box lunch",
  [ProductType.POSTRE]: "Postres",
  [ProductType.BEBIDA]: "Bebidas",
};

interface ProductFiltersProps {
  query: ProductQuery;
  onChange: (query: ProductQuery) => void;
}

export function ProductFilters({ query, onChange }: ProductFiltersProps) {
  return (
    <div className="flex flex-col gap-3 p-2 sm:flex-row sm:items-center sm:justify-between">
      {/* --- BUSCADOR --- */}
      <div className="relative w-full sm:max-w-xs">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors group-focus-within:text-amber-400"
        />
        <Input
          placeholder="Buscar en el menú..."
          defaultValue={query.search}
          onChange={(e) => onChange({ ...query, search: e.target.value, page: 1 })}
          className="h-11 rounded-2xl border border-neutral-800 bg-neutral-950/60 pl-10 text-sm text-neutral-100 placeholder:text-neutral-500 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset] transition-all focus-visible:border-amber-400/60 focus-visible:ring-2 focus-visible:ring-amber-400/20"
        />
      </div>

      {/* --- SELECTS --- */}
      <div className="flex flex-wrap gap-2.5">
        <div className="relative">
          <SlidersHorizontal
            size={14}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
          />
          <select
            className="h-11 appearance-none rounded-2xl border border-neutral-800 bg-neutral-950/60 pl-9 pr-9 text-sm font-medium text-neutral-200 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset] transition-all hover:border-neutral-700 focus-visible:border-amber-400/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/20"
            value={query.type ?? ""}
            onChange={(e) => onChange({ ...query, type: e.target.value || undefined, page: 1 })}
          >
            <option value="" className="bg-neutral-900 text-neutral-200">
              Todos los tipos
            </option>
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value} className="bg-neutral-900 text-neutral-200">
                {label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
          />
        </div>

        <div className="relative">
          <select
            className="h-11 appearance-none rounded-2xl border border-neutral-800 bg-neutral-950/60 pl-4 pr-9 text-sm font-medium text-neutral-200 shadow-[0_1px_0_rgba(255,255,255,0.03)_inset] transition-all hover:border-neutral-700 focus-visible:border-amber-400/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/20"
            value={query.sortBy ?? ""}
            onChange={(e) =>
              onChange({ ...query, sortBy: (e.target.value || undefined) as ProductQuery["sortBy"], page: 1 })
            }
          >
            <option value="" className="bg-neutral-900 text-neutral-200">
              Ordenar por
            </option>
            <option value="newest" className="bg-neutral-900 text-neutral-200">
              Más recientes
            </option>
            <option value="featured" className="bg-neutral-900 text-neutral-200">
              Destacados
            </option>
            <option value="price_asc" className="bg-neutral-900 text-neutral-200">
              Precio: menor a mayor
            </option>
            <option value="price_desc" className="bg-neutral-900 text-neutral-200">
              Precio: mayor a menor
            </option>
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500"
          />
        </div>
      </div>
    </div>
  );
}