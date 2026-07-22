"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adminService, type DashboardStats } from "../services/admin.service";

export function TopProductsCard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    adminService.getStats().then(setStats);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Productos más vendidos</CardTitle>
      </CardHeader>
      <CardContent>
        {!stats || stats.topProducts.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin datos suficientes todavía.</p>
        ) : (
          <ul className="space-y-3">
            {stats.topProducts.map((product, index) => (
              <li key={product.productId} className="flex items-center justify-between text-sm">
                <span>
                  <span className="mr-2 text-muted-foreground">{index + 1}.</span>
                  {product.name}
                </span>
                <span className="font-medium">{product.unitsSold} unidades</span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
