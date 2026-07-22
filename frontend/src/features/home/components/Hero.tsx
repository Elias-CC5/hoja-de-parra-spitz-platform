"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const SLIDES = [
  {
    image: "/hero/parrilla-1.jpg",
    alt: "Parrilla de carnes premium sobre brasas",
  },
  {
    image: "/hero/parrilla-2.jpg",
    alt: "Mesa de catering corporativo servida",
  },
  {
    image: "/hero/parrilla-3.jpg",
    alt: "Chef preparando cortes a la parrilla",
  },
  {
    image: "/hero/parrilla-4.jpg",
    alt: "Evento corporativo con buffet",
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
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative h-[92vh] min-h-[640px] w-full overflow-hidden bg-background text-primary-foreground">
      {/* Carrusel de imágenes de fondo */}
      {SLIDES.map((slide, index) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.alt}
            fill
            priority={index === 0}
            className="object-cover"
            sizes="100vw"
          />
        </div>
      ))}

      {/* Overlays: oscurece para legibilidad + tinte de marca */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
      <div className="absolute inset-0 bg-accent/10 mix-blend-multiply" />

      {/* Contenido */}
      <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/40 bg-black/30 px-4 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
              Catering & eventos corporativos
            </p>
          </div>

          <h1 className="font-display text-4xl font-medium leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            Cada mesa cuenta
            <br />
            <span className="italic text-accent">una historia</span>
          </h1>

          <p className="mt-6 max-w-md text-lg text-white/80">
            Buffet, coffee break, box lunch y almuerzos corporativos preparados
            a las brasas, con la misma dedicación que un asado familiar. Para
            tu empresa o tu celebración más importante.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/menu">
              <Button
                size="lg"
                variant="accent"
                className="transition-transform hover:scale-[1.03]"
              >
                Ver menú
              </Button>
            </Link>
            <Link href="/cotizar">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white transition-colors hover:bg-white/10"
              >
                Cotizar mi evento
              </Button>
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-6">
            {[
              { value: "+500", label: "eventos realizados" },
              { value: "15", label: "años de experiencia" },
              { value: "100%", label: "a las brasas" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl font-medium text-accent">
                  {stat.value}
                </p>
                <p className="text-xs uppercase tracking-wide text-white/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Flechas de navegación */}
      <button
        onClick={prev}
        aria-label="Imagen anterior"
        className="group absolute left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 sm:left-8"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={next}
        aria-label="Siguiente imagen"
        className="group absolute right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50 sm:right-8"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Dots indicadores */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Ir a la imagen ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === current ? "w-8 bg-accent" : "w-1.5 bg-white/40 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Badge flotante inferior derecho */}
      <div className="absolute bottom-8 right-4 z-10 hidden animate-bounce rounded-2xl border border-accent/30 bg-black/40 px-4 py-3 shadow-lg backdrop-blur-sm [animation-duration:3s] sm:right-8 md:block">
        <p className="font-display text-sm font-medium text-white">
          🔥 A las brasas
        </p>
      </div>
    </section>
  );
}