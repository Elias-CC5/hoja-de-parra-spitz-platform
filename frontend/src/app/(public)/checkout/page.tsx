import { CheckoutForm } from "@/features/checkout/components/CheckoutForm";
import { ShieldCheck, ShoppingBag } from "lucide-react";

export const metadata = {
  title: "Finalizar compra | DeParraSpitz",
  description: "Completa los datos de tu pedido y realiza tu pago de forma segura.",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white pt-28 pb-20 relative overflow-hidden">
      {/* Luz de fondo tenue decorativa */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-amber-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Encabezado Principal */}
        <div className="mb-10 text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            <ShoppingBag className="h-3.5 w-3.5" />
            <span>Proceso de Pago</span>
          </div>

          <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Finaliza tu pedido
          </h1>

          <p className="mx-auto max-w-md text-sm text-neutral-400">
            Ingresa la dirección y detalles de entrega para coordinar tu servicio gastronómico.
          </p>
        </div>

        {/* Formulario e Inyección del Componente Checkout */}
        <div className="relative">
          <CheckoutForm />
        </div>

        {/* Garantía / Confianza inferior */}
        <div className="mt-12 flex items-center justify-center gap-2 text-xs text-neutral-500">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Pago 100% encriptado y procesamiento seguro mediante Culqi.</span>
        </div>
      </div>
    </div>
  );
}