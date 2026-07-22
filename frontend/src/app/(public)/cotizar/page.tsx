import { Suspense } from "react";
import { QuotationForm } from "@/features/quotations/components/QuotationForm";

export const metadata = { title: "Cotizar evento" };

export default function QuotePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">Cotización</p>
        <h1 className="font-display text-3xl font-medium">Cuéntanos sobre tu evento</h1>
        <p className="mt-2 text-muted-foreground">
          Completa el formulario y nuestro equipo te enviará una propuesta a medida.
        </p>
      </div>
      <Suspense fallback={null}>
        <QuotationForm />
      </Suspense>
    </div>
  );
}
