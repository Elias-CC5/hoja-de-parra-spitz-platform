import { z } from "zod";

export const checkoutSchema = z.object({
  deliveryAddress: z.string().min(5, "Ingresa una dirección válida"),
  eventDate: z.string().min(1, "Selecciona una fecha"),
  numberOfPeople: z.coerce.number().min(1, "Ingresa el número de personas"),
  notes: z.string().optional(),
});
export type CheckoutFormValues = z.input<typeof checkoutSchema>;
