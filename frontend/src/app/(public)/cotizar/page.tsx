import { Suspense } from "react";
import { ReservationForm } from "@/features/reservations/components/ReservationForm";
import { Sparkles, CalendarCheck2, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Cotizar / Reservar Evento | DeParraSpitz",
  description: "Completa el formulario y nuestro equipo coordinará la propuesta gastronómica ideal para tu evento.",
};

export default function QuotePage() {
  return (
    <div className="relative min-h-screen bg-neutral-950 text-white pt-28 pb-20 overflow-hidden">
      {/* Luz de fondo tenue decorativa */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Encabezado */}
        <div className="mb-10 text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Cotización Personalizada</span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Cuéntanos sobre tu evento
          </h1>

          <p className="mx-auto max-w-md text-sm text-neutral-400 leading-relaxed">
            Completa los detalles de tu celebración y diseñaremos una experiencia gastronómica a la medida.
          </p>
        </div>

        {/* Tarjeta del Formulario */}
        <div className="rounded-3xl border border-neutral-800/80 bg-neutral-900/40 p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
          <Suspense fallback={
            <div className="flex h-40 items-center justify-center text-sm text-neutral-500">
              Cargando formulario...
            </div>
          }>
            <ReservationForm />
          </Suspense>
        </div>

        {/* Mensaje de confianza */}
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-neutral-500">
          <ShieldCheck className="h-4 w-4 text-amber-400" />
          <span>Respuesta garantizada en menos de 24 horas hábiles.</span>
        </div>
      </div>
    </div>
  );
}