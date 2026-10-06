import type { APIRoute } from 'astro';
import { domainLang, LANGS } from '../i18n';
import { ORIGINS } from '../lib/site';

// Sitemap del dominio de la petición, con la versión en el otro idioma (hreflang).
export const prerender = false;

const PAGES = ['/'];

export const GET: APIRoute = ({ request }) => {
  const origin = ORIGINS[domainLang(request.headers.get('host'), ORIGINS)];
  const urls = PAGES.map((path) => {
    const alternates = [
      ...LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${ORIGINS[l]}${path}"/>`),
      `<xhtml:link rel="alternate" hreflang="x-default" href="${ORIGINS.en}${path}"/>`,
    ].join('');
    return `<url><loc>${origin}${path}</loc>${alternates}</url>`;
  }).join('');
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">' +
    urls +
    '</urlset>';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
