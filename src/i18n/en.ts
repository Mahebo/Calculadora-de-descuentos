// English texts. Same shape as es.ts (Dict type).
import type { Dict } from './es';

const itemsLabel = (n: number) => n + (n === 1 ? ' item' : ' items');

export const en: Dict = {
  lang: 'en',
  locale: 'en-US',
  ogLocale: 'en_US',

  seo: {
    title: 'Discount Calculator for Entrepreneurs | Mahebo',
    ogTitle: 'Discount calculator for entrepreneurs',
    description:
      'Calculate discounts and know exactly how much you earn on every sale. A tool for entrepreneurs that helps you control your profit margin when offering or receiving discounts.',
    image: '/ogimage-en.jpg',
    imageAlt: 'Discount calculator: price tag with a percent sign',
    browserRequirements: 'Requires JavaScript.',
    priceCurrency: 'USD',
  },

  header: {
    title: 'Discount calculator',
    subtitle:
      'Set the discount %, add items with their unit price and quantity. The total, the discount and the potential profit are calculated automatically.',
    discount: 'Discount',
    languageNav: 'Language',
  },

  table: {
    section: 'Items',
    heading: 'Items',
    item: 'Item',
    unitPrice: 'Unit price',
    quantity: 'Quantity',
    totalPrice: 'Total price',
    discounted: 'Discounted',
    sum: 'Sum',
    namePlaceholder: 'Item name',
    toggleTitle: 'Include in the totals',
    toggleAria: (n: number) => `Include item ${n}`,
    nameAria: (n: number) => `Item ${n} name`,
    priceAria: (n: number) => `Item ${n} unit price`,
    qtyAria: (n: number) => `Item ${n} quantity`,
    deleteAria: (n: number) => `Delete item ${n}`,
    itemsLabel,
    countLabel: (active: number, count: number) =>
      active === count ? itemsLabel(active) : `${active} of ${count} items active`,
    examplesNote: 'The first rows are examples. Edit them or clear the list.',
    empty: 'Empty list. Use "Add item" to get started.',
    examples: ['Sample item A', 'Sample item B', 'Sample item C'],
  },

  actions: {
    add: 'Add item',
    clear: 'Clear list',
    pdf: 'Download PDF',
  },

  results: {
    pay: 'Total to pay',
    payHint: 'Discounted sum of the active items.',
    gain: 'Potential profit',
    gainHintBefore: 'Total price sum minus total to pay (',
    gainHintAfter: '% of the total).',
    githubAria: 'Mahebo on GitHub',
    madeWith: 'Made with',
    love: 'love',
    by: 'by',
  },

  banner: {
    extraLine1: 'extra on',
    extraLine2: 'Hostinger',
    title: 'Get an additional discount on your hosting plan.',
    subtitle: 'Sign up from here and the referral discount will be applied automatically.',
  },

  history: {
    heading: 'History',
    namePlaceholder: 'Name for this list (optional)',
    nameAria: 'Name to save this list',
    save: 'Save to history',
    hint: 'Saved only in this browser. Loading a list replaces the current one.',
    empty: 'No saved lists yet.',
    emptyList: 'Empty list. Add at least one item before saving.',
    blocked: "Couldn't save. This browser blocks local storage.",
    saved: (name: string) => `Saved: ${name}.`,
    loaded: (name: string) => `Loaded: ${name}.`,
    defaultName: (date: string) => `List from ${date}`,
    load: 'Load',
    delete: 'Delete',
    deleteAria: (name: string) => `Delete from history: ${name}`,
    meta: (m: { when: string; count: number; total: string; pct: string; pay: string; gain: string }) =>
      `${m.when} · ${itemsLabel(m.count)} · Total ${m.total} · To pay (−${m.pct}%) ${m.pay} · Profit ${m.gain}`,
  },

  pdf: {
    defaultTitle: 'Item list',
    fileFallback: 'list',
    discount: (pct: string) => `Discount ${pct}%`,
    columns: {
      item: 'ITEM',
      unitPrice: 'UNIT PRICE',
      qty: 'QTY',
      total: 'TOTAL PRICE',
      discounted: 'DISCOUNTED',
    },
    fallbackName: (n: number) => `Item ${n}`,
    sumLabel: (n: number) => `Total price sum (${itemsLabel(n)})`,
    pay: 'Total to pay',
    gain: 'Potential profit',
    noActive: 'There are no active items to export.',
    preparing: 'Preparing download…',
    loadFailed: "The PDF generator didn't load. Reload the page and try again.",
    buildFailed: "Couldn't generate the PDF.",
    sent: "Download sent to the browser. If the file doesn't appear, this view blocks downloads.",
    blocked: 'This view blocks file downloads.',
  },
};
