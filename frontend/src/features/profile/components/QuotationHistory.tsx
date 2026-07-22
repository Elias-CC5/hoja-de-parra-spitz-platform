"use client";

import { useEffect, useState } from "react";
import { profileService } from "../services/profile.service";
import type { Quotation } from "@/types";
import { Badge } from "@/components/ui/badge";

const STATUS_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  aprobada: "Aprobada",
  rechazada: "Rechazada",
  convertida_a_pedido: "Convertida en pedido",
};

export function QuotationHistory() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    profileService.findMyQuotations().then(setQuotations).finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <p className="text-sm text-muted-foreground">Cargando cotizaciones...</p>;
  if (quotations.length === 0)
    return <p className="text-sm text-muted-foreground">Aún no tienes cotizaciones.</p>;

  return (
    <div className="space-y-4">
      {quotations.map((quotation) => (
        <div key={quotation.id} className="rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium capitalize">{quotation.eventType.replace("_", " ")}</span>
            <Badge variant="secondary">{STATUS_LABELS[quotation.status] ?? quotation.status}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date(quotation.eventDate).toLocaleDateString("es-PE")} · {quotation.numberOfGuests} invitados
          </p>
          {quotation.finalPrice && (
            <p className="mt-2 font-display text-lg font-medium">
              S/ {Number(quotation.finalPrice).toFixed(2)}
            </p>
          )}
          {quotation.adminNotes && (
            <p className="mt-1 text-sm text-muted-foreground">Nota: {quotation.adminNotes}</p>
          )}
        </div>
      ))}
    </div>
  );
}
