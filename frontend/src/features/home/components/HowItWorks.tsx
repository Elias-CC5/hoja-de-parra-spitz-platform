"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Flame, Utensils, ChefHat, ArrowRight } from "lucide-react";

// Datos con imágenes por URL directa (Unsplash)
const SERVICES = [
  {
    number: "01",
    tagNumber: "N.º 01",
    badge: "MÁS SOLICITADO",
    badgeIcon: Flame,
    title: "Buffet Parrillero",
    subtitle: "EVENTOS CORPORATIVOS · REUNIONES FAMILIARES",
    description:
      "Carnes selectas a la parrilla, anticuchos, chorizo parrillero y guarniciones tradicionales.",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1000&q=80",
  },
  {
    number: "02",
    tagNumber: "N.º 02",
    badge: "EXPERIENCIA INTERNACIONAL",
    badgeIcon: Utensils,
    title: "Buffet Árabe",
    subtitle: "BODAS · EVENTOS TEMÁTICOS",
    description:
      "Shawarma, falafel, hummus, tabule y panes árabes recién horneados.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80",
  },
  {
    number: "03",
    tagNumber: "N.º 03",
    badge: "SABOR DE CASA",
    badgeIcon: ChefHat,
    title: "Buffet Criollo",
    subtitle: "CUMPLEAÑOS · CELEBRACIONES ÍNTIMAS",
    description:
      "Ají de gallina, lomo saltado, arroz con pollo y postres tradicionales.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80", // Puedes cambiar esta URL por la imagen que prefieras
  },
];

export function BuffetServices() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
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
      {/* Resplandor ambiental de fondo */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[450px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-600/10 blur-[150px]" />

      {/* Malla sutil */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1f1915_1px,transparent_1px),linear-gradient(to_bottom,#1f1915_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-amber-500">
            <span className="h-[1px] w-8 bg-gradient-to-r from-transparent to-amber-500/60" />
            Nuestras Especialidades
            <span className="h-[1px] w-8 bg-gradient-to-l from-transparent to-amber-500/60" />
          </div>

          <h2 className="mt-4 font-serif text-3xl font-bold tracking-tight text-white sm:text-5xl">
            Servicios de Buffet <span className="text-amber-400">Exclusive</span>
          </h2>

          <div className="mx-auto my-4 h-[1px] w-12 bg-amber-500/40" />

          <p className="mx-auto max-w-xl text-sm font-light text-stone-400 sm:text-base">
            Propuestas culinarias conceptuales y personalizadas para hacer de tu evento una experiencia sensorial memorable.
          </p>
        </div>

        {/* Grid de Tarjetas */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {SERVICES.map((service) => {
            const BadgeIcon = service.badgeIcon;

            return (
              <motion.div
                key={service.title}
                variants={cardVariants}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-stone-800/80 bg-stone-900/60 backdrop-blur-xl transition-all duration-500 hover:border-amber-500/40 hover:bg-stone-900/90 hover:shadow-2xl hover:shadow-amber-500/10"
              >
                {/* Imagen desde URL externa */}
                <div className="relative h-64 w-full overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    unoptimized
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/20 to-transparent" />

                  {/* Badge Superior Izquierdo */}
                  <div className="absolute left-4 top-4">
                    <span className="inline-flex items-center rounded-md border border-stone-700/60 bg-stone-950/80 px-2.5 py-1 text-[10px] font-bold tracking-wider text-amber-400 backdrop-blur-md">
                      {service.badge}
                    </span>
                  </div>

                  {/* Badge Superior Derecho */}
                  <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-amber-500/30 bg-stone-950/70 text-amber-400 backdrop-blur-md">
                    <BadgeIcon className="h-4 w-4" />
                  </div>

                  {/* Número marca de agua */}
                  <span className="absolute bottom-1 left-4 font-serif text-5xl font-bold italic text-amber-500/20 select-none">
                    {service.number}
                  </span>
                </div>

                <div className="relative border-b border-dashed border-stone-800/80" />

                {/* Contenido */}
                <div className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-serif text-xl font-bold text-white transition-colors group-hover:text-amber-200">
                        {service.title}
                      </h3>
                      <span className="font-mono text-xs italic text-amber-400/80">
                        {service.tagNumber}
                      </span>
                    </div>

                    <p className="mt-1 text-[11px] font-semibold tracking-wider text-amber-500/90 uppercase">
                      {service.subtitle}
                    </p>

                    <p className="mt-3 text-xs leading-relaxed font-light text-stone-400">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-stone-800/40">
                    <button className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 transition-colors hover:text-amber-300">
                      Explorar propuesta
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}