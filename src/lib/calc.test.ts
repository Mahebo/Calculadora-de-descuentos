import { describe, expect, it } from 'vitest';
import {
  clampPct,
  itemDiscounted,
  itemTotal,
  money,
  pdfFilename,
  pos,
  summarize,
  type Item,
} from './calc';
import { en } from '../i18n/en';
import { es } from '../i18n/es';

describe('caso de prueba del encargo', () => {
  const items: Item[] = [
    { name: 'A', price: 100000, qty: 2 },
    { name: 'B', price: 45000, qty: 5, on: false },
    { name: 'C', price: 28500, qty: 1 },
  ];
  const s = summarize(items, 43);

  it('suma solo los ítems activos', () => {
    expect(money(s.total, 'es-CO')).toBe('$228.500');
    expect(money(s.pay, 'es-CO')).toBe('$130.245');
    expect(money(s.gain, 'es-CO')).toBe('$98.255');
  });

  it('cuenta los activos', () => {
    expect(es.table.countLabel(s.active, s.count)).toBe('2 de 3 ítems activos');
  });

  it('en inglés', () => {
    expect(money(s.total, 'en-US')).toBe('$228,500');
    expect(money(s.pay, 'en-US')).toBe('$130,245');
    expect(money(s.gain, 'en-US')).toBe('$98,255');
    expect(en.table.countLabel(s.active, s.count)).toBe('2 of 3 items active');
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
  it('formatea dinero según el locale', () => {
    expect(money(0, 'es-CO')).toBe('$0');
    expect(money(1234567.891, 'es-CO')).toBe('$1.234.567,89');
    expect(money(1234567.891, 'en-US')).toBe('$1,234,567.89');
  });

  it('singular, plural y parcial', () => {
    expect(es.table.countLabel(1, 1)).toBe('1 ítem');
    expect(es.table.countLabel(3, 3)).toBe('3 ítems');
    expect(es.table.countLabel(0, 0)).toBe('0 ítems');
    expect(en.table.countLabel(1, 1)).toBe('1 item');
    expect(en.table.countLabel(3, 3)).toBe('3 items');
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
    expect(pdfFilename('Item list', d, 'list')).toBe('item-list-2026-10-05.pdf');
    expect(pdfFilename('¿?', d, 'list')).toBe('list-2026-10-05.pdf');
  });
});
