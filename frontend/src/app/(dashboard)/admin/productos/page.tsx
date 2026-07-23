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
  Pencil,
  Trash2,
} from "lucide-react";

const PLACEHOLDER_IMAGE = "/product-placeholder.svg";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Modales
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    category: "",
    isAvailable: true,
  });

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      // Intenta usar getProducts o findAllProducts según esté expuesto en adminService
const serviceMethod = (adminService as any).getProducts || (adminService as any).findAllProducts;
      if (!serviceMethod) {
        throw new Error("El método para obtener productos no está definido en adminService");
      }

      const response = await serviceMethod();
      // Soporta tanto arreglos directos como respuestas paginadas { items: [...] }
      const list = Array.isArray(response) ? response : response?.items || [];
      setProducts(list);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = () => {
    setIsLoadingCategories(true);
const serviceMethod = (adminService as any).getCategories || (adminService as any).findAllCategories;
    
    if (!serviceMethod) {
      setIsLoadingCategories(false);
      return Promise.resolve([]);
    }

    return serviceMethod()
      .then((data: any) => {
        const list = Array.isArray(data) ? data : data?.items || [];
        setCategories(list);
        return list;
      })
      .catch((err: any) => {
        console.error("Error al cargar categorías:", err);
        return [];
      })
      .finally(() => setIsLoadingCategories(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Abrir Modal para Crear
  const handleOpenCreateModal = async () => {
    setEditingProduct(null);
    const catList = await loadCategories();
    setFormData({
      name: "",
      description: "",
      price: "",
      imageUrl: "",
      category: catList.length > 0 ? catList[0].id : "",
      isAvailable: true,
    });
    setIsModalOpen(true);
  };

  // Abrir Modal para Editar
  const handleOpenEditModal = async (product: any) => {
    setEditingProduct(product);
    await loadCategories();

    // Extraer URL de la imagen sin importar la estructura que venga del backend
    const currentImgUrl =
      product.images?.[0]?.url ||
      (typeof product.images?.[0] === "string" ? product.images[0] : "") ||
      product.imageUrl ||
      "";

    // Extraer ID de la categoría
    const currentCategoryId =
      typeof product.category === "object"
        ? product.category?.id
        : product.categoryId || product.category || "";

    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price ? String(product.price) : "",
      imageUrl: currentImgUrl,
      category: currentCategoryId,
      isAvailable: product.isAvailable ?? true,
    });

    setIsModalOpen(true);
  };

  // Eliminar Producto
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar el producto "${name}"?`)) return;

    try {
      await adminService.deleteProduct(id);
      loadProducts();
    } catch (err: any) {
      alert("Error al eliminar el producto.");
    }
  };

  // Enviar Formulario (Crear o Actualizar)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: any = {
        name: formData.name,
        description: formData.description.trim() || undefined,
        price: Number(formData.price),
        category: formData.category,
        isAvailable: formData.isAvailable,
      };

      if (formData.imageUrl.trim()) {
        payload.images = [
          {
            url: formData.imageUrl.trim(),
            publicId: `url-${Date.now()}`,
          },
        ];
      } else {
        payload.images = [];
      }

      if (editingProduct) {
        // Modo Edición
        await adminService.updateProduct(editingProduct.id, payload);
      } else {
        // Modo Creación
        await adminService.createProduct(payload);
      }

      setIsModalOpen(false);
      loadProducts();
    } catch (err: any) {
      console.error("Error al guardar producto:", err?.response?.data || err);
      const backendMessage = err?.response?.data?.message;

      alert(
        Array.isArray(backendMessage)
          ? `Error de validación:\n- ${backendMessage.join("\n- ")}`
          : backendMessage || "Error al procesar el producto."
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
          onClick={handleOpenCreateModal}
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
          {products.map((product: any) => {
            // Resolver URL de imagen híbrida
            const imageUrl =
              product.images?.[0]?.url ||
              (typeof product.images?.[0] === "string" ? product.images[0] : null) ||
              product.imageUrl ||
              PLACEHOLDER_IMAGE;

            return (
              <div
                key={product.id}
                className="group relative flex items-center gap-4 rounded-3xl border border-neutral-800/80 bg-neutral-950/80 p-4 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-amber-400/40 hover:bg-neutral-900/60"
              >
                {/* Imagen */}
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-neutral-900 border border-neutral-800">
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    unoptimized={true}
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>

                {/* Detalles */}
                <div className="flex-1 min-w-0 space-y-1">
                  <h3 className="text-sm font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs font-semibold text-amber-400/90 font-mono">
                    S/ {Number(product.price || 0).toFixed(2)}
                  </p>

                  <div className="pt-1 flex items-center justify-between">
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

                    {/* Botones de Acción */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(product)}
                        title="Editar Producto"
                        className="p-1.5 rounded-xl text-neutral-400 hover:text-amber-400 hover:bg-amber-400/10 transition"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id, product.name)}
                        title="Eliminar Producto"
                        className="p-1.5 rounded-xl text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Crear / Editar Producto */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                {editingProduct ? "Editar Producto" : "Crear Nuevo Producto"}
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
                  Nombre del Producto *
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

              {/* Categoría y Precio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1 flex items-center gap-1.5">
                    <FolderTree className="h-3.5 w-3.5 text-amber-400" />
                    Categoría *
                  </label>
                  {isLoadingCategories ? (
                    <div className="flex items-center gap-2 py-2.5 px-4 rounded-2xl border border-neutral-800 bg-neutral-900/50 text-xs text-neutral-500">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-400" />
                      Cargando...
                    </div>
                  ) : (
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/50 px-4 py-2.5 text-xs text-white outline-none focus:border-amber-400"
                    >
                      <option value="" disabled className="bg-neutral-950 text-neutral-500">
                        Selecciona una categoría
                      </option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id} className="bg-neutral-950 text-white">
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    Precio (S/) *
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
                  Debe ser un enlace directo a la imagen (ej: Unsplash, Imgur, Cloudinary, etc.).
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

              {/* Disponibilidad */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isAvailable"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="h-4 w-4 rounded accent-amber-400 cursor-pointer"
                />
                <label htmlFor="isAvailable" className="text-xs text-neutral-300 cursor-pointer select-none">
                  Producto disponible en carta
                </label>
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
                  disabled={isSubmitting}
                  className="w-1/2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2.5 text-xs font-bold text-neutral-950 transition-transform hover:scale-[1.02] disabled:opacity-50"
                >
                  {isSubmitting
                    ? "Guardando..."
                    : editingProduct
                    ? "Actualizar Producto"
                    : "Guardar Producto"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}