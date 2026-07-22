import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";

const LEAF_PATH =
  "M12 2C7 5 3 10 3 16c0 3.5 2.5 6 6 6 4.5 0 9-4 9-12 0-3-2-6-6-8Z";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent">
                <path d={LEAF_PATH} />
              </svg>
              <span className="font-display text-lg font-semibold">Hoja de Parra Spitz</span>
            </div>
            <p className="text-sm leading-relaxed text-primary-foreground/70">
              Catering, buffet y servicio gastronómico para eventos empresariales y sociales.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-accent">Explorar</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link href="/menu" className="hover:text-accent">Menú</Link></li>
              <li><Link href="/servicios" className="hover:text-accent">Servicios para eventos</Link></li>
              <li><Link href="/cotizar" className="hover:text-accent">Solicitar cotización</Link></li>
              <li><Link href="/reservas" className="hover:text-accent">Reservar evento</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-accent">Empresa</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link href="/nosotros" className="hover:text-accent">Sobre nosotros</Link></li>
              <li><Link href="/contacto" className="hover:text-accent">Contacto</Link></li>
              <li><Link href="/terminos" className="hover:text-accent">Términos y condiciones</Link></li>
              <li><Link href="/privacidad" className="hover:text-accent">Política de privacidad</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-accent">Contacto</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-center gap-2"><MapPin size={16} className="text-accent" /> Lima, Perú</li>
              <li className="flex items-center gap-2"><Phone size={16} className="text-accent" /> +51 987 654 321</li>
              <li className="flex items-center gap-2"><Mail size={16} className="text-accent" /> contacto@hojadeparraspitz.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/10 pt-6 text-xs text-primary-foreground/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Hoja de Parra Spitz. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
