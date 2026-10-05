import { describe, expect, it } from 'vitest';
import {
  clampPct,
  countLabel,
  itemDiscounted,
  itemTotal,
  money,
  pdfFilename,
  pos,
  summarize,
  type Item,
} from './calc';

describe('caso de prueba del encargo', () => {
  const items: Item[] = [
    { name: 'A', price: 100000, qty: 2 },
    { name: 'B', price: 45000, qty: 5, on: false },
    { name: 'C', price: 28500, qty: 1 },
  ];
  const s = summarize(items, 43);

  it('suma solo los ítems activos', () => {
    expect(money(s.total)).toBe('$228.500');
    expect(money(s.pay)).toBe('$130.245');
    expect(money(s.gain)).toBe('$98.255');
  });

  it('cuenta los activos', () => {
    expect(countLabel(s.active, s.count)).toBe('2 de 3 ítems activos');
  });
});

describe('fórmulas por ítem', () => {
  it('total = precio unidad × cantidad', () => {
    expect(itemTotal({ name: '', price: '1500.5', qty: '3' })).toBeCloseTo(4501.5);
  });

  it('con descuento = total × (1 − descuento / 100)', () => {
    expect(itemDiscounted({ name: '', price: 1000, qty: 2 }, 25)).toBe(1500);
  });
});

describe('entradas inválidas', () => {
  it('vacío, negativo o no numérico cuenta como 0', () => {
    expect(pos('')).toBe(0);
    expect(pos(-5)).toBe(0);
    expect(pos('abc')).toBe(0);
    expect(pos(undefined)).toBe(0);
    expect(pos('12.5')).toBe(12.5);
  });

  it('el descuento se limita a 0–99', () => {
    expect(clampPct(100)).toBe(99);
    expect(clampPct(150)).toBe(99);
    expect(clampPct('99.5')).toBe(99);
    expect(clampPct(-3)).toBe(0);
    expect(clampPct('')).toBe(0);
    expect(clampPct('12.5')).toBe(12.5);
  });

  it('descuento fuera de rango no produce totales negativos', () => {
    const s = summarize([{ name: '', price: 100, qty: 1 }], 250);
    expect(s.pay).toBeCloseTo(1);
    expect(s.gain).toBeCloseTo(99);
  });
});

describe('formato y contador', () => {
  it('formatea dinero en es-CO', () => {
    expect(money(0)).toBe('$0');
    expect(money(1234567.891)).toBe('$1.234.567,89');
  });

  it('singular, plural y parcial', () => {
    expect(countLabel(1, 1)).toBe('1 ítem');
    expect(countLabel(3, 3)).toBe('3 ítems');
    expect(countLabel(0, 0)).toBe('0 ítems');
  });

  it('ítem sin "on" cuenta como activo', () => {
    expect(summarize([{ name: '', price: 10, qty: 1 }], 0).active).toBe(1);
  });
});

describe('nombre del PDF', () => {
  it('minúsculas, sin tildes, con guiones y fecha', () => {
    const d = new Date(2026, 9, 5, 23, 30);
    expect(pdfFilename('Lista de ítems', d)).toBe('lista-de-items-2026-10-05.pdf');
    expect(pdfFilename('  Compras: Año Nuevo!! ', d)).toBe('compras-ano-nuevo-2026-10-05.pdf');
    expect(pdfFilename('¿?', d)).toBe('lista-2026-10-05.pdf');
  });
});
