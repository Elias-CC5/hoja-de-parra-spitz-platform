"use client";

import { useEffect, useState } from "react";
import { reservationsService } from "@/features/reservations/services/reservations.service";
import type { Reservation } from "@/types";
import { Calendar, Users, MapPin, Clock } from "lucide-react";

export function ReservationHistory() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const data = await reservationsService.findMine();
      setReservations(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener reservas:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  if (loading) {
    return <p className="text-sm text-neutral-400">Cargando tus reservas...</p>;
  }

  if (reservations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Calendar className="h-10 w-10 text-neutral-600 mb-3" />
        <p className="text-neutral-300 font-medium">Aún no tienes reservas registradas.</p>
        <p className="text-xs text-neutral-500 mt-1">
          Las solicitudes de cotización que envíes aparecerán aquí automáticamente.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reservations.map((res) => (
        <div 
          key={res.id} 
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-900/60 p-4"
        >
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-amber-400 capitalize">{res.eventType}</span>
              <span className="rounded-full bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 text-[10px] text-amber-400 uppercase font-medium">
                {res.status || "PENDIENTE"}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-neutral-500" />
                {res.eventDate}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-neutral-500" />
                {res.eventTime} hrs
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5 text-neutral-500" />
                {res.numberOfPeople} invitados
              </span>
            </div>

            <p className="flex items-center gap-1 text-xs text-neutral-500">
              <MapPin className="h-3.5 w-3.5" />
              {res.address}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}