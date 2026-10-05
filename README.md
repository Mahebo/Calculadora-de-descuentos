# Calculadora de descuento

Calculadora de precios con descuento. Agregas ítems con precio por unidad y cantidad, activas o desactivas cada uno y la página calcula el total a pagar y la ganancia potencial. La lista actual y un historial de listas se guardan en el navegador (`localStorage`), y la lista se puede descargar en PDF.

Hecha con Astro, Tailwind CSS v4 y TypeScript, sin framework de UI.

## Cómo correrlo

Requiere Node 22.12 o superior y pnpm.

```sh
pnpm install
pnpm dev       # servidor de desarrollo en http://localhost:4321
pnpm build     # revisa tipos (astro check) y genera el sitio
pnpm preview   # sirve el resultado del build en local
pnpm test      # pruebas de cálculo con Vitest
```

`pnpm build` genera un sitio estático en `dist/`, listo para cualquier hosting de archivos estáticos.
