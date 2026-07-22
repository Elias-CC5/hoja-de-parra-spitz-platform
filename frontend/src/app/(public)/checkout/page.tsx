import { CheckoutForm } from "@/features/checkout/components/CheckoutForm";

export const metadata = { title: "Finalizar compra" };

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">Checkout</p>
        <h1 className="font-display text-3xl font-medium">Finaliza tu pedido</h1>
      </div>
      <CheckoutForm />
    </div>
  );
}
