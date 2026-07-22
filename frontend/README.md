# Hoja de Parra Spitz — Frontend (Next.js 15)

Sitio web oficial: catálogo, carrito, checkout con Culqi, cotizaciones,
reservas, perfil de usuario y panel administrativo.

## Requisitos

- Node.js 20+
- Backend corriendo (ver `../backend/README.md`)

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # ajusta NEXT_PUBLIC_API_URL y NEXT_PUBLIC_CULQI_PUBLIC_KEY
npm run dev
```

Sitio disponible en `http://localhost:3000`.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 ·
shadcn/ui (configurado manualmente) · Zustand · React Hook Form + Zod ·
Axios (con refresh JWT automático) · Framer Motion · Lucide React · Culqi.js

## Sistema de diseño

Paleta propia (no genérica): verde oliva `#2C3B2E` (marca) + dorado `#B8894A`
(acento) + crema `#F7F3EC` (fondo). Tipografía `Fraunces` (display/serif) +
`Inter` (UI/sans). Todo definido en `src/app/globals.css` con dark mode
mediante clase `.dark`.

## Estructura (Feature Based)

```
src/
├── app/                 # Rutas: (public), (auth), (dashboard)
├── components/ui/       # shadcn/ui
├── components/layout/   # Navbar, Footer
├── features/            # Una carpeta por feature de negocio
├── store/                # Zustand: auth, cart, ui
├── lib/                  # axios, utils, token-storage
└── types/                # Tipos globales (calcados del backend)
```

## Features implementadas

- ✅ `auth` — login, registro (RHF + Zod)
- ✅ `home` — Hero, categorías, destacados, cómo funciona, testimonios, contacto
- ✅ `menu` — catálogo con buscador, filtros, ordenamiento, paginación
- ✅ `product-detail` — galería, reviews, relacionados, agregar al carrito
- ✅ `services-catalog` — servicios de catering + FAQ + CTA a cotización
- ✅ `cart` — drawer lateral persistente (backend)
- ✅ `checkout` — formulario de entrega + pago con Culqi.js
- ✅ `quotations` — formulario de solicitud de cotización
- ✅ `reservations` — formulario de reserva de eventos
- ✅ `profile` — pedidos, reservas, cotizaciones, favoritos, editar cuenta
- ✅ `chatbot` — widget flotante conectado al backend
- ✅ `admin` — dashboard de estadísticas, gestión de pedidos/cotizaciones/reservas/productos

## Nota sobre `next build` en este entorno

Si ves un error de `next/font` al buildear en un entorno sin acceso a
`fonts.googleapis.com`, es una restricción de red del entorno, no del código.
En un entorno con internet normal (local o CI/CD en Vercel) se resuelve solo.

## Pendiente para producción real

- CRUD completo de productos/categorías en el admin (hoy son de solo lectura;
  usar Swagger del backend mientras tanto para crear/editar)
- Tests (Jest + Testing Library / Playwright)
- Página `/nosotros`, `/terminos`, `/privacidad` (contenido legal real)
- Sitemap.xml y robots.txt dinámicos
- Analíticas (GA4 / Vercel Analytics)
