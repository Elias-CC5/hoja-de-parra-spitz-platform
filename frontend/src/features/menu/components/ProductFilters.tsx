"use client";

import { Search } from "lucide-react";
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
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="relative w-full sm:max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar en el menú..."
          className="pl-9"
          defaultValue={query.search}
          onChange={(e) => onChange({ ...query, search: e.target.value, page: 1 })}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          className="h-10 rounded-md border border-input bg-transparent px-3 text-sm"
          value={query.type ?? ""}
          onChange={(e) => onChange({ ...query, type: e.target.value || undefined, page: 1 })}
        >
          <option value="">Todos los tipos</option>
          {Object.entries(TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>

        <select
          className="h-10 rounded-md border border-input bg-transparent px-3 text-sm"
          value={query.sortBy ?? ""}
          onChange={(e) =>
            onChange({ ...query, sortBy: (e.target.value || undefined) as ProductQuery["sortBy"], page: 1 })
          }
        >
          <option value="">Ordenar por</option>
          <option value="newest">Más recientes</option>
          <option value="featured">Destacados</option>
          <option value="price_asc">Precio: menor a mayor</option>
          <option value="price_desc">Precio: mayor a menor</option>
        </select>
      </div>
    </div>
  );
}
