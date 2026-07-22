import { api } from "@/lib/axios";
import type { Reservation } from "@/types";
import type { ReservationFormValues } from "./reservations.schemas";

export const reservationsService = {
  create: (dto: ReservationFormValues) => api.post<never, Reservation>("/reservations", dto),
  findMine: () => api.get<never, Reservation[]>("/reservations/my-reservations"),
  cancel: (id: string) => api.patch<never, Reservation>(`/reservations/${id}/cancel`),
};
