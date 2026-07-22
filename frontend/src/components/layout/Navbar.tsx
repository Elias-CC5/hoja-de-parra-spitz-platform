"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { 
  ChevronDown, 
  ChefHat, 
  Moon, 
  ShoppingBag, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X,
  ShieldCheck,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useUiStore } from "@/store/ui.store";

const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/menu", label: "Menú" },
  { href: "/servicios", label: "Reservas" },
  { href: "/cotizar", label: "Cotizar evento" },
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

  const itemCount = summary?.cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  // Verificar en consola los datos del usuario para depuración
  useEffect(() => {
    if (user) {
      console.log("🔥 Navbar User Data:", user);
      console.log("🔥 User Role:", user?.role);
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsUserMenuOpen(false);
    await logout();
  };

  // Comprobación segura de si el usuario es Admin
  const isAdmin = user?.role ? String(user.role).toLowerCase().includes("admin") : false;

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <div
        className={`relative flex w-full max-w-6xl items-center justify-between gap-4 rounded-full border border-neutral-800/90 bg-neutral-950/90 px-4 py-2.5 backdrop-blur-2xl transition-all duration-300 ${
          scrolled ? "shadow-2xl shadow-black/60 border-neutral-700/80" : "shadow-lg shadow-black/30"
        }`}
      >
        {/* LOGO & BRAND */}
        <Link
          href="/"
          className="group relative flex shrink-0 items-center gap-3 rounded-full px-1 focus:outline-none"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-neutral-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-transform group-hover:scale-105">
            <ChefHat className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-lg font-bold tracking-tight text-white leading-none">
              DeParra<span className="text-amber-400">Spitz</span>
            </span>
            <span className="mt-1 text-[9px] font-bold tracking-widest text-amber-500 uppercase">
              Catering & Eventos
            </span>
          </div>
        </Link>

        {/* NAVEGACIÓN CENTRAL */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-amber-400 text-neutral-950 shadow-[0_0_20px_rgba(251,191,36,0.4)] scale-105"
                    : "text-neutral-300 hover:text-white hover:bg-neutral-900/80"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CONTROLES DERECHA */}
        <div className="relative flex shrink-0 items-center gap-2">
          {/* Botón Modo Noche */}
          <button
            aria-label="Cambiar tema"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-900 text-amber-400 border border-neutral-800 transition-colors hover:bg-neutral-800 hover:text-amber-300"
          >
            <Moon className="h-4 w-4" />
          </button>

          <div className="h-4 w-px bg-neutral-800 mx-0.5 hidden sm:block" />

          {/* MENÚ DE USUARIO AUTENTICADO */}
          {isAuthenticated ? (
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/80 px-3 py-1.5 text-sm font-medium text-neutral-200 transition-all hover:border-neutral-700 hover:bg-neutral-800 hover:text-white"
              >
                <UserIcon className="h-4 w-4 text-amber-400" />
                <span className="max-w-[110px] truncate">{user?.fullName || "Mi Cuenta"}</span>
                <ChevronDown className={`h-3.5 w-3.5 text-neutral-400 transition-transform duration-200 ${isUserMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* DROPDOWN MENU */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-3 w-56 animate-in fade-in zoom-in-95 duration-150 rounded-2xl border border-neutral-800 bg-neutral-950 p-2 shadow-2xl shadow-black/80 backdrop-blur-2xl">
                  {/* Encabezado con Info de Usuario */}
                  <div className="px-3 py-2 border-b border-neutral-800/80">
                    <p className="text-[10px] font-bold tracking-wider text-neutral-500 uppercase">
                      Sesión Activa
                    </p>
                    <p className="text-sm font-semibold text-white truncate mt-0.5">
                      {user?.fullName}
                    </p>
                    
                    {/* Badge de Administrador */}
                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 mt-1.5 rounded-full bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 border border-amber-400/20">
                        <ShieldCheck className="h-3 w-3" /> Administrador
                      </span>
                    )}
                  </div>

                  {/* Opciones del Menú */}
                  <div className="py-1">
                    {/* Botón exclusivo para Admin */}
                    {isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl bg-amber-400/10 px-3 py-2 text-sm font-bold text-amber-400 transition-colors hover:bg-amber-400 hover:text-neutral-950 my-1"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Panel Admin
                      </Link>
                    )}

                    <Link
                      href="/perfil"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-900 hover:text-white"
                    >
                      <UserIcon className="h-4 w-4 text-neutral-400" />
                      Mi Perfil
                    </Link>
                  </div>

                  {/* Botón de Cerrar Sesión */}
                  <div className="border-t border-neutral-800/80 pt-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                    >
                      <LogOut className="h-4 w-4" />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="hidden sm:block">
              <Button
                size="sm"
                className="rounded-full bg-amber-400 px-5 font-bold text-neutral-950 shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:bg-amber-300 transition-all"
              >
                Iniciar sesión
              </Button>
            </Link>
          )}

          {/* BOTÓN CARRITO */}
          <Button
            variant="ghost"
            size="icon"
            onClick={openCart}
            aria-label="Ver carrito"
            className="relative rounded-full border border-neutral-800 bg-neutral-900 text-neutral-200 hover:bg-neutral-800 hover:text-white"
          >
            <ShoppingBag className="h-4 w-4" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[10px] font-extrabold text-neutral-950 shadow-[0_0_10px_rgba(251,191,36,0.6)]">
                {itemCount}
              </span>
            )}
          </Button>

          {/* MENÚ MÓVIL HAMBURGUESA */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-neutral-300 hover:bg-neutral-800 md:hidden"
            onClick={toggleMobileMenu}
            aria-label="Menú"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* MENÚ DESPLEGABLE MÓVIL */}
      {isMobileMenuOpen && (
        <div className="absolute left-4 right-4 top-[76px] animate-in fade-in slide-in-from-top-3 duration-200 md:hidden">
          <nav className="flex flex-col gap-1 rounded-3xl border border-neutral-800 bg-neutral-950/95 p-3 shadow-2xl shadow-black/80 backdrop-blur-2xl">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold transition-colors ${
                    isActive
                      ? "bg-amber-400 text-neutral-950"
                      : "text-neutral-300 hover:bg-neutral-900 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="my-1 h-px bg-neutral-800" />

            {!isAuthenticated ? (
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="rounded-2xl bg-amber-400 px-4 py-3 text-center text-sm font-bold text-neutral-950"
              >
                Iniciar sesión
              </Link>
            ) : (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-2 rounded-2xl bg-amber-400/10 px-4 py-3 text-sm font-bold text-amber-400"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Panel Admin
                  </Link>
                )}
                <Link
                  href="/perfil"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-neutral-300 hover:bg-neutral-900"
                >
                  <UserIcon className="h-4 w-4 text-amber-400" />
                  Mi Perfil
                </Link>
                <button
                  onClick={() => {
                    closeMobileMenu();
                    handleLogout();
                  }}
                  className="flex w-full items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Cerrar Sesión
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}