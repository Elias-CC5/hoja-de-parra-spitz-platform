import { api } from "@/lib/axios";
import type { PaginatedResult, Product } from "@/types";

export interface ProductQuery {
  search?: string;
  categoryId?: string;
  type?: string;
  sortBy?: "price_asc" | "price_desc" | "newest" | "featured";
  page?: number;
  limit?: number;
}

export const productsService = {
  findAll: (query: ProductQuery = {}) =>
    api.get<never, PaginatedResult<Product>>("/products", { params: query }),
  findFeatured: () => api.get<never, Product[]>("/products/featured"),
  findBySlug: (slug: string) => api.get<never, Product>(`/products/slug/${slug}`),
  findRelated: (id: string) => api.get<never, Product[]>(`/products/${id}/related`),
};
