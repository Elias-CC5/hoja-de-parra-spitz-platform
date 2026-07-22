"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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

  if (step === "success") {
    return (
      <div className="rounded-lg border border-border bg-card p-10 text-center">
        <h2 className="font-display text-2xl font-medium">¡Pago confirmado!</h2>
        <p className="mt-2 text-muted-foreground">
          Tu pedido fue registrado correctamente. Te contactaremos para coordinar la entrega.
        </p>
        <Button className="mt-6" onClick={() => router.push("/perfil")}>
          Ver mis pedidos
        </Button>
      </div>
    );
  }

  if (!summary || summary.cart.items.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-10 text-center text-muted-foreground">
        Tu carrito está vacío. Agrega productos antes de continuar con el pago.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="deliveryAddress">Dirección de entrega</Label>
        <Input id="deliveryAddress" placeholder="Dirección completa" {...register("deliveryAddress")} />
        {errors.deliveryAddress && (
          <p className="text-sm text-destructive">{errors.deliveryAddress.message}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="eventDate">Fecha de entrega</Label>
          <Input id="eventDate" type="date" {...register("eventDate")} />
          {errors.eventDate && <p className="text-sm text-destructive">{errors.eventDate.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="numberOfPeople">Número de personas</Label>
          <Input id="numberOfPeople" type="number" min={1} {...register("numberOfPeople")} />
          {errors.numberOfPeople && (
            <p className="text-sm text-destructive">{errors.numberOfPeople.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notas adicionales (opcional)</Label>
        <textarea
          id="notes"
          rows={3}
          className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm"
          {...register("notes")}
        />
      </div>

      {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

      <div className="rounded-lg border border-border bg-secondary/40 p-5">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Subtotal</span>
          <span>S/ {summary.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>IGV (18%)</span>
          <span>S/ {summary.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Envío</span>
          <span>{summary.shipping === 0 ? "Gratis" : `S/ ${summary.shipping.toFixed(2)}`}</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-border pt-2 font-display text-lg font-medium">
          <span>Total</span>
          <span>S/ {summary.total.toFixed(2)}</span>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isSubmitting || step === "processing"}
      >
        {(isSubmitting || step === "processing") && <Loader2 className="animate-spin" />}
        Pagar con tarjeta (Culqi)
      </Button>
    </form>
  );
}
