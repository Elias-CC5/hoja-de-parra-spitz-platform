import { Star } from "lucide-react";
import { reviewsService } from "../services/product-detail.service";

export async function ProductReviews({ productId }: { productId: string }) {
  const [reviews, rating] = await Promise.all([
    reviewsService.findByProduct(productId).catch(() => []),
    reviewsService.getAverageRating(productId).catch(() => ({ average: 0, count: 0 })),
  ]);

  return (
    <section className="mt-16 border-t border-border pt-10">
      <div className="mb-6 flex items-center gap-3">
        <h2 className="font-display text-2xl font-medium">Opiniones</h2>
        {rating.count > 0 && (
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star size={16} className="fill-accent text-accent" />
            {rating.average.toFixed(1)} ({rating.count})
          </span>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aún no hay reseñas para este producto.</p>
      ) : (
        <ul className="space-y-6">
          {reviews.map((review) => (
            <li key={review.id} className="border-b border-border pb-6 last:border-none">
              <div className="mb-1 flex items-center gap-2">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < review.rating ? "fill-accent text-accent" : "text-muted-foreground"}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">{review.user?.fullName ?? "Cliente"}</span>
              </div>
              {review.comment && <p className="text-sm text-muted-foreground">{review.comment}</p>}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
