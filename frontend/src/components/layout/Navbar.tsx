"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChefHat,
  ShoppingBag,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useUiStore } from "@/store/ui.store";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/menu", label: "Menú" },
  { href: "/servicios", label: "Servicios" },
  { href: "/cotizar", label: "Cotizar" },
];

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const summary = useCartStore((state) => state.summary);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, openCart } = useUiStore();

  const [scrolled, setScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userMenuBtnRef = useRef<HTMLButtonElement>(null);

  const itemCount = summary?.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const isAdmin = user?.role ? String(user.role).toLowerCase().includes("admin") : false;

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsUserMenuOpen(false);
        userMenuBtnRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    closeMobileMenu();
    setIsUserMenuOpen(false);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`relative flex w-full max-w-5xl items-center justify-between gap-4 rounded-2xl border px-3 py-2 transition-all duration-300 ${
          scrolled
            ? "border-white/[0.08] bg-[#0c0c0d]/90 shadow-[0_8px_40px_-8px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
            : "border-white/[0.06] bg-[#141416]/60 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.4)] backdrop-blur-xl"
        }`}
      >
        {/* hairline top sheen for depth */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-amber-200/25 to-transparent"
        />

        {/* NAVEGACIÓN IZQUIERDA */}
        <nav aria-label="Navegación principal" className="hidden items-center gap-0.5 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative rounded-xl px-3.5 py-1.5 text-[13px] font-medium tracking-tight transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-300/50 ${
                  isActive ? "text-white" : "text-neutral-400 hover:text-neutral-100"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 rounded-xl border border-amber-300/10 bg-white/[0.08] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.06)]"
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* LOGO / MARCA */}
        <Link
          href="/"
          className="group relative flex items-center gap-2 rounded-full px-1 text-white focus-visible:outline-none"
        >
          <motion.span
            whileHover={{ rotate: -6, scale: 1.06 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-amber-300/20 to-amber-500/10 ring-1 ring-inset ring-amber-200/15"
          >
            <ChefHat className="h-3.5 w-3.5 stroke-[2.25] text-amber-200" />
          </motion.span>
          <span className="font-sans text-[13px] font-semibold tracking-[0.01em] text-white">
            DeParra<span className="text-amber-200">Spitz</span>
          </span>
        </Link>

        {/* CONTROLES DERECHA */}
        <div className="relative flex shrink-0 items-center gap-1.5">
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <motion.button
                ref={userMenuBtnRef}
                type="button"
                whileTap={{ scale: 0.96 }}
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                aria-haspopup="menu"
                aria-expanded={isUserMenuOpen}
                className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.04] px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:border-white/[0.1] hover:bg-white/[0.08]"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10">
                  <UserIcon className="h-3 w-3 text-neutral-300" />
                </span>
                <span className="max-w-[100px] truncate">{user?.fullName || "Cuenta"}</span>
                <ChevronDown
                  className={`h-3 w-3 text-neutral-500 transition-transform duration-200 ${
                    isUserMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </motion.button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    role="menu"
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.97 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-60 origin-top-right overflow-hidden rounded-2xl border border-white/[0.08] bg-[#161618] shadow-[0_20px_60px_-12px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
                  >
                    <div className="bg-white/[0.02] px-4 py-3">
                      <p className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
                        Sesión activa
                      </p>
                      <p className="mt-1 truncate text-[13px] font-semibold text-white">
                        {user?.fullName}
                      </p>
                      {isAdmin && (
                        <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-amber-300/20 bg-amber-300/10 px-2 py-0.5 text-[10px] font-bold text-amber-200">
                          <ShieldCheck className="h-3 w-3" /> Administrador
                        </span>
                      )}
                    </div>

                    <div className="h-px bg-white/[0.06]" />

                    <div className="p-1.5">
                      {isAdmin && (
                        <Link
                          role="menuitem"
                          href="/admin"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="mb-1 flex items-center gap-2.5 rounded-xl bg-amber-300/[0.08] px-3 py-2 text-[12px] font-semibold text-amber-200 transition-colors hover:bg-amber-300 hover:text-neutral-950"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Panel admin
                        </Link>
                      )}
                      <Link
                        role="menuitem"
                        href="/perfil"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[12px] font-medium text-neutral-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                      >
                        <UserIcon className="h-4 w-4 text-neutral-500" />
                        Mi perfil
                      </Link>
                    </div>

                    <div className="h-px bg-white/[0.06]" />

                    <div className="p-1.5">
                      <button
                        role="menuitem"
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-[12px] font-semibold text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                      >
                        <LogOut className="h-4 w-4" />
                        Cerrar sesión
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link href="/login" className="hidden sm:block">
              <motion.div whileTap={{ scale: 0.96 }}>
                <Button
                  size="sm"
                  className="h-8 rounded-xl bg-amber-200 px-4 text-[12px] font-semibold text-neutral-950 shadow-[0_1px_0_0_rgba(255,255,255,0.4)_inset] transition-all hover:bg-amber-100"
                >
                  Iniciar sesión
                </Button>
              </motion.div>
            </Link>
          )}

          <div className="mx-0.5 h-5 w-px bg-white/[0.08]" />

          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={openCart}
              aria-label={`Ver carrito${itemCount > 0 ? `, ${itemCount} productos` : ""}`}
              className="relative h-8 w-8 rounded-xl text-neutral-300 hover:bg-white/[0.08] hover:text-white"
            >
              <ShoppingBag className="h-4 w-4" />
              {itemCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-300 text-[9px] font-black text-neutral-950 ring-2 ring-[#141416]"
                >
                  {itemCount > 9 ? "9+" : itemCount}
                </motion.span>
              )}
            </Button>
          </motion.div>

          <motion.div whileTap={{ scale: 0.9 }} className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-xl text-neutral-300 hover:bg-white/[0.08]"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* OVERLAY + MENÚ MÓVIL */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute left-4 right-4 top-[72px] z-50 md:hidden"
            >
              <nav
                aria-label="Navegación móvil"
                className="flex flex-col gap-1 rounded-2xl border border-white/[0.08] bg-[#141416]/95 p-3 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
              >
                {NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMobileMenu}
                      aria-current={isActive ? "page" : undefined}
                      className={`rounded-xl px-4 py-2.5 text-[13px] font-medium transition-colors ${
                        isActive
                          ? "bg-white/[0.08] text-white"
                          : "text-neutral-400 hover:bg-white/[0.05] hover:text-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}

                <div className="my-1.5 h-px bg-white/[0.08]" />

                {!isAuthenticated ? (
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="rounded-xl bg-amber-200 px-4 py-2.5 text-center text-[13px] font-semibold text-neutral-950"
                  >
                    Iniciar sesión
                  </Link>
                ) : (
                  <>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-2 rounded-xl bg-amber-300/[0.1] px-4 py-2.5 text-[13px] font-bold text-amber-200"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Panel admin
                      </Link>
                    )}
                    <Link
                      href="/perfil"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-medium text-neutral-300 hover:bg-white/[0.05]"
                    >
                      <UserIcon className="h-4 w-4 text-neutral-500" />
                      Mi perfil
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        closeMobileMenu();
                        handleLogout();
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-semibold text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar sesión
                    </button>
                  </>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}