import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* tu configuración existente... */
  typescript: {
    // ⚠️ Ignora errores de TypeScript en la compilación de Vercel
    ignoreBuildErrors: true,
  },
  eslint: {
    // ⚠️ Ignora errores de ESLint en la compilación de Vercel
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;