import { z } from "zod";
import { EventType } from "@/types";

export const reservationSchema = z.object({
  eventType: z.nativeEnum(EventType),
  eventDate: z.string().min(1, "Selecciona una fecha"),
  eventTime: z.string().min(1, "Selecciona una hora"),
  numberOfPeople: z.coerce.number().min(1, "Ingresa el número de personas"),
  address: z.string().min(5, "Ingresa la dirección del evento"),
  comments: z.string().optional(),
});
export type ReservationFormValues = z.input<typeof reservationSchema>;
