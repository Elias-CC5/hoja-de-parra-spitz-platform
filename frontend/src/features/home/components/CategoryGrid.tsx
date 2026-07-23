import Link from "next/link";
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
import { categoriesService } from "@/features/menu/services/categories.service";

// Set de íconos temáticos que rotan por categoría — más carácter que un
// mismo bolso de compras repetido ocho veces.
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

export async function CategoryGrid() {
  const categories = await categoriesService.findAll().catch(() => []);

  if (categories.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-neutral-950 py-24">
      {/* Resplandor ambiental, mismo lenguaje que el resto del sitio */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-amber-500/[0.06] blur-[130px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <span className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-amber-400/80">
            Explora por categoría
          </span>
          <h2 className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl">
            ¿Qué necesitas hoy?
          </h2>
          <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-amber-400/60 to-transparent" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.slice(0, 8).map((category, i) => {
            const Icon = CATEGORY_ICONS[i % CATEGORY_ICONS.length];

            return (
              <Link
                key={category.id}
                href={`/menu?categoryId=${category.id}`}
                className="group relative flex flex-col items-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-b from-neutral-900 to-neutral-950 p-7 text-center ring-1 ring-neutral-800/80 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_20px_40px_-24px_rgba(0,0,0,0.7)] transition-all duration-400 hover:-translate-y-1.5 hover:ring-amber-400/40 hover:shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_30px_50px_-20px_rgba(0,0,0,0.8),0_0_30px_-8px_rgba(245,158,11,0.3)]"
              >
                {/* Glow interno que aparece al hover */}
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-500/10 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Flecha indicando navegación, aparece al hover */}
                <ArrowUpRight className="absolute right-4 top-4 h-4 w-4 text-neutral-700 opacity-0 -translate-y-1 translate-x-1 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 group-hover:text-amber-400" />

                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-b from-amber-400/15 to-amber-500/5 ring-1 ring-amber-400/20 transition-all duration-400 group-hover:from-amber-400/25 group-hover:to-amber-500/10 group-hover:ring-amber-400/40">
                  <Icon className="h-6 w-6 text-amber-400 transition-transform duration-400 group-hover:scale-110" strokeWidth={1.75} />
                </div>

                <span className="relative text-sm font-bold text-neutral-200 transition-colors group-hover:text-white">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}