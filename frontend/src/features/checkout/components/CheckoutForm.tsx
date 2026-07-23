"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, 
  MapPin, 
  Calendar, 
  Users, 
  FileText, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  ShoppingBag,
  ArrowRight
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { checkoutSchema, type CheckoutFormValues } from "../services/checkout.schemas";
import { checkoutService } from "../services/checkout.service";
import { useCulqiCheckout } from "../hooks/useCulqiCheckout";

type CheckoutStep = "form" | "processing" | "success" | "error";

export function CheckoutForm() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { summary, fetchCart } = useCartStore();
  const [step, setStep] = useState<CheckoutStep>("form");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({ resolver: zodResolver(checkoutSchema) });

  const handleTokenReady = async (token: string) => {
    if (!createdOrderId || !user) return;
    setStep("processing");
    try {
      await checkoutService.payOrder(createdOrderId, token, user.email);
      setStep("success");
      await fetchCart();
    } catch {
      setStep("error");
      setErrorMessage("El pago fue rechazado. Puedes intentar nuevamente con otra tarjeta.");
    }
  };

  const { openCheckout } = useCulqiCheckout({
    amountInSoles: summary?.total ?? 0,
    onTokenReady: handleTokenReady,
  });

  const onSubmit = async (values: CheckoutFormValues) => {
    setErrorMessage(null);
    try {
      const order = await checkoutService.createOrder(values);
      setCreatedOrderId(order.id);
      openCheckout();
    } catch {
      setErrorMessage("No pudimos crear tu pedido. Verifica que tu carrito no esté vacío.");
    }
  };

  // --- ESTADO: PAGO EXITOSO ---
  if (step === "success") {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-emerald-500/30 bg-neutral-900/60 p-8 text-center backdrop-blur-xl shadow-2xl"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h2 className="font-display text-2xl font-bold text-white">¡Pago Confirmado!</h2>
        <p className="mt-2 text-sm text-neutral-400 max-w-md mx-auto">
          Tu pedido fue registrado con éxito. Nos pondremos en contacto contigo pronto para coordinar los detalles.
        </p>
        <Button 
          className="mt-6 bg-amber-400 font-semibold text-neutral-950 hover:bg-amber-300 transition-colors"
          onClick={() => router.push("/perfil")}
        >
          Ver mis pedidos
        </Button>
      </motion.div>
    );
  }

  // --- ESTADO: CARRITO VACÍO ---
  if (!summary || summary.cart.items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-12 text-center text-neutral-400 backdrop-blur-md"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-800/80 text-neutral-500 mb-3">
          <ShoppingBag className="h-7 w-7" />
        </div>
        <p className="text-base font-medium text-neutral-300">Tu carrito está vacío</p>
        <p className="text-xs text-neutral-500 mt-1">Agrega productos del menú antes de finalizar tu compra.</p>
        <Button 
          variant="outline" 
          className="mt-5 border-neutral-700 text-neutral-300 hover:bg-neutral-800"
          onClick={() => router.push("/menu")}
        >
          Ir a la carta
        </Button>
      </motion.div>
    );
  }

  // --- FORMULARIO PRINCIPAL ---
  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onSubmit={handleSubmit(onSubmit)} 
      className="grid gap-8 lg:grid-cols-12"
    >
      {/* COLUMNA IZQUIERDA: Formulario de Datos (7 Cols) */}
      <div className="space-y-6 lg:col-span-7">
        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-6 backdrop-blur-md space-y-5">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <MapPin className="h-5 w-5 text-amber-400" />
            Detalles de Entrega
          </h2>

          {/* Dirección */}
          <div className="space-y-2">
            <Label htmlFor="deliveryAddress" className="text-xs font-medium text-neutral-300">
              Dirección de entrega
            </Label>
            <div className="relative">
              <Input 
                id="deliveryAddress" 
                placeholder="Ej. Av. Primavera 123, Dpto 402 - Surco" 
                className="bg-neutral-950/60 border-neutral-800 focus:border-amber-400/50 text-white pl-9 h-11 transition-all"
                {...register("deliveryAddress")} 
              />
              <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-neutral-500" />
            </div>
            {errors.deliveryAddress && (
              <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" /> {errors.deliveryAddress.message}
              </p>
            )}
          </div>

          {/* Fecha y Personas */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="eventDate" className="text-xs font-medium text-neutral-300">
                Fecha del evento / entrega
              </Label>
              <div className="relative">
                <Input 
                  id="eventDate" 
                  type="date" 
                  className="bg-neutral-950/60 border-neutral-800 focus:border-amber-400/50 text-white pl-9 h-11 transition-all [color-scheme:dark]"
                  {...register("eventDate")} 
                />
                <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-neutral-500" />
              </div>
              {errors.eventDate && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" /> {errors.eventDate.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfPeople" className="text-xs font-medium text-neutral-300">
                N° de comensales / personas
              </Label>
              <div className="relative">
                <Input 
                  id="numberOfPeople" 
                  type="number" 
                  min={1} 
                  placeholder="10"
                  className="bg-neutral-950/60 border-neutral-800 focus:border-amber-400/50 text-white pl-9 h-11 transition-all"
                  {...register("numberOfPeople")} 
                />
                <Users className="absolute left-3 top-3.5 h-4 w-4 text-neutral-500" />
              </div>
              {errors.numberOfPeople && (
                <p className="text-xs text-red-400 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" /> {errors.numberOfPeople.message}
                </p>
              )}
            </div>
          </div>

          {/* Notas Adicionales */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-xs font-medium text-neutral-300">
              Indicaciones especiales o notas (opcional)
            </Label>
            <div className="relative">
              <textarea
                id="notes"
                rows={3}
                placeholder="Ej. Timbre malogrado, restricciones alimenticias, etc."
                className="w-full rounded-lg border border-neutral-800 bg-neutral-950/60 p-3 text-sm text-white placeholder:text-neutral-600 focus:border-amber-400/50 focus:outline-none transition-all"
                {...register("notes")}
              />
            </div>
          </div>
        </div>

        {/* Mensaje de Error si falla la API */}
        <AnimatePresence>
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400"
            >
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* COLUMNA DERECHA: Resumen de Pago (5 Cols) */}
      <div className="space-y-6 lg:col-span-5">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-xl shadow-xl space-y-5">
          <h3 className="text-base font-semibold text-white flex items-center justify-between border-b border-neutral-800/80 pb-4">
            <span>Resumen del Pedido</span>
            <span className="text-xs text-neutral-400 font-normal">
              {summary.cart.items.length} {summary.cart.items.length === 1 ? "ítem" : "ítems"}
            </span>
          </h3>

          {/* Desglose de Precios */}
          <div className="space-y-3 text-sm text-neutral-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-neutral-200">S/ {summary.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>IGV (18%)</span>
              <span className="text-neutral-200">S/ {summary.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Costo de Envío</span>
              <span className="text-emerald-400 font-medium">
                {summary.shipping === 0 ? "Gratis" : `S/ ${summary.shipping.toFixed(2)}`}
              </span>
            </div>

            <div className="border-t border-neutral-800 pt-3 flex justify-between items-baseline">
              <span className="font-semibold text-white">Total a pagar</span>
              <span className="font-display text-2xl font-bold text-amber-400">
                S/ {summary.total.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Botón Principal de Pago */}
          <Button
            type="submit"
            size="lg"
            className="group w-full h-12 bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 font-bold hover:from-amber-300 hover:to-amber-400 transition-all duration-300 shadow-lg shadow-amber-500/10 rounded-xl flex items-center justify-center gap-2"
            disabled={isSubmitting || step === "processing"}
          >
            {(isSubmitting || step === "processing") ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Procesando pedido...</span>
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                <span>Pagar con tarjeta (Culqi)</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </Button>

          <p className="text-[11px] text-center text-neutral-500 flex items-center justify-center gap-1">
            🔒 Procesado de forma segura mediante Culqi
          </p>
        </div>
      </div>
    </motion.form>
  );
}