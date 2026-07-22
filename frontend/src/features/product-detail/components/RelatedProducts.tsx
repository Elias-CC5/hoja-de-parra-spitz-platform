import { ProductCard } from "@/features/menu/components/ProductCard";
import { productsService } from "@/features/menu/services/products.service";

export async function RelatedProducts({ productId }: { productId: string }) {
  const related = await productsService.findRelated(productId).catch(() => []);

  if (related.length === 0) return null;

  return (
    <section className="mt-16 border-t border-border pt-10">
      <h2 className="mb-6 font-display text-2xl font-medium">También te puede interesar</h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
