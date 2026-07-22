import { CalendarCheck, ChefHat, ClipboardList, Truck } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardList,
    title: "Elige o cotiza",
    description: "Explora nuestro menú o solicita una cotización a medida para tu evento.",
  },
  {
    icon: CalendarCheck,
    title: "Confirma la fecha",
    description: "Coordina fecha, hora, lugar y número de invitados con nuestro equipo.",
  },
  {
    icon: ChefHat,
    title: "Preparamos todo",
    description: "Nuestra cocina prepara cada plato con insumos frescos el mismo día.",
  },
  {
    icon: Truck,
    title: "Entrega puntual",
    description: "Llevamos todo listo para servir, a tiempo y en las condiciones pactadas.",
  },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-12 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">Proceso</p>
        <h2 className="font-display text-3xl font-medium">Cómo funciona</h2>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((step, index) => (
          <div key={step.title} className="relative">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <step.icon size={22} />
            </div>
            <span className="mb-1 block text-xs font-semibold text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display text-lg font-medium">{step.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
