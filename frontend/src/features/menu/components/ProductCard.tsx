"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Plus, Sparkles, Eye, Check, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAddToCart } from "@/features/cart/hooks/useAddToCart";
import type { Product } from "@/types";

const PLACEHOLDER_IMAGE = "/product-placeholder.svg";

function ProductQuickView({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const { addToCart, isAdding } = useAddToCart();
  const isLoadingThis = isAdding === product.id;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Monta con un frame de diferencia para poder animar la entrada.
    const raf = requestAnimationFrame(() => setMounted(true));
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative z-10 grid w-full max-w-4xl grid-cols-1 overflow-hidden rounded-[28px] bg-neutral-950 ring-1 ring-neutral-800 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9)] transition-all duration-300 md:grid-cols-2 ${
          mounted ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
        }`}
      >
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-neutral-950/70 text-neutral-300 ring-1 ring-white/10 backdrop-blur-md transition-colors hover:text-amber-400 md:right-4 md:top-4"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Imagen */}
        <div className="relative aspect-square w-full bg-stone-950 md:aspect-auto">
          <Image
            src={product.images?.[0]?.url ?? PLACEHOLDER_IMAGE}
            alt={product.name}
            fill
            unoptimized={true}
            className="object-cover"
          />
          {product.isFeatured && (
            <Badge className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-gradient-to-b from-amber-400 to-amber-500 text-stone-950 px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-lg">
              <Sparkles className="h-3 w-3 fill-stone-950" />
              Especialidad
            </Badge>
          )}
        </div>

        {/* Detalle */}
        <div className="flex flex-col justify-between p-6 sm:p-8">
          <div>
            {product.category?.name && (
              <span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.25em] text-amber-400/80">
                {product.category.name}
              </span>
            )}
            <h2 className="font-serif text-2xl font-bold text-white tracking-tight leading-snug capitalize">
              {product.name}
            </h2>

            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-sm font-bold text-amber-400">S/</span>
              <span className="text-2xl font-black text-white tracking-tight">
                {Number(product.price).toFixed(2)}
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-stone-400">
              {product.description}
            </p>

            {product.minPeoplePerOrder && (
              <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-neutral-900 ring-1 ring-neutral-800 px-3.5 py-2 text-xs text-neutral-300">
                <Users className="h-3.5 w-3.5 text-amber-400" />
                <span>
                  Ración para <strong className="text-white">{product.minPeoplePerOrder}</strong>
                  {product.maxPeoplePerOrder ? ` a ${product.maxPeoplePerOrder}` : ""} persona(s)
                </span>
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-neutral-800/70 pt-6">
            <Button
              onClick={() => addToCart(product.id)}
              disabled={isLoadingThis}
              className={`h-11 w-full rounded-2xl font-bold transition-all duration-300 gap-1.5 active:scale-[0.97] ${
                isLoadingThis
                  ? "bg-stone-800 text-stone-400 ring-1 ring-stone-700"
                  : "bg-gradient-to-b from-amber-400 to-amber-500 text-stone-950 shadow-[0_10px_24px_-6px_rgba(245,158,11,0.5)] hover:brightness-105"
              }`}
            >
              {isLoadingThis ? (
                <>
                  <Check className="h-4 w-4 animate-bounce" />
                  <span className="text-xs">Agregado</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 stroke-[3]" />
                  <span className="text-xs">Agregar al carrito</span>
                </>
              )}
            </Button>

            <Link
              href={`/menu/${product.slug}`}
              className="text-center text-xs font-semibold text-neutral-500 transition-colors hover:text-amber-400"
            >
              Ver página completa del producto
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, isAdding } = useAddToCart();
  const isLoadingThis = isAdding === product.id;
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, glareX: 50, glareY: 50 });

  // Sutil tilt 3D que sigue el cursor — el "signature" de la card.
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const ry = (px - 0.5) * 10; // rotación eje Y
    const rx = (0.5 - py) * 8; // rotación eje X
    setTilt({ rx, ry, glareX: px * 100, glareY: py * 100 });
  }

  function handleMouseLeave() {
    setTilt({ rx: 0, ry: 0, glareX: 50, glareY: 50 });
  }

  return (
    <div
      className="group [perspective:1200px]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={cardRef}
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateZ(0)`,
          transition: "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        className="relative flex flex-col justify-between overflow-hidden rounded-[28px] bg-gradient-to-b from-stone-900 to-stone-950 [transform-style:preserve-3d] shadow-[0_1px_0_rgba(255,255,255,0.06)_inset,0_30px_60px_-20px_rgba(0,0,0,0.7),0_10px_20px_-8px_rgba(0,0,0,0.5)] ring-1 ring-stone-800/70 transition-shadow duration-500 group-hover:shadow-[0_1px_0_rgba(255,255,255,0.08)_inset,0_45px_80px_-20px_rgba(0,0,0,0.8),0_0_0_1px_rgba(245,158,11,0.25),0_0_40px_-5px_rgba(245,158,11,0.25)]"
      >
        {/* Glare dinámico que sigue el cursor, da sensación de superficie real */}
        <div
          className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.10), transparent 45%)`,
          }}
        />

        {/* Borde superior dorado, delgado, como filo de plato */}
        <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />

        {/* --- IMAGEN --- */}
        <div className="relative" style={{ transform: "translateZ(20px)" }}>
          <button
            type="button"
            onClick={() => setQuickViewOpen(true)}
            aria-label={`Vista rápida de ${product.name}`}
            className="relative block aspect-[4/3] w-full overflow-hidden bg-stone-950 text-left"
          >
            <Image
              src={product.images?.[0]?.url ?? PLACEHOLDER_IMAGE}
              alt={product.name}
              fill
              unoptimized={true}
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
            />

            {/* Viñeta + degradado hacia el cuerpo, más profundo en los bordes */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/10 to-transparent" />
            <div className="absolute inset-0 shadow-[inset_0_0_60px_20px_rgba(0,0,0,0.55)]" />

            {product.isFeatured && (
              <Badge className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-gradient-to-b from-amber-400 to-amber-500 text-stone-950 px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow-[0_6px_16px_-4px_rgba(245,158,11,0.6),inset_0_1px_0_rgba(255,255,255,0.5)]">
                <Sparkles className="h-3 w-3 fill-stone-950" />
                Especialidad
              </Badge>
            )}

            {/* Precio flotante sobre la imagen, tipo etiqueta de plato de autor */}
            <div className="absolute right-4 bottom-4 flex items-baseline gap-1 rounded-2xl bg-stone-950/70 px-3 py-1.5 backdrop-blur-md ring-1 ring-white/10 shadow-lg">
              <span className="text-[10px] font-bold text-amber-400">S/</span>
              <span className="text-lg font-black text-white tracking-tight">
                {Number(product.price).toFixed(2)}
              </span>
            </div>

            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-stone-950/85 ring-1 ring-amber-400/30 px-4 py-2 text-xs font-semibold text-stone-100 backdrop-blur-md shadow-2xl translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <Eye className="h-3.5 w-3.5 text-amber-400" />
                Ver detalle
              </span>
            </div>
          </button>
        </div>

        {/* --- CUERPO --- */}
        <div
          className="flex flex-1 flex-col justify-between p-6 pt-5"
          style={{ transform: "translateZ(30px)" }}
        >
          <div>
            {product.category?.name && (
              <span className="mb-1.5 block text-[10px] font-extrabold uppercase tracking-[0.25em] text-amber-400/80">
                {product.category.name}
              </span>
            )}

            <Link href={`/menu/${product.slug}`}>
              <h3 className="font-serif text-xl font-bold text-white tracking-tight leading-snug capitalize transition-colors group-hover:text-amber-300">
                {product.name}
              </h3>
            </Link>

            <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-stone-400">
              {product.description}
            </p>
          </div>

          {/* --- ACCIÓN --- */}
          <div className="mt-6 flex items-center justify-end border-t border-stone-800/70 pt-4">
            <Button
              size="sm"
              onClick={() => addToCart(product.id)}
              disabled={isLoadingThis}
              aria-label={`Agregar ${product.name} al carrito`}
              className={`h-11 w-full rounded-2xl font-bold transition-all duration-300 gap-1.5 active:scale-[0.97] ${
                isLoadingThis
                  ? "bg-stone-800 text-stone-400 ring-1 ring-stone-700"
                  : "bg-gradient-to-b from-amber-400 to-amber-500 text-stone-950 shadow-[0_10px_24px_-6px_rgba(245,158,11,0.5),inset_0_1px_0_rgba(255,255,255,0.4)] hover:shadow-[0_14px_30px_-6px_rgba(245,158,11,0.65),inset_0_1px_0_rgba(255,255,255,0.5)] hover:brightness-105"
              }`}
            >
              {isLoadingThis ? (
                <>
                  <Check className="h-4 w-4 animate-bounce" />
                  <span className="text-xs">Agregado</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 stroke-[3]" />
                  <span className="text-xs">Agregar al carrito</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {quickViewOpen && (
        <ProductQuickView product={product} onClose={() => setQuickViewOpen(false)} />
      )}
    </div>
  );
}