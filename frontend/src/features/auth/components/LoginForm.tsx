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
import { loginSchema, type LoginFormValues } from "../services/auth.schemas";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────
// CONFIGURACIÓN DE SLIDES CON IMÁGENES PÚBLICAS
// ─────────────────────────────────────────────────────────
const SHOWCASE_SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200&auto=format&fit=crop",
    icon: Flame,
    alt: "Parrilla premium",
    label: "Parrilla",
    kicker: "Sabor al fuego",
    quote: "La brasa perfecta no se apura, se domina.",
  },
  {
    src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop",
    icon: UtensilsCrossed,
    alt: "Cocina criolla",
    label: "Criollo",
    kicker: "Tradición peruana",
    quote: "Cada receta, una historia compartida en la mesa.",
  },
  {
    src: "https://images.unsplash.com/photo-1541518763669-27fef04b14e8?q=80&w=1200&auto=format&fit=crop",
    icon: Compass,
    alt: "Cocina árabe",
    label: "Árabe",
    kicker: "Especias de oriente",
    quote: "Donde cada especia cuenta una ruta distinta.",
  },
] as const;

const SLIDE_DURATION = 8000;

const imageVariants: Record<string, any> = {
  enter: { opacity: 0, scale: 1.1, clipPath: "circle(0% at 50% 45%)" },
  center: {
    opacity: 1,
    scale: 1,
    clipPath: "circle(75% at 50% 45%)",
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 1,
    scale: 1.03,
    clipPath: "circle(75% at 50% 45%)",
    transition: { duration: 0.4, ease: "easeIn" },
  },
};

const quoteVariants: Record<string, any> = {
  enter: { opacity: 0, y: 16 },
  center: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.45 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.25 } },
};

export function LoginForm() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
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

  const tiltRotateX = useSpring(useTransform(mvY, [-0.5, 0.5], [10, -10]), {
    stiffness: 150,
    damping: 18,
  });
  const tiltRotateY = useSpring(useTransform(mvX, [-0.5, 0.5], [-12, 12]), {
    stiffness: 150,
    damping: 18,
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

  // Form handling
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      await login(values.email, values.password);
      router.push("/");
    } catch {
      setServerError("Correo o contraseña incorrectos");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="hero-section login-screen-split"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={resetTilt}
      onMouseMove={handleMouseMove}
    >
      <div className="hero-vignette" />

      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-14 items-center h-full py-10 lg:py-0">
        
        {/* COLUMNA IZQUIERDA: FORMULARIO */}
        <div className="flex flex-col justify-center h-full max-w-md w-full mx-auto lg:mx-0">
          <motion.span
            className="hero-badge w-fit mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            DeParraSpitz · Catering & Eventos
          </motion.span>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <span className="hero-kicker block">Bienvenido de vuelta</span>
            <h1 className="mt-2 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] text-foreground tracking-tight">
              Inicia tu <br />
              <span className="font-display italic font-normal hero-title-accent">
                sesión
              </span>
            </h1>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Accede a tu cuenta para gestionar tus eventos y cotizaciones.
            </p>
          </motion.div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn(
              "flex flex-col gap-4 mt-6",
              shake && "animate-[login-shake_0.5s_ease]"
            )}
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="login-label-clean">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="andres@gmail.com"
                className="login-input-clean"
                {...register("email")}
              />
              {errors.email && (
                <p className="login-error-text">
                  <AlertCircle size={13} />
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="login-label-clean">
                  Contraseña
                </label>
                <Link href="/reset-password" className="login-gold-link text-xs">
                  ¿La olvidaste?
                </Link>
              </div>
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
            </div>

            <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer select-none pt-0.5">
              <input
                type="checkbox"
                className="w-3.5 h-3.5 rounded border-zinc-700 bg-zinc-900 accent-amber-400"
              />
              Mantener sesión iniciada
            </label>

            {serverError && (
              <div className="login-server-error-banner">
                <AlertCircle size={14} className="shrink-0" />
                <span>{serverError}</span>
              </div>
            )}

            <button type="submit" disabled={isSubmitting} className="login-btn-primary">
              {isSubmitting ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={15} />
                  Ingresando...
                </span>
              ) : (
                <span className="inline-flex items-center justify-center gap-1.5">
                  Ingresar
                  <ArrowRight size={14} />
                </span>
              )}
            </button>

            <div className="login-divider-clean">
              <span>O continúa con</span>
            </div>

            <button type="button" className="login-btn-google">
              <svg width="15" height="15" viewBox="0 0 48 48">
                <path
                  fill="#FFC107"
                  d="M43.6 20.5H42V20H24v8h11.3C33.7 32.6 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21c0-1.4-.1-2.8-.4-3.5z"
                />
                <path
                  fill="#FF3D00"
                  d="M6.3 14.7l6.6 4.8C14.5 16 18.9 13 24 13c3.1 0 5.8 1.1 8 3l6-6C34.6 5.1 29.6 3 24 3 16.3 3 9.7 7.3 6.3 14.7z"
                />
                <path
                  fill="#4CAF50"
                  d="M24 45c5.5 0 10.5-1.8 14.3-5l-6.6-5.4C29.8 36 27 37 24 37c-5.3 0-9.6-3.4-11.3-8l-6.6 5.1C9.6 40.6 16.2 45 24 45z"
                />
                <path
                  fill="#1976D2"
                  d="M43.6 20.5H42V20H24v8h11.3c-1 3-3.2 5.4-6 6.9l6.6 5.4C39.6 37.4 43 31.4 43 24c0-1.4-.1-2.8-.4-3.5z"
                />
              </svg>
              Continuar con Google
            </button>

            <p className="text-center text-xs text-zinc-500 pt-1">
              ¿Nuevo en la plataforma?{" "}
              <Link href="/registro" className="login-gold-link">
                Crea tu cuenta
              </Link>
            </p>
          </form>
        </div>

        {/* COLUMNA DERECHA: SHOWCASE 3D DE IMÁGENES Y BENTO THUMBNAILS */}
        <div className="hidden lg:block relative h-[440px] sm:h-[560px] lg:h-[calc(100vh-11rem)] lg:max-h-[720px] lg:min-h-[550px]">
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
              <AnimatePresence mode="sync">
                <motion.img
                  key={current.src}
                  src={current.src}
                  alt={current.alt}
                  loading={currentSlide === 0 ? "eager" : "lazy"}
                  variants={imageVariants}
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

          {/* Panel Bento con Thumbnails */}
          <motion.div
            className="hero-thumb-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {SHOWCASE_SLIDES.map((img, i) => {
              const isActive = i === currentSlide;
              const ThumbIcon = img.icon;

              return (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => setCurrentSlide(i)}
                  aria-label={`Ver estilo ${img.label}`}
                  aria-pressed={isActive}
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
                </button>
              );
            })}
          </motion.div>
        </div>

      </div>
    </section>
  );
}