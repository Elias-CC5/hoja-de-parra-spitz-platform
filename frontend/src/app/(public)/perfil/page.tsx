"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { useAuthStore } from "@/store/auth.store";
import { OrderHistory } from "@/features/profile/components/OrderHistory";
import { ReservationHistory } from "@/features/profile/components/ReservationHistory";
import { QuotationHistory } from "@/features/profile/components/QuotationHistory";
import { FavoritesList } from "@/features/profile/components/FavoritesList";
import { EditProfileForm } from "@/features/profile/components/EditProfileForm";

const TABS = [
  { value: "orders", label: "Pedidos" },
  { value: "reservations", label: "Reservas" },
  { value: "quotations", label: "Cotizaciones" },
  { value: "favorites", label: "Favoritos" },
  { value: "profile", label: "Mi cuenta" },
];

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">Mi cuenta</p>
        <h1 className="font-display text-3xl font-medium">Hola, {user?.fullName?.split(" ")[0]}</h1>
      </div>

      <Tabs.Root defaultValue="orders">
        <Tabs.List className="mb-8 flex gap-1 overflow-x-auto border-b border-border">
          {TABS.map((tab) => (
            <Tabs.Trigger
              key={tab.value}
              value={tab.value}
              className="whitespace-nowrap border-b-2 border-transparent px-4 py-2 text-sm font-medium text-muted-foreground data-[state=active]:border-accent data-[state=active]:text-foreground"
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <Tabs.Content value="orders"><OrderHistory /></Tabs.Content>
        <Tabs.Content value="reservations"><ReservationHistory /></Tabs.Content>
        <Tabs.Content value="quotations"><QuotationHistory /></Tabs.Content>
        <Tabs.Content value="favorites"><FavoritesList /></Tabs.Content>
        <Tabs.Content value="profile"><EditProfileForm /></Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
