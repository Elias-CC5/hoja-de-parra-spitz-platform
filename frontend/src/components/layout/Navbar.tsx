"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Menu, ShoppingBag, User, X } from "lucide-react";
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
  const { user, isAuthenticated } = useAuthStore();
  const summary = useCartStore((state) => state.summary);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, openCart } = useUiStore();

  const itemCount = summary?.cart.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated, fetchCart]);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-display text-xl font-semibold tracking-tight">
          Hoja de Parra <span className="text-accent">Spitz</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-accent"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={openCart} aria-label="Ver carrito" className="relative">
            <ShoppingBag />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-accent-foreground">
                {itemCount}
              </span>
            )}
          </Button>

          {isAuthenticated ? (
            <Link href="/perfil">
              <Button variant="ghost" size="icon" aria-label="Mi perfil">
                <User />
              </Button>
            </Link>
          ) : (
            <Link href="/login" className="hidden sm:block">
              <Button variant="outline" size="sm">Iniciar sesión</Button>
            </Link>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Menú"
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <nav className="flex flex-col gap-1 border-t border-border bg-background px-4 py-3 md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMobileMenu}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
            >
              {link.label}
            </Link>
          ))}
          {!isAuthenticated && (
            <Link
              href="/login"
              onClick={closeMobileMenu}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
            >
              Iniciar sesión
            </Link>
          )}
          {user && (
            <Link
              href="/perfil"
              onClick={closeMobileMenu}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-secondary"
            >
              Mi perfil
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
