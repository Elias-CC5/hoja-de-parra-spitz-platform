"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Loader2,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Flame,
  UtensilsCrossed,
  Compass,
  Quote,
  Sparkles,
} from "lucide-react";

import { useAuthStore } from "@/store/auth.store";
import { registerSchema, type RegisterFormValues } from "../services/auth.schemas";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────
// CONFIGURACIÓN DE SLIDES CON IMÁGENES PÚBLICAS Y CONTENIDO
// ─────────────────────────────────────────────────────────
const SHOWCASE_SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop",
    icon: Flame,
    alt: "Parrilla premium",
    label: "Parrilla",
    title: "Brasas & Cortes",
    description: "La tradición de la parrilla criolla llevada a su máximo nivel.",
    quote: "La brasa perfecta no se apura, se domina.",
  },
  {
    src: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1200&auto=format&fit=crop",
    icon: UtensilsCrossed,
    alt: "Cocina criolla",
    label: "Criollo",
    title: "Sabor Tradicional",
    description: "Guisos e ingredientes autóctonos con sazón criolla inolvidable.",
    quote: "El secreto está en el aderezo de la casa.",
  },
  {
    src: "https://images.unsplash.com/photo-1529003600303-bd51f39627fb?q=80&w=1200&auto=format&fit=crop",
    icon: Compass,
    alt: "Cocina árabe",
    label: "Árabe",
    title: "Fusión de Especias",
    description: "Aromas del Medio Oriente integrados con la cocina de autor.",
    quote: "Un viaje de sabores a través de la especia.",
  },
] as const;

const SLIDE_DURATION = 8000;

// ─────────────────────────────────────────────────────────
// VARIANTES DE ANIMACIÓN ULTRA PROFESIONALES (FRAMER MOTION)
// ─────────────────────────────────────────────────────────

const formContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
};

const formItemVariants = {
  hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.25, 1, 0.5, 1],
    },
  },
};

const image3DVariants = {
  enter: {
    opacity: 0,
    scale: 1.15,
    rotateY: -10,
    filter: "blur(12px) brightness(0.7)",
  },
  center: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    filter: "blur(0px) brightness(1)",
    transition: {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    rotateY: 10,
    filter: "blur(8px) brightness(0.5)",
    transition: {
      duration: 0.6,
      ease: "easeInOut",
    },
  },
};

const quoteVariants = {
  enter: { opacity: 0, y: 25, scale: 0.95 },
  center: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: 0.35,
      ease: [0.34, 1.56, 0.64, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -15,
    scale: 0.95,
    transition: { duration: 0.3 },
  },
};

export function RegisterForm() {
  const router = useRouter();
  const registerUser = useAuthStore((state) => state.register);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [shake, setShake] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const current = SHOWCASE_SLIDES[currentSlide];
  const otherStyles = SHOWCASE_SLIDES.length - 1;

  // Parallax y Tilt 3D
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);

  const tiltRotateX = useSpring(useTransform(mvY, [-0.5, 0.5], [12, -12]), {
    stiffness: 120,
    damping: 20,
  });
  const tiltRotateY = useSpring(useTransform(mvX, [-0.5, 0.5], [-14, 14]), {
    stiffness: 120,
    damping: 20,
  });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      mvX.set(relX);
      mvY.set(relY);

      if (frameRef.current) {
        const fr = frameRef.current.getBoundingClientRect();
        const px = ((e.clientX - fr.left) / fr.width) * 100;
        const py = ((e.clientY - fr.top) / fr.height) * 100;
        frameRef.current.style.setProperty("--mx", `${px}%`);
        frameRef.current.style.setProperty("--my", `${py}%`);
      }
    },
    [mvX, mvY]
  );

  const resetTilt = useCallback(() => {
    setIsPaused(false);
    mvX.set(0);
    mvY.set(0);
  }, [mvX, mvY]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % SHOWCASE_SLIDES.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [isPaused]);

  // React Hook Form
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
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="hero-section login-screen-split min-h-screen py-8 lg:py-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={resetTilt}
      onMouseMove={handleMouseMove}
    >
      <div className="hero-vignette" />

      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-center h-full my-auto">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO REGISTRO ANIMADO */}
        <motion.div
          className="flex flex-col justify-center h-full max-w-md w-full mx-auto lg:mx-0 py-6"
          variants={formContainerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span className="hero-badge w-fit mb-4" variants={formItemVariants}>
            <Sparkles className="w-3.5 h-3.5" />
            DeParraSpitz · Catering & Eventos
          </motion.span>

          <motion.div variants={formItemVariants}>
            <span className="hero-kicker block">Únete a la experiencia</span>
            <h1 className="mt-1 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.08] text-foreground tracking-tight">
              Crea tu <br />
              <span className="font-display italic font-normal hero-title-accent">
                cuenta
              </span>
            </h1>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Regístrate para solicitar cotizaciones y gestionar tus eventos privados.
            </p>
          </motion.div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn(
              "flex flex-col gap-3 mt-5",
              shake && "animate-[login-shake_0.5s_ease]"
            )}
          >
            {/* Nombre Completo */}
            <motion.div className="flex flex-col gap-1" variants={formItemVariants}>
              <label htmlFor="fullName" className="login-label-clean">
                Nombre completo
              </label>
              <input
                id="fullName"
                type="text"
                placeholder="Juan Pérez"
                className="login-input-clean"
                {...register("fullName")}
              />
              {errors.fullName && (
                <p className="login-error-text">
                  <AlertCircle size={13} />
                  {errors.fullName.message}
                </p>
              )}
            </motion.div>

            {/* Email */}
            <motion.div className="flex flex-col gap-1" variants={formItemVariants}>
              <label htmlFor="email" className="login-label-clean">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="tucorreo@ejemplo.com"
                className="login-input-clean"
                {...register("email")}
              />
              {errors.email && (
                <p className="login-error-text">
                  <AlertCircle size={13} />
                  {errors.email.message}
                </p>
              )}
            </motion.div>

            {/* Teléfono */}
            <motion.div className="flex flex-col gap-1" variants={formItemVariants}>
              <label htmlFor="phone" className="login-label-clean">
                Teléfono (opcional)
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="+51 987 654 321"
                className="login-input-clean"
                {...register("phone")}
              />
            </motion.div>

            {/* Contraseña */}
            <motion.div className="flex flex-col gap-1" variants={formItemVariants}>
              <label htmlFor="password" className="login-label-clean">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="login-input-clean pr-10"
                  {...register("password")}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && (
                <p className="login-error-text">
                  <AlertCircle size={13} />
                  {errors.password.message}
                </p>
              )}
            </motion.div>

            {/* Confirmar Contraseña */}
            <motion.div className="flex flex-col gap-1" variants={formItemVariants}>
              <label htmlFor="confirmPassword" className="login-label-clean">
                Confirmar contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="login-input-clean pr-10"
                  {...register("confirmPassword")}
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="login-error-text">
                  <AlertCircle size={13} />
                  {errors.confirmPassword.message}
                </p>
              )}
            </motion.div>

            {serverError && (
              <motion.div className="login-server-error-banner" variants={formItemVariants}>
                <AlertCircle size={14} className="shrink-0" />
                <span>{serverError}</span>
              </motion.div>
            )}

            {/* Botón Principal */}
            <motion.div variants={formItemVariants} className="pt-1">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="login-btn-primary"
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={15} />
                    Creando tu cuenta...
                  </span>
                ) : (
                  <span className="inline-flex items-center justify-center gap-1.5">
                    Crear cuenta
                    <ArrowRight size={14} />
                  </span>
                )}
              </motion.button>
            </motion.div>

            <motion.p className="text-center text-xs text-zinc-500 pt-1" variants={formItemVariants}>
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="login-gold-link">
                Inicia sesión
              </Link>
            </motion.p>
          </form>
        </motion.div>

        {/* COLUMNA DERECHA: SHOWCASE 3D ANIMADO */}
        <div className="hidden lg:block relative h-[520px] lg:h-[calc(100vh-10rem)] lg:max-h-[720px] lg:min-h-[580px]">
          <div className="hero-media-wrap">
            {Array.from({ length: otherStyles }).map((_, i) => (
              <div
                key={`stack-${i}`}
                className="hero-stack-card"
                style={{ "--stack-i": i + 1 } as React.CSSProperties}
                aria-hidden="true"
              />
            ))}

            <motion.div
              ref={frameRef}
              className="hero-media-frame"
              style={{
                rotateX: tiltRotateX,
                rotateY: tiltRotateY,
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={current.src}
                  src={current.src}
                  alt={current.alt}
                  loading={currentSlide === 0 ? "eager" : "lazy"}
                  variants={image3DVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="hero-media-image"
                />
              </AnimatePresence>
              <div className="hero-media-overlay" />
              <div className="hero-glass-sheen" />

              {/* Cita Flotante */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.src}
                  className="hero-quote-card"
                  variants={quoteVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  style={{ transform: "translateZ(40px)" }}
                >
                  <Quote className="w-4 h-4 hero-quote-icon shrink-0" />
                  <p>&quot;{current.quote}&quot;</p>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Panel Bento Interactivo con Thumbnails */}
          <motion.div
            className="hero-thumb-panel"
            initial={{ opacity: 0, x: 30, filter: "blur(6px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {SHOWCASE_SLIDES.map((img, i) => {
              const isActive = i === currentSlide;
              const ThumbIcon = img.icon;

              return (
                <motion.button
                  key={img.src}
                  type="button"
                  onClick={() => setCurrentSlide(i)}
                  aria-label={`Ver estilo ${img.label}`}
                  aria-pressed={isActive}
                  whileHover={{ scale: 1.04, x: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className={cn("hero-thumb", isActive && "hero-thumb-active")}
                >
                  <span className="hero-thumb-image-wrap flex items-center justify-center bg-black/40 backdrop-blur-md rounded-lg border border-white/10">
                    <ThumbIcon
                      className={cn(
                        "w-5 h-5 transition-transform duration-300",
                        isActive ? "text-amber-400 scale-110" : "text-zinc-400"
                      )}
                    />
                    <span className="hero-thumb-shine" />
                  </span>
                  <span className="hero-thumb-meta">
                    <span
                      className={cn(
                        "hero-thumb-label truncate font-medium transition-colors",
                        isActive ? "text-amber-400" : "text-zinc-300"
                      )}
                    >
                      {img.label}
                    </span>
                    <span className="hero-progress-track">
                      {isActive && (
                        <motion.span
                          key={`${i}-${isPaused}`}
                          className="hero-progress-fill"
                          initial={{ width: "0%" }}
                          animate={{ width: isPaused ? "0%" : "100%" }}
                          transition={{
                            duration: isPaused ? 0 : SLIDE_DURATION / 1000,
                            ease: "linear",
                          }}
                        />
                      )}
                    </span>
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </div>

      </div>
    </section>
  );
}