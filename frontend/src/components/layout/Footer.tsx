"use client";

import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";

const LEAF_PATH =
  "M12 2C7 5 3 10 3 16c0 3.5 2.5 6 6 6 4.5 0 9-4 9-12 0-3-2-6-6-8Z";

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0a0908] text-stone-100">
      {/* Línea divisoria superior con degradado dorado */}
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />

      {/* Resplandor ambiental de fondo */}
      <div className="pointer-events-none absolute left-1/2 bottom-0 -z-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-amber-600/10 blur-[140px]" />

      {/* Malla sutil */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1f1915_1px,transparent_1px),linear-gradient(to_bottom,#1f1915_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_100%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-16 pb-12 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          
          {/* Columna 1: Marca y Redes */}
          <div className="md:col-span-1">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-500/30 bg-gradient-to-br from-amber-500/20 to-orange-600/10 text-amber-400 shadow-inner">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                >
                  <path d={LEAF_PATH} />
                </svg>
              </div>
              <span className="font-serif text-lg font-bold tracking-wide text-white">
                Hoja de Parra <span className="text-amber-400">Spitz</span>
              </span>
            </div>

            <p className="text-xs leading-relaxed font-light text-stone-400">
              Catering, buffet y servicio gastronómico exclusivo para eventos empresariales y celebraciones memorables.
            </p>

            {/* Redes Sociales con SVGs directos (Sin errores de versión) */}
            <div className="mt-6 flex items-center gap-3">
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-800 bg-stone-900/80 text-stone-400 transition-all duration-300 hover:border-amber-500/50 hover:bg-stone-800 hover:text-amber-400 hover:shadow-lg hover:shadow-amber-500/10"
                aria-label="Instagram"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </Link>

              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-800 bg-stone-900/80 text-stone-400 transition-all duration-300 hover:border-amber-500/50 hover:bg-stone-800 hover:text-amber-400 hover:shadow-lg hover:shadow-amber-500/10"
                aria-label="Facebook"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </Link>

              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-800 bg-stone-900/80 text-stone-400 transition-all duration-300 hover:border-amber-500/50 hover:bg-stone-800 hover:text-amber-400 hover:shadow-lg hover:shadow-amber-500/10"
                aria-label="LinkedIn"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Columna 2: Explorar */}
          <div>
            <h4 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Explorar
            </h4>
            <ul className="space-y-2.5 text-xs font-light text-stone-400">
              {[
                { label: "Menú Exclusivo", href: "/menu" },
                { label: "Servicios para eventos", href: "/servicios" },
                { label: "Solicitar cotización", href: "/cotizar" },
                { label: "Reservar evento", href: "/reservas" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-amber-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 3: Empresa */}
          <div>
            <h4 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Empresa
            </h4>
            <ul className="space-y-2.5 text-xs font-light text-stone-400">
              {[
                { label: "Sobre nosotros", href: "/nosotros" },
                { label: "Contacto", href: "/contacto" },
                { label: "Términos y condiciones", href: "/terminos" },
                { label: "Política de privacidad", href: "/privacidad" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="inline-block transition-all duration-200 hover:translate-x-1 hover:text-amber-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Columna 4: Contacto Directo */}
          <div>
            <h4 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              Contacto
            </h4>
            <ul className="space-y-3.5 text-xs font-light text-stone-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                <span>Lima, Perú</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-amber-400" />
                <span>+51 987 654 321</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-amber-400" />
                <span className="truncate">contacto@hojadeparraspitz.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Separador inferior */}
        <div className="mt-16 border-t border-stone-800/80 pt-8 flex flex-col items-center justify-between gap-4 text-xs font-light text-stone-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Hoja de Parra Spitz. Todos los derechos reservados.</p>
          <p className="text-[11px] text-stone-600">Gastronomía & Catering de Alta Gama</p>
        </div>
      </div>
    </footer>
  );
}