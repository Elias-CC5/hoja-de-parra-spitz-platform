"use client";

import { useEffect, useState } from "react";
import { profileService } from "../services/profile.service";
import { reservationsService } from "@/features/reservations/services/reservations.service";
import type { Reservation } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATUS_LABELS: Record<string, string> = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  cancelada: "Cancelada",
  completada: "Completada",
};

export function ReservationHistory() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const load = () => {
    profileService.findMyReservations().then(setReservations).finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  if (isLoading) return <p className="text-sm text-muted-foreground">Cargando reservas...</p>;
  if (reservations.length === 0)
    return <p className="text-sm text-muted-foreground">Aún no tienes reservas.</p>;

  return (
    <div className="space-y-4">
      {reservations.map((reservation) => (
        <div key={reservation.id} className="rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">
              {new Date(reservation.eventDate).toLocaleDateString("es-PE")} · {reservation.eventTime}
            </span>
            <Badge variant="secondary">{STATUS_LABELS[reservation.status] ?? reservation.status}</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {reservation.numberOfPeople} personas · {reservation.address}
          </p>
          {reservation.status === "pendiente" && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={async () => {
                await reservationsService.cancel(reservation.id);
                load();
              }}
            >
              Cancelar
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}
