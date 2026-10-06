# Calculadora de descuento

Calculadora de precios con descuento, en español e inglés. Agregas ítems con precio por unidad y cantidad, activas o desactivas cada uno y la página calcula el total a pagar y la ganancia potencial. La lista actual y un historial de listas se guardan en el navegador (`localStorage`), y la lista se puede descargar en PDF.

Hecha con Astro, Tailwind CSS v4 y TypeScript, sin framework de UI.

## Cómo correrlo

Requiere Node 22.12 o superior y pnpm.

```sh
pnpm install
cp .env.example .env   # y ajusta los valores (ver "Configuración")
pnpm dev               # servidor de desarrollo en http://localhost:4321
pnpm build             # revisa tipos (astro check) y genera el servidor en dist/
pnpm start             # arranca el servidor de producción (puerto 4321), leyendo .env si existe
pnpm test              # pruebas de cálculo e idiomas con Vitest
```

`pnpm build` genera un servidor Node en `dist/server/entry.mjs` y los archivos estáticos en `dist/client/`. `pnpm start` sirve ambos. Escucha en `0.0.0.0:4321`; las variables de entorno `HOST` y `PORT` lo cambian.

## Configuración

Se hace con variables de entorno. En local van en `.env` (copia de `.env.example`, no se sube al repositorio); en producción se definen en el servidor. Se leen al arrancar, así que cambiarlas no requiere volver a compilar.

| Variable | Obligatoria | Para qué |
|---|---|---|
| `SITE_URL_ES` | sí | Dominio en español, con `https://` y sin barra final. |
| `SITE_URL_EN` | sí | Dominio en inglés, con `https://` y sin barra final. |
| `UMAMI_WEBSITE_ID` | no | ID del sitio en [Umami](https://umami.is). Sin valor, no se carga la analítica. |

Si falta una variable obligatoria, el servidor responde con error y el log indica cuál.

## Idiomas

El servidor decide dos cosas en cada petición (`src/middleware.ts`):

- **Metadatos según el dominio.** En el dominio de `SITE_URL_ES`, el título, la descripción, la URL canónica, Open Graph (con `public/ogimage.jpg`), X y JSON-LD van en español; en el de `SITE_URL_EN`, en inglés (con `public/ogimage-en.jpg`). Cada dominio enlaza al otro con `hreflang` y tiene su propio `robots.txt` y `sitemap.xml`.
- **Interfaz según la persona.** Primero el idioma elegido en el selector (cookie `lang`), luego el del navegador (`Accept-Language`). Si el navegador no pide español ni inglés, o no envía ninguno (como los buscadores), el idioma del dominio.

Todos los textos, incluidos SEO, mensajes y PDF, están en `src/i18n/es.ts` y `src/i18n/en.ts`, que deben tener las mismas claves (lo comprueba una prueba).

## Despliegue con Coolify

1. Apunta los dos dominios (registros DNS A o CNAME) al servidor.
2. En la aplicación de Coolify:
   - **Domains:** los dos, separados por coma (por ejemplo `https://calculadora.mahebo.com,https://calculator.mahebo.com`).
   - **Build pack:** Nixpacks, con "Is it a static site?" desmarcado.
   - **Start command:** `pnpm start`. **Ports exposes:** `4321`.
   - **Environment variables:** `SITE_URL_ES`, `SITE_URL_EN` y, si usas analítica, `UMAMI_WEBSITE_ID`.
3. Despliega. El log debe mostrar el servidor escuchando en `http://0.0.0.0:4321`.
