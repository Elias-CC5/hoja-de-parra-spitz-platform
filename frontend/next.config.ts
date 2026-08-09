/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Desactiva la verificación estricta de ESLint al hacer build
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Opcional: desactiva errores estrictos de tipos al hacer build
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;