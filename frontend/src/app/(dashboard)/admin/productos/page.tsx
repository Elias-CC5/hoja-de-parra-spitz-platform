"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { adminService, Category } from "@/features/admin/services/admin.service";
import type { Product } from "@/types";
import {
  Package,
  Plus,
  Loader2,
  CheckCircle2,
  XCircle,
  Sparkles,
  Link as LinkIcon,
  FolderTree,
} from "lucide-react";

const PLACEHOLDER_IMAGE = "/product-placeholder.svg";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
    isAvailable: true,
  });

  const loadProducts = () => {
    setIsLoading(true);
    adminService
      .findAllProducts()
      .then((data) => setProducts(data.items || []))
      .catch(() => setProducts([]))
      .finally(() => setIsLoading(false));
  };

  const loadCategories = () => {
    setIsLoadingCategories(true);
    adminService
      .findAllCategories()
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setCategories(list);
        if (list.length > 0 && !formData.category) {
          setFormData((prev) => ({ ...prev, category: list[0].id }));
        }
      })
      .catch((err) => console.error("Error al cargar categorías:", err))
      .finally(() => setIsLoadingCategories(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    loadCategories();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 📦 Payload limpio para cumplir con las reglas estrictas de NestJS
      const payload: any = {
        name: formData.name,
        description: formData.description.trim() || undefined,
        price: Number(formData.price),
        category: formData.category,
        isAvailable: formData.isAvailable,
      };

      // Si ingresó URL de imagen, la adjuntamos en el formato esperado
      if (formData.imageUrl.trim()) {
        payload.images = [{ url: formData.imageUrl.trim() }];
      }

      await adminService.createProduct(payload);

      // Limpiar y cerrar modal
      setIsModalOpen(false);
      setFormData({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        category: categories.length > 0 ? categories[0].id : "",
        isAvailable: true,
      });

      // Recargar lista
      loadProducts();
    } catch (err: any) {
      console.error("Error al crear producto:", err?.response?.data || err);
      const backendMessage = err?.response?.data?.message;

      alert(
        Array.isArray(backendMessage)
          ? `Error de validación en Backend:\n- ${backendMessage.join("\n- ")}`
          : backendMessage || "Error al crear el producto. Revisa los datos ingresados."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800/80 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Package className="h-7 w-7 text-amber-400" />
            Catálogo de <span className="text-amber-400">Productos</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Administra los platos, bocadillos y bebidas para la carta de DeParraSpitz.
          </p>
        </div>

        <button
          onClick={handleOpenModal}
          className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-2.5 text-xs font-bold text-neutral-950 shadow-[0_0_20px_rgba(251,191,36,0.25)] transition-all hover:scale-105"
        >
          <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
          <span>Nuevo Producto</span>
        </button>
      </div>

      {/* Grid de Productos */}
      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-3xl border border-neutral-800/80 bg-neutral-950/50 backdrop-blur-xl">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
          <p className="text-xs font-semibold text-neutral-400">Cargando catálogo...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-3xl border border-neutral-800/80 bg-neutral-950/50 backdrop-blur-xl">
          <p className="text-sm font-semibold text-neutral-400">No hay productos registrados en el menú.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative flex items-center gap-4 rounded-3xl border border-neutral-800/80 bg-neutral-950/80 p-4 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-amber-400/40 hover:bg-neutral-900/60"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800">
                <Image
                  src={product.images?.[0]?.url ?? PLACEHOLDER_IMAGE}
                  alt={product.name}
                  fill
                  unoptimized={true}
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <h3 className="text-sm font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs font-semibold text-amber-400/90 font-mono">
                  S/ {Number(product.price).toFixed(2)}
                </p>

                <div className="pt-1">
                  {product.isAvailable ? (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-400/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-400/20">
                      <CheckCircle2 className="h-3 w-3" />
                      Disponible
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-lg bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-400 border border-rose-500/20">
                      <XCircle className="h-3 w-3" />
                      Agotado
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para Crear Producto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                Crear Nuevo Producto
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Nombre del Producto
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Tequeños Lomo Saltado"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/50 px-4 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                />
              </div>

              {/* Categoría y Precio en 2 columnas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Selector de Categorías */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1 flex items-center gap-1.5">
                    <FolderTree className="h-3.5 w-3.5 text-amber-400" />
                    Categoría
                  </label>
                  {isLoadingCategories ? (
                    <div className="flex items-center gap-2 py-2.5 px-4 rounded-2xl border border-neutral-800 bg-neutral-900/50 text-xs text-neutral-500">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-400" />
                      Cargando...
                    </div>
                  ) : categories.length === 0 ? (
                    <div className="text-[11px] text-amber-400/90 bg-amber-400/10 p-2.5 rounded-2xl border border-amber-400/20">
                      No hay categorías disponibles.
                    </div>
                  ) : (
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/50 px-4 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id} className="bg-neutral-950 text-white">
                          {cat.name} ({cat.type})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Precio */}
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Precio (S/)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-2.5 text-xs font-bold text-amber-400">
                      S/
                    </span>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/50 pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* URL Imagen */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Link / URL de la Imagen
                </label>
                <div className="relative">
                  <LinkIcon className="absolute left-3.5 top-2.5 h-4 w-4 text-neutral-500" />
                  <input
                    type="url"
                    placeholder="https://imagenes.com/foto.jpg"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/50 pl-10 pr-4 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                  />
                </div>
                <p className="text-[10px] text-neutral-500 mt-1">
                  Pega el enlace directo de la foto del producto.
                </p>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  placeholder="Descripción del producto..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/50 px-4 py-2.5 text-xs text-white outline-none focus:border-amber-400 resize-none"
                />
              </div>

              {/* Acciones */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-xs font-bold text-neutral-300 hover:bg-neutral-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || categories.length === 0}
                  className="w-1/2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2.5 text-xs font-bold text-neutral-950 transition-transform hover:scale-[1.02] disabled:opacity-50"
                >
                  {isSubmitting ? "Guardando..." : "Guardar Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}