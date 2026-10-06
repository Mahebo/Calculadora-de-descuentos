import type { APIRoute } from 'astro';
import { domainLang } from '../i18n';
import { ORIGINS } from '../lib/site';

// Cada dominio anuncia su propio sitemap.
export const prerender = false;

export const GET: APIRoute = ({ request }) => {
  const origin = ORIGINS[domainLang(request.headers.get('host'), ORIGINS)];
  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${origin}/sitemap.xml\n`, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
