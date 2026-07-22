"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Flame, Menu, ShoppingBag, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useUiStore } from "@/store/ui.store";

const NAV_LINKS = [
  { href: "/menu", label: "Menú" },
  { href: "/servicios", label: "Servicios" },
  { href: "/cotizar", label: "Cotizar evento" },
  { href: "/contacto", label: "Contacto" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();
  const summary = useCartStore((state) => state.summary);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, openCart } = useUiStore();

  const [scrolled, setScrolled] = useState(false);
  const itemCount = summary?.cart.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <div
        className={`relative flex w-full max-w-6xl items-center justify-between gap-4 rounded-full border border-stone-800/80 bg-stone-950/80 px-3 py-2 backdrop-blur-xl transition-all duration-300 ${
          scrolled ? "shadow-xl shadow-black/40 border-stone-800" : "shadow-md shadow-black/20"
        }`}
      >
        {/* Glow sutil de fondo dentro de la píldora */}
        <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-amber-600/[0.04] via-transparent to-orange-700/[0.04]" />

        {/* Logo */}
        <Link
          href="/"
          className="relative flex shrink-0 items-center gap-2 rounded-full px-2 font-display text-lg font-semibold tracking-tight text-white"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-700 shadow-[0_0_16px_-2px_rgba(249,115,22,0.6)]">
            <Flame className="h-4 w-4 text-stone-950" fill="currentColor" strokeWidth={1.5} />
          </span>
          <span className="hidden sm:inline">
            Hoja de Parra <span className="text-amber-400">Spitz</span>
          </span>
        </Link>

        {/* Nav central (píldora interna con indicador activo) */}
        <nav className="relative hidden items-center gap-1 rounded-full bg-stone-900/70 p-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-gradient-to-r from-amber-500 to-orange-600 text-stone-950 shadow-[0_0_12px_-2px_rgba(249,115,22,0.5)]"
                    : "text-stone-400 hover:bg-stone-800/80 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Acciones derecha */}
        <div className="relative flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={openCart}
            aria-label="Ver carrito"
            className="relative rounded-full text-stone-300 hover:bg-stone-800/80 hover:text-white"
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
            {itemCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-[10px] font-semibold text-stone-950">
                {itemCount}
              </span>
            )}
          </Button>

          {isAuthenticated ? (
            <Link href="/perfil">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Mi perfil"
                className="rounded-full text-stone-300 hover:bg-stone-800/80 hover:text-white"
              >
                <User className="h-[18px] w-[18px]" />
              </Button>
            </Link>
          ) : (
            <Link href="/login" className="hidden sm:block">
              <Button
                size="sm"
                className="ml-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-4 font-semibold text-stone-950 shadow-[0_0_14px_-3px_rgba(249,115,22,0.6)] hover:brightness-110 transition-all"
              >
                Iniciar sesión
              </Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-stone-300 hover:bg-stone-800/80 hover:text-white md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Menú"
          >
            {isMobileMenuOpen ? <X className="h-[18px] w-[18px]" /> : <Menu className="h-[18px] w-[18px]" />}
          </Button>
        </div>
      </div>

      {/* Menú mobile: dropdown tipo card debajo de la píldora */}
      {isMobileMenuOpen && (
        <div className="absolute left-4 right-4 top-[72px] animate-in fade-in slide-in-from-top-2 duration-200 md:hidden">
          <nav className="flex flex-col gap-1 rounded-3xl border border-stone-800/80 bg-stone-950/95 p-3 shadow-2xl shadow-black/40 backdrop-blur-xl">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-amber-500 to-orange-600 text-stone-950"
                      : "text-stone-300 hover:bg-stone-800/80 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="my-1 h-px bg-stone-800" />

            {!isAuthenticated && (
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-stone-300 hover:bg-stone-800/80 hover:text-white"
              >
                Iniciar sesión
              </Link>
            )}
            {user && (
              <Link
                href="/perfil"
                onClick={closeMobileMenu}
                className="rounded-2xl px-4 py-3 text-sm font-medium text-stone-300 hover:bg-stone-800/80 hover:text-white"
              >
                Mi perfil
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}