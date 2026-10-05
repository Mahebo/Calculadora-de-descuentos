// Generación y descarga del PDF. jsPDF se carga bajo demanda con import()
// para que no pese en la carga inicial.
import type { jsPDF as JsPDF } from 'jspdf';
import { isActive, itemDiscounted, itemTotal, money, num, clampPct, pos, type Item } from './calc';

export async function loadJsPDF(): Promise<typeof JsPDF> {
  return (await import('jspdf')).jsPDF;
}

/** A4 vertical, márgenes de 15 mm, Helvetica. Solo ítems activos. */
export function buildPdf(
  JsPDFCtor: typeof JsPDF,
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
  const when = now.toLocaleString('es-CO', { dateStyle: 'long', timeStyle: 'short' }).replace(/ /g, ' ');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(doc.splitTextToSize(title, R - L), L, y);
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(90);
  doc.text(when + '  ·  Descuento ' + num(pct) + ' %', L, y);
  y += 10;

  function header() {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(90);
    doc.text('ÍTEM', L, y);
    doc.text('PRECIO UNIDAD', cols.unit, y, { align: 'right' });
    doc.text('CANT.', cols.qty, y, { align: 'right' });
    doc.text('PRECIO TOTAL', cols.total, y, { align: 'right' });
    doc.text('CON DESCUENTO', cols.disc, y, { align: 'right' });
    y += 2;
    doc.setDrawColor(150);
    doc.line(L, y, R, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(20);
  }
  header();

  let t = 0;
  let d = 0;
  active.forEach((it, i) => {
    const lines: string[] = doc.splitTextToSize(it.name && it.name.trim() ? it.name : 'Ítem ' + (i + 1), 68);
    const h = lines.length * 4.6 + 3;
    if (y + h > 280) {
      doc.addPage();
      y = 20;
      header();
    }
    const total = itemTotal(it);
    const disc = itemDiscounted(it, pct);
    doc.text(lines, L, y);
    doc.text(money(pos(it.price)), cols.unit, y, { align: 'right' });
    doc.text(num(pos(it.qty)), cols.qty, y, { align: 'right' });
    doc.text(money(total), cols.total, y, { align: 'right' });
    doc.text(money(disc), cols.disc, y, { align: 'right' });
    t += total;
    d += disc;
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
  doc.text('Suma precio total (' + active.length + (active.length === 1 ? ' ítem)' : ' ítems)'), L, y);
  doc.text(money(t), R, y, { align: 'right' });
  y += 9;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Total a pagar', L, y);
  doc.text(money(d), R, y, { align: 'right' });
  y += 8;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Ganancia potencial', L, y);
  doc.text(money(t - d), R, y, { align: 'right' });
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
