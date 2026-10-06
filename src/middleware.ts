// Idioma de cada respuesta, decidido en el servidor:
// 1) ?lang=es|en (selector ES · EN): guarda la elección en una cookie y vuelve a la URL sin el parámetro;
// 2) cookie con la elección guardada;
// 3) idioma del navegador (Accept-Language); inglés si no es español ni inglés.
import { defineMiddleware } from 'astro:middleware';
import { DEFAULT_LANG, isLang, LANG_COOKIE, pickLang } from './i18n';

const ONE_YEAR = 60 * 60 * 24 * 365;

export const onRequest = defineMiddleware(async (ctx, next) => {
  // Las rutas prerenderizadas (robots.txt) se generan en el build: no hay petición que leer.
  if (ctx.isPrerendered) {
    ctx.locals.lang = DEFAULT_LANG;
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

  const lang = pickLang(ctx.cookies.get(LANG_COOKIE)?.value, ctx.request.headers.get('accept-language'));
  ctx.locals.lang = lang;

  const response = await next();
  // La misma URL cambia según idioma y cookie: que ningún caché mezcle versiones.
  response.headers.set('Content-Language', lang);
  response.headers.append('Vary', 'Accept-Language, Cookie');
  return response;
});
