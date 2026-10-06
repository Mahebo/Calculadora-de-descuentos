// Textos en español. en.ts debe tener exactamente la misma forma (tipo Dict).

const itemsLabel = (n: number) => n + (n === 1 ? ' ítem' : ' ítems');

export const es = {
  lang: 'es',
  /** Formato de números, dinero y fechas. */
  locale: 'es-CO',
  ogLocale: 'es_CO',

  seo: {
    title: 'Calculadora de Descuentos para Emprendedores | Mahebo',
    ogTitle: 'Calculadora de descuentos para emprendedores',
    description:
      'Calcula descuentos y conoce con precisión cuánto ganas en cada venta. Una herramienta para emprendedores que te ayuda a controlar tu margen de ganancia al ofrecer o recibir descuentos.',
    image: '/ogimage.jpg',
    imageAlt: 'Calculadora de descuentos: etiqueta de precio con el símbolo de porcentaje',
    browserRequirements: 'Requiere JavaScript.',
    priceCurrency: 'COP',
  },

  header: {
    title: 'Calculadora de descuento',
    subtitle:
      'Establece el % de descuento, agrega ítems con precio por unidad y cantidad. El total, el descuento y la ganancia potencial se calculan solos.',
    discount: 'Descuento',
    languageNav: 'Idioma',
  },

  table: {
    section: 'Ítems',
    heading: 'Ítems',
    item: 'Ítem',
    unitPrice: 'Precio unidad',
    quantity: 'Cantidad',
    totalPrice: 'Precio total',
    discounted: 'Con descuento',
    sum: 'Suma',
    namePlaceholder: 'Nombre del ítem',
    toggleTitle: 'Tener en cuenta en las sumas',
    toggleAria: (n: number) => `Tener en cuenta el ítem ${n}`,
    nameAria: (n: number) => `Nombre del ítem ${n}`,
    priceAria: (n: number) => `Precio por unidad del ítem ${n}`,
    qtyAria: (n: number) => `Cantidad del ítem ${n}`,
    deleteAria: (n: number) => `Eliminar ítem ${n}`,
    itemsLabel,
    /** "3 ítems", "1 ítem" o "2 de 3 ítems activos". */
    countLabel: (active: number, count: number) =>
      active === count ? itemsLabel(active) : `${active} de ${count} ítems activos`,
    examplesNote: 'Las filas iniciales son ejemplos. Edítalas o vacía la lista.',
    empty: 'Lista vacía. Usa "Agregar ítem" para empezar.',
    examples: ['Ítem de ejemplo A', 'Ítem de ejemplo B', 'Ítem de ejemplo C'],
  },

  actions: {
    add: 'Agregar ítem',
    clear: 'Vaciar lista',
    pdf: 'Descargar PDF',
  },

  results: {
    pay: 'Total a pagar',
    payHint: 'Suma con descuento de los ítems activos.',
    gain: 'Ganancia potencial',
    /** Rodean al porcentaje: "…total a pagar (43 % del total)." */
    gainHintBefore: 'Suma de precio total menos total a pagar (',
    gainHintAfter: ' % del total).',
    githubAria: 'Mahebo en GitHub',
    /** Firma: "Hecho con ♥ por Mahebo™"; `love` lo lee el lector de pantalla en lugar del corazón. */
    madeWith: 'Hecho con',
    love: 'amor',
    by: 'por',
  },

  banner: {
    extraLine1: 'extra en',
    extraLine2: 'Hostinger',
    title: 'Obtén un descuento adicional en tu plan de hosting.',
    subtitle: 'Entra desde aquí y el descuento de referido se aplicará automáticamente.',
  },

  history: {
    heading: 'Historial',
    namePlaceholder: 'Nombre para esta lista (opcional)',
    nameAria: 'Nombre para guardar esta lista',
    save: 'Guardar en historial',
    hint: 'Se guarda solo en este navegador. Cargar una lista reemplaza la actual.',
    empty: 'Sin listas guardadas todavía.',
    emptyList: 'Lista vacía. Agrega al menos un ítem antes de guardar.',
    blocked: 'No se pudo guardar. Este navegador bloquea el almacenamiento local.',
    saved: (name: string) => `Guardada: ${name}.`,
    loaded: (name: string) => `Cargada: ${name}.`,
    defaultName: (date: string) => `Lista del ${date}`,
    load: 'Cargar',
    delete: 'Eliminar',
    deleteAria: (name: string) => `Eliminar del historial: ${name}`,
    meta: (m: { when: string; count: number; total: string; pct: string; pay: string; gain: string }) =>
      `${m.when} · ${itemsLabel(m.count)} · Total ${m.total} · A pagar (−${m.pct} %) ${m.pay} · Ganancia ${m.gain}`,
  },

  pdf: {
    defaultTitle: 'Lista de ítems',
    /** Nombre del archivo si el título no deja letras ni números. */
    fileFallback: 'lista',
    discount: (pct: string) => `Descuento ${pct} %`,
    columns: {
      item: 'ÍTEM',
      unitPrice: 'PRECIO UNIDAD',
      qty: 'CANT.',
      total: 'PRECIO TOTAL',
      discounted: 'CON DESCUENTO',
    },
    fallbackName: (n: number) => `Ítem ${n}`,
    sumLabel: (n: number) => `Suma precio total (${itemsLabel(n)})`,
    pay: 'Total a pagar',
    gain: 'Ganancia potencial',
    noActive: 'No hay ítems activos para exportar.',
    preparing: 'Preparando descarga…',
    loadFailed: 'No cargó el generador de PDF. Recarga la página e intenta de nuevo.',
    buildFailed: 'No se pudo generar el PDF.',
    sent: 'Descarga enviada al navegador. Si no aparece el archivo, esta vista bloquea descargas.',
    blocked: 'Esta vista bloquea la descarga de archivos.',
  },
};

export type Dict = typeof es;
