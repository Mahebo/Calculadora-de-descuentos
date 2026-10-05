// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // URL pública: base de canonical, og:url, og:image, robots.txt y sitemap.
  site: 'https://calculadora.mahebo.com',
  output: 'static',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
    // jspdf solo se importa al pulsar "Descargar PDF". En dev se preempaqueta al arrancar
    // para que Vite no responda 504 "Outdated Optimize Dep" al descubrirlo tarde.
    optimizeDeps: { include: ['jspdf'] },
  },
});
