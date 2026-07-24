import { api } from "@/lib/axios";
import type { Reservation } from "@/types";
import type { ReservationFormValues } from "./reservations.schemas";

export const reservationsService = {
  create: async (dto: ReservationFormValues): Promise<Reservation> => {
    const response = await api.post<Reservation>("/reservations", dto);
    return response.data ?? response;
  },
  
  findMine: async (): Promise<Reservation[]> => {
    const response = await api.get<Reservation[]>("/reservations/my-reservations");
    return response.data ?? response;
  },

  cancel: async (id: string): Promise<Reservation> => {
    const response = await api.patch<Reservation>(`/reservations/${id}/cancel`);
    return response.data ?? response;
  },
};