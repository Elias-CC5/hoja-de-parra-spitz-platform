import Link from "next/link";
import { categoriesService } from "@/features/menu/services/categories.service";

const CATEGORY_ICONS: Record<string, string> = {
  producto: "M4 7h16l-1.5 12h-13L4 7Z M9 7V5a3 3 0 0 1 6 0v2",
};

export async function CategoryGrid() {
  const categories = await categoriesService.findAll().catch(() => []);

  if (categories.length === 0) return null;

  return (
    <section className="bg-secondary/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">Explora por categoría</p>
          <h2 className="font-display text-3xl font-medium">¿Qué necesitas hoy?</h2>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.slice(0, 8).map((category) => (
            <Link
              key={category.id}
              href={`/menu?categoryId=${category.id}`}
              className="group flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-6 text-center transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d={CATEGORY_ICONS.producto} />
                </svg>
              </div>
              <span className="text-sm font-medium group-hover:text-accent">{category.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
