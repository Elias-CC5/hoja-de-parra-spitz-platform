"use client";

import { useEffect, useState } from "react";
import { DollarSign, ShoppingBag, Users, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminService, type DashboardStats } from "../services/admin.service";

const CARDS = [
  { key: "totalRevenue", label: "Ingresos totales", icon: DollarSign, isCurrency: true },
  { key: "totalOrders", label: "Pedidos", icon: ShoppingBag },
  { key: "totalUsers", label: "Usuarios", icon: Users },
  { key: "totalProducts", label: "Productos", icon: Package },
] as const;

export function StatsCards() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    adminService.getStats().then(setStats);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {CARDS.map((card) => (
        <Card key={card.key}>
          <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{card.label}</CardTitle>
            <card.icon size={18} className="text-accent" />
          </CardHeader>
          <CardContent>
            <p className="font-display text-2xl font-semibold">
              {stats
                ? "isCurrency" in card
                  ? `S/ ${Number(stats[card.key]).toFixed(2)}`
                  : stats[card.key]
                : "—"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
