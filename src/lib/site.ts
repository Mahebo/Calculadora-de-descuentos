// Configuración del despliegue, desde variables de entorno (ver .env.example y README).
// Se lee al arrancar el servidor, así que cambiarla no requiere volver a compilar.
import { SITE_URL_EN, SITE_URL_ES, UMAMI_WEBSITE_ID } from 'astro:env/server';
import type { Lang } from '../i18n';

/**
 * Dominio de cada idioma (protocolo + host, sin barra final). Define los metadatos de la página
 * (title, description, Open Graph, canonical), robots.txt, sitemap.xml y el idioma de la interfaz
 * cuando el navegador no pide español ni inglés.
 */
export const ORIGINS: Record<Lang, string> = {
  es: new URL(SITE_URL_ES).origin,
  en: new URL(SITE_URL_EN).origin,
};

/** ID del sitio en Umami. Sin valor, la página no carga la analítica. */
export const UMAMI_ID: string | undefined = UMAMI_WEBSITE_ID || undefined;
