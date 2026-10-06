// Idiomas de la interfaz. El servidor elige uno por petición (ver src/middleware.ts) y el
// script de la página lo lee de <html lang>.
import { en } from './en';
import { es, type Dict } from './es';

export type { Dict };
export type Lang = 'es' | 'en';

export const LANGS: readonly Lang[] = ['es', 'en'];
/** Nombre de cada idioma en su propio idioma (selector ES · EN). */
export const LANG_NAMES: Record<Lang, string> = { es: 'Español', en: 'English' };
/** Para cualquier idioma que no sea español ni inglés, o si el navegador no envía ninguno. */
export const DEFAULT_LANG: Lang = 'en';
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
 * Idioma de la respuesta: primero la elección guardada en la cookie; si no hay, el idioma
 * soportado con mayor peso (q) en Accept-Language; si ninguno coincide, DEFAULT_LANG.
 * Con pesos iguales gana el que aparece primero.
 */
export function pickLang(cookie: string | undefined, acceptLanguage: string | null | undefined): Lang {
  if (isLang(cookie)) return cookie;
  let best: Lang = DEFAULT_LANG;
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
