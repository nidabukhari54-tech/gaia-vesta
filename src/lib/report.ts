import { getChartPositions, type DestinyMatrixResult } from './matrix-calculator';
import { getArcana } from './arcana-meanings';
import { personalZones, type Zone } from './zones';

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function chartSvg(result: DestinyMatrixResult): string {
  const pos = Object.fromEntries(getChartPositions(result).map((p) => [p.id, p]));
  const line = (a: string, b: string) =>
    `<line x1="${pos[a].x}" y1="${pos[a].y}" x2="${pos[b].x}" y2="${pos[b].y}" stroke="#c9b8e8" stroke-width="1.5"/>`;
  const lines = [
    line('A', 'B'), line('B', 'C'), line('C', 'D'), line('D', 'A'),
    line('E', 'F'), line('F', 'G'), line('G', 'H'), line('H', 'E'),
    line('A', 'C'), line('D', 'B'), line('H', 'F'), line('E', 'G'),
  ].join('');
  const nodes = getChartPositions(result)
    .map((p) => {
      const centre = p.id === 'X';
      return `<circle cx="${p.x}" cy="${p.y}" r="${centre ? 21 : 16}" fill="${centre ? '#7c5cbf' : '#ffffff'}" stroke="#7c5cbf" stroke-width="1.5"/>
      <text x="${p.x}" y="${p.y + 5}" text-anchor="middle" font-size="13" font-weight="700" fill="${centre ? '#ffffff' : '#2d2440'}">${p.arcana}</text>`;
    })
    .join('');
  return `<svg viewBox="0 0 400 400" width="340" height="340" xmlns="http://www.w3.org/2000/svg">${lines}${nodes}</svg>`;
}

function zoneChapter(zone: Zone, index: number): string {
  const lightShadow =
    zone.light || zone.shadow
      ? `<div class="ls">
          ${zone.light ? `<div class="ls-box"><p class="label">In the light</p><p>${esc(zone.light)}</p></div>` : ''}
          ${zone.shadow ? `<div class="ls-box"><p class="label">In the shadow</p><p>${esc(zone.shadow)}</p></div>` : ''}
        </div>`
      : '';
  return `<section class="chapter">
    <h2><span class="zoneno">${String(index + 1).padStart(2, '0')}</span> ${esc(zone.title)}</h2>
    <p class="points">${esc(zone.points)}</p>
    ${zone.body.map((p) => `<p>${esc(p)}</p>`).join('')}
    ${lightShadow}
  </section>`;
}

/**
 * Builds the complete free PDF reading (v2) as a self-contained HTML document:
 * a branded cover with the chart, the chart at a glance, then the reading as
 * twelve named zone chapters — the same zone system as the on-site reading —
 * and a closing page. Opened in a new window; the browser's print dialog
 * saves it as a PDF. Everything is generated locally — no server, no paywall.
 */
export function buildReportHtml(
  name: string,
  birthDateLabel: string,
  result: DestinyMatrixResult,
  birthDate?: Date,
): string {
  const core = getArcana(result.X);
  const zones = personalZones(result, undefined, { birthDate, name });

  const glance: [string, number][] = [
    ['A — Top point (your portrait)', result.A],
    ['B — Right point (your drive)', result.B],
    ['C — Bottom point (your foundation)', result.C],
    ['D — Left point (your karmic foundation)', result.D],
    ['E — Talent point', result.E],
    ['F — Lower-right point (grounding)', result.F],
    ['G — Lower-left point (tail repetition)', result.G],
    ['H — Upper-left point (wisdom)', result.H],
    ['X — Centre (soul purpose)', result.X],
  ];

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Destiny Matrix Reading — ${esc(name)}</title>
<style>
  @page { margin: 18mm 16mm; }
  body { font-family: Georgia, 'Times New Roman', serif; color: #2d2440; line-height: 1.55; margin: 0; }
  h1 { font-size: 30px; margin: 0 0 4px; }
  h2 { font-size: 20px; margin: 30px 0 4px; padding-bottom: 5px; border-bottom: 2px solid #c9a227; }
  p { margin: 6px 0; font-size: 13.5px; }
  .meta { color: #6b6285; font-size: 13px; }
  .brand { color: #7c5cbf; letter-spacing: 2.5px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
  .center { text-align: center; }
  .chart { text-align: center; margin: 18px 0 4px; }
  .points { color: #7c5cbf; font-size: 12px; font-weight: 700; letter-spacing: 0.6px; margin: 0 0 6px; }
  .zoneno { color: #c9a227; }
  .chapter { page-break-inside: auto; }
  .ls { display: flex; gap: 10px; margin: 8px 0 2px; }
  .ls-box { flex: 1; background: #faf7ff; border: 1px solid #e4dcf5; border-radius: 10px; padding: 10px 14px; page-break-inside: avoid; }
  .label { color: #7c5cbf; font-size: 10.5px; font-weight: 700; letter-spacing: 1.6px; text-transform: uppercase; margin: 0 0 2px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 8px 0; }
  td, th { border: 1px solid #e4dcf5; padding: 6px 9px; text-align: left; vertical-align: top; }
  th { background: #f3efff; }
  .affirm { font-style: italic; color: #7c5cbf; text-align: center; font-size: 14.5px; margin: 10px 0 2px; }
  .closing { margin-top: 40px; border-top: 2px solid #c9a227; padding-top: 14px; page-break-inside: avoid; }
  .footer { margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; color: #8a83a0; font-size: 11.5px; text-align: center; }
</style>
</head>
<body>
  <!-- Cover -->
  <p class="brand center">Gaia Vesta · Destiny Matrix</p>
  <h1 class="center">Your Destiny Matrix Reading</h1>
  <p class="meta center">Prepared for <strong>${esc(name)}</strong> · Born ${esc(birthDateLabel)}</p>
  <p class="center" style="font-size:13px;">Your full chart read in twelve named zones — personality, soul purpose, love, money, family lines, karmic tail and the year ahead. Free, in full: this is the reading other sites charge for.</p>

  <div class="chart">${chartSvg(result)}</div>
  <p class="affirm">At your centre: ${core.id} — ${esc(core.name)}. “${esc(core.affirmation)}”</p>

  <h2>Your Chart at a Glance</h2>
  <table>
    <tr><th>Position</th><th>Arcana</th><th>Keywords</th></tr>
    ${glance
      .map(([label, id]) => {
        const arc = getArcana(id);
        return `<tr><td>${esc(label)}</td><td><strong>${arc.id} — ${esc(arc.name)}</strong></td><td>${esc(arc.description)}</td></tr>`;
      })
      .join('')}
  </table>
  <p>Love line ${result.loveLine.left} · ${result.loveLine.center} · ${result.loveLine.right} &nbsp;|&nbsp; Money line ${result.moneyLine.left} · ${result.moneyLine.center} · ${result.moneyLine.right} &nbsp;|&nbsp; Life path ${result.lifePath.left} · ${result.lifePath.center} · ${result.lifePath.right}</p>

  <!-- The twelve zones -->
  ${zones.map((z, i) => zoneChapter(z, i)).join('')}

  <!-- Closing -->
  <section class="closing">
    <h2 style="border-bottom:none; margin-top:0;">Where to go from here</h2>
    <p>Your chart never changes — but the year you are in does, and so does the person reading it. A few honest next steps:</p>
    <p><strong>Read your partner's chart beside yours.</strong> The free Compatibility Matrix on Gaia Vesta reads two charts together in nine zones — including the friction patterns most readings leave out.</p>
    <p><strong>Read your child's chart.</strong> The Children's Matrix translates the same points into talents, emotional needs and learning style — written for parents.</p>
    <p><strong>Follow the year.</strong> Your Personal Year turns every January. The free Daily Horoscope and 2027 Horoscope pages keep the shorter cycles in view.</p>
    <p><strong>Go deeper with Gaia Cosmic.</strong> Members get unlimited AI deep readings that connect these zones into one story — why a pattern repeats, where it started, and what this year is asking of you. It is an invitation, not a lock: everything in this report is yours, free, in full.</p>
    <p class="affirm">“${esc(core.affirmation)}”</p>
  </section>

  <p class="footer">Generated free by Gaia Vesta — gaia-vesta-mcyr.vercel.app · This reading is a tool for reflection, not a prediction, and never medical or financial advice. Your chart never changes; what you do with it does.</p>
</body>
</html>`;
}

/** Opens the free PDF report in a new tab and triggers the print/save-as-PDF dialog. */
export function openPdfReport(
  name: string,
  birthDateLabel: string,
  result: DestinyMatrixResult,
  birthDate?: Date,
): boolean {
  const win = window.open('', '_blank');
  if (!win) return false;
  win.document.open();
  win.document.write(buildReportHtml(name || 'Your', birthDateLabel, result, birthDate));
  win.document.close();
  win.focus();
  const trigger = () => {
    try {
      win.print();
    } catch {
      /* the report is open; the user can print manually */
    }
  };
  if (win.document.readyState === 'complete') {
    setTimeout(trigger, 350);
  } else {
    win.onload = () => setTimeout(trigger, 350);
  }
  return true;
}
