import { cateringServicesService } from "@/features/services-catalog/services/catering-services.service";
import { ServiceCard } from "@/features/services-catalog/components/ServiceCard";
import { Sparkles, UtensilsCrossed } from "lucide-react";

export const metadata = {
  title: "Servicios para eventos | DeParraSpitz",
  description:
    "Desde matrimonios hasta conferencias corporativas: diseñamos la experiencia gastronómica perfecta para cada ocasión.",
};

export default async function ServicesPage() {
  const services = await cateringServicesService.findAll().catch(() => []);

  return (
    <div className="relative min-h-screen bg-neutral-950 text-white pt-28 pb-20 overflow-hidden">
      {/* Resplandor ámbar/dorado de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Encabezado Principal */}
        <div className="mb-14 text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Catering & Experiencias</span>
          </div>

          <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Nuestros Servicios Exclusivos
          </h1>

          <p className="mx-auto max-w-2xl text-base text-neutral-400 leading-relaxed">
            Desde matrimonios memorables hasta conferencias corporativas de alto nivel: 
            diseñamos la propuesta gastronómica perfecta adaptada a cada ocasión.
          </p>
        </div>

        {/* Estado Vacío / Grilla de Servicios */}
        {services.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-neutral-800/80 bg-neutral-900/40 py-16 px-6 text-center backdrop-blur-xl">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-900 border border-neutral-800 text-amber-400 mb-4 shadow-inner">
              <UtensilsCrossed className="h-8 w-8" />
            </div>
            <h3 className="font-display text-lg font-semibold text-neutral-200">
              Próximamente disponibles
            </h3>
            <p className="mt-1 text-sm text-neutral-500 max-w-sm">
              Estamos preparando nuestro catálogo de servicios para eventos. Vuelve a consultar pronto.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}