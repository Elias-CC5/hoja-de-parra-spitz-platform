"use client";

import { Flame, Utensils, ChefHat, ArrowRight, Sparkles } from "lucide-react";
import {
  ImageAccordion,
  type AccordionItemData,
} from "@/components/shared/scroll-stack/interactive-image-accordion";

const SERVICES: AccordionItemData[] = [
  {
    id: 1,
    title: "Buffet Parrillero",
    imageUrl:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    title: "Buffet Árabe",
    imageUrl:
      "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    title: "Buffet Criollo",
    imageUrl:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1000&q=80",
  },
];

export function BuffetServices() {
  return (
    <section className="relative w-full overflow-hidden bg-[#0c0a09] text-stone-100 border-b border-stone-800/60">
      {/* Resplandor cálido de fondo, igual al hero */}
      <div className="absolute top-10 left-1/4 w-[700px] h-[400px] bg-amber-600/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-orange-700/10 blur-[140px] pointer-events-none rounded-full" />

      <div className="relative z-10 container mx-auto px-6 py-20 md:py-28">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Texto */}
          <div className="w-full lg:w-[42%] text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-stone-800 bg-stone-900/90 px-4 py-1.5 mb-6 backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-medium text-stone-300">
                3 formatos de buffet disponibles
              </span>
            </div>

            <p className="font-display text-xs sm:text-sm uppercase tracking-[0.3em] text-amber-400/90 mb-3">
              Nuestras Especialidades
            </p>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              Servicios de Buffet{" "}
              <span className="font-sans italic font-light text-amber-400">
                Exclusive
              </span>
            </h2>

            <p className="mt-6 text-sm sm:text-base text-stone-400 max-w-md mx-auto lg:mx-0 leading-relaxed">
              Propuestas culinarias conceptuales y personalizadas para hacer
              de tu evento una experiencia sensorial memorable. Pasa el
              cursor sobre cada formato para explorarlo.
            </p>

            <div className="mt-8 flex items-center justify-center lg:justify-start gap-3">
              <a href="#cotizar">
                <button className="h-11 px-6 bg-white hover:bg-stone-200 text-stone-950 font-semibold rounded-full shadow-2xl gap-2 inline-flex items-center transition-colors">
                  Ver todos los servicios
                  <ArrowRight className="h-4 w-4" />
                </button>
              </a>
              <a href="/cotizar">
                <button className="h-11 px-6 border border-stone-800 bg-stone-900/60 text-stone-300 hover:bg-stone-800 hover:text-white rounded-full backdrop-blur-md gap-2 inline-flex items-center transition-colors">
                  <Flame className="h-4 w-4 text-amber-500" />
                  Cotizar evento
                </button>
              </a>
            </div>
          </div>

          {/* Accordion de imágenes */}
          <div className="w-full lg:w-[58%] flex justify-center">
            <ImageAccordion items={SERVICES} defaultActiveIndex={2} />
          </div>
        </div>
      </div>
    </section>
  );
}