// Generación y descarga del PDF. jsPDF se carga bajo demanda con import()
// para que no pese en la carga inicial.
import type { jsPDF as JsPDF } from 'jspdf';
import { isActive, itemDiscounted, itemTotal, money, num, clampPct, pos, type Item } from './calc';
import type { Dict } from '../i18n';

export async function loadJsPDF(): Promise<typeof JsPDF> {
  return (await import('jspdf')).jsPDF;
}

/** A4 vertical, márgenes de 15 mm, Helvetica. Solo ítems activos. Textos y formatos del idioma `t`. */
export function buildPdf(
  JsPDFCtor: typeof JsPDF,
  t: Dict,
  title: string,
  items: readonly Item[],
  pctValue: unknown,
  now: Date,
): ArrayBuffer {
  const doc = new JsPDFCtor({ unit: 'mm', format: 'a4' });
  const pct = clampPct(pctValue);
  const L = 15;
  const R = 195;
  let y = 20;
  const cols = { unit: 118, qty: 134, total: 164, disc: R };
  const active = items.filter(isActive);
  // Helvetica estándar no tiene U+202F (espacio estrecho que algunos navegadores ponen antes de "p. m.").
  const when = now.toLocaleString(t.locale, { dateStyle: 'long', timeStyle: 'short' }).replace(/ /g, ' ');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(doc.splitTextToSize(title, R - L), L, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.text(when + '  ·  ' + t.pdf.discount(num(pct, t.locale)), L, y);
  y += 10;

  function header() {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(90);
    doc.text(t.pdf.columns.item, L, y);
    doc.text(t.pdf.columns.unitPrice, cols.unit, y, { align: 'right' });
    doc.text(t.pdf.columns.qty, cols.qty, y, { align: 'right' });
    doc.text(t.pdf.columns.total, cols.total, y, { align: 'right' });
    doc.text(t.pdf.columns.discounted, cols.disc, y, { align: 'right' });
    y += 2;
    doc.setDrawColor(150);
    doc.line(L, y, R, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(20);
  }
  header();

  let sumTotal = 0;
  let sumPay = 0;
  active.forEach((it, i) => {
    const lines: string[] = doc.splitTextToSize(it.name && it.name.trim() ? it.name : t.pdf.fallbackName(i + 1), 68);
    const h = lines.length * 4.6 + 3;
    if (y + h > 280) {
      doc.addPage();
      y = 20;
      header();
    }
    const total = itemTotal(it);
    const disc = itemDiscounted(it, pct);
    doc.text(lines, L, y);
    doc.text(money(pos(it.price), t.locale), cols.unit, y, { align: 'right' });
    doc.text(num(pos(it.qty), t.locale), cols.qty, y, { align: 'right' });
    doc.text(money(total, t.locale), cols.total, y, { align: 'right' });
    doc.text(money(disc, t.locale), cols.disc, y, { align: 'right' });
    sumTotal += total;
    sumPay += disc;
    y += h;
    doc.setDrawColor(215);
    doc.line(L, y - 3.2, R, y - 3.2);
  });

  if (y + 32 > 285) {
    doc.addPage();
    y = 20;
  }
  y += 4;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(20);
  doc.text(t.pdf.sumLabel(active.length), L, y);
  doc.text(money(sumTotal, t.locale), R, y, { align: 'right' });
  y += 9;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(t.pdf.pay, L, y);
  doc.text(money(sumPay, t.locale), R, y, { align: 'right' });
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text(t.pdf.gain, L, y);
  doc.text(money(sumTotal - sumPay, t.locale), R, y, { align: 'right' });
  return doc.output('arraybuffer');
}

/** Descarga directa con un Blob y un enlace con atributo download. false si falla. */
export function downloadPdf(filename: string, data: ArrayBuffer): boolean {
  try {
    const url = URL.createObjectURL(new Blob([data], { type: 'application/pdf' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60000);
    return true;
  } catch {
    return false;
  }
}
