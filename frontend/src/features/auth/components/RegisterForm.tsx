"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff, Flame, UtensilsCrossed, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth.store";
import { registerSchema, type RegisterFormValues } from "../services/auth.schemas";

export function RegisterForm() {
  const router = useRouter();
  const registerUser = useAuthStore((state) => state.register);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"parrilla" | "criollo" | "arabe">("parrilla");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    try {
      await registerUser(values);
      router.push("/");
    } catch {
      setServerError("No pudimos crear tu cuenta. Verifica tus datos e intenta de nuevo.");
    }
  };

  const experienceData = {
    parrilla: {
      title: "Brasas & Cortes",
      description: "La tradición de la parrilla criolla llevada a su máximo nivel.",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1000&auto=format&fit=crop",
      quote: "La brasa perfecta no se apura, se domina.",
    },
    criollo: {
      title: "Sabor Tradicional",
      description: "Guisos e ingredientes autóctonos con sazón criolla inolvidable.",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1000&auto=format&fit=crop",
      quote: "El secreto está en el aderezo de la casa.",
    },
    arabe: {
      title: "Fusión de Especias",
      description: "Aromas del Medio Oriente integrados con la cocina de autor.",
      image: "https://images.unsplash.com/photo-1529003600303-bd51f39627fb?q=80&w=1000&auto=format&fit=crop",
      quote: "Un viaje de sabores a través de la especia.",
    },
  };

  return (
    <div className="fixed inset-0 w-screen h-screen flex bg-[#030303] text-zinc-100 overflow-hidden z-50">
      {/* SECCIÓN IZQUIERDA: FORMULARIO */}
      <div className="w-full lg:w-[45%] xl:w-[40%] h-full flex flex-col justify-between p-8 md:p-12 z-10 bg-[#030303] overflow-y-auto custom-scrollbar">
        {/* Badge Superior Marca */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            DeParraSpitz <span className="text-zinc-400">Catering & Eventos</span>
          </div>
        </div>

        {/* Formulario */}
        <div className="w-full max-w-sm mx-auto my-auto py-6">
          <div className="mb-6 text-left">
            <p className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase mb-1">
              ÚNETE A LA EXPERIENCIA
            </p>
            <h1 className="text-3xl lg:text-4xl font-serif text-white mb-2">
              Crea tu <span className="italic text-[#EAB308]">cuenta</span>
            </h1>
            <p className="text-xs text-zinc-400">
              Regístrate para solicitar cotizaciones y gestionar tus eventos privados.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            {/* Nombre Completo */}
            <div className="space-y-1">
              <Label htmlFor="fullName" className="text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
                Nombre completo
              </Label>
              <Input
                id="fullName"
                placeholder="Juan Pérez"
                className="h-10 bg-[#0A0A0C] border-zinc-800/80 focus:border-[#EAB308] focus:ring-[#EAB308]/20 text-white text-xs rounded-xl"
                {...register("fullName")}
              />
              {errors.fullName && <p className="text-[11px] text-red-400">{errors.fullName.message}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1">
              <Label htmlFor="email" className="text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="tucorreo@ejemplo.com"
                className="h-10 bg-[#0A0A0C] border-zinc-800/80 focus:border-[#EAB308] focus:ring-[#EAB308]/20 text-white text-xs rounded-xl"
                {...register("email")}
              />
              {errors.email && <p className="text-[11px] text-red-400">{errors.email.message}</p>}
            </div>

            {/* Teléfono */}
            <div className="space-y-1">
              <Label htmlFor="phone" className="text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
                Teléfono (opcional)
              </Label>
              <Input
                id="phone"
                placeholder="+51 987 654 321"
                className="h-10 bg-[#0A0A0C] border-zinc-800/80 focus:border-[#EAB308] focus:ring-[#EAB308]/20 text-white text-xs rounded-xl"
                {...register("phone")}
              />
            </div>

            {/* Contraseña */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
                Contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-10 bg-[#0A0A0C] border-zinc-800/80 focus:border-[#EAB308] focus:ring-[#EAB308]/20 text-white text-xs rounded-xl pr-9"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-[11px] text-red-400">{errors.password.message}</p>}
            </div>

            {/* Confirmar Contraseña */}
            <div className="space-y-1">
              <Label htmlFor="confirmPassword" className="text-[11px] font-medium tracking-wide text-zinc-400 uppercase">
                Confirmar contraseña
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-10 bg-[#0A0A0C] border-zinc-800/80 focus:border-[#EAB308] focus:ring-[#EAB308]/20 text-white text-xs rounded-xl pr-9"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-[11px] text-red-400">{errors.confirmPassword.message}</p>}
            </div>

            {serverError && <p className="text-xs text-red-400 pt-1">{serverError}</p>}

            {/* Botón Principal */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-[#EAB308] hover:bg-[#d9a307] text-black font-semibold rounded-xl text-xs transition-all shadow-lg shadow-amber-500/10 mt-2"
            >
              {isSubmitting && <Loader2 className="animate-spin mr-2" size={15} />}
              {isSubmitting ? "Creando tu cuenta..." : "Crear cuenta →"}
            </Button>

            {/* Footer / Link a Login */}
            <p className="text-center text-xs text-zinc-500 pt-2">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-[#EAB308] hover:underline font-medium">
                Inicia sesión
              </Link>
            </p>
          </form>
        </div>

        <div />
      </div>

      {/* SECCIÓN DERECHA: PANEL VISUAL DE DEPARRASPITZ */}
      <div className="hidden lg:flex flex-1 p-4 h-full bg-[#08080A]">
        <div className="relative w-full h-full rounded-3xl overflow-hidden bg-[#0A0A0D] border border-zinc-800/60 p-10 flex flex-col justify-between">
          {/* Header Superior del Panel */}
          <div className="flex justify-between items-start z-10">
            <span className="text-[11px] font-semibold tracking-widest text-zinc-500 uppercase">
              Spitz Experience
            </span>

            {/* Selector de Menú / Tabs Flotantes */}
            <div className="p-1 rounded-2xl bg-[#121216]/90 border border-zinc-800 backdrop-blur-md flex flex-col gap-1 w-28">
              <button
                onClick={() => setActiveTab("parrilla")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-all ${
                  activeTab === "parrilla"
                    ? "bg-[#201D13] text-[#EAB308] border border-amber-500/30 font-medium"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Flame size={13} /> Parrilla
              </button>
              <button
                onClick={() => setActiveTab("criollo")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-all ${
                  activeTab === "criollo"
                    ? "bg-[#201D13] text-[#EAB308] border border-amber-500/30 font-medium"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <UtensilsCrossed size={13} /> Criollo
              </button>
              <button
                onClick={() => setActiveTab("arabe")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-all ${
                  activeTab === "arabe"
                    ? "bg-[#201D13] text-[#EAB308] border border-amber-500/30 font-medium"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Compass size={13} /> Árabe
              </button>
            </div>
          </div>

          {/* Tarjeta Visual de Comida Central */}
          <div className="relative my-auto flex justify-center items-center py-4">
            <div className="relative w-full max-w-md h-[360px] rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
              <Image
                src={experienceData[activeTab].image}
                alt="Platillo Gastronómico"
                fill
                className="object-cover transition-all duration-500 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

              {/* Cita Flotante sobre la Imagen */}
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-center">
                <p className="text-xs italic font-serif text-amber-200/90">
                  &quot;{experienceData[activeTab].quote}&quot;
                </p>
              </div>
            </div>
          </div>

          {/* Pie de Página del Panel */}
          <div className="z-10">
            <p className="text-[11px] font-semibold tracking-wider text-[#EAB308] uppercase mb-1">
              SABOR AL FUEGO
            </p>
            <h3 className="text-2xl font-serif text-white mb-1">
              {experienceData[activeTab].title}
            </h3>
            <p className="text-xs text-zinc-400 max-w-md">
              {experienceData[activeTab].description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}