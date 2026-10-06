import { describe, expect, it } from 'vitest';
import { dict, domainLang, pickLang } from './index';
import { en } from './en';
import { es } from './es';

describe('pickLang: idioma de la respuesta', () => {
  it('español si el navegador prefiere español', () => {
    expect(pickLang(undefined, 'es-CO,es;q=0.9,en;q=0.8')).toBe('es');
    expect(pickLang(undefined, 'es')).toBe('es');
  });

  it('inglés si el navegador prefiere inglés', () => {
    expect(pickLang(undefined, 'en-US,en;q=0.9,es;q=0.8')).toBe('en');
  });

  it('respeta los pesos q aunque el idioma soportado no vaya primero', () => {
    expect(pickLang(undefined, 'pt-BR,pt;q=0.9,es;q=0.8,en;q=0.7')).toBe('es');
    expect(pickLang(undefined, 'fr-FR,fr;q=0.9,en;q=0.5,es;q=0.4')).toBe('en');
    expect(pickLang(undefined, 'en;q=0.3,es;q=0.6')).toBe('es');
  });

  it('inglés por defecto: otros idiomas, comodín o sin cabecera', () => {
    expect(pickLang(undefined, 'fr-FR,fr;q=0.9')).toBe('en');
    expect(pickLang(undefined, '*')).toBe('en');
    expect(pickLang(undefined, '')).toBe('en');
    expect(pickLang(undefined, null)).toBe('en');
  });

  it('la cookie del selector gana sobre el navegador', () => {
    expect(pickLang('es', 'en-US,en')).toBe('es');
    expect(pickLang('en', 'es-CO,es')).toBe('en');
  });

  it('ignora cookies inválidas', () => {
    expect(pickLang('fr', 'es-CO')).toBe('es');
  });

  it('sin preferencia útil usa el idioma del dominio', () => {
    expect(pickLang(undefined, null, 'es')).toBe('es');
    expect(pickLang(undefined, 'fr-FR,fr', 'es')).toBe('es');
    expect(pickLang(undefined, 'fr-FR,fr', 'en')).toBe('en');
    expect(pickLang(undefined, 'en-US', 'es')).toBe('en');
    expect(pickLang('es', 'en-US', 'en')).toBe('es');
  });
});

describe('domainLang: idioma de los metadatos según el dominio', () => {
  const origins = { es: 'https://calculadora.mahebo.com', en: 'https://calculator.mahebo.com' };
  it('cada dominio con su idioma', () => {
    expect(domainLang('calculadora.mahebo.com', origins)).toBe('es');
    expect(domainLang('calculator.mahebo.com', origins)).toBe('en');
    expect(domainLang('Calculator.Mahebo.com:443', origins)).toBe('en');
  });

  it('cualquier otro host usa español', () => {
    expect(domainLang('localhost:4321', origins)).toBe('es');
    expect(domainLang('calculator.mahebo.com.evil.com', origins)).toBe('es');
    expect(domainLang('', origins)).toBe('es');
    expect(domainLang(null, origins)).toBe('es');
  });
});

describe('diccionarios', () => {
  // Misma forma en ambos idiomas: ninguna clave sin traducir.
  const shape = (o: unknown): unknown =>
    o && typeof o === 'object' && !Array.isArray(o)
      ? Object.fromEntries(Object.entries(o).map(([k, v]) => [k, shape(v)]))
      : Array.isArray(o)
        ? o.length
        : typeof o;

  it('español e inglés tienen las mismas claves', () => {
    expect(shape(en)).toEqual(shape(es));
  });

  it('dict() cae en inglés con valores desconocidos', () => {
    expect(dict('fr')).toBe(en);
    expect(dict(undefined)).toBe(en);
    expect(dict('es')).toBe(es);
  });

  it('textos con número o nombre', () => {
    expect(es.history.meta({ when: 'w', count: 1, total: '$1', pct: '10', pay: '$0,9', gain: '$0,1' })).toBe(
      'w · 1 ítem · Total $1 · A pagar (−10 %) $0,9 · Ganancia $0,1',
    );
    expect(en.history.meta({ when: 'w', count: 2, total: '$1', pct: '10', pay: '$0.9', gain: '$0.1' })).toBe(
      'w · 2 items · Total $1 · To pay (−10%) $0.9 · Profit $0.1',
    );
    expect(en.pdf.sumLabel(1)).toBe('Total price sum (1 item)');
    expect(es.pdf.sumLabel(2)).toBe('Suma precio total (2 ítems)');
  });
});
