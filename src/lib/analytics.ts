// Analítica con Umami (sin cookies). El script solo se incluye en producción y si UMAMI_WEBSITE_ID
// está definido (src/lib/site.ts), y solo envía datos desde los dominios públicos. Si no cargó
// (dev, sin ID, bloqueador de anuncios), track() no hace nada.

declare global {
  interface Window {
    umami?: { track: (event: string) => void };
  }
}

export function track(event: string): void {
  try {
    window.umami?.track(event);
  } catch {
    // La analítica nunca debe romper la calculadora.
  }
}

let used = false;

/** Una vez por visita: la primera vez que alguien cambia la lista, el descuento o carga una lista. */
export function trackFirstUse(): void {
  if (used) return;
  used = true;
  track('Usó la calculadora');
}
