/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Permite cargar imágenes desde estos dominios con next/image.
    // Sin esto, next/image solo acepta imágenes locales (de la carpeta public/).
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: '**' },  // acepta cualquier HTTPS (para desarrollo)
    ],
  },
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
