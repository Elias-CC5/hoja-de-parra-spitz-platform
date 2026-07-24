"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { useAuthStore } from "@/store/auth.store";
import { OrderHistory } from "@/features/profile/components/OrderHistory";
import { ReservationHistory } from "@/features/profile/components/ReservationHistory";
import { QuotationHistory } from "@/features/profile/components/QuotationHistory";
import { FavoritesList } from "@/features/profile/components/FavoritesList";
import { EditProfileForm } from "@/features/profile/components/EditProfileForm";
import { 
  ShoppingBag, 
  CalendarCheck, 
  FileText, 
  Heart, 
  User, 
  Mail,
  Sparkles,
  ShieldCheck
} from "lucide-react";

const TABS = [
  { value: "orders", label: "Pedidos", icon: ShoppingBag },
  { value: "reservations", label: "Reservas", icon: CalendarCheck },
  { value: "quotations", label: "Cotizaciones", icon: FileText },
  { value: "favorites", label: "Favoritos", icon: Heart },
  { value: "profile", label: "Mi Cuenta", icon: User },
];

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  // Formatear Iniciales
  const getInitials = (name?: string) => {
    if (!name) return "WC";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  // Capitalizar el nombre (ej. "will" -> "Will")
  const formatName = (name?: string) => {
    if (!name) return "Cliente";
    const firstName = name.split(" ")[0];
    return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pt-28 pb-16 sm:px-6 lg:px-8">
      
      {/* 👑 TARJETA HERO DE PERFIL LUXURY */}
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-amber-500/20 bg-neutral-900/60 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl" />
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* Avatar con Anillo Dorado */}
            <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-amber-400/40 bg-gradient-to-br from-neutral-800 to-neutral-950 text-2xl font-bold tracking-wider text-amber-400 shadow-xl">
              {getInitials(user?.fullName)}
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-neutral-950 ring-2 ring-neutral-900">
                <ShieldCheck className="h-3.5 w-3.5" />
              </span>
            </div>

            {/* Datos del Cliente */}
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-400 border border-amber-400/20">
                  <Sparkles className="h-3 w-3" /> Cliente DeParraSpitz
                </span>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
                ¡Hola, {formatName(user?.fullName)}!
              </h1>

              {user?.email && (
                <p className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-neutral-400">
                  <Mail className="h-3.5 w-3.5 text-neutral-500" />
                  <span>{user.email}</span>
                </p>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* 🗂️ SISTEMA DE PESTAÑAS MODERNAS */}
      <Tabs.Root defaultValue="orders" className="space-y-6">
        
        {/* Barra Nav con cápsulas de selección */}
        <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-1.5 backdrop-blur-sm">
          <Tabs.List className="flex overflow-x-auto gap-1 scrollbar-none">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <Tabs.Trigger
                  key={tab.value}
                  value={tab.value}
                  className="group flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs sm:text-sm font-medium text-neutral-400 transition-all duration-200 hover:text-amber-400 hover:bg-neutral-800/50 data-[state=active]:bg-amber-400 data-[state=active]:text-neutral-950 data-[state=active]:font-semibold data-[state=active]:shadow-lg data-[state=active]:shadow-amber-400/10"
                >
                  <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </Tabs.Trigger>
              );
            })}
          </Tabs.List>
        </div>

        {/* CONTENEDOR DE CONTENIDO */}
        <div className="rounded-2xl border border-neutral-800/60 bg-neutral-900/20 p-6 min-h-[320px]">
          <Tabs.Content value="orders" className="focus-visible:outline-none">
            <OrderHistory />
          </Tabs.Content>

          <Tabs.Content value="reservations" className="focus-visible:outline-none">
            <ReservationHistory />
          </Tabs.Content>

          <Tabs.Content value="quotations" className="focus-visible:outline-none">
            <QuotationHistory />
          </Tabs.Content>

          <Tabs.Content value="favorites" className="focus-visible:outline-none">
            <FavoritesList />
          </Tabs.Content>

          <Tabs.Content value="profile" className="focus-visible:outline-none">
            <EditProfileForm />
          </Tabs.Content>
        </div>

      </Tabs.Root>

    </div>
  );
}