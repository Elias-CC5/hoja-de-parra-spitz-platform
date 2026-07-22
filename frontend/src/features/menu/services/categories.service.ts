import { api } from "@/lib/axios";
import type { Category } from "@/types";

export const categoriesService = {
  findAll: (onlyActive = true) =>
    api.get<never, Category[]>("/categories", { params: { onlyActive } }),
};
