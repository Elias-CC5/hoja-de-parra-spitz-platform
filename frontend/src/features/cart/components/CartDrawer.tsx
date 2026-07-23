"use client";

import * as Dialog from "@radix-ui/react-dialog";
import Link from "next/link";
import { Minus, Plus, Trash2, X, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUiStore } from "@/store/ui.store";
import { useCartStore } from "@/store/cart.store";

export function CartDrawer() {
  const { isCartOpen, closeCart } = useUiStore();
  const { summary, updateItem, removeItem } = useCartStore();

  const items = summary?.cart.items ?? [];

  // 🔍 Función que rastrea la URL en cualquier nivel de la estructura de datos
  const getImageUrl = (item: any): string | null => {
    if (!item) return null;

    const product = item.product || item;

    // 1. Array de imágenes (TypeORM / Relaciones)
    const imagesArray = product.images || item.images;
    if (Array.isArray(imagesArray) && imagesArray.length > 0) {
      const first = imagesArray[0];
      if (typeof first === "string") return first;
      if (first?.url) return first.url;
      if (first?.imageUrl) return first.imageUrl;
      if (first?.path) return first.path;
    }

    // 2. Propiedades directas comunes en NestJS
    const possibleUrls = [
      product.imageUrl,
      product.image,
      product.coverImage,
      product.photo,
      item.imageUrl,
      item.image,
      item.productImage,
      item.product_image,
    ];

    for (const url of possibleUrls) {
      if (typeof url === "string" && url.trim().length > 0) {
        return url;
      }
    }

    return null;
  };

  return (
    <Dialog.Root open={isCartOpen} onOpenChange={(open) => !open && closeCart()}>
      <Dialog.Portal>
        {/* Overlay con blur y animación Fade */}
        <Dialog.Overlay 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md transition-opacity duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" 
        />
        
        {/* Drawer Deslizante desde la derecha */}
        <Dialog.Content 
          className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col border-l border-neutral-800 bg-neutral-950/95 text-white shadow-2xl backdrop-blur-xl transition-transform duration-300 ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right"
        >
          {/* Header del Carrito */}
          <div className="flex items-center justify-between border-b border-neutral-800/80 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div>
                <Dialog.Title className="font-display text-lg font-bold text-white">
                  Tu Carrito
                </Dialog.Title>
                <p className="text-xs text-neutral-400">
                  {items.length} {items.length === 1 ? "producto" : "productos"} seleccionados
                </p>
              </div>
            </div>
            
            <Dialog.Close asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                aria-label="Cerrar carrito"
              >
                <X className="h-5 w-5" />
              </Button>
            </Dialog.Close>
          </div>

          {/* Lista de Productos */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {items.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-900 border border-neutral-800 mb-4">
                  <ShoppingBag className="h-8 w-8 text-neutral-600" />
                </div>
                <p className="font-display text-lg font-medium text-neutral-200">
                  Tu carrito está vacío
                </p>
                <p className="mt-1 text-xs text-neutral-500 max-w-[220px]">
                  Explora nuestro menú y agrega tus platos favoritos.
                </p>
                <Link href="/menu" onClick={closeCart}>
                  <Button className="mt-5 bg-amber-400 font-semibold text-neutral-950 hover:bg-amber-300 transition-colors">
                    Ver menú
                  </Button>
                </Link>
              </div>
            ) : (
              <ul className="space-y-4">
                {items.map((item) => {
                  // Le pasamos el item completo para buscar la imagen
                  const imageUrl = getImageUrl(item);

                  return (
                    <li
                      key={item.id}
                      className="group flex gap-4 rounded-2xl border border-neutral-800/80 bg-neutral-900/50 p-3.5 backdrop-blur-sm transition-all hover:border-neutral-700"
                    >
                      {/* Contenedor e Imagen del producto */}
                      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 flex items-center justify-center">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={item.product?.name ?? "Producto"}
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <ShoppingBag className="h-7 w-7 text-neutral-700" />
                        )}
                      </div>

                      {/* Detalles y Controles */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex justify-between gap-2">
                          <div>
                            <p className="text-sm font-semibold text-white line-clamp-1">
                              {item.product?.name ?? (item as any).name ?? "Producto"}
                            </p>
                            <p className="text-xs font-bold text-amber-400 mt-0.5">
                              S/ {Number(item.unitPrice ?? item.product?.price ?? 0).toFixed(2)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-neutral-500 hover:text-red-400 transition-colors p-1"
                            aria-label="Quitar del carrito"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          {/* Botones de + / - */}
                          <div className="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-950 p-1">
                            <button
                              onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                              className="rounded p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white disabled:opacity-30 transition-colors"
                              aria-label="Reducir cantidad"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-xs font-semibold text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateItem(item.id, item.quantity + 1)}
                              className="rounded p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white transition-colors"
                              aria-label="Aumentar cantidad"
                            >
                              <Plus size={12} />
                            </button>
                          </div>

                          <span className="text-xs font-medium text-neutral-400">
                            Subtotal:{" "}
                            <strong className="text-neutral-200">
                              S/ {(Number(item.unitPrice) * item.quantity).toFixed(2)}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Resumen y Botón de Pago */}
          {items.length > 0 && summary && (
            <div className="border-t border-neutral-800/80 bg-neutral-950 p-6 space-y-4">
              <div className="space-y-1.5 text-xs text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-neutral-200">S/ {summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>IGV (18%)</span>
                  <span className="text-neutral-200">S/ {summary.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span className="text-emerald-400 font-medium">
                    {summary.shipping === 0 ? "Gratis" : `S/ ${summary.shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between border-t border-neutral-800 pt-2 text-sm font-bold text-white">
                  <span>Total</span>
                  <span className="text-amber-400 text-base">S/ {summary.total.toFixed(2)}</span>
                </div>
              </div>

              <Link href="/checkout" onClick={closeCart} className="block w-full">
                <Button className="group w-full h-12 bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 font-bold hover:from-amber-300 hover:to-amber-400 transition-all duration-300 shadow-lg shadow-amber-500/10 rounded-xl flex items-center justify-center gap-2">
                  <span>Ir a pagar</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}