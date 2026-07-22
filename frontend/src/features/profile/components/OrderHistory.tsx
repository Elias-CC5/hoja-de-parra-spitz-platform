"use client";

import { useEffect, useState } from "react";
import { profileService } from "../services/profile.service";
import type { Order } from "@/types";
import { Badge } from "@/components/ui/badge";

const STATUS_LABELS: Record<string, string> = {
  pendiente_pago: "Pendiente de pago",
  pagado: "Pagado",
  en_preparacion: "En preparación",
  en_camino: "En camino",
  entregado: "Entregado",
  cancelado: "Cancelado",
};

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    profileService
      .findMyOrders()
      .then(setOrders)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <p className="text-sm text-muted-foreground">Cargando pedidos...</p>;
  if (orders.length === 0) return <p className="text-sm text-muted-foreground">Aún no tienes pedidos.</p>;

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">{order.orderNumber}</span>
            <Badge variant="secondary">{STATUS_LABELS[order.status] ?? order.status}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString("es-PE")} · {order.numberOfPeople} personas
          </p>
          <p className="mt-2 font-display text-lg font-medium">S/ {Number(order.total).toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}
