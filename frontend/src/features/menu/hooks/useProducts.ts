"use client";

import { useEffect, useState } from "react";
import { productsService, type ProductQuery } from "../services/products.service";
import type { PaginatedResult, Product } from "@/types";

export function useProducts(initialQuery: ProductQuery) {
  const [query, setQuery] = useState<ProductQuery>(initialQuery);
  const [result, setResult] = useState<PaginatedResult<Product> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- necesario para mostrar loading al cambiar filtros
    setIsLoading(true);

    productsService
      .findAll(query)
      .then((data) => {
        if (active) setResult(data);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [query]);

  return { result, isLoading, query, setQuery };
}
