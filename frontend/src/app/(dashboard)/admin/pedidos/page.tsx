// src/app/(dashboard)/admin/pedidos/page.tsx
"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/features/admin/services/admin.service";
import type { Order } from "@/types";
import { ShoppingBag, Loader2, Calendar, Users, DollarSign, Tag } from "lucide-react";

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

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pagado":
      case "entregado":
        return "bg-emerald-400/10 text-emerald-400 border-emerald-400/30";
      case "en_preparacion":
      case "en_camino":
        return "bg-amber-400/10 text-amber-400 border-amber-400/30";
      case "cancelado":
        return "bg-rose-500/10 text-rose-400 border-rose-500/30";
      default:
        return "bg-neutral-800 text-neutral-300 border-neutral-700";
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Banner */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <ShoppingBag className="h-7 w-7 text-amber-400" />
            Gestión de <span className="text-amber-400">Pedidos</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Sincronizado en tiempo real con la base de datos de eventos.
          </p>
        </div>
      </div>

      {/* Contenido */}
      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-3xl border border-neutral-800/80 bg-neutral-950/50 backdrop-blur-xl">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
          <p className="text-xs font-semibold text-neutral-400">Cargando lista de pedidos...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-3xl border border-neutral-800/80 bg-neutral-950/50 backdrop-blur-xl">
          <p className="text-sm font-semibold text-neutral-400">No hay pedidos registrados por el momento.</p>
        </div>
      ) : (
        <div className="w-full overflow-hidden rounded-3xl border border-neutral-800/80 bg-neutral-950/90 shadow-2xl backdrop-blur-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-800/80 bg-neutral-900/60 uppercase text-neutral-400 font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-4"><span className="flex items-center gap-1.5"><Tag className="h-3.5 w-3.5 text-amber-400" /> N° Pedido</span></th>
                  <th className="px-6 py-4"><span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5 text-amber-400" /> Fecha evento</span></th>
                  <th className="px-6 py-4"><span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-amber-400" /> Personas</span></th>
                  <th className="px-6 py-4"><span className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5 text-amber-400" /> Total</span></th>
                  <th className="px-6 py-4">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {orders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-neutral-900/40">
                    <td className="px-6 py-4 font-bold text-amber-400 font-mono text-sm">#{order.orderNumber}</td>
                    <td className="px-6 py-4 font-medium text-neutral-200">{new Date(order.eventDate).toLocaleDateString("es-PE")}</td>
                    <td className="px-6 py-4 font-medium text-neutral-300">{order.numberOfPeople} pers.</td>
                    <td className="px-6 py-4 font-bold text-white text-sm">S/ {Number(order.total).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select
                          value={order.status}
                          className={`appearance-none rounded-xl border px-3 py-1.5 pr-8 text-xs font-bold transition-all outline-none cursor-pointer ${getStatusBadgeClass(order.status)}`}
                          onChange={async (e) => {
                            await adminService.updateOrderStatus(order.id, e.target.value);
                            load();
                          }}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status} className="bg-neutral-900 text-white font-medium">
                              {status.replace("_", " ").toUpperCase()}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-current opacity-70">▼</div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}