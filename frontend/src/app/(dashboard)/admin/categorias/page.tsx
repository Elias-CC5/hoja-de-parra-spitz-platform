"use client";

import { useEffect, useState } from "react";
import { adminService, Category } from "@/features/admin/services/admin.service";
import {
  FolderTree,
  Plus,
  Loader2,
  Sparkles,
  X,
  Tag,
} from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "producto", // Por defecto se asigna tipo "producto" internamente
  });

  const loadCategories = () => {
    setIsLoading(true);
    adminService
      .findAllCategories()
      .then((data) => {
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Error al cargar categorías:", err);
        setCategories([]);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      await adminService.createCategory({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        type: form.type as "producto" | "servicio",
      });

      // Limpiar y cerrar modal
      setForm({ name: "", description: "", type: "producto" });
      setIsModalOpen(false);

      // Recargar la lista de categorías
      loadCategories();
    } catch (err: any) {
      console.error("Error al crear categoría:", err);
      const msg = err?.response?.data?.message || "Error al guardar la categoría.";
      setErrorMessage(Array.isArray(msg) ? msg.join(", ") : msg);
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
            <FolderTree className="h-7 w-7 text-amber-400" />
            Categorías de <span className="text-amber-400">Menú</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Organiza los productos de tu carta en secciones para tus clientes.
          </p>
        </div>

        <button
          onClick={() => {
            setErrorMessage(null);
            setIsModalOpen(true);
          }}
          className="group flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-5 py-2.5 text-xs font-bold text-neutral-950 shadow-[0_0_20px_rgba(251,191,36,0.25)] transition-all hover:scale-105"
        >
          <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
          <span>Nueva Categoría</span>
        </button>
      </div>

      {/* Grid de Categorías */}
      {isLoading ? (
        <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-3xl border border-neutral-800/80 bg-neutral-950/50 backdrop-blur-xl">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
          <p className="text-xs font-semibold text-neutral-400">Cargando categorías...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-3xl border border-neutral-800/80 bg-neutral-950/50 backdrop-blur-xl">
          <p className="text-sm font-semibold text-neutral-400">
            No hay categorías creadas aún.
          </p>
          <p className="text-xs text-neutral-600">
            Haz clic en "Nueva Categoría" para crear la primera.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="group relative flex flex-col justify-between rounded-3xl border border-neutral-800/80 bg-neutral-950/80 p-5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:border-amber-400/40 hover:bg-neutral-900/60"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400/10 px-2.5 py-1 text-[11px] font-bold text-amber-400 border border-amber-400/20">
                    <Tag className="h-3 w-3" />
                    Categoría
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                  {cat.name}
                </h3>
                {cat.description && (
                  <p className="text-xs text-neutral-400 line-clamp-2">
                    {cat.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Crear Categoría */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-950 p-6 shadow-2xl space-y-5">
            {/* Encabezado Modal */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                Nueva Categoría
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nombre de Categoría */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Nombre de la Categoría *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Entradas, Platos Principales, Bebidas"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-400 transition"
                />
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Descripción (Opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Breve descripción de la categoría..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-2xl border border-neutral-800 bg-neutral-900/60 px-4 py-2.5 text-xs text-white placeholder:text-neutral-600 focus:outline-none focus:border-amber-400 transition resize-none"
                />
              </div>

              {/* Botones */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-xs font-bold text-neutral-300 hover:bg-neutral-800 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-1/2 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 px-4 py-2.5 text-xs font-bold text-neutral-950 transition-transform hover:scale-[1.02] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    "Guardar Categoría"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}