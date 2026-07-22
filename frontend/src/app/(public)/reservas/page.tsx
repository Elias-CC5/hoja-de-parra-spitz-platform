import { ReservationForm } from "@/features/reservations/components/ReservationForm";

export const metadata = { title: "Reservar evento" };

export default function ReservationsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">Reservas</p>
        <h1 className="font-display text-3xl font-medium">Reserva tu evento</h1>
        <p className="mt-2 text-muted-foreground">
          Asegura la fecha para tu celebración o evento corporativo.
        </p>
      </div>
      <ReservationForm />
    </div>
  );
}
