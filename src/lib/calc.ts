// Cálculo y formato. Funciones puras: sin DOM ni almacenamiento.

export interface Item {
  name: string;
  price: number | string;
  qty: number | string;
  /** Ausente equivale a activo. */
  on?: boolean;
}

export interface Totals {
  /** Suma de precio total de los ítems activos. */
  total: number;
  /** Suma con descuento de los ítems activos (total a pagar). */
  pay: number;
  /** total − pay. */
  gain: number;
  active: number;
  count: number;
}

const formatters = new Map<string, Intl.NumberFormat>();

/** Formateador por locale (es-CO, en-US…), creado una sola vez. */
function fmt(locale: string): Intl.NumberFormat {
  let f = formatters.get(locale);
  if (!f) {
    f = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
    formatters.set(locale, f);
  }
  return f;
}

/** Vacío, negativo o no numérico cuenta como 0. */
export function pos(v: unknown): number {
  const n = parseFloat(String(v));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

/** Descuento máximo: con 100 % o más no habría nada que pagar. */
export const MAX_PCT = 99;

/** Descuento limitado a 0–MAX_PCT. */
export function clampPct(v: unknown): number {
  const p = parseFloat(String(v));
  return Number.isFinite(p) ? Math.min(MAX_PCT, Math.max(0, p)) : 0;
}

export function isActive(it: Item): boolean {
  return it.on !== false;
}

export function itemTotal(it: Item): number {
  return pos(it.price) * pos(it.qty);
}

export function itemDiscounted(it: Item, pct: unknown): number {
  return itemTotal(it) * (1 - clampPct(pct) / 100);
}

export function summarize(items: readonly Item[], pct: unknown): Totals {
  let total = 0;
  let pay = 0;
  let active = 0;
  for (const it of items) {
    if (!isActive(it)) continue;
    total += itemTotal(it);
    pay += itemDiscounted(it, pct);
    active++;
  }
  return { total, pay, gain: total - pay, active, count: items.length };
}

export function num(n: number, locale: string): string {
  return fmt(locale).format(n);
}

/** "$130.245" en es-CO, "$130,245" en en-US. */
export function money(n: number, locale: string): string {
  return '$' + fmt(locale).format(Math.round(n * 100) / 100);
}

/** Minúsculas, sin tildes, con guiones. Si no queda nada, `fallback`. */
export function slugify(title: string, fallback = 'lista'): string {
  return (
    title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || fallback
  );
}

/** Fecha local en formato AAAA-MM-DD. */
export function dateStamp(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}

export function pdfFilename(title: string, d: Date, fallback?: string): string {
  return slugify(title, fallback) + '-' + dateStamp(d) + '.pdf';
}
