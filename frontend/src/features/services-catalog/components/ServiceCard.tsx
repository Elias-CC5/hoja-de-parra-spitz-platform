import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { CateringService } from "@/types";

const PLACEHOLDER_IMAGE = "/product-placeholder.svg";

const EVENT_TYPE_LABELS: Record<string, string> = {
  matrimonio: "Matrimonios",
  cumpleanos: "Cumpleaños",
  empresarial: "Eventos empresariales",
  conferencia: "Conferencias",
  coffee_break: "Coffee Break",
  aniversario: "Aniversarios",
  graduacion: "Graduaciones",
  evento_privado: "Eventos privados",
};

export function ServiceCard({ service }: { service: CateringService }) {
  return (
    <Link
      href={`/servicios/${service.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <Image
          src={service.galleryUrls?.[0] ?? PLACEHOLDER_IMAGE}
          alt={service.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-accent">
          {EVENT_TYPE_LABELS[service.eventType] ?? service.eventType}
        </p>
        <h3 className="font-display text-lg font-medium group-hover:text-accent">{service.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{service.description}</p>
        <span className="mt-3 flex items-center gap-1 text-sm font-medium text-accent">
          Ver detalles <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}
