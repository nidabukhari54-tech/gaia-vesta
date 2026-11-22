import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, ArrowRight, Repeat, CircleDashed } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { faqPageSchema, webAppSchema, toolBreadcrumb } from '../lib/schema';
import { SalesCTA } from '../components/SalesCTA';
import { ChartCalculator } from '../components/chart/ChartCalculator';
import { DestinyMatrixChart } from '../components/chart/DestinyMatrixChart';
import { ArcanaModal, type SelectedArcana } from '../components/chart/ArcanaModal';
import { calculateDestinyMatrix, type DestinyMatrixResult } from '../lib/matrix-calculator';
import type { Arcana } from '../lib/arcana-meanings';
import {
  analyzeNumbers,
  getFatherLine,
  getMotherLine,
  getParentChildLine,
  getTalentLine,
  type ChartLine,
} from '../lib/lines';
import { openPdfReport } from '../lib/report';

const FAQS = [
  {
    q: 'What are the generation lines in a Destiny Matrix chart?',
    a: 'The two diagonals of the diamond. One carries your father\u2019s line — the traits, duties and unfinished business of the men in your family. The other carries your mother\u2019s line — the emotional patterns and instincts of the women. Every chart has both, whatever your own gender: you inherit from both lines.',
  },
  {
    q: 'Which diagonal is the father\u2019s line and which is the mother\u2019s?',
    a: 'The male generation line runs from the upper-left point of the chart through the centre to the lower-right. The female generation line runs from the upper-right through the centre to the lower-left. Where they cross — the centre — is you: the place where both inheritances meet and where you can choose to repeat them or resolve them.',
  },
  {
    q: 'What is the parent\u2013child line?',
    a: 'It is the story the two generation lines tell together: what your father imprinted, what your mother imprinted, what you made of both at your centre, and what flows onward from you to your own children or the next generation you influence. A difficult point here is not a curse — it marks exactly where the family pattern is yours to change.',
  },
  {
    q: 'What do repeated and missing numbers mean?',
    a: 'An arcana that appears at several positions is a loud energy: its gift and its lesson show up in several areas of life at once. An arcana that never appears is an energy your chart does not carry natively — you tend to meet it through partners, friends and mentors, and build it deliberately instead of by instinct. Neither is good or bad; together they map your emphasis and your growth edges.',
  },
];

function LineSection({ line }: { line: ChartLine }) {
  return (
    <div className="mb-10">
      <h2 className="font-serif font-semibold text-2xl text-cream mb-2">{line.title}</h2>
      <p className="text-lav/75 leading-relaxed mb-5 max-w-2xl">{line.intro}</p>
      <div className={`grid gap-4 ${line.points.length === 4 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
        {line.points.map((p) => (
          <div key={p.key} className="bg-white/80 rounded-2xl border border-purple/15 p-6 text-text-primary">
            <p className="text-xs font-semibold tracking-widest uppercase text-purple">
              {p.role} · Arcana {p.arcana.id}
            </p>
            <h3 className="font-serif font-semibold text-xl mt-1">{p.arcana.name}</h3>
            <p className="text-sm font-medium text-text-primary/50 mb-3">{p.arcana.description}</p>
            <p className="text-text-primary/75 leading-relaxed text-[15px]">{p.arcana.personality}</p>
            <p className="text-sm text-text-primary/60 mt-3">
              <span className="font-medium text-text-primary/75">Karmic lesson:</span> {p.arcana.karmicLesson}
            </p>
          </div>
        ))}
      </div>
      {line.supporting.length > 0 && (
        <p className="text-sm text-lavdim mt-4">
          Supporting points on this line:{' '}
          {line.supporting.map((s, i) => (
            <span key={s.key}>
              {i > 0 && ' · '}
              <strong className="text-lav/85">{s.arcana.id}</strong> {s.arcana.name}
            </span>
          ))}
        </p>
      )}
    </div>
  );
}

export function FamilyLines() {
  const [result, setResult] = useState<DestinyMatrixResult | null>(null);
  const [name, setName] = useState('');
  const [birthLabel, setBirthLabel] = useState('');
  const [selected, setSelected] = useState<SelectedArcana | null>(null);
  const [pdfNote, setPdfNote] = useState('');

  const handleNodeClick = (position: string, arcana: Arcana) => setSelected({ position, arcana });

  const father = result ? getFatherLine(result) : null;
  const mother = result ? getMotherLine(result) : null;
  const parentChild = result ? getParentChildLine(result) : null;
  const talent = result ? getTalentLine(result) : null;
  const analysis = result ? analyzeNumbers(result) : null;

  const handlePdf = () => {
    if (!result) return;
    const ok = openPdfReport(name || 'Your', birthLabel, result);
    setPdfNote(
      ok
        ? 'Your report opened in a new tab — choose "Save as PDF" in the print dialog. It is the complete reading, free.'
        : 'Your browser blocked the new tab. Allow pop-ups for this site, then press the button again.',
    );
  };

  return (
    <PublicLayout>
      <ToolHero
        image="/images/family-illustration.webp"
        imageAlt="A family gazing together at a glowing golden Destiny Matrix star"
        eyebrow="Destiny Matrix · Family Lines"
        title="Family & Talent Lines Calculator"
        subtitle="Half of your chart was written before you were born. Read your father's line, your mother's line, the parent–child pattern where they meet in you — and the talent line that is yours alone."
        schema={[webAppSchema('Family & Talent Lines Calculator', '/tools/family-lines', "Half of your chart was written before you were born. Read your father's line, your mother's line, the parent–child pattern where they meet in you — and the talent line that is yours alone."), faqPageSchema(FAQS), toolBreadcrumb('Family & Talent Lines', '/tools/family-lines')]}
      />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {!result || !father || !mother || !parentChild || !talent || !analysis ? (
          <>
            <ChartCalculator
              onCalculate={(date, personName) => {
                setResult(calculateDestinyMatrix(date));
                setName(personName);
                setBirthLabel(
                  date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
                );
              }}
            />
            <p className="text-center text-xs text-lavdim mt-5 max-w-md mx-auto">
              Enter your birth date. Nothing is stored — your lines are calculated in your browser.
            </p>
          </>
        ) : (
          <div className="animate-fadeIn">
            <div className="text-center mb-10">
              <span className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-br from-gold/25 to-purple/25 items-center justify-center mb-3">
                <Users className="w-6 h-6 text-goldlight" />
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream">
                {name ? `${name}'s family lines` : 'Your family lines'}
              </h2>
              <p className="text-lav/70 mt-2 max-w-xl mx-auto">
                Two inheritances, one crossing point — you. Read each line in order: what arrived, where it meets your centre, and where it lands.
              </p>
            </div>

            <LineSection line={father} />
            <LineSection line={mother} />
            <LineSection line={parentChild} />
            <LineSection line={talent} />

            <div className="mb-10">
              <h2 className="font-serif font-semibold text-2xl text-cream mb-2">Your Numbers, Analysed</h2>
              <p className="text-lav/75 leading-relaxed mb-5 max-w-2xl">
                Across all sixteen points of your chart, some arcana speak more than once — and some never appear. Both facts mean something.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/80 rounded-2xl border border-gold/25 p-6 text-text-primary">
                  <p className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-purple mb-3">
                    <Repeat className="w-4 h-4" /> Repeated — your loud energies
                  </p>
                  {analysis.repeated.length ? (
                    <ul className="space-y-3">
                      {analysis.repeated.map((r) => (
                        <li key={r.arcana.id} className="text-[15px] text-text-primary/75 leading-relaxed">
                          <strong className="text-text-primary">
                            {r.arcana.id} — {r.arcana.name}
                          </strong>{' '}
                          × {r.count} ({r.positions.join(', ').toLowerCase()}): {r.arcana.description.toLowerCase()}.
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-text-primary/70 text-[15px]">
                      No arcana repeats in your chart — your energies are spread evenly, with no single number dominating.
                    </p>
                  )}
                </div>
                <div className="bg-white/80 rounded-2xl border border-purple/15 p-6 text-text-primary">
                  <p className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-purple mb-3">
                    <CircleDashed className="w-4 h-4" /> Missing — your growth edges
                  </p>
                  <p className="text-text-primary/75 text-[15px] leading-relaxed mb-3">
                    {analysis.missing.length} of the 22 arcana do not appear in your chart. These are the qualities you meet
                    through other people and build deliberately:
                  </p>
                  <p className="flex flex-wrap gap-1.5">
                    {analysis.missing.map((a) => (
                      <span
                        key={a.id}
                        className="text-xs font-medium bg-purple/10 text-text-primary/75 rounded-full px-2.5 py-1"
                      >
                        {a.id} · {a.name}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#FAF5EA] backdrop-blur-sm rounded-[1.75rem] p-5 sm:p-8 mb-6 shadow-[0_30px_80px_-20px_rgba(124,92,191,0.45)] border border-purple/20 text-text-primary">
              <p className="text-center text-sm font-medium text-text-primary/60 mb-2">
                Your full chart — the two diagonals are your family lines
              </p>
              <DestinyMatrixChart result={result} onNodeClick={handleNodeClick} />
            </div>

            <div className="text-center mb-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handlePdf}
                  className="px-6 py-3 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  Download Free PDF Report
                </button>
                <button
                  onClick={() => setResult(null)}
                  className="px-6 py-3 bg-white/[0.04] border border-white/25 text-cream font-medium rounded-xl hover:border-goldlight/60 transition-all"
                >
                  Calculate another chart
                </button>
              </div>
              {pdfNote && <p className="text-sm text-lavdim mt-3 max-w-md mx-auto">{pdfNote}</p>}
              <p className="text-xs text-lavdim mt-2">
                The PDF is your complete reading — every line in this page, plus love, money, karmic tail and purposes. Free, no card.
              </p>
            </div>

            <SalesCTA
              headline="Your family wrote the first draft. The full reading is about your revisions."
              context="You have seen what you inherited. The AI deep reading traces how those inheritances play out in your love line, your money line and your year ahead — and where you are already breaking the pattern."
            />
          </div>
        )}

        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-cream mb-6 text-center">Family line questions</h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.q} className="bg-white/[0.04] rounded-2xl border border-white/10 p-6">
                <h3 className="font-serif font-semibold text-lg text-cream mb-2">{f.q}</h3>
                <p className="text-lav/80 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-lavdim mt-10">
          Follow the thread further with the{' '}
          <Link to="/tools/karmic-tail" className="text-goldlight font-medium hover:underline">
            Karmic Tail Calculator
          </Link>{' '}
          — or read the{' '}
          <Link to="/tools/how-to-read-destiny-matrix" className="text-goldlight font-medium hover:underline inline-flex items-center gap-1">
            how to read your full chart <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </p>
      </section>

      <ArcanaModal selected={selected} onClose={() => setSelected(null)} />
    </PublicLayout>
  );
}
