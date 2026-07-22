"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { adminService } from "@/features/admin/services/admin.service";
import type { Product } from "@/types";

const PLACEHOLDER_IMAGE = "/product-placeholder.svg";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    adminService
      .findAllProducts()
      .then((data) => setProducts(data.items))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-medium">Productos</h1>
        <p className="text-sm text-muted-foreground">
          La creación/edición de productos con imágenes se gestiona vía Swagger
          (<code>/api/v1/docs</code>) o se puede extender aquí con un formulario CRUD.
        </p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando...</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="flex gap-3 rounded-lg border border-border p-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                <Image
                  src={product.images?.[0]?.url ?? PLACEHOLDER_IMAGE}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">S/ {Number(product.price).toFixed(2)}</p>
                <Badge variant={product.isAvailable ? "secondary" : "destructive"} className="mt-1">
                  {product.isAvailable ? "Disponible" : "No disponible"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
