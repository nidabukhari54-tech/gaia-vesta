import { getChartPositions, type DestinyMatrixResult } from './matrix-calculator';
import { getArcana } from './arcana-meanings';
import { getKarmicTail } from './karmic-tail';
import {
  analyzeNumbers,
  getFatherLine,
  getMotherLine,
  getParentChildLine,
  getTalentLine,
  purposeByStage,
} from './lines';

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

function arcanaBlock(label: string, id: number, text: string): string {
  const a = getArcana(id);
  return `<div class="block">
    <p class="label">${esc(label)} · Arcana ${a.id}</p>
    <h3>${a.id} — ${esc(a.name)}</h3>
    <p class="sub">${esc(a.description)}</p>
    <p>${esc(text)}</p>
  </div>`;
}

/**
 * Builds the complete free PDF reading as a self-contained HTML document.
 * Opened in a new window; the browser's print dialog saves it as a PDF.
 * Everything is generated locally from the chart — no server, no paywall.
 */
export function buildReportHtml(name: string, birthDateLabel: string, result: DestinyMatrixResult): string {
  const core = getArcana(result.X);
  const tail = getKarmicTail(result);
  const father = getFatherLine(result);
  const mother = getMotherLine(result);
  const parentChild = getParentChildLine(result);
  const talent = getTalentLine(result);
  const purposes = purposeByStage(result);
  const analysis = analyzeNumbers(result);

  const corePoints: [string, number][] = [
    ['A — Top point (your portrait)', result.A],
    ['B — Right point (your drive)', result.B],
    ['C — Bottom point (your foundation)', result.C],
    ['D — Left point (your karmic foundation)', result.D],
    ['E — Talent point', result.E],
    ['F — Lower-right point (grounding)', result.F],
    ['G — Lower-left point (tail repetition)', result.G],
    ['H — Upper-left point (wisdom)', result.H],
  ];

  const repeatedHtml = analysis.repeated.length
    ? analysis.repeated
        .map(
          (r) =>
            `<li><strong>${r.arcana.id} — ${esc(r.arcana.name)}</strong> appears ${r.count} times (${r.positions
              .map(esc)
              .join(', ')}): ${esc(r.arcana.description)}. A repeated arcana is a loud energy — its lesson and its gift both run through several areas of your life at once.</li>`,
        )
        .join('')
    : '<li>No arcana repeats in your chart — your energies are spread evenly, with no single number dominating.</li>';

  const missingHtml = analysis.missing
    .map((a) => `${a.id} ${esc(a.name)}`)
    .join(' · ');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Destiny Matrix Reading — ${esc(name)}</title>
<style>
  @page { margin: 18mm 16mm; }
  body { font-family: Georgia, 'Times New Roman', serif; color: #2d2440; line-height: 1.55; margin: 0; }
  h1 { font-size: 30px; margin: 0 0 4px; }
  h2 { font-size: 21px; margin: 34px 0 6px; padding-bottom: 5px; border-bottom: 2px solid #c9a227; }
  h3 { font-size: 16.5px; margin: 0 0 2px; }
  p { margin: 6px 0; font-size: 13.5px; }
  .meta { color: #6b6285; font-size: 13px; }
  .brand { color: #7c5cbf; letter-spacing: 2.5px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
  .center { text-align: center; }
  .chart { text-align: center; margin: 18px 0 4px; }
  .block { background: #faf7ff; border: 1px solid #e4dcf5; border-radius: 10px; padding: 12px 16px; margin: 10px 0; page-break-inside: avoid; }
  .label { color: #7c5cbf; font-size: 10.5px; font-weight: 700; letter-spacing: 1.6px; text-transform: uppercase; margin: 0; }
  .sub { color: #6b6285; font-style: italic; margin: 0 0 4px; font-size: 12.5px; }
  .code { font-size: 40px; font-weight: 700; color: #7c5cbf; text-align: center; margin: 6px 0; letter-spacing: 2px; }
  ul { font-size: 13.5px; padding-left: 18px; }
  li { margin: 5px 0; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 8px 0; }
  td, th { border: 1px solid #e4dcf5; padding: 6px 9px; text-align: left; vertical-align: top; }
  th { background: #f3efff; }
  .footer { margin-top: 36px; border-top: 1px solid #ddd; padding-top: 10px; color: #8a83a0; font-size: 11.5px; text-align: center; }
  .affirm { font-style: italic; color: #7c5cbf; }
</style>
</head>
<body>
  <p class="brand center">Gaia Vesta · Destiny Matrix</p>
  <h1 class="center">The Complete Destiny Matrix Reading</h1>
  <p class="meta center">Prepared for <strong>${esc(name)}</strong> · Born ${esc(birthDateLabel)}</p>
  <p class="center" style="font-size:13px;">Your full chart, read point by point — soul purpose, love, money, family lines, karmic tail and the year-stage purposes. Free, in full: this is the reading other sites charge for.</p>

  <div class="chart">${chartSvg(result)}</div>

  <h2>Your Soul Purpose — Arcana ${core.id}, ${esc(core.name)}</h2>
  <p>${esc(core.personality)}</p>
  <p><strong>Karmic lesson:</strong> ${esc(core.karmicLesson)}</p>
  <p class="affirm">“${esc(core.affirmation)}”</p>

  <h2>Your Core Points</h2>
  <table>
    <tr><th>Position</th><th>Arcana</th><th>What it means</th></tr>
    ${corePoints
      .map(([label, id]) => {
        const a = getArcana(id);
        return `<tr><td>${esc(label)}</td><td><strong>${a.id} — ${esc(a.name)}</strong></td><td>${esc(a.description)}. ${esc(a.personality)}</td></tr>`;
      })
      .join('')}
    <tr><td>X — Centre (soul purpose)</td><td><strong>${core.id} — ${esc(core.name)}</strong></td><td>${esc(core.description)}. The energy everything else in the chart serves.</td></tr>
  </table>

  <h2>Love Line — ${result.loveLine.left} · ${result.loveLine.center} · ${result.loveLine.right}</h2>
  ${arcanaBlock('How you enter love (A)', result.A, getArcana(result.A).loveMeaning)}
  ${arcanaBlock('Love at your centre (X)', result.X, core.loveMeaning)}
  ${arcanaBlock('What love builds toward (C)', result.C, getArcana(result.C).loveMeaning)}

  <h2>Money Line — ${result.moneyLine.left} · ${result.moneyLine.center} · ${result.moneyLine.right}</h2>
  ${arcanaBlock('Your money drive (B)', result.B, getArcana(result.B).moneyMeaning)}
  ${arcanaBlock('Money at your centre (X)', result.X, core.moneyMeaning)}
  ${arcanaBlock('Your material foundation (D)', result.D, getArcana(result.D).moneyMeaning)}

  <h2>Life Path Line — ${result.lifePath.left} · ${result.lifePath.center} · ${result.lifePath.right}</h2>
  <p>From ${esc(getArcana(result.lifePath.left).name)} through ${esc(core.name)} to ${esc(getArcana(result.lifePath.right).name)}: ${esc(getArcana(result.lifePath.left).personality)} At the centre, ${esc(core.personality)}</p>

  <h2>Your Karmic Tail</h2>
  <p class="code">${esc(tail.code)}</p>
  ${tail.points.map((p) => arcanaBlock(p.role, p.arcana.id, `${p.heading}. ${p.arcana.karmicLesson} Watch for: ${p.arcana.challenges.join(', ').toLowerCase()}. Strength to build: ${p.arcana.strengths.join(', ').toLowerCase()}.`)).join('')}

  <h2>${esc(father.title)}</h2>
  <p>${esc(father.intro)}</p>
  ${father.points.map((p) => arcanaBlock(p.role, p.arcana.id, p.arcana.personality)).join('')}

  <h2>${esc(mother.title)}</h2>
  <p>${esc(mother.intro)}</p>
  ${mother.points.map((p) => arcanaBlock(p.role, p.arcana.id, p.arcana.personality)).join('')}

  <h2>${esc(parentChild.title)}</h2>
  <p>${esc(parentChild.intro)}</p>
  ${parentChild.points.map((p) => arcanaBlock(p.role, p.arcana.id, p.arcana.personality)).join('')}

  <h2>${esc(talent.title)}</h2>
  <p>${esc(talent.intro)}</p>
  ${talent.points.map((p) => arcanaBlock(p.role, p.arcana.id, `${p.arcana.personality} Strengths: ${p.arcana.strengths.join(', ')}.`)).join('')}

  <h2>Your Purpose, by Life Stage</h2>
  ${purposes.map((p) => arcanaBlock(`${p.stage} — ${p.label}`, p.arcana.id, p.arcana.karmicLesson)).join('')}

  <h2>Your Numbers, Analysed</h2>
  <p><strong>Repeated arcana</strong> — the loudest energies in your chart:</p>
  <ul>${repeatedHtml}</ul>
  <p><strong>Missing arcana</strong> — energies your chart does not carry natively (${analysis.missing.length} of 22). These are not flaws: they are the qualities you meet through other people and build deliberately, rather than by instinct.</p>
  <p>${missingHtml}</p>

  <p class="footer">Generated free by Gaia Vesta — gaia-vesta-mcyr.vercel.app · This reading is a tool for reflection, not a prediction. Your chart never changes; what you do with it does.</p>
</body>
</html>`;
}

/** Opens the free PDF report in a new tab and triggers the print/save-as-PDF dialog. */
export function openPdfReport(name: string, birthDateLabel: string, result: DestinyMatrixResult): boolean {
  const win = window.open('', '_blank');
  if (!win) return false;
  win.document.open();
  win.document.write(buildReportHtml(name || 'Your', birthDateLabel, result));
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
