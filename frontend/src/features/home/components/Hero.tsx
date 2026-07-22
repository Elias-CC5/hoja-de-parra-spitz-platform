"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Flame, Award, Calendar, Users, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

// Imágenes HD reales de Unsplash optimizadas para parrilla y catering
const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1920&auto=format&fit=crop",
    alt: "Cortes de carne premium a las brasas",
    subtitle: "Sabor Ahumado Auténtico",
  },
  {
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1920&auto=format&fit=crop",
    alt: "Costillar a la parrilla con acabado perfecto",
    subtitle: "Catering de Alta Gama",
  },
  {
    image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=1920&auto=format&fit=crop",
    alt: "Banquete y buffet corporativo preparado al aire libre",
    subtitle: "Eventos Inolvidables",
  },
  {
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1920&auto=format&fit=crop",
    alt: "Mesa servida para evento exclusivo",
    subtitle: "Atención Exclusiva",
  },
];

export function Hero() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 7000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative h-[94vh] min-h-[680px] w-full overflow-hidden bg-stone-950 text-white selection:bg-orange-500 selection:text-white">
      {/* 1. Carrusel de imágenes con efecto Ken Burns */}
      {SLIDES.map((slide, index) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-0" : "opacity-0 -z-10"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority={index === 0}
            className={`object-cover object-center ${index === current ? "animate-kenburns" : ""}`}
            sizes="100vw"
            unoptimized // Permite cargar URLs externas de Unsplash directamente
          />
        </div>
      ))}

      {/* 2. Capas de sobreposición (Overlays cinemáticos) */}
      <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/30" />
      <div className="ember-glow absolute -bottom-20 -left-20 h-[500px] w-[500px] rounded-full pointer-events-none" />

      {/* 3. Contenido Principal */}
      <div className="relative mx-auto flex h-full max-w-7xl items-center px-6 sm:px-8 lg:px-12">
        <div className="max-w-2xl pt-12">
          
          {/* Insignia / Badge de calidad */}
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-orange-500/30 bg-stone-900/80 px-4 py-2 backdrop-blur-md shadow-ember">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-orange-500" />
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-orange-400 flex items-center gap-1.5">
              <Flame className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
              Catering Premium & Fuego Real
            </span>
          </div>

          {/* Titular Principal */}
          <h1 className="font-serif text-4xl font-bold leading-[1.08] text-stone-100 sm:text-6xl lg:text-7xl tracking-tight">
            Cada mesa cuenta <br />
            <span className="bg-gradient-to-r from-amber-200 via-orange-400 to-amber-500 bg-clip-text italic text-transparent">
              una historia
            </span>
          </h1>

          {/* Bajada de texto */}
          <p className="mt-6 text-base sm:text-lg text-stone-300/90 leading-relaxed max-w-xl font-light">
            Especialistas en buffet, coffee break, box lunch y banquetes ejecutivos. 
            Llevamos la mística del asado tradicional y la alta cocina a tu empresa o celebración.
          </p>

          {/* Botones de Acción (CTAs) */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/menu">
              <Button
                size="lg"
                className="h-13 px-8 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-orange-950/50 border border-orange-400/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-orange-600/20"
              >
                Explorar Menú
              </Button>
            </Link>
            <Link href="/cotizar">
              <Button
                size="lg"
                variant="outline"
                className="h-13 px-8 border-stone-600 bg-stone-900/60 text-stone-200 hover:bg-stone-800/80 hover:text-white hover:border-stone-400 backdrop-blur-md font-medium rounded-xl transition-all duration-300"
              >
                Cotizar Evento
              </Button>
            </Link>
          </div>

          {/* Métricas / Social Proof */}
          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-stone-800/80 pt-6">
            <div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-amber-400">+500</p>
              <p className="text-xs font-medium uppercase tracking-wider text-stone-400 mt-1">
                Eventos Realizados
              </p>
            </div>
            <div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-amber-400">15</p>
              <p className="text-xs font-medium uppercase tracking-wider text-stone-400 mt-1">
                Años de Experiencia
              </p>
            </div>
            <div>
              <p className="font-serif text-2xl sm:text-3xl font-bold text-amber-400">100%</p>
              <p className="text-xs font-medium uppercase tracking-wider text-stone-400 mt-1">
                Sabor a las Brasas
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Controles de Navegación del Carrusel */}
      <div className="absolute right-6 bottom-12 z-20 flex items-center gap-3 sm:right-12">
        <button
          onClick={prev}
          aria-label="Anterior"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-700/60 bg-stone-900/60 text-stone-300 backdrop-blur-md transition-all hover:bg-orange-600 hover:text-white hover:border-orange-500"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={next}
          aria-label="Siguiente"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-stone-700/60 bg-stone-900/60 text-stone-300 backdrop-blur-md transition-all hover:bg-orange-600 hover:text-white hover:border-orange-500"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>

      {/* Indicadores de diapositiva (Dots) */}
      <div className="absolute bottom-8 left-6 sm:left-12 z-20 flex items-center gap-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Diapositiva ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-500 ${
              index === current
                ? "w-10 bg-gradient-to-r from-orange-500 to-amber-500"
                : "w-2 bg-stone-700 hover:bg-stone-500"
            }`}
          />
        ))}
      </div>

      {/* 5. Tarjeta flotante interactiva (Sello de Garantía) */}
      <div className="absolute bottom-12 right-36 z-10 hidden lg:flex items-center gap-4 rounded-2xl border border-amber-500/20 bg-stone-900/80 p-4 shadow-2xl backdrop-blur-xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400">
          <Award className="h-6 w-6" />
        </div>
        <div>
          <div className="flex items-center gap-1 text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-amber-400" />
            ))}
          </div>
          <p className="text-xs font-semibold text-stone-200 mt-1">Calidad Grill Certificada</p>
          <p className="text-[10px] text-stone-400">Carnes seleccionadas & sazón de autor</p>
        </div>
      </div>
    </section>
  );
}