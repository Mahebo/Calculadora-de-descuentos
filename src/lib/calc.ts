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

const fmt = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 2 });

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

export function num(n: number): string {
  return fmt.format(n);
}

export function money(n: number): string {
  return '$' + fmt.format(Math.round(n * 100) / 100);
}

/** "1 ítem" / "3 ítems". */
export function itemsLabel(n: number): string {
  return n + (n === 1 ? ' ítem' : ' ítems');
}

/** "3 ítems", "1 ítem" o "2 de 3 ítems activos". */
export function countLabel(active: number, count: number): string {
  return active === count ? itemsLabel(active) : active + ' de ' + count + ' ítems activos';
}

/** Minúsculas, sin tildes, con guiones. */
export function slugify(title: string): string {
  return (
    title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'lista'
  );
}

/** Fecha local en formato AAAA-MM-DD. */
export function dateStamp(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}

export function pdfFilename(title: string, d: Date): string {
  return slugify(title) + '-' + dateStamp(d) + '.pdf';
}
