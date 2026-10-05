// Lectura y escritura en localStorage. Si el navegador lo bloquea, todo sigue
// funcionando en memoria: cada acceso va dentro de try/catch.
import type { Item } from './calc';

export const KEY = 'calc-descuento-v1';
export const HKEY = 'calc-descuento-historial-v1';

export interface State {
  pct: number | string;
  /** true mientras se muestran las filas de ejemplo sin editar. */
  examples: boolean;
  items: Item[];
}

export interface HistoryEntry {
  name: string;
  at: number;
  pct: number;
  items: Item[];
}

function exampleState(): State {
  return {
    pct: 43,
    examples: true,
    items: [
      { name: 'Ítem de ejemplo A', price: 100000, qty: 2 },
      { name: 'Ítem de ejemplo B', price: 45000, qty: 5 },
      { name: 'Ítem de ejemplo C', price: 28500, qty: 1 },
    ],
  };
}

function isItemList(v: unknown): v is Item[] {
  return Array.isArray(v) && v.every((it) => typeof it === 'object' && it !== null);
}

/** qty ausente equivale a 1. */
function withQty(items: Item[]): Item[] {
  for (const it of items) if (it.qty == null) it.qty = 1;
  return items;
}

function read(key: string): unknown {
  try {
    return JSON.parse(localStorage.getItem(key) ?? 'null');
  } catch {
    return null;
  }
}

function write(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/** Lista actual guardada o, si no hay, las filas de ejemplo. */
export function loadState(): State {
  const saved = read(KEY) as Partial<State> | null;
  if (saved && isItemList(saved.items)) {
    return { pct: saved.pct ?? 43, examples: saved.examples === true, items: withQty(saved.items) };
  }
  return exampleState();
}

export function saveState(state: State): void {
  write(KEY, state);
}

export function loadHistory(): HistoryEntry[] {
  const h = read(HKEY);
  if (!Array.isArray(h)) return [];
  const valid: HistoryEntry[] = h.filter((e) => e && isItemList(e.items));
  for (const e of valid) withQty(e.items);
  return valid;
}

/** false si el navegador no permitió guardar. */
export function saveHistory(history: HistoryEntry[]): boolean {
  return write(HKEY, history);
}
