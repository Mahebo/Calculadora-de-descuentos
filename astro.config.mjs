// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// URL pública: base de canonical, og:url, og:image, robots.txt y sitemap.
const site = 'https://calculadora.mahebo.com';

export default defineConfig({
  site,
  // La página se genera en el servidor para elegir el idioma de cada visita (src/middleware.ts).
  // Lo demás (robots.txt, assets) sigue siendo estático.
  adapter: node({ mode: 'standalone' }),
  // Escucha en todas las interfaces (necesario dentro del contenedor de Coolify) en el puerto 4321.
  // Las variables de entorno HOST y PORT tienen prioridad.
  server: { host: true, port: 4321 },
  integrations: [
    // La página no es prerenderizada, así que el sitemap no la ve sola.
    sitemap({ customPages: [`${site}/`] }),
  ],
  vite: {
    plugins: [tailwindcss()],
    // jspdf solo se importa al pulsar "Descargar PDF". En dev se preempaqueta al arrancar
    // para que Vite no responda 504 "Outdated Optimize Dep" al descubrirlo tarde.
    optimizeDeps: { include: ['jspdf'] },
  },
});
