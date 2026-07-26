"use client";

import { motion, Variants } from "framer-motion";
import { Star, Quote, CheckCircle2, Sparkles } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "El coffee break para nuestra conferencia anual llegó puntual y la presentación fue impecable. Nuestros asistentes notaron la calidad de inmediato.",
    author: "Renzo Alva",
    role: "Gerente de Eventos",
    company: "Consultora Andina",
    rating: 5,
    avatar: "RA",
  },
  {
    quote:
      "Contratamos el buffet para el matrimonio de mi hija y superó cada expectativa. El sabor, el montaje y el trato del personal fueron excepcionales.",
    author: "María Elena Rojas",
    role: "Cliente Particular",
    company: "Bodas & Eventos",
    rating: 5,
    avatar: "MR",
  },
  {
    quote:
      "Llevamos tres años pidiendo box lunch para nuestras capacitaciones. Siempre consistentes en calidad, presentación y tiempos de entrega.",
    author: "Diego Salcedo",
    role: "Jefe de RRHH",
    company: "Grupo Industrial Sur",
    rating: 5,
    avatar: "DS",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

export function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-[#0c0a09] py-28 text-stone-100">
      {/* Glow / Resplandor ambiental de fondo */}
      <div className="pointer-events-none absolute left-1/4 top-1/2 -z-0 h-[400px] w-[600px] -translate-y-1/2 rounded-full bg-amber-600/10 blur-[140px]" />

      {/* Malla decorativa de fondo */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1f1915_1px,transparent_1px),linear-gradient(to_bottom,#1f1915_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-14 lg:flex-row lg:gap-16">
          {/* Texto: ahora a la izquierda y fijo mientras el usuario recorre los testimonios */}
          <div className="lg:w-[34%] lg:shrink-0">
            <div className="lg:sticky lg:top-28 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-stone-800 bg-stone-900/90 px-4 py-1.5 mb-6 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                <span className="text-xs font-medium text-stone-300">
                  +200 eventos atendidos
                </span>
              </div>

              <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-amber-400/90 mb-3">
                Experiencias Reales
              </p>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-[1.15]">
                Lo que dicen{" "}
                <span className="font-sans italic font-light text-amber-400">
                  de nosotros
                </span>
              </h2>

              <p className="mt-6 text-sm sm:text-base text-stone-400 max-w-md mx-auto lg:mx-0 leading-relaxed">
                La confianza y satisfacción de nuestros clientes son nuestro
                mejor sello de garantía.
              </p>

              <div className="mt-8 flex items-center justify-center lg:justify-start gap-2 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
                <span className="ml-2 text-sm font-semibold text-white">5.0</span>
                <span className="text-sm text-stone-500">/ 5</span>
              </div>
            </div>
          </div>

          {/* Testimonios apilados a la derecha */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-1 flex-col gap-6"
          >
            {TESTIMONIALS.map((testimonial) => (
              <motion.figure
                key={testimonial.author}
                variants={cardVariants}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-stone-800/80 bg-stone-900/60 p-8 backdrop-blur-xl transition-all duration-500 hover:border-amber-500/40 hover:bg-stone-900/90 hover:shadow-2xl hover:shadow-amber-500/10 sm:flex-row sm:items-center sm:gap-8"
              >
                <Quote className="absolute right-6 top-6 h-20 w-20 text-stone-800/30 transition-colors duration-500 group-hover:text-amber-500/10 select-none pointer-events-none" />

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex gap-1 text-amber-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      Verificado
                    </span>
                  </div>

                  <blockquote className="relative z-10 font-serif text-sm leading-relaxed text-stone-300 font-light italic">
                    "{testimonial.quote}"
                  </blockquote>
                </div>

                <figcaption className="mt-6 pt-6 border-t border-stone-800/80 flex items-center gap-4 sm:mt-0 sm:pt-0 sm:border-t-0 sm:border-l sm:pl-8 sm:w-56 sm:shrink-0">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-amber-500/30 bg-gradient-to-br from-amber-500/20 to-orange-600/10 font-mono text-sm font-bold text-amber-400 shadow-inner group-hover:border-amber-500/60 transition-colors">
                    {testimonial.avatar}
                  </div>

                  <div className="truncate">
                    <span className="block font-serif text-base font-bold text-white transition-colors group-hover:text-amber-200">
                      {testimonial.author}
                    </span>
                    <span className="block text-xs font-light text-amber-500/90 truncate">
                      {testimonial.role}{" "}
                      <span className="text-stone-400">· {testimonial.company}</span>
                    </span>
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}