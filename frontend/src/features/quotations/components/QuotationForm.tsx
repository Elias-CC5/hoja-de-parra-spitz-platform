"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth.store";
import { EventType } from "@/types";
import { quotationSchema, type QuotationFormValues } from "../services/quotations.schemas";
import { quotationsService } from "../services/quotations.service";

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  [EventType.MATRIMONIO]: "Matrimonio",
  [EventType.CUMPLEANOS]: "Cumpleaños",
  [EventType.EMPRESARIAL]: "Evento empresarial",
  [EventType.CONFERENCIA]: "Conferencia",
  [EventType.COFFEE_BREAK]: "Coffee Break",
  [EventType.ANIVERSARIO]: "Aniversario",
  [EventType.GRADUACION]: "Graduación",
  [EventType.EVENTO_PRIVADO]: "Evento privado",
};

export function QuotationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QuotationFormValues>({
    resolver: zodResolver(quotationSchema),
    defaultValues: {
      eventType: (searchParams.get("eventType") as EventType) ?? undefined,
    },
  });

  const onSubmit = async (values: QuotationFormValues) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setServerError(null);
    try {
      await quotationsService.create(values);
      setIsSuccess(true);
    } catch {
      setServerError("No pudimos enviar tu solicitud. Intenta nuevamente.");
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-10 text-center">
        <CheckCircle2 size={40} className="text-accent" />
        <h2 className="font-display text-xl font-medium">¡Solicitud enviada!</h2>
        <p className="text-muted-foreground">
          Nuestro equipo revisará tu solicitud y te enviará una propuesta pronto.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="eventType">Tipo de evento</Label>
        <select
          id="eventType"
          className="h-10 w-full rounded-md border border-input bg-transparent px-3 text-sm"
          {...register("eventType")}
        >
          <option value="">Selecciona un tipo</option>
          {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        {errors.eventType && <p className="text-sm text-destructive">Selecciona un tipo de evento</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="eventDate">Fecha del evento</Label>
          <Input id="eventDate" type="date" {...register("eventDate")} />
          {errors.eventDate && <p className="text-sm text-destructive">{errors.eventDate.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="eventTime">Hora</Label>
          <Input id="eventTime" type="time" {...register("eventTime")} />
          {errors.eventTime && <p className="text-sm text-destructive">{errors.eventTime.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Lugar del evento</Label>
        <Input id="location" placeholder="Dirección completa" {...register("location")} />
        {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="numberOfGuests">Número de invitados</Label>
          <Input id="numberOfGuests" type="number" min={1} {...register("numberOfGuests")} />
          {errors.numberOfGuests && (
            <p className="text-sm text-destructive">{errors.numberOfGuests.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="estimatedBudget">Presupuesto estimado (opcional)</Label>
          <Input id="estimatedBudget" type="number" min={0} {...register("estimatedBudget")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalServices">Servicios adicionales (opcional)</Label>
        <Input id="additionalServices" placeholder="Decoración, música, mobiliario..." {...register("additionalServices")} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comments">Comentarios (opcional)</Label>
        <textarea
          id="comments"
          rows={4}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
          placeholder="Cuéntanos más sobre tu evento..."
          {...register("comments")}
        />
      </div>

      {serverError && <p className="text-sm text-destructive">{serverError}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="animate-spin" />}
        Enviar solicitud de cotización
      </Button>
    </form>
  );
}
