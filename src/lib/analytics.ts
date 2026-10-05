// Analítica con Umami (sin cookies). El script solo se incluye en el build de producción y solo
// envía datos desde el dominio público; si no cargó (dev, bloqueador de anuncios), track() no hace nada.

declare global {
  interface Window {
    umami?: { track: (event: string) => void };
  }
}

export const UMAMI_WEBSITE_ID = '4cad43a3-c71b-43d3-a6e0-ced9a8541a41';

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
