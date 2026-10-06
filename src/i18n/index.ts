// Idiomas. El servidor decide dos cosas por petición (src/middleware.ts):
// - el idioma de los metadatos (SEO, Open Graph), según el dominio;
// - el idioma de la interfaz, según la elección del selector o el navegador.
// El script de la página lee el de la interfaz de <html lang>.
import { en } from './en';
import { es, type Dict } from './es';

export type { Dict };
export type Lang = 'es' | 'en';

export const LANGS: readonly Lang[] = ['es', 'en'];
/** Nombre de cada idioma en su propio idioma (selector ES · EN). */
export const LANG_NAMES: Record<Lang, string> = { es: 'Español', en: 'English' };
/** Si no hay nada mejor (valor desconocido en dict()). */
export const DEFAULT_LANG: Lang = 'en';

/**
 * Idioma del dominio de la petición (cabecera Host), comparado con el dominio de cada idioma
 * (`origins`, de las variables de entorno: src/lib/site.ts). Cualquier otro host (localhost,
 * previews) usa español.
 */
export function domainLang(host: string | null | undefined, origins: Record<Lang, string>): Lang {
  const hostname = (host ?? '').trim().toLowerCase().replace(/:\d+$/, '');
  return LANGS.find((l) => new URL(origins[l]).hostname === hostname) ?? 'es';
}
/** Cookie que guarda la elección hecha con el selector ES · EN. */
export const LANG_COOKIE = 'lang';

const dicts: Record<Lang, Dict> = { es, en };

export function isLang(v: unknown): v is Lang {
  return v === 'es' || v === 'en';
}

export function dict(lang: unknown): Dict {
  return dicts[isLang(lang) ? lang : DEFAULT_LANG];
}

/**
 * Idioma de la interfaz: primero la elección guardada en la cookie; si no hay, el idioma
 * soportado con mayor peso (q) en Accept-Language; si ninguno coincide, `fallback` (el del dominio).
 * Con pesos iguales gana el que aparece primero.
 */
export function pickLang(
  cookie: string | undefined,
  acceptLanguage: string | null | undefined,
  fallback: Lang = DEFAULT_LANG,
): Lang {
  if (isLang(cookie)) return cookie;
  let best: Lang = fallback;
  let bestQ = 0;
  for (const part of (acceptLanguage ?? '').split(',')) {
    const [tag = '', ...params] = part.split(';');
    const base = tag.trim().toLowerCase().split('-')[0];
    if (!isLang(base)) continue;
    const qParam = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
    const q = qParam ? Number(qParam.slice(2)) : 1;
    if (Number.isFinite(q) && q > bestQ) {
      best = base;
      bestQ = q;
    }
  }
  return best;
}
