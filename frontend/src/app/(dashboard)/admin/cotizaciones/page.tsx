"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { adminService } from "@/features/admin/services/admin.service";
import type { Quotation } from "@/types";

export default function AdminQuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [prices, setPrices] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);

  const load = () => {
    adminService.findAllQuotations().then(setQuotations).finally(() => setIsLoading(false));
  };
  useEffect(load, []);

  const handleReview = async (id: string, status: string) => {
    await adminService.reviewQuotation(id, {
      status,
      finalPrice: prices[id] ? Number(prices[id]) : undefined,
    });
    load();
  };

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-medium">Cotizaciones</h1>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando...</p>
      ) : quotations.length === 0 ? (
        <p className="text-sm text-muted-foreground">No hay cotizaciones registradas.</p>
      ) : (
        <div className="space-y-4">
          {quotations.map((quotation) => (
            <div key={quotation.id} className="rounded-lg border border-border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium capitalize">{quotation.eventType.replace("_", " ")}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(quotation.eventDate).toLocaleDateString("es-PE")} · {quotation.numberOfGuests} invitados · {quotation.location}
                  </p>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                  {quotation.status}
                </span>
              </div>

              {quotation.comments && (
                <p className="mt-2 text-sm text-muted-foreground">&ldquo;{quotation.comments}&rdquo;</p>
              )}

              {quotation.status === "pendiente" && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Precio final (S/)"
                    className="w-40"
                    value={prices[quotation.id] ?? ""}
                    onChange={(e) => setPrices((prev) => ({ ...prev, [quotation.id]: e.target.value }))}
                  />
                  <Button size="sm" onClick={() => handleReview(quotation.id, "aprobada")}>
                    Aprobar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleReview(quotation.id, "rechazada")}>
                    Rechazar
                  </Button>
                </div>
              )}

              {quotation.status === "aprobada" && (
                <Button
                  size="sm"
                  className="mt-4"
                  onClick={async () => {
                    await adminService.convertQuotationToOrder(quotation.id);
                    load();
                  }}
                >
                  Convertir en pedido
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
