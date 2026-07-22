import { api } from "@/lib/axios";
import type { Quotation } from "@/types";
import type { QuotationFormValues } from "./quotations.schemas";

export const quotationsService = {
  create: (dto: QuotationFormValues) => api.post<never, Quotation>("/quotations", dto),
  findMine: () => api.get<never, Quotation[]>("/quotations/my-quotations"),
};
