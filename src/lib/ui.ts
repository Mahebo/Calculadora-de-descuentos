// Clases que comparten el HTML generado en el servidor y el script de la página.
// Los textos están en src/i18n/.

/**
 * Rejilla de las filas de la tabla de ítems.
 * Escritorio: 7 columnas (más estrechas entre 680 y 860 px).
 * Móvil (< 680 px): casilla y nombre / precio unidad, cantidad y eliminar / precio total y con descuento.
 */
export const rowGrid =
  'grid grid-cols-[1.375rem_minmax(0,1fr)_7rem_4.5rem_7rem_7rem_2.25rem] items-center gap-2.5 px-3.5 sm:max-[860px]:gap-2 sm:max-[860px]:grid-cols-[1.375rem_minmax(0,1fr)_6rem_3.75rem_6.25rem_6.25rem_2.25rem] max-sm:grid-cols-[1.375rem_minmax(0,1fr)_minmax(0,1fr)_2.25rem] max-sm:items-end';
export const numCell = 'min-w-0 text-right max-sm:flex max-sm:flex-col max-sm:gap-0.5';
/** Etiqueta pequeña que solo aparece en móvil, encima de cada valor (sin color; mobileLabel lo agrega). */
export const mobileLabelBase = 'hidden text-right text-[.68rem] font-semibold tracking-[.06em] uppercase max-sm:block';
export const mobileLabel = mobileLabelBase + ' text-muted';
export const outValue = 'tabular-nums wrap-anywhere';
export const emptyState = 'rounded-tile bg-soft px-4 py-7 text-center text-muted';
