import Link from "next/link";
import { categoriesService } from "@/features/menu/services/categories.service";
import { AnimatedList } from "@/components/shared/scroll-stack/animated-list";
import {
  UtensilsCrossed,
  Soup,
  CakeSlice,
  CupSoda,
  Sandwich,
  Salad,
  Coffee,
  Package,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";

const CATEGORY_ICONS: LucideIcon[] = [
  UtensilsCrossed,
  Soup,
  Salad,
  Sandwich,
  CakeSlice,
  CupSoda,
  Coffee,
  Package,
];

const ICON_STYLES = [
  { bg: "bg-emerald-500", glow: "shadow-emerald-500/30" },
  { bg: "bg-blue-500", glow: "shadow-blue-500/30" },
  { bg: "bg-pink-500", glow: "shadow-pink-500/30" },
  { bg: "bg-amber-500", glow: "shadow-amber-500/30" },
  { bg: "bg-orange-500", glow: "shadow-orange-500/30" },
  { bg: "bg-teal-500", glow: "shadow-teal-500/30" },
  { bg: "bg-purple-500", glow: "shadow-purple-500/30" },
  { bg: "bg-rose-500", glow: "shadow-rose-500/30" },
];

export async function CategoryGrid() {
  const categories = await categoriesService.findAll().catch(() => []);

  if (!categories || categories.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-neutral-950 py-20 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-1/2 h-[600px] w-[900px] -translate-y-1/2 rounded-full bg-amber-500/[0.04] blur-[140px]"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* Encabezado: fijo a la izquierda, igual que en el resto del sitio */}
          <div className="lg:w-[30%] lg:shrink-0">
            <div className="lg:sticky lg:top-28 text-center lg:text-left">
              <span className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-amber-400/90">
                Explora por categoría
              </span>
              <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
                ¿Qué se te{" "}
                <span className="italic font-light text-amber-400">
                  antoja
                </span>{" "}
                hoy?
              </h2>
              <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent lg:mx-0 lg:bg-gradient-to-r lg:from-amber-400/60 lg:to-transparent" />
              <p className="mt-5 text-sm text-neutral-400 leading-relaxed max-w-xs mx-auto lg:mx-0">
                Cada categoría reúne una parte distinta de la experiencia
                DeParraSpitz. Elige por dónde quieres empezar.
              </p>
            </div>
          </div>

          {/* Grid de categorías */}
          <AnimatedList
            delay={150}
            className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {categories.slice(0, 8).map((category, i) => {
              const Icon = CATEGORY_ICONS[i % CATEGORY_ICONS.length];
              const { bg, glow } = ICON_STYLES[i % ICON_STYLES.length];

              return (
                <Link
                  key={category.id}
                  href={`/menu?categoryId=${category.id}`}
                  className="group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-white/[0.07] bg-neutral-900/60 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/40 hover:bg-neutral-900/90 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.8),0_0_20px_-5px_rgba(245,158,11,0.2)]"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-amber-500/10 blur-xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />

                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-1/2 h-0 w-[3px] -translate-y-1/2 rounded-r bg-gradient-to-b from-amber-400 to-amber-600 transition-all duration-300 group-hover:h-3/4"
                  />

                  <div
                    className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${bg} shadow-md ${glow} transition-transform duration-300 group-hover:scale-105`}
                  >
                    <Icon className="h-6 w-6 text-white" strokeWidth={2} />
                  </div>

                  <div className="relative flex flex-1 flex-col min-w-0">
                    <span className="truncate text-sm font-bold text-neutral-100 transition-colors group-hover:text-amber-300">
                      {category.name}
                    </span>
                    <span className="text-xs text-neutral-500 transition-colors group-hover:text-neutral-400">
                      Especialidad de la casa
                    </span>
                  </div>

                  <ArrowUpRight
                    className="relative h-4 w-4 shrink-0 -translate-x-2 text-neutral-600 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-amber-400 group-hover:opacity-100"
                    strokeWidth={2.5}
                  />
                </Link>
              );
            })}
          </AnimatedList>
        </div>
      </div>
    </section>
  );
}