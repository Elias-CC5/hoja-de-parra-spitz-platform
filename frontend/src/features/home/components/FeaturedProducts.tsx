import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/features/menu/components/ProductCard";
import { productsService } from "@/features/menu/services/products.service";

export async function FeaturedProducts() {
  const products = await productsService.findFeatured().catch(() => []);

  if (products.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">Lo más pedido</p>
          <h2 className="font-display text-3xl font-medium">Productos destacados</h2>
        </div>
        <Link href="/menu" className="hidden items-center gap-1 text-sm font-medium hover:text-accent sm:flex">
          Ver todo el menú <ArrowRight size={16} />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
