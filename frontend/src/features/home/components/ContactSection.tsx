import { Mail, MapPin, Phone } from "lucide-react";

export function ContactSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">Contacto</p>
          <h2 className="font-display text-3xl font-medium">Conversemos sobre tu evento</h2>
          <p className="mt-4 max-w-md text-muted-foreground">
            Escríbenos o llámanos y te ayudamos a armar la propuesta perfecta
            para tu empresa o celebración.
          </p>

          <ul className="mt-8 space-y-4 text-sm">
            <li className="flex items-center gap-3">
              <MapPin size={18} className="text-accent" /> Lima, Perú
            </li>
            <li className="flex items-center gap-3">
              <Phone size={18} className="text-accent" /> +51 987 654 321
            </li>
            <li className="flex items-center gap-3">
              <Mail size={18} className="text-accent" /> contacto@hojadeparraspitz.com
            </li>
          </ul>
        </div>

        <div className="flex min-h-[280px] items-center justify-center rounded-lg border border-border bg-muted text-sm text-muted-foreground">
          Mapa de ubicación (integrar Google Maps embed con la dirección real)
        </div>
      </div>
    </section>
  );
}
