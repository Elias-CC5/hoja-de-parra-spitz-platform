"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  CheckCircle2, 
  Loader2, 
  Calendar, 
  Clock, 
  Users, 
  MapPin, 
  MessageSquare, 
  PartyPopper,
  Send,
  AlertCircle,
  Heart,
  Cake,
  Briefcase,
  Presentation,
  Coffee,
  Award,
  GraduationCap,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth.store";
import { EventType } from "@/types";
import { reservationSchema, type ReservationFormValues } from "../services/reservations.schemas";
import { reservationsService } from "../services/reservations.service";

// Configuración visual de los tipos de evento con íconos dedicados
const EVENT_TYPES_CONFIG: Record<EventType, { label: string; icon: any }> = {
  [EventType.MATRIMONIO]: { label: "Matrimonio", icon: Heart },
  [EventType.CUMPLEANOS]: { label: "Cumpleaños", icon: Cake },
  [EventType.EMPRESARIAL]: { label: "Empresarial", icon: Briefcase },
  [EventType.CONFERENCIA]: { label: "Conferencia", icon: Presentation },
  [EventType.COFFEE_BREAK]: { label: "Coffee Break", icon: Coffee },
  [EventType.ANIVERSARIO]: { label: "Aniversario", icon: Award },
  [EventType.GRADUACION]: { label: "Graduación", icon: GraduationCap },
  [EventType.EVENTO_PRIVADO]: { label: "Evento Privado", icon: Sparkles },
};

export function ReservationForm() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ReservationFormValues>({ resolver: zodResolver(reservationSchema) });

  const onSubmit = async (values: ReservationFormValues) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setServerError(null);
    try {
      await reservationsService.create(values);
      setIsSuccess(true);
    } catch {
      setServerError("No pudimos registrar tu reserva. Revisa la información e intenta nuevamente.");
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        
        <div className="space-y-1">
          <h2 className="font-display text-2xl font-bold text-white">¡Solicitud Registrada!</h2>
          <p className="text-sm text-neutral-400 max-w-sm mx-auto leading-relaxed">
            Hemos recibido los detalles de tu evento. Nuestro equipo se pondrá en contacto contigo muy pronto.
          </p>
        </div>

        <Button 
          onClick={() => setIsSuccess(false)}
          className="mt-4 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:text-white transition-colors"
        >
          Enviar otra cotización
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      
      {/* Selector Interactivo en formato de Grilla (Chips / Cards) */}
      <div className="space-y-3">
        <Label className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
          <PartyPopper className="h-4 w-4 text-amber-400" />
          Tipo de evento
        </Label>

        <Controller
          name="eventType"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {Object.entries(EVENT_TYPES_CONFIG).map(([value, { label, icon: Icon }]) => {
                const isSelected = field.value === value;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => field.onChange(value)}
                    className={`group flex flex-col items-center justify-center gap-2 rounded-2xl border p-3 text-center transition-all duration-200 ${
                      isSelected
                        ? "border-amber-400 bg-amber-400/10 text-amber-400 shadow-md shadow-amber-400/10"
                        : "border-neutral-800/80 bg-neutral-950/60 text-neutral-400 hover:border-neutral-700 hover:bg-neutral-900/60 hover:text-white"
                    }`}
                  >
                    <Icon className={`h-5 w-5 transition-transform group-hover:scale-110 ${isSelected ? "text-amber-400" : "text-neutral-500"}`} />
                    <span className="text-xs font-medium line-clamp-1">{label}</span>
                  </button>
                );
              })}
            </div>
          )}
        />
        {errors.eventType && <p className="text-xs text-red-400 font-medium">Por favor, selecciona un tipo de evento</p>}
      </div>

      {/* Fecha y Hora */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="eventDate" className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
            <Calendar className="h-4 w-4 text-amber-400" />
            Fecha del evento
          </Label>
          <Input 
            id="eventDate" 
            type="date" 
            className="h-11 rounded-xl border-neutral-800 bg-neutral-950/80 text-white focus:border-amber-400 focus:ring-amber-400 [color-scheme:dark]"
            {...register("eventDate")} 
          />
          {errors.eventDate && <p className="text-xs text-red-400 font-medium">{errors.eventDate.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="eventTime" className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-400" />
            Hora de inicio
          </Label>
          <Input 
            id="eventTime" 
            type="time" 
            className="h-11 rounded-xl border-neutral-800 bg-neutral-950/80 text-white focus:border-amber-400 focus:ring-amber-400 [color-scheme:dark]"
            {...register("eventTime")} 
          />
          {errors.eventTime && <p className="text-xs text-red-400 font-medium">{errors.eventTime.message}</p>}
        </div>
      </div>

      {/* Número de personas */}
      <div className="space-y-2">
        <Label htmlFor="numberOfPeople" className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
          <Users className="h-4 w-4 text-amber-400" />
          N° de comensales / invitados
        </Label>
        <Input 
          id="numberOfPeople" 
          type="number" 
          min={1} 
          placeholder="Ej. 50"
          className="h-11 rounded-xl border-neutral-800 bg-neutral-950/80 text-white placeholder:text-neutral-600 focus:border-amber-400 focus:ring-amber-400"
          {...register("numberOfPeople")} 
        />
        {errors.numberOfPeople && (
          <p className="text-xs text-red-400 font-medium">{errors.numberOfPeople.message}</p>
        )}
      </div>

      {/* Ubicación */}
      <div className="space-y-2">
        <Label htmlFor="address" className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-amber-400" />
          Ubicación del evento
        </Label>
        <Input 
          id="address" 
          placeholder="Dirección completa, local o distrito" 
          className="h-11 rounded-xl border-neutral-800 bg-neutral-950/80 text-white placeholder:text-neutral-600 focus:border-amber-400 focus:ring-amber-400"
          {...register("address")} 
        />
        {errors.address && <p className="text-xs text-red-400 font-medium">{errors.address.message}</p>}
      </div>

      {/* Comentarios */}
      <div className="space-y-2">
        <Label htmlFor="comments" className="text-xs font-semibold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-amber-400" />
          Notas o requerimientos especiales (opcional)
        </Label>
        <textarea
          id="comments"
          rows={3}
          placeholder="Platos de preferencia, restricciones alimenticias, estilo de servicio..."
          className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-colors"
          {...register("comments")}
        />
      </div>

      {/* Mensaje de error de API */}
      {serverError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3.5 text-xs text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      {/* Botón enviar */}
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="group w-full h-12 bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 font-bold hover:from-amber-300 hover:to-amber-400 transition-all duration-300 shadow-lg shadow-amber-500/10 rounded-xl flex items-center justify-center gap-2 text-sm pt-0.5"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-neutral-950" />
            <span>Enviando solicitud...</span>
          </>
        ) : (
          <>
            <span>Solicitar Cotización</span>
            <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </>
        )}
      </Button>
    </form>
  );
}