"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { Star, CalendarCheck, Flame, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CardSwap, { Card } from "@/components/shared/scroll-stack/CardSwap";

const ITEMS = [
  { image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop", title: "Cortes Premium", subtitle: "A las Brasas" },
  { image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800&auto=format&fit=crop", title: "Costillares Ahumados", subtitle: "Cocción Lenta" },
  { image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=800&auto=format&fit=crop", title: "Catering Corporativo", subtitle: "Eventos de Empresa" },
  { image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop", title: "Banquetes & Buffet", subtitle: "Mesas Servidas" },
  { image: "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=800&auto=format&fit=crop", title: "Parrilladas Privadas", subtitle: "Servicio Exclusivo" },
  { image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800&auto=format&fit=crop", title: "Coffee Break & Box Lunch", subtitle: "Sabor de Autor" },
];

export function Hero() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let raf = 0;
    const move = (e: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        stage.style.setProperty("--rx", `${(-py * 10).toFixed(2)}deg`);
        stage.style.setProperty("--ry", `${(px * 14).toFixed(2)}deg`);
        stage.style.setProperty("--tx", `${(px * 12).toFixed(2)}px`);
        stage.style.setProperty("--ty", `${(py * 12).toFixed(2)}px`);
      });
    };
    const leave = () => {
      stage.style.setProperty("--rx", "0deg");
      stage.style.setProperty("--ry", "0deg");
      stage.style.setProperty("--tx", "0px");
      stage.style.setProperty("--ty", "0px");
    };
    stage.addEventListener("mousemove", move);
    stage.addEventListener("mouseleave", leave);
    return () => {
      stage.removeEventListener("mousemove", move);
      stage.removeEventListener("mouseleave", leave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative w-full min-h-[92vh] overflow-hidden bg-[#0c0a09] text-stone-100 pt-28 pb-16 flex items-center">
      <div className="absolute top-1/4 left-1/4 w-[650px] h-[450px] bg-amber-600/10 blur-[160px] pointer-events-none rounded-full hero-glow-a" />
      <div className="absolute bottom-10 right-10 w-[550px] h-[400px] bg-orange-700/15 blur-[140px] pointer-events-none rounded-full z-0 hero-glow-b" />

      <div className="ember-field pointer-events-none absolute inset-0 z-[1]">
        {Array.from({ length: 9 }).map((_, i) => (
          <span key={i} className="ember" style={{ "--i": i } as React.CSSProperties} />
        ))}
      </div>

      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(var(--accent)_1px,transparent_1px),linear-gradient(90deg,var(--accent)_1px,transparent_1px)] bg-[size:48px_48px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center">

        <div className="lg:col-span-5 text-center lg:text-left flex flex-col items-center lg:items-start">
          <div className="hero-reveal inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-1.5 backdrop-blur-md mb-6 shadow-xl" style={{ "--delay": "0ms" } as React.CSSProperties}>
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-medium text-amber-300 uppercase tracking-widest">
              Catering & Eventos Privados
            </span>
          </div>

          <p className="hero-reveal font-display text-sm sm:text-base uppercase tracking-[0.35em] text-amber-400/90 mb-2" style={{ "--delay": "90ms" } as React.CSSProperties}>
            Hoja de Parra <span className="text-stone-600">·</span> Spitz
          </p>

          <h1 className="hero-reveal font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]" style={{ "--delay": "180ms" } as React.CSSProperties}>
            Sabor a brasas{" "}
            <span className="font-sans italic font-light ember-text block sm:inline">inolvidable</span>
          </h1>

          <p className="hero-reveal mt-5 text-stone-400 text-base sm:text-lg max-w-xl leading-relaxed" style={{ "--delay": "280ms" } as React.CSSProperties}>
            Experiencias gastronómicas de alto nivel a fuego lento. Cortes seleccionados y servicio exclusivo para tus momentos más especiales.
          </p>

          <div className="hero-reveal mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4" style={{ "--delay": "380ms" } as React.CSSProperties}>
            <Link href="/cotizar">
              <Button size="lg" className="h-12 px-7 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-full shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(245,158,11,0.55)]">
                <CalendarCheck className="mr-2 h-5 w-5 text-stone-950" />
                Cotizar Mi Evento
              </Button>
            </Link>
            <Link href="/menu">
              <Button size="lg" variant="outline" className="h-12 px-7 border-stone-800 bg-stone-900/80 text-stone-200 hover:bg-stone-800 hover:text-white rounded-full backdrop-blur-md transition-all duration-300 hover:scale-105">
                <Flame className="mr-2 h-5 w-5 text-amber-500" />
                Ver Menú
              </Button>
            </Link>
          </div>
        </div>

        {/* Stack agrandado: ahora ocupa más columna y más tamaño físico */}
        <div ref={stageRef} className="hero-stage lg:col-span-7 flex justify-center items-center relative w-full h-[620px] sm:h-[680px]">
          <div className="hero-stage-inner relative w-full max-w-[560px] h-[620px] flex items-center justify-center">
            <CardSwap
              width={480}
              height={600}
              cardDistance={60}
              verticalDistance={45}
              delay={4000}
              pauseOnHover={false}
              skewAmount={2}
              easing="elastic"
            >
              {ITEMS.map((item, index) => (
                <Card key={index} className="group cursor-pointer select-none">
                  <div className="relative w-full h-full">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" />
                    <div className="card-sheen absolute inset-0 pointer-events-none" />
                    <div className="absolute bottom-6 left-6 right-6 z-10 pointer-events-none">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400 block mb-1">
                        {item.subtitle}
                      </span>
                      <h3 className="text-2xl font-bold text-white leading-snug flex items-center justify-between">
                        {item.title}
                        <ArrowRight className="h-5 w-5 text-amber-400 opacity-80 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                      </h3>
                    </div>
                  </div>
                </Card>
              ))}
            </CardSwap>
          </div>
        </div>

      </div>
    </section>
  );
}