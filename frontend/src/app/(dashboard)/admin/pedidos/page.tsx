"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/features/admin/services/admin.service";
import type { Order } from "@/types";

const STATUS_OPTIONS = [
  "pendiente_pago",
  "pagado",
  "en_preparacion",
  "en_camino",
  "entregado",
  "cancelado",
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = () => {
    adminService.findAllOrders().then(setOrders).finally(() => setIsLoading(false));
  };
  useEffect(load, []);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-medium">Pedidos</h1>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left">
              <tr>
                <th className="px-4 py-3">N° Pedido</th>
                <th className="px-4 py-3">Fecha evento</th>
                <th className="px-4 py-3">Personas</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                  <td className="px-4 py-3">{new Date(order.eventDate).toLocaleDateString("es-PE")}</td>
                  <td className="px-4 py-3">{order.numberOfPeople}</td>
                  <td className="px-4 py-3">S/ {Number(order.total).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      className="rounded-md border border-input bg-transparent px-2 py-1 text-xs"
                      onChange={async (e) => {
                        await adminService.updateOrderStatus(order.id, e.target.value);
                        load();
                      }}
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
