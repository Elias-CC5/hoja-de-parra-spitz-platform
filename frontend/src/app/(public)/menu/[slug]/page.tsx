import { notFound } from "next/navigation";
import Link from "next/link";
import { productsService } from "@/features/menu/services/products.service";
import { ProductGallery } from "@/features/product-detail/components/ProductGallery";
import { ProductReviews } from "@/features/product-detail/components/ProductReviews";
import { RelatedProducts } from "@/features/product-detail/components/RelatedProducts";
import { AddToCartPanel } from "@/features/product-detail/components/AddToCartPanel";
import { Users, ChevronRight, UtensilsCrossed, Sparkles, ShieldCheck, Menu } from "lucide-react";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// ⚠️ DEBE TENER 'export default' OBLIGATORIAMENTE
export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await productsService.findBySlug(slug).catch(() => null);

  if (!product) notFound();

  return (
    <div className="relative min-h-screen w-full bg-neutral-950 text-neutral-100 overflow-hidden py-10 sm:py-16">
      {/* Ambiente de fondo: dos resplandores en vez de uno, dan más profundidad de escena */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[700px] rounded-full bg-amber-500/[0.08] blur-[150px]" />
      <div className="pointer-events-none absolute top-[30%] -right-40 h-80 w-80 rounded-full bg-amber-600/[0.05] blur-[130px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.02)_1px,transparent_0)] bg-[length:28px_28px]" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
        {/* --- BREADCRUMB --- */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-400">
          <Link
            href="/menu"
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <Menu className="h-3.5 w-3.5" />
            Carta / Menú
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-neutral-700" />
          {product.category && (
            <>
              <span className="text-neutral-400">{product.category.name}</span>
              <ChevronRight className="h-3.5 w-3.5 text-neutral-700" />
            </>
          )}
          <span className="text-amber-400 truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* --- TARJETA PRINCIPAL --- */}
        <div className="relative rounded-[32px] bg-gradient-to-b from-neutral-900 to-neutral-950 p-6 sm:p-10 ring-1 ring-neutral-800/70 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset,0_40px_80px_-30px_rgba(0,0,0,0.8)]">
          {/* Filo dorado superior, mismo lenguaje que las cards de la grilla */}
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/40 to-transparent" />

          <div className="grid gap-10 lg:grid-cols-2 lg:gap-12 items-start">
            <div className="overflow-hidden rounded-[24px] ring-1 ring-neutral-800/70 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.7)]">
              <ProductGallery images={product.images} name={product.name} />
            </div>

            <div className="flex flex-col justify-between space-y-6">
              <div>
                {product.category && (
                  <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-gradient-to-b from-amber-500/15 to-amber-500/5 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-amber-400 mb-3">
                    <Sparkles className="h-3 w-3" />
                    <span>{product.category.name}</span>
                  </div>
                )}

                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  {product.name}
                </h1>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="bg-gradient-to-b from-amber-300 to-amber-500 bg-clip-text text-3xl sm:text-4xl font-extrabold text-transparent">
                    S/ {Number(product.price).toFixed(2)}
                  </span>
                  <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">
                    IGV incluido
                  </span>
                </div>

                <p className="mt-5 text-sm sm:text-base text-neutral-300 leading-relaxed border-t border-neutral-800/80 pt-5">
                  {product.description}
                </p>

                <div className="mt-6 inline-flex items-center gap-2.5 rounded-2xl bg-neutral-800/40 ring-1 ring-neutral-700/50 px-4 py-2.5 text-xs text-neutral-300 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
                  <Users className="h-4 w-4 text-amber-400" />
                  <span>
                    Ración para <strong className="text-white font-bold">{product.minPeoplePerOrder}</strong>
                    {product.maxPeoplePerOrder ? ` a ${product.maxPeoplePerOrder}` : ""} persona(s)
                  </span>
                </div>
              </div>

              <div className="border-t border-neutral-800/80 pt-6 space-y-4">
                <AddToCartPanel productId={product.id} />

                <div className="flex items-center justify-center sm:justify-start gap-4 text-[11px] text-neutral-500 pt-2">
                  <span className="flex items-center gap-1.5">
                    <UtensilsCrossed className="h-3.5 w-3.5 text-amber-400" /> Preparación al momento
                  </span>
                  <span className="text-neutral-700">•</span>
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-400" /> Ingredientes frescos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- RESEÑAS --- */}
        <div className="border-t border-neutral-800/60 pt-12">
          <ProductReviews productId={product.id} />
        </div>

        {/* --- RELACIONADOS --- */}
        <div className="border-t border-neutral-800/60 pt-12">
          <RelatedProducts productId={product.id} />
        </div>
      </div>
    </div>
  );
}