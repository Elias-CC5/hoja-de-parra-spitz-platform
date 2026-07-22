"use client";

import { useEffect, useState } from "react";
import { adminService } from "@/features/admin/services/admin.service";
import type { Reservation } from "@/types";

const STATUS_OPTIONS = ["pendiente", "confirmada", "cancelada", "completada"];

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = () => {
    adminService.findAllReservations().then(setReservations).finally(() => setIsLoading(false));
  };
  useEffect(load, []);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-medium">Reservas</h1>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Tipo de evento</th>
                <th className="px-4 py-3">Personas</th>
                <th className="px-4 py-3">Dirección</th>
                <th className="px-4 py-3">Estado</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    {new Date(reservation.eventDate).toLocaleDateString("es-PE")} {reservation.eventTime}
                  </td>
                  <td className="px-4 py-3 capitalize">{reservation.eventType.replace("_", " ")}</td>
                  <td className="px-4 py-3">{reservation.numberOfPeople}</td>
                  <td className="px-4 py-3">{reservation.address}</td>
                  <td className="px-4 py-3">
                    <select
                      value={reservation.status}
                      className="rounded-md border border-input bg-transparent px-2 py-1 text-xs"
                      onChange={async (e) => {
                        await adminService.updateReservationStatus(reservation.id, e.target.value);
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
