import { api } from "@/lib/axios";
import type { Review } from "@/types";

export const reviewsService = {
  findByProduct: (productId: string) => api.get<never, Review[]>(`/reviews/product/${productId}`),
  getAverageRating: (productId: string) =>
    api.get<never, { average: number; count: number }>(`/reviews/product/${productId}/rating`),
  create: (productId: string, rating: number, comment?: string) =>
    api.post<never, Review>("/reviews", { productId, rating, comment }),
};
