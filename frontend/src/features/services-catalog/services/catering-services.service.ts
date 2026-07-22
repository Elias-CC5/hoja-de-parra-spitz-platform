import { api } from "@/lib/axios";
import type { CateringService } from "@/types";

export const cateringServicesService = {
  findAll: (onlyActive = true) =>
    api.get<never, CateringService[]>("/services-catalog", { params: { onlyActive } }),
  findBySlug: (slug: string) => api.get<never, CateringService>(`/services-catalog/slug/${slug}`),
};
