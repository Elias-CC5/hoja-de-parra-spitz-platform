"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, CalendarCheck, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

const ITEMS = [
  { image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=600&auto=format&fit=crop", title: "Cortes Premium", subtitle: "A las Brasas" },
  { image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop", title: "Costillares Ahumados", subtitle: "Cocción Lenta" },
  { image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=600&auto=format&fit=crop", title: "Catering Corporativo", subtitle: "Eventos de Empresa" },
  { image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=600&auto=format&fit=crop", title: "Banquetes & Buffet", subtitle: "Mesas Servidas" },
  { image: "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=600&auto=format&fit=crop", title: "Parrilladas Privadas", subtitle: "Servicio Exclusivo" },
  { image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600&auto=format&fit=crop", title: "Coffee Break & Box Lunch", subtitle: "Sabor de Autor" },
  { image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600&auto=format&fit=crop", title: "Eventos Especiales", subtitle: "Atención Exclusiva" },
];

const MARQUEE_ITEMS = [...ITEMS, ...ITEMS, ...ITEMS];

export function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0c0a09] text-stone-100 pt-32 pb-0 flex flex-col">
      {/* Resplandor cálido de fondo */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-amber-600/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1100px] h-[400px] bg-orange-700/15 blur-[140px] pointer-events-none rounded-full z-0" />

      {/* Partículas de brasa flotando */}
      <div className="ember-field pointer-events-none absolute inset-0 z-[1]">
        {Array.from({ length: 14 }).map((_, i) => (
          <span key={i} className={`ember ember-${i % 7}`} />
        ))}
      </div>

      {/* Grid sutil de fondo */}
      <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(var(--accent)_1px,transparent_1px),linear-gradient(90deg,var(--accent)_1px,transparent_1px)] bg-[size:56px_56px] pointer-events-none" />

      {/* --- TEXTOS PRINCIPALES (compacto) --- */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
        <div className="inline-flex items-center gap-3 rounded-full border border-stone-800 bg-stone-900/90 px-4 py-1.5 backdrop-blur-md mb-5 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-700">
          
          <div className="flex items-center gap-1.5 text-xs text-stone-300">
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />          </div>
        </div>

        {/* Nombre de marca, chico y elegante arriba del título */}
        <p className="font-display text-sm sm:text-base uppercase tracking-[0.3em] text-amber-400/90 mb-3 animate-in fade-in duration-700">
          Hoja de Parra <span className="text-stone-500">·</span> Spitz
        </p>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15] animate-in fade-in slide-in-from-bottom-4 duration-700">
          Sabor a brasas{" "}
          <span className="font-sans italic font-light ember-text">inolvidable</span>
        </h1>

        <div className="mt-6 flex items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200">
          <Link href="/cotizar">
            <Button size="lg" className="h-11 px-6 bg-white hover:bg-stone-200 text-stone-950 font-semibold rounded-full shadow-2xl transition-all duration-300 hover:scale-105">
              <CalendarCheck className="mr-2 h-4 w-4 text-amber-600" />
              Cotizar Mi Evento
            </Button>
          </Link>
          <Link href="/menu">
            <Button size="lg" variant="outline" className="h-11 px-6 border-stone-800 bg-stone-900/60 text-stone-300 hover:bg-stone-800 hover:text-white rounded-full backdrop-blur-md transition-transform duration-300 hover:scale-105">
              <Flame className="mr-2 h-4 w-4 text-amber-500" />
              Ver Menú
            </Button>
          </Link>
        </div>
      </div>

      {/* --- COVERFLOW 3D con reflejo tipo espejo --- */}
      <div className="relative z-10 mt-12 w-full">
        {/* Spotlight central detrás de las cards */}
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-amber-500/15 via-orange-600/5 to-transparent blur-[100px] pointer-events-none" />

        <div className="coverflow-stage relative w-full overflow-hidden py-14 group/stage">
          <div className="absolute left-0 top-0 z-30 h-full w-24 sm:w-56 bg-gradient-to-r from-[#0c0a09] via-[#0c0a09]/90 to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 z-30 h-full w-24 sm:w-56 bg-gradient-to-l from-[#0c0a09] via-[#0c0a09]/90 to-transparent pointer-events-none" />

          <div className="coverflow-perspective">
            <div className="animate-coverflow group-hover/stage:[animation-play-state:paused] flex items-center">
              {MARQUEE_ITEMS.map((item, index) => (
                <div key={index} className="coverflow-card-wrap shrink-0">
                  <div className="coverflow-card relative h-[280px] w-[210px] sm:h-[360px] sm:w-[260px] overflow-hidden rounded-3xl border border-stone-800/80 bg-stone-900 shadow-2xl group cursor-pointer">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/25 to-transparent opacity-85 group-hover:opacity-95 transition-opacity" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-amber-500/0 group-hover:ring-amber-500/50 rounded-3xl transition-all duration-500" />
                    <div className="absolute bottom-6 left-6 right-6 z-10">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                        {item.subtitle}
                      </span>
                      <h3 className="text-lg font-bold text-white leading-snug mt-1">
                        {item.title}
                      </h3>
                    </div>
                  </div>

                  {/* Reflejo espejo debajo de la card */}
                  <div
                    className="coverflow-reflection h-[280px] w-[210px] sm:h-[360px] sm:w-[260px] rounded-3xl overflow-hidden mt-1"
                    aria-hidden="true"
                  >
                    <Image
                      src={item.image}
                      alt=""
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Piso degradado que absorbe el reflejo */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-transparent to-[#0c0a09] pointer-events-none z-20" />
      </div>
    </section>
  );
}