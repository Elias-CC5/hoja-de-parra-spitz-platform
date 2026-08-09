"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Loader2, 
  AlertCircle, 
  ShoppingBag,
  Send,
  UtensilsCrossed
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart.store";
import { api } from "@/lib/axios";

// URL base del backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Helper universal para formatear cualquier URL de imagen
const formatImageUrl = (url: string | null | undefined): string | null => {
  if (!url || typeof url !== "string") return null;
  const cleanUrl = url.trim();
  if (!cleanUrl) return null;

  if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://") || cleanUrl.startsWith("data:")) {
    return cleanUrl;
  }

  const cleanPath = cleanUrl.startsWith("/") ? cleanUrl : `/${cleanUrl}`;
  return `${API_BASE_URL.replace(/\/$/, "")}${cleanPath}`;
};

// Extrae la imagen del objeto item/product
const getImageUrlFromObject = (obj: any): string | null => {
  if (!obj) return null;

  const product = obj.product || obj;

  const images = product.images || obj.images || product.productImages;
  if (Array.isArray(images) && images.length > 0) {
    for (const img of images) {
      if (typeof img === "string") return formatImageUrl(img);
      if (img?.url) return formatImageUrl(img.url);
      if (img?.path) return formatImageUrl(img.path);
      if (img?.imageUrl) return formatImageUrl(img.imageUrl);
      if (img?.filename) return formatImageUrl(`/uploads/${img.filename}`);
    }
  }

  const possibleProps = [
    product.imageUrl,
    product.image,
    product.url,
    product.photo,
    product.photoUrl,
    product.coverImage,
    product.mainImage,
    obj.imageUrl,
    obj.image,
    obj.productImage
  ];

  for (const prop of possibleProps) {
    if (typeof prop === "string" && prop.trim().length > 0) {
      return formatImageUrl(prop);
    }
  }

  return null;
};

export function CheckoutForm() {
  const router = useRouter();
  const { summary, fetchCart } = useCartStore();
  const [step, setStep] = useState<"form" | "success">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [productImagesMap, setProductImagesMap] = useState<Record<string, string>>({});

  const PHONE_NUMBER = "51994222690";

  useEffect(() => {
    const loadMissingImages = async () => {
      if (!summary?.cart?.items) return;

      const newMap: Record<string, string> = {};

      for (const item of summary.cart.items) {
        const productId = item.productId || item.product?.id || item.id;
        
        const directImage = getImageUrlFromObject(item);
        if (directImage) {
          if (productId) newMap[productId] = directImage;
          continue;
        }

        if (productId) {
          try {
            const productData = await api.get<never, any>(`/products/${productId}`);
            const fetchedImg = getImageUrlFromObject(productData);
            if (fetchedImg) {
              newMap[productId] = fetchedImg;
            }
          } catch {
            // Ignorar errores individuales
          }
        }
      }

      if (Object.keys(newMap).length > 0) {
        setProductImagesMap((prev) => ({ ...prev, ...newMap }));
      }
    };

    loadMissingImages();
  }, [summary]);

  const handleSendWhatsApp = async () => {
    setErrorMessage(null);

    if (!summary || !summary.cart?.items || summary.cart.items.length === 0) {
      setErrorMessage("Tu carrito está vacío.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Formatear la lista de productos sin links de imágenes
      const itemsList = summary.cart.items
        .map((item: any) => {
          const rawItem = item || {};
          const product = rawItem.product || {};

          const unitPrice = Number(rawItem.price ?? product.price ?? rawItem.unitPrice ?? 0);
          const quantity = Number(rawItem.quantity ?? 1);
          const productName = product.name || rawItem.name || "Producto";

          return `- *${productName}* (x${quantity}) - S/ ${(unitPrice * quantity).toFixed(2)}`;
        })
        .join("\n");

      const subtotal = Number(summary.subtotal ?? 0);
      const tax = Number(summary.tax ?? 0);
      const shipping = Number(summary.shipping ?? 0);
      const total = Number(summary.total ?? 0);

      // Estructura limpia estilo Ticket/Cotización
      const message = 
        `*SOLICITUD DE PEDIDO - DEPARRASPITZ*\n` +
        `=================================\n` +
        `Hola, me gustaría confirmar el siguiente pedido para mi evento:\n\n` +
        `*DETALLE DE PRODUCTOS:*\n` +
        `${itemsList}\n\n` +
        `*RESUMEN DE PAGO:*\n` +
        `- *Subtotal:* S/ ${subtotal.toFixed(2)}\n` +
        `- *IGV (18%):* S/ ${tax.toFixed(2)}\n` +
        `- *Costo de Envío:* ${shipping === 0 ? "Gratis" : `S/ ${shipping.toFixed(2)}`}\n` +
        `- *Total a Pagar:* S/ ${total.toFixed(2)}\n` +
        `=================================\n` +
        `Quedo a la espera de sus comentarios para coordinar el pago. ¡Muchas gracias!`;

      const whatsappUrl = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, "_blank");

      setStep("success");
      await fetchCart();

    } catch {
      setErrorMessage("Ocurrió un problema al redirigir a WhatsApp.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- ESTADO: PEDIDO COMPLETADO ---
  if (step === "success") {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-emerald-500/30 bg-neutral-900/60 p-8 text-center backdrop-blur-xl shadow-2xl max-w-lg mx-auto"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-4">
          <Send className="h-8 w-8" />
        </div>
        <h2 className="font-display text-2xl font-bold text-white">¡Pedido Redirigido a WhatsApp!</h2>
        <p className="mt-2 text-sm text-neutral-400 max-w-md mx-auto">
          Hemos abierto una conversación para coordinar los detalles finales de tu pedido.
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
  if (!summary || !summary.cart?.items || summary.cart.items.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-neutral-800 bg-neutral-900/50 p-12 text-center text-neutral-400 backdrop-blur-md max-w-md mx-auto"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-800/80 text-neutral-500 mb-3">
          <ShoppingBag className="h-7 w-7" />
        </div>
        <p className="text-base font-medium text-neutral-300">Tu carrito está vacío</p>
        <p className="text-xs text-neutral-500 mt-1">Agrega productos del menú para finalizar tu compra.</p>
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

  // --- VISTA PRINCIPAL ---
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="grid gap-8 lg:grid-cols-12"
    >
      {/* COLUMNA IZQUIERDA: Ítems */}
      <div className="space-y-6 lg:col-span-7">
        <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-6 backdrop-blur-md space-y-5">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-neutral-800/80 pb-4">
            <UtensilsCrossed className="h-5 w-5 text-amber-400" />
            Productos de tu Pedido
          </h2>

          <div className="divide-y divide-neutral-800/60 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">
            {summary.cart.items.map((item: any, index: number) => {
              const rawItem = item || {};
              const product = rawItem.product || {};
              const productId = rawItem.productId || product.id || rawItem.id;

              const imageUrl = getImageUrlFromObject(rawItem) || productImagesMap[productId] || null;

              const price = Number(rawItem.price ?? product.price ?? rawItem.unitPrice ?? 0);
              const qty = Number(rawItem.quantity ?? 1);
              const itemTotal = price * qty;
              const productName = product.name || rawItem.name || "Producto";

              return (
                <div key={rawItem.id || `cart-item-${index}`} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                  {/* Contenedor de Imagen */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 flex items-center justify-center">
                    {imageUrl ? (
                      <img 
                        src={imageUrl} 
                        alt={productName} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://placehold.co/100x100/171717/F59E0B?text=Sin+Foto";
                        }}
                      />
                    ) : (
                      <span className="text-[10px] text-amber-400 font-semibold text-center px-1">
                        Sin Foto
                      </span>
                    )}
                  </div>

                  {/* Detalle del producto */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white truncate capitalize">
                      {productName}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-1">
                      Cantidad: <span className="text-amber-400 font-semibold">{qty}</span>
                    </p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Precio unitario: S/ {price.toFixed(2)}
                    </p>
                  </div>

                  {/* Subtotal por ítem */}
                  <div className="text-right">
                    <span className="text-sm font-bold text-white">
                      S/ {itemTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

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

      {/* COLUMNA DERECHA: Resumen */}
      <div className="space-y-6 lg:col-span-5">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-xl shadow-xl space-y-5">
          <h3 className="text-base font-semibold text-white flex items-center justify-between border-b border-neutral-800/80 pb-4">
            <span>Resumen del Pedido</span>
            <span className="text-xs text-neutral-400 font-normal">
              {summary.cart.items.length} {summary.cart.items.length === 1 ? "ítem" : "ítems"}
            </span>
          </h3>

          <div className="space-y-3 text-sm text-neutral-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-neutral-200">S/ {Number(summary.subtotal ?? 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>IGV (18%)</span>
              <span className="text-neutral-200">S/ {Number(summary.tax ?? 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Costo de Envío</span>
              <span className="text-emerald-400 font-medium">
                {Number(summary.shipping ?? 0) === 0 ? "Gratis" : `S/ ${Number(summary.shipping).toFixed(2)}`}
              </span>
            </div>

            <div className="border-t border-neutral-800 pt-3 flex justify-between items-baseline">
              <span className="font-semibold text-white">Total a pagar</span>
              <span className="font-display text-2xl font-bold text-amber-400">
                S/ {Number(summary.total ?? 0).toFixed(2)}
              </span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleSendWhatsApp}
            size="lg"
            className="group w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all duration-300 shadow-lg shadow-emerald-600/20 rounded-xl flex items-center justify-center gap-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Generando pedido...</span>
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                <span>Completar pedido por WhatsApp</span>
              </>
            )}
          </Button>

          <p className="text-[11px] text-center text-neutral-500">
            🟢 Serás redirigido a WhatsApp para confirmar los detalles
          </p>
        </div>
      </div>
    </motion.div>
  );
}