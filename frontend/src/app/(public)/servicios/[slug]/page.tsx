import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { cateringServicesService } from "@/features/services-catalog/services/catering-services.service";
import { ServiceFaqAccordion } from "@/features/services-catalog/components/ServiceFaqAccordion";
import { Button } from "@/components/ui/button";

const PLACEHOLDER_IMAGE = "/product-placeholder.svg";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = await cateringServicesService.findBySlug(slug).catch(() => null);

  if (!service) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-lg bg-muted">
        <Image
          src={service.galleryUrls?.[0] ?? PLACEHOLDER_IMAGE}
          alt={service.name}
          fill
          className="object-cover"
        />
      </div>

      <h1 className="font-display text-3xl font-medium">{service.name}</h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">{service.description}</p>

      {service.referencePrice && (
        <p className="mt-4 font-display text-xl font-semibold">
          Desde S/ {Number(service.referencePrice).toFixed(2)}
        </p>
      )}

      {service.galleryUrls && service.galleryUrls.length > 1 && (
        <div className="mt-6 grid grid-cols-3 gap-3">
          {service.galleryUrls.slice(1, 4).map((url) => (
            <div key={url} className="relative aspect-square overflow-hidden rounded-md bg-muted">
              <Image src={url} alt={service.name} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-lg border border-border bg-secondary/40 p-6 text-center">
        <p className="mb-3 font-display text-lg font-medium">¿Te interesa este servicio para tu evento?</p>
        <Link href={`/cotizar?eventType=${service.eventType}`}>
          <Button size="lg">Solicitar cotización</Button>
        </Link>
      </div>

      <ServiceFaqAccordion faqs={service.faqs} />
    </div>
  );
}
