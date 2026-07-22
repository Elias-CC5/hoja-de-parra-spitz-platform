import { z } from "zod";
import { EventType } from "@/types";

export const quotationSchema = z.object({
  eventType: z.nativeEnum(EventType),
  eventDate: z.string().min(1, "Selecciona una fecha"),
  eventTime: z.string().min(1, "Selecciona una hora"),
  location: z.string().min(5, "Ingresa la dirección del evento"),
  numberOfGuests: z.coerce.number().min(1, "Ingresa el número de invitados"),
  estimatedBudget: z.coerce.number().optional(),
  additionalServices: z.string().optional(),
  comments: z.string().optional(),
});
export type QuotationFormValues = z.input<typeof quotationSchema>;
