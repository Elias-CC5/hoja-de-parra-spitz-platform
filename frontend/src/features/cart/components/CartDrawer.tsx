"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/ui.store";
import { useCartStore } from "@/store/cart.store";

const PLACEHOLDER_IMAGE = "/product-placeholder.svg";

export function CartDrawer() {
  const { isCartOpen, closeCart } = useUiStore();
  const { summary, updateItem, removeItem } = useCartStore();

  const items = summary?.cart.items ?? [];

  return (
    <Dialog.Root open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <Dialog.Content className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-background shadow-xl">
          <div className="flex items-center justify-between border-b border-border p-5">
            <Dialog.Title className="font-display text-lg font-medium">Tu carrito</Dialog.Title>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Cerrar carrito">
                <X />
              </Button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
                <p className="font-display text-lg">Tu carrito está vacío</p>
                <p className="text-sm text-muted-foreground">
                  Explora nuestro menú y agrega tus platos favoritos.
                </p>
                <Link href="/menu" onClick={closeCart}>
                  <Button className="mt-4">Ver menú</Button>
                </Link>
              </div>
            ) : (
              <ul className="space-y-5">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={item.product?.images?.[0]?.url ?? PLACEHOLDER_IMAGE}
                        alt={item.product?.name ?? "Producto"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{item.product?.name}</p>
                      <p className="text-sm text-muted-foreground">S/ {Number(item.unitPrice).toFixed(2)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                          className="flex h-6 w-6 items-center justify-center rounded border border-border hover:bg-secondary"
                          aria-label="Reducir cantidad"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateItem(item.id, item.quantity + 1)}
                          className="flex h-6 w-6 items-center justify-center rounded border border-border hover:bg-secondary"
                          aria-label="Aumentar cantidad"
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="ml-auto text-muted-foreground hover:text-destructive"
                          aria-label="Quitar del carrito"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {items.length > 0 && summary && (
            <div className="space-y-3 border-t border-border p-5">
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
              <div className="flex justify-between border-t border-border pt-3 font-display text-base font-medium">
                <span>Total</span>
                <span>S/ {summary.total.toFixed(2)}</span>
              </div>
              <Link href="/checkout" onClick={closeCart}>
                <Button className="w-full" size="lg">Ir a pagar</Button>
              </Link>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
