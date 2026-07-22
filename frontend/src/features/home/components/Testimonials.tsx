const TESTIMONIALS = [
  {
    quote:
      "El coffee break para nuestra conferencia anual llegó puntual y la presentación fue impecable. Nuestros asistentes lo notaron.",
    author: "Renzo Alva",
    role: "Gerente de eventos, Consultora Andina",
  },
  {
    quote:
      "Contratamos el buffet para el matrimonio de mi hija y superó cada expectativa. El sabor y el trato fueron excepcionales.",
    author: "María Elena Rojas",
    role: "Cliente particular",
  },
  {
    quote:
      "Llevamos tres años pidiendo box lunch para nuestras capacitaciones. Siempre consistentes en calidad y tiempos de entrega.",
    author: "Diego Salcedo",
    role: "Jefe de RRHH, Grupo Industrial Sur",
  },
];

export function Testimonials() {
  return (
    <section className="bg-primary py-20 text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-accent">Clientes</p>
          <h2 className="font-display text-3xl font-medium">Lo que dicen de nosotros</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <figure
              key={testimonial.author}
              className="rounded-lg border border-primary-foreground/10 bg-primary-foreground/5 p-6"
            >
              <blockquote className="font-display text-lg italic leading-relaxed text-primary-foreground/90">
                “{testimonial.quote}”
              </blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-medium">{testimonial.author}</span>
                <span className="block text-primary-foreground/60">{testimonial.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
