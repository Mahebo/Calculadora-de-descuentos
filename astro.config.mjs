// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
    // jspdf solo se importa al pulsar "Descargar PDF". En dev se preempaqueta al arrancar
    // para que Vite no responda 504 "Outdated Optimize Dep" al descubrirlo tarde.
    optimizeDeps: { include: ['jspdf'] },
  },
});
