"use client";

import { motion } from "framer-motion";
import { Star, Quote, CheckCircle2 } from "lucide-react";

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

export function Testimonials() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
    },
  };

  return (
    <section className="relative overflow-hidden bg-[#0c0a09] py-28 text-stone-100">
      {/* Glow / Resplandor ambiental de fondo */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-600/10 blur-[140px]" />

      {/* Malla decorativa de fondo */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1f1915_1px,transparent_1px),linear-gradient(to_bottom,#1f1915_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="mb-20 text-center">
          <div className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
            <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-amber-500/60" />
            Experiencias Reales
            <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-amber-500/60" />
          </div>

          <h2 className="mt-4 font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Lo que dicen <span className="text-amber-400">de nosotros</span>
          </h2>

          <div className="mx-auto my-4 h-[1px] w-12 bg-amber-500/40" />

          <p className="mx-auto max-w-xl text-sm font-light text-stone-400 sm:text-base">
            La confianza y satisfacción de nuestros clientes son nuestro mejor sello de garantía.
          </p>
        </div>

        {/* Grid de Testimonios */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {TESTIMONIALS.map((testimonial) => (
            <motion.figure
              key={testimonial.author}
              variants={cardVariants}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-stone-800/80 bg-stone-900/60 p-8 backdrop-blur-xl transition-all duration-500 hover:border-amber-500/40 hover:bg-stone-900/90 hover:shadow-2xl hover:shadow-amber-500/10"
            >
              {/* Ícono gigante de comillas marcas de agua */}
              <Quote className="absolute right-6 top-6 h-20 w-20 text-stone-800/30 transition-colors duration-500 group-hover:text-amber-500/10 select-none pointer-events-none" />

              <div>
                {/* Estrellas + Tag de verificado */}
                <div className="flex items-center justify-between mb-6">
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

                {/* Cita / Testimonio */}
                <blockquote className="relative z-10 font-serif text-sm leading-relaxed text-stone-300 font-light italic">
                  “{testimonial.quote}”
                </blockquote>
              </div>

              {/* Separador y Datos del Autor */}
              <figcaption className="mt-8 pt-6 border-t border-stone-800/80 flex items-center gap-4">
                {/* Avatar con Iniciales */}
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-amber-500/30 bg-gradient-to-br from-amber-500/20 to-orange-600/10 font-mono text-sm font-bold text-amber-400 shadow-inner group-hover:border-amber-500/60 transition-colors">
                  {testimonial.avatar}
                </div>

                {/* Nombre y Cargo */}
                <div className="truncate">
                  <span className="block font-serif text-base font-bold text-white transition-colors group-hover:text-amber-200">
                    {testimonial.author}
                  </span>
                  <span className="block text-xs font-light text-amber-500/90 truncate">
                    {testimonial.role} · <span className="text-stone-400">{testimonial.company}</span>
                  </span>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}