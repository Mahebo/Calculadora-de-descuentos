// Idiomas de cada respuesta, decididos en el servidor:
// - metadatos (SEO, Open Graph): por dominio (SITE_URL_ES → español, SITE_URL_EN → inglés);
// - interfaz:
//   1) ?lang=es|en (selector de idioma): guarda la elección en una cookie y vuelve a la URL sin el parámetro;
//   2) cookie con la elección guardada;
//   3) idioma del navegador (Accept-Language);
//   4) si no pide español ni inglés (o no envía ninguno, como los buscadores), el idioma del dominio.
import { defineMiddleware } from 'astro:middleware';
import { DEFAULT_LANG, domainLang, isLang, LANG_COOKIE, pickLang } from './i18n';
import { ORIGINS } from './lib/site';

const ONE_YEAR = 60 * 60 * 24 * 365;

export const onRequest = defineMiddleware(async (ctx, next) => {
  // Las rutas prerenderizadas (robots.txt) se generan en el build: no hay petición que leer.
  if (ctx.isPrerendered) {
    ctx.locals.lang = ctx.locals.seoLang = DEFAULT_LANG;
    return next();
  }

  const chosen = ctx.url.searchParams.get('lang');
  if (isLang(chosen)) {
    ctx.cookies.set(LANG_COOKIE, chosen, {
      path: '/',
      maxAge: ONE_YEAR,
      sameSite: 'lax',
      httpOnly: true,
      secure: ctx.url.protocol === 'https:',
    });
    const clean = new URL(ctx.url);
    clean.searchParams.delete('lang');
    return ctx.redirect(clean.pathname + clean.search, 303);
  }

  // Host tal como llega del proxy (Coolify/Traefik lo conserva). Solo se compara con ORIGINS.
  const seoLang = domainLang(ctx.request.headers.get('host'), ORIGINS);
  const lang = pickLang(ctx.cookies.get(LANG_COOKIE)?.value, ctx.request.headers.get('accept-language'), seoLang);
  ctx.locals.seoLang = seoLang;
  ctx.locals.lang = lang;

  const response = await next();
  // La misma URL cambia según idioma y cookie: que ningún caché mezcle versiones.
  // (El dominio ya forma parte de la clave de cualquier caché.)
  response.headers.set('Content-Language', lang);
  response.headers.append('Vary', 'Accept-Language, Cookie');
  return response;
});
