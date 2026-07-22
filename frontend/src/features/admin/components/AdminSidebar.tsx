"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShoppingBag, 
  FileText, 
  CalendarDays, 
  Package, 
  FolderTree, // 👈 Nuevo icono para Categorías
  ShieldCheck,
  TrendingUp 
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingBag },
  { href: "/admin/cotizaciones", label: "Cotizaciones", icon: FileText },
  { href: "/admin/reservas", label: "Reservas", icon: CalendarDays },
  { href: "/admin/productos", label: "Productos", icon: Package },
  { href: "/admin/categorias", label: "Categorías", icon: FolderTree }, // 👈 Agregado aquí
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-60 shrink-0">
      <div className="sticky top-28 rounded-3xl border border-neutral-800/80 bg-neutral-950/80 p-4 backdrop-blur-2xl shadow-xl shadow-black/50">
        
        {/* Cabecera del Sidebar */}
        <div className="flex items-center gap-3 px-2 py-1 mb-4 border-b border-neutral-800/80 pb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-400/10 text-amber-400 border border-amber-400/20 shadow-inner">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-white">Panel Admin</h2>
            <p className="text-[11px] text-amber-400/80 font-medium">DeParraSpitz</p>
          </div>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-gradient-to-r from-amber-400 to-amber-500 text-neutral-950 shadow-[0_0_20px_rgba(251,191,36,0.3)] scale-[1.02]"
                    : "text-neutral-400 hover:bg-neutral-900 hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${isActive ? "text-neutral-950" : "text-amber-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Status */}
        <div className="mt-6 rounded-2xl border border-neutral-800/60 bg-neutral-900/40 p-3">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-emerald-400">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Sistema Online</span>
          </div>
        </div>

      </div>
    </aside>
  );
}