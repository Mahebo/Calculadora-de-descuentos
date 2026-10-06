// @ts-check
import { defineConfig, envField } from 'astro/config';
import node from '@astrojs/node';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // La página, robots.txt y sitemap.xml se generan en el servidor según el dominio y el idioma de
  // cada visita (src/middleware.ts). Los assets son estáticos.
  adapter: node({ mode: 'standalone' }),
  // Escucha en todas las interfaces (necesario dentro del contenedor de Coolify) en el puerto 4321.
  // Las variables de entorno HOST y PORT tienen prioridad.
  server: { host: true, port: 4321 },
  env: {
    // Configuración del despliegue (ver .env.example). `access: 'secret'` hace que se lea al arrancar
    // el servidor y no se incruste en el build: en Coolify basta con definirlas como variables de entorno.
    schema: {
      /** Dominio en español, p. ej. https://calculadora.mahebo.com */
      SITE_URL_ES: envField.string({ context: 'server', access: 'secret', url: true }),
      /** Dominio en inglés, p. ej. https://calculator.mahebo.com */
      SITE_URL_EN: envField.string({ context: 'server', access: 'secret', url: true }),
      /** ID del sitio en Umami (opcional): sin valor no se carga la analítica. */
      UMAMI_WEBSITE_ID: envField.string({ context: 'server', access: 'secret', optional: true }),
    },
  },
  vite: {
    plugins: [tailwindcss()],
    // jspdf solo se importa al pulsar "Descargar PDF". En dev se preempaqueta al arrancar
    // para que Vite no responda 504 "Outdated Optimize Dep" al descubrirlo tarde.
    optimizeDeps: { include: ['jspdf'] },
  },
});
