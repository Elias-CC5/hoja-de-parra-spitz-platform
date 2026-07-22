import { notFound } from "next/navigation";
import { productsService } from "@/features/menu/services/products.service";
import { ProductGallery } from "@/features/product-detail/components/ProductGallery";
import { ProductReviews } from "@/features/product-detail/components/ProductReviews";
import { RelatedProducts } from "@/features/product-detail/components/RelatedProducts";
import { AddToCartPanel } from "@/features/product-detail/components/AddToCartPanel";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await productsService.findBySlug(slug).catch(() => null);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          {product.category && (
            <p className="mb-2 text-sm font-medium uppercase tracking-wide text-accent">
              {product.category.name}
            </p>
          )}
          <h1 className="font-display text-3xl font-medium">{product.name}</h1>
          <p className="mt-4 text-muted-foreground">{product.description}</p>
          <p className="mt-6 font-display text-3xl font-semibold">S/ {Number(product.price).toFixed(2)}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Mínimo {product.minPeoplePerOrder} persona(s)
            {product.maxPeoplePerOrder ? ` · Máximo ${product.maxPeoplePerOrder}` : ""}
          </p>

          <AddToCartPanel productId={product.id} />
        </div>
      </div>

      <ProductReviews productId={product.id} />
      <RelatedProducts productId={product.id} />
    </div>
  );
}
