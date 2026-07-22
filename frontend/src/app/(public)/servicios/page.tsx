import { cateringServicesService } from "@/features/services-catalog/services/catering-services.service";
import { ServiceCard } from "@/features/services-catalog/components/ServiceCard";

export const metadata = { title: "Servicios para eventos" };

export default async function ServicesPage() {
  const services = await cateringServicesService.findAll().catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-10">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">Catering para eventos</p>
        <h1 className="font-display text-3xl font-medium">Nuestros servicios</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Desde matrimonios hasta conferencias corporativas: diseñamos la experiencia
          gastronómica perfecta para cada ocasión.
        </p>
      </div>

      {services.length === 0 ? (
        <p className="text-muted-foreground">Aún no hay servicios publicados.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  );
}
