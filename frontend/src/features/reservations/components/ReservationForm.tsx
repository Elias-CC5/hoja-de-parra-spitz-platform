"use client";

import { useState } from "react";
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
import { EventType } from "@/types";
import { reservationSchema, type ReservationFormValues } from "../services/reservations.schemas";
import { reservationsService } from "../services/reservations.service";

const COMPANY_WHATSAPP_NUMBER = "51994222690";

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
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ReservationFormValues>({ 
    resolver: zodResolver(reservationSchema) 
  });

  const onSubmit = async (values: ReservationFormValues) => {
    setErrorMessage(null);

    // 1. Asegurarnos de castear los tipos de datos requeridos por la API
    const formattedPayload = {
      ...values,
      numberOfPeople: Number(values.numberOfPeople),
    };

    try {
      // 2. Guardar obligatoriamente en la Base de Datos
      await reservationsService.create(formattedPayload);

      // 3. Formatear la fecha para WhatsApp
      const [year, month, day] = values.eventDate.split("-");
      const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
      const formattedDate = dateObj.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const eventName = EVENT_TYPES_CONFIG[values.eventType]?.label || values.eventType;

      // 4. Armar el mensaje de WhatsApp
      const message = [
        `*SOLICITUD DE COTIZACION - DEPARRASPITZ*`,
        `=================================`,
        ``,
        `Hola, me gustaria solicitar una cotizacion para nuestro proximo evento:`,
        ``,
        `- *Tipo de Evento:* ${eventName}`,
        `- *Fecha:* ${formattedDate}`,
        `- *Hora de Inicio:* ${values.eventTime} hrs`,
        `- *N° de Invitados:* ${values.numberOfPeople} personas`,
        `- *Ubicacion:* ${values.address}`,
        values.comments ? `- *Notas:* ${values.comments}` : "",
        ``,
        `=================================`,
        `Quedo a la espera de sus comentarios. ¡Muchas gracias!`,
      ].filter(Boolean).join("\n");

      // 5. Abrir WhatsApp y mostrar estado exitoso
      const whatsappUrl = `https://wa.me/${COMPANY_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      
      setIsSuccess(true);
      window.open(whatsappUrl, "_blank");

    } catch (error: any) {
      console.error("Error al registrar la reserva:", error);
      
      // Si el servidor retorna error de autenticación u otro fallo
      const msg = error?.response?.data?.message || "No se pudo registrar la reserva en tu perfil. Asegúrate de haber iniciado sesión.";
      setErrorMessage(msg);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        
        <div className="space-y-1">
          <h2 className="font-display text-2xl font-bold text-white">¡Reserva guardada y redirigiendo!</h2>
          <p className="text-sm text-neutral-400 max-w-sm mx-auto leading-relaxed">
            Tu reserva ha sido guardada en tu perfil y se abrió WhatsApp para coordinar los detalles.
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
      
      {/* Alerta de Error si la BD falla */}
      {errorMessage && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-400">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-400" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Selector de Eventos */}
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
          {...register("numberOfPeople", { valueAsNumber: true })} 
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

      {/* Botón Solicitar Cotización */}
      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="group w-full h-12 bg-emerald-500 text-neutral-950 font-bold hover:bg-emerald-400 transition-all duration-300 shadow-lg shadow-emerald-500/10 rounded-xl flex items-center justify-center gap-2 text-sm pt-0.5"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin text-neutral-950" />
            <span>Procesando reserva...</span>
          </>
        ) : (
          <>
            <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            <span>Solicitar por WhatsApp</span>
          </>
        )}
      </Button>
    </form>
  );
}