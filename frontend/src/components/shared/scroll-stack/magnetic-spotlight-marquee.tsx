// components/ui/magnetic-spotlight-marquee.tsx
"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface MagneticSpotlightMarqueeProps {
  className?: string;
  images?: string[];
  title?: string[];
  subtitle?: string[];
  paragraphs?: string[][];
  footerText?: string;
}

interface WakeTarget {
  setY: (value: number) => void;
  restCenterY: number;
  currentY: number;
}

const config = {
  stripFollowEase: 0.12,
  stripEdgeInset: 175,
  contentRiseRate: 0.85,
  risenTopGap: 100,
  liftHeadStart: 140,
  wakeStrength: 3.0,
  wakeReach: 140,
  lineSettleEase: 0.1,
};

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1558030006-450675393462?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=400&auto=format&fit=crop",
];

const DEFAULT_TITLE = ["Hoja de Parra"];
const DEFAULT_SUBTITLE = [
  "GASTRONOMÍA A LAS BRASAS",
  "TÉCNICAS ANCESTRALES",
  "SERVICIO DE ALTA GAMA",
];

const DEFAULT_PARAGRAPHS = [
  [
    "01. NUESTRA ESENCIA",
    "Transformamos el arte de cocinar",
    "a la leña y carbón en una experiencia",
    "multisensorial inolvidable.",
  ],
  [
    "02. SELECCIÓN PREMIUM",
    "Cortes de origen importados,",
    "maridajes exclusivos y vegetales",
    "cosechados al día para tu mesa.",
  ],
  [
    "03. EVENTOS PRIVADOS",
    "Banquetes de gala, bodas de autor,",
    "parrilladas exclusivas y experiencias",
    "privadas diseñadas a medida.",
  ],
  [
    "04. CATERING CORPORATIVO",
    "Llevamos la alta cocina a tu empresa.",
    "Coffee breaks, summits y reuniones",
    "con cocción lenta y presentación impecable.",
  ],
];

export function MagneticSpotlightMarquee({
  className,
  images = DEFAULT_IMAGES,
  title = DEFAULT_TITLE,
  subtitle = DEFAULT_SUBTITLE,
  paragraphs = DEFAULT_PARAGRAPHS,
  footerText = "Hoja de Parra · Spitz © Gastronomía de alta gama a fuego lento. Reservas privadas, eventos corporativos y banquetes exclusivos.",
}: MagneticSpotlightMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeStripRef = useRef<HTMLDivElement>(null);
  const marqueeTrackRef = useRef<HTMLDivElement>(null);

  const [clonedImages, setClonedImages] = useState<string[]>(images);

  // ---------------------------------------------------------------------
  // 1. Marquee infinito 100% CSS (corre en el compositor / GPU, no en JS).
  //    Solo calculamos cuántos sets necesitamos y seteamos variables CSS.
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (!marqueeTrackRef.current) return;

    const track = marqueeTrackRef.current;

    const setup = () => {
      const isMobile = window.innerWidth < 768;
      const itemWidth = isMobile ? 140 : 180;
      const gap = 16;
      const oneSetWidth = images.length * (itemWidth + gap);
      const setsNeeded = Math.ceil(window.innerWidth / oneSetWidth) + 2;

      const newImages: string[] = [];
      for (let i = 0; i < setsNeeded; i++) newImages.push(...images);
      setClonedImages(newImages);

      track.style.setProperty("--marquee-distance", `-${oneSetWidth}px`);
      track.style.setProperty("--marquee-duration", `${oneSetWidth / 35}s`);
    };

    setup();

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const debouncedSetup = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setup, 150);
    };

    window.addEventListener("resize", debouncedSetup, { passive: true });
    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", debouncedSetup);
    };
  }, [images]);

  // ---------------------------------------------------------------------
  // 2. Loop de física (spotlight que sigue al cursor + "onda" en el texto)
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (!containerRef.current || !marqueeStripRef.current) return;

    const spotlightSection = containerRef.current;
    const marqueeStrip = marqueeStripRef.current;

    let stripBaseTop = 0;
    let stripHeight = 0;
    let sectionHeight = 0;
    let stripRestCenterY = 0;
    let contentTopAtRest = 0;
    let stripTargetY = 0;
    let stripCurrentY = 0;
    let stripPrevY = 0;
    let hasPointerMoved = false;
    let cachedRect = spotlightSection.getBoundingClientRect();
    let isAnimating = false;

    let targets: WakeTarget[] = [];

    const setMarqueeY = gsap.quickSetter(marqueeStrip, "y", "px");

    const measureGeometry = () => {
      sectionHeight = spotlightSection.offsetHeight;
      stripBaseTop = marqueeStrip.offsetTop;
      stripHeight = marqueeStrip.offsetHeight;
      stripRestCenterY = config.stripEdgeInset;
      cachedRect = spotlightSection.getBoundingClientRect();

      const elements = Array.from(
        spotlightSection.querySelectorAll(".wake-target")
      ) as HTMLElement[];
      let blockTop = Infinity;

      targets = elements.map((el): WakeTarget => {
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== spotlightSection) {
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement;
  }
  const restCenterY = y + el.offsetHeight / 2;
  blockTop = Math.min(blockTop, restCenterY - el.offsetHeight / 2);

  return {
    setY: (value: number) => gsap.quickSetter(el, "y", "px")(value),
    restCenterY,
    currentY: 0,
  };
});

      contentTopAtRest = isFinite(blockTop) ? blockTop : sectionHeight * 0.4;

      if (!hasPointerMoved) {
        const restY = config.stripEdgeInset - stripHeight / 2;
        stripTargetY = restY;
        stripCurrentY = restY;
        stripPrevY = restY;
        setMarqueeY(stripCurrentY);
      }
    };

    measureGeometry();

    // Debounce del resize: evita recalcular offsets en cada pixel
    let resizeTimeout: ReturnType<typeof setTimeout>;
    const debouncedMeasure = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(measureGeometry, 150);
    };
    window.addEventListener("resize", debouncedMeasure, { passive: true });

    // El rect solo cambia por resize o scroll de la página, no por mousemove
    const updateRectOnScroll = () => {
      cachedRect = spotlightSection.getBoundingClientRect();
    };
    window.addEventListener("scroll", updateRectOnScroll, { passive: true });

    // Arranca/detiene el ticker solo cuando hace falta (ahorra CPU si el
    // usuario nunca movió el mouse sobre la sección)
    const ensureAnimating = () => {
      if (!isAnimating) {
        isAnimating = true;
        gsap.ticker.add(render);
      }
    };

    const handlePointerMove = (e: MouseEvent) => {
      hasPointerMoved = true;
      const pointerY = e.clientY - cachedRect.top;
      stripTargetY = pointerY - stripHeight / 2;
      ensureAnimating();
    };

    const handlePointerLeave = () => {
      hasPointerMoved = false;
      stripTargetY = config.stripEdgeInset - stripHeight / 2;
    };

    spotlightSection.addEventListener("mousemove", handlePointerMove, {
      passive: true,
    });
    spotlightSection.addEventListener("mouseleave", handlePointerLeave, {
      passive: true,
    });

    const EPSILON = 0.01;

    const render = () => {
      const prevStripY = stripCurrentY;
      stripCurrentY += (stripTargetY - stripCurrentY) * config.stripFollowEase;
      setMarqueeY(stripCurrentY);

      const stripCenterY = stripBaseTop + stripCurrentY + stripHeight / 2;
      const stripVelocityY = stripCurrentY - stripPrevY;
      stripPrevY = stripCurrentY;

      const descentBelowRest = Math.max(0, stripCenterY - stripRestCenterY);
      const maxRise = Math.max(0, contentTopAtRest - config.risenTopGap);
      const contentRise = -Math.min(
        descentBelowRest * config.contentRiseRate,
        maxRise
      );

      let stillMoving = Math.abs(stripCurrentY - stripTargetY) > EPSILON;

      for (let i = 0; i < targets.length; i++) {
        const line = targets[i];
        const gapToStrip = line.restCenterY - stripCenterY;
        const reachedLine = stripCenterY + config.liftHeadStart >= line.restCenterY;
        const wakeInfluence = Math.exp(
          -(gapToStrip * gapToStrip) / (2 * config.wakeReach * config.wakeReach)
        );
        const wakeOffset = stripVelocityY * wakeInfluence * config.wakeStrength;
        const lineTarget = (reachedLine ? contentRise : 0) + wakeOffset;

        line.currentY += (lineTarget - line.currentY) * config.lineSettleEase;
        line.setY(line.currentY);

        if (Math.abs(lineTarget - line.currentY) > EPSILON) stillMoving = true;
      }

      // Si todo se asentó y el mouse ya salió, detiene el ticker
      // (ahorra CPU/batería cuando la sección está quieta)
      if (!stillMoving && !hasPointerMoved && Math.abs(prevStripY - stripCurrentY) < EPSILON) {
        gsap.ticker.remove(render);
        isAnimating = false;
      }
    };

    // Arranca una vez para asentar la geometría inicial
    ensureAnimating();

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", debouncedMeasure);
      window.removeEventListener("scroll", updateRectOnScroll);
      spotlightSection.removeEventListener("mousemove", handlePointerMove);
      spotlightSection.removeEventListener("mouseleave", handlePointerLeave);
      gsap.ticker.remove(render);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className={cn(
        "spotlight relative w-full h-[100vh] min-h-[900px] overflow-hidden bg-[#0c0a09] text-stone-100 font-sans pt-16 md:pt-20 select-none",
        className
      )}
      style={{ transform: "translateZ(0)" }}
    >
      {/* Tira Marquee totalmente aislada de la capa del texto */}
      <div
        ref={marqueeStripRef}
        className="spotlight-marquee absolute left-0 w-full z-10 h-[160px] md:h-[200px] pointer-events-none"
        style={{ top: 0, transform: "translate3d(0,0,0)", backfaceVisibility: "hidden" }}
      >
        <div
          ref={marqueeTrackRef}
          className="spotlight-marquee-track animate-marquee flex gap-4 h-full items-center absolute top-0 left-0"
          style={{ backfaceVisibility: "hidden", willChange: "transform" }}
        >
          {clonedImages.map((img, idx) => (
            <div
              key={idx}
              className="w-[140px] h-[140px] md:w-[180px] md:h-[180px] shrink-0 rounded-[20px] overflow-hidden border border-amber-500/20 bg-stone-900"
              style={{ transform: "translateZ(0)" }}
            >
              <img
                src={img}
                alt="Marquee item"
                className="w-full h-full object-cover pointer-events-none"
                loading={idx < images.length ? "eager" : "lazy"}
                decoding="async"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Capa de Texto */}
      <div
        className="spotlight-content-wrapper relative w-full h-full flex flex-col items-center justify-center px-6 md:px-12 lg:px-20 z-20 pointer-events-none"
        style={{ transform: "translateZ(0)" }}
      >
        <h1 className="font-display text-[12vw] md:text-[8rem] font-normal leading-[0.85] tracking-tighter mb-12 md:mb-16 text-center flex flex-col items-center text-stone-100">
          {title.map((line, idx) => (
            <div key={idx} className="wake-target inline-block relative" style={{ transform: "translateZ(0)" }}>
              {line}
            </div>
          ))}
        </h1>

        <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8 md:gap-12 px-2">
          <div className="flex-1 md:max-w-[300px] text-left">
            <h3 className="text-lg md:text-2xl uppercase tracking-tight font-medium leading-[1.2] text-amber-200/90">
              {subtitle.map((line, idx) => (
                <div key={idx} className="wake-target mb-1" style={{ transform: "translateZ(0)" }}>
                  {line}
                </div>
              ))}
            </h3>
          </div>

          <div className="flex-[2] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-[11px] md:text-xs leading-[1.6]">
            {paragraphs.map((para, pIdx) => (
              <div key={pIdx} className="flex flex-col">
                {para.map((line, lIdx) => (
                  <div
                    key={lIdx}
                    className={cn(
                      "wake-target whitespace-nowrap",
                      lIdx === 0 ? "font-semibold text-amber-400 mb-1 tracking-wider" : "text-stone-300"
                    )}
                    style={{ transform: "translateZ(0)" }}
                  >
                    {line}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full p-6 z-30 flex justify-center pointer-events-none">
        <p className="text-[9px] md:text-[11px] text-stone-400 max-w-3xl text-center leading-[1.5]">
          {footerText}
        </p>
      </div>

      <style jsx global>{`
        @keyframes marquee-scroll {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(var(--marquee-distance, -1000px), 0, 0);
          }
        }
        .animate-marquee {
          animation: marquee-scroll var(--marquee-duration, 20s) linear infinite;
        }
      `}</style>
    </section>
  );
}

export default MagneticSpotlightMarquee;