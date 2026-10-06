# Calculadora de descuento

Calculadora de precios con descuento, en español e inglés. Agregas ítems con precio por unidad y cantidad, activas o desactivas cada uno y la página calcula el total a pagar y la ganancia potencial. La lista actual y un historial de listas se guardan en el navegador (`localStorage`), y la lista se puede descargar en PDF.

Hecha con Astro, Tailwind CSS v4 y TypeScript, sin framework de UI.

## Cómo correrlo

Requiere Node 22.12 o superior y pnpm.

```sh
pnpm install
pnpm dev       # servidor de desarrollo en http://localhost:4321
pnpm build     # revisa tipos (astro check) y genera el servidor en dist/
pnpm start     # arranca el servidor de producción (puerto 4321)
pnpm test      # pruebas de cálculo e idiomas con Vitest
```

`pnpm build` genera un servidor Node en `dist/server/entry.mjs` y los archivos estáticos en `dist/client/`. `pnpm start` sirve ambos. Escucha en `0.0.0.0:4321`; las variables de entorno `HOST` y `PORT` lo cambian.

## Idiomas

La misma URL responde en español o en inglés. El servidor elige el idioma en cada petición (`src/middleware.ts`):

1. el que la persona eligió con el selector ES · EN (se guarda en la cookie `lang`);
2. si no hay elección, el idioma del navegador (`Accept-Language`);
3. si no es español ni inglés, inglés.

Todos los textos, incluidos SEO, Open Graph, mensajes y PDF, están en `src/i18n/es.ts` y `src/i18n/en.ts`, que deben tener las mismas claves (lo comprueba una prueba).

La URL pública (`site` en `astro.config.mjs`) es la base de la URL canónica, las etiquetas Open Graph, `robots.txt` y el sitemap. Si cambia el dominio, se cambia solo ahí.
