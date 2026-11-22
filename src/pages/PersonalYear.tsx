import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SunMoon } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { faqPageSchema, webAppSchema, toolBreadcrumb } from '../lib/schema';
import { ChartCalculator } from '../components/chart/ChartCalculator';
import { personalYearNumber, personalMonthNumber, personalDayNumber } from '../lib/numerology';
import { PERSONAL_YEAR_MEANINGS } from '../lib/numerology-meanings';

const FAQS = [
  {
    q: 'How is my Personal Year calculated?',
    a: 'Add the digits of your birth month, your birth day, and the calendar year you are asking about, then reduce to a single digit (1–9 — Master Numbers are not kept in cycle calculations). The worked example below shows the sums for a real birth date. Your Personal Month and Personal Day are nested the same way inside it.',
  },
  {
    q: 'When does my Personal Year actually start?',
    a: 'Two schools exist. The calendar school runs every Personal Year from 1 January. The birthday school runs it from birthday to birthday, arguing the cycle is personal, not calendrical. This calculator uses the calendar year, the more common convention — if you were born late in the year, read the closing months with a flavour of the year ahead.',
  },
  {
    q: 'What if I am in a difficult year, like 4 or 9?',
    a: 'No year in the cycle is a punishment. A 4 year is heavy on repair and routine because it is building the foundation a freer 5 year will move on; a 9 year asks for release because a brand-new cycle starts next year. The theme tells you what the year rewards — working with it, rather than against it, is the entire practical value of the system.',
  },
  {
    q: 'How do Personal Year, Month and Day fit together?',
    a: 'Like weather inside a climate. The Personal Year sets the year\'s climate; the Personal Month is the season inside it; the Personal Day is today\'s weather. A bold 8 day inside a quiet 7 year is a good day for one brave conversation — not for betting the farm. Read the three together, largest first.',
  },
];

export function PersonalYear() {
  const [birthDate, setBirthDate] = useState<Date | null>(null);

  const today = new Date();
  const py = birthDate ? personalYearNumber(birthDate, today.getFullYear()) : null;
  const pm = birthDate ? personalMonthNumber(birthDate, today.getFullYear(), today.getMonth() + 1) : null;
  const pd = birthDate ? personalDayNumber(birthDate, today) : null;
  const meaning = py ? PERSONAL_YEAR_MEANINGS[py] : null;

  const nextYear = today.getFullYear() + 1;
  const nextPy = birthDate ? personalYearNumber(birthDate, nextYear) : null;

  return (
    <PublicLayout>
      <ToolHero
        image="/images/personal-year-illustration.webp"
        imageAlt="A golden sunrise cresting indigo hills, encircled by a thin ring of light"
        eyebrow="Numerology · Cycles"
        title="Personal Year, Month & Day"
        subtitle="Life moves in 9-year cycles. Find the year you are in right now, the theme of this month inside it, and the energy of today — all from your birth date."
        schema={[webAppSchema('Personal Year, Month & Day', '/tools/personal-year', "Life moves in 9-year cycles. Find the year you are in right now, the theme of this month inside it, and the energy of today — all from your birth date."), faqPageSchema(FAQS), toolBreadcrumb('Personal Year', '/tools/personal-year')]}
      />


      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {!birthDate ? (
          <ChartCalculator onCalculate={(date) => setBirthDate(date)} />
        ) : (
          meaning && (
            <div className="animate-fadeIn">
              <div className="text-center mb-8">
                <p className="text-sm text-lavdim mb-1">Your Personal Year for {today.getFullYear()}</p>
                <div className="w-24 h-24 bg-gradient-to-r from-gold to-purple rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto shadow-lg">
                  {meaning.year}
                </div>
                <h2 className="text-3xl font-serif font-bold text-cream mt-4">{meaning.theme}</h2>
              </div>

              <div className="bg-white/80 rounded-2xl p-6 border border-gold/20 mb-5 text-text-primary">
                <p className="text-text-primary/80 leading-relaxed mb-4">{meaning.description}</p>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <p className="bg-green-50 rounded-lg p-3"><span className="font-semibold text-green-700">Lean in:</span> {meaning.focus}</p>
                  <p className="bg-red-50 rounded-lg p-3"><span className="font-semibold text-red-600">Watch out:</span> {meaning.avoid}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <div className="bg-white/80 rounded-2xl p-5 border border-purple/20 text-text-primary">
                  <h3 className="font-semibold mb-2">Love this year</h3>
                  <p className="text-sm text-text-primary/75 leading-relaxed">{meaning.love}</p>
                </div>
                <div className="bg-white/80 rounded-2xl p-5 border border-gold/25 text-text-primary">
                  <h3 className="font-semibold mb-2">Money & work this year</h3>
                  <p className="text-sm text-text-primary/75 leading-relaxed">{meaning.money}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <div className="bg-white/80 rounded-2xl p-6 border border-purple/20 text-center text-text-primary">
                  <p className="text-xs font-semibold tracking-widest uppercase text-purple mb-2">
                    This month · {today.toLocaleDateString('en-US', { month: 'long' })}
                  </p>
                  <p className="text-5xl font-serif font-bold mb-2">{pm}</p>
                  <p className="text-sm text-text-primary/65">
                    {PERSONAL_YEAR_MEANINGS[pm!].theme} energy, nested inside your {meaning.theme.toLowerCase()} year.
                  </p>
                </div>
                <div className="bg-white/80 rounded-2xl p-6 border border-purple/20 text-center text-text-primary">
                  <p className="text-xs font-semibold tracking-widest uppercase text-purple mb-2">Today</p>
                  <p className="text-5xl font-serif font-bold mb-2">{pd}</p>
                  <p className="text-sm text-text-primary/65">
                    A {PERSONAL_YEAR_MEANINGS[pd!].theme.toLowerCase()} day — {PERSONAL_YEAR_MEANINGS[pd!].focus.toLowerCase()}
                  </p>
                </div>
              </div>

              {nextPy && (
                <div className="bg-gradient-to-br from-gold/10 to-purple/10 rounded-2xl p-6 border border-gold/25 text-center mb-8">
                  <p className="text-sm text-lav/80">
                    Next year ({nextYear}) you enter a <strong className="text-cream">Personal Year {nextPy} — {PERSONAL_YEAR_MEANINGS[nextPy].theme}</strong>.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setBirthDate(null)}
                  className="px-6 py-3 bg-white/[0.04] border border-white/25 text-cream font-medium rounded-xl hover:border-goldlight/60 transition-all flex items-center justify-center gap-2"
                >
                  <SunMoon className="w-5 h-5" /> Different birth date
                </button>
                <Link
                  to="/tools/year-forecast"
                  className="px-6 py-3 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-lg transition-all text-center"
                >
                  See the full year in my Destiny Matrix
                </Link>
              </div>
            </div>
          )
        )}

        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-cream mb-3 text-center">A worked example</h2>
          <p className="text-lav/75 leading-relaxed max-w-2xl mx-auto text-center mb-6">
            Take someone born on <strong className="text-cream">14 March 1990</strong>, asking about <strong className="text-cream">2026</strong>:
          </p>
          <div className="bg-white/[0.04] rounded-2xl border border-white/10 p-6 max-w-2xl mx-auto">
            <ul className="space-y-2.5 text-lav/85 leading-relaxed">
              <li><strong className="text-cream">Birth month:</strong> March → 3. <strong className="text-cream">Birth day:</strong> 14 → 1+4 = 5. <strong className="text-cream">Year:</strong> 2026 → 2+0+2+6 = 10.</li>
              <li><strong className="text-cream">Combine:</strong> 3 + 5 + 10 = 18.</li>
              <li><strong className="text-cream">Reduce:</strong> 1+8 = 9.</li>
              <li><strong className="text-cream">Result: Personal Year 9 — Completion & Release.</strong> A year for finishing, forgiving and clearing the decks before a brand-new 1 year opens the next cycle.</li>
            </ul>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-cream mb-3 text-center">All nine Personal Years, explained</h2>
          <p className="text-lav/70 text-center max-w-2xl mx-auto mb-8">
            The full 9-year cycle, in order — find the year you are in, and read the ones either side of it to feel where you have come from and where the current is carrying you.
          </p>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
              const m = PERSONAL_YEAR_MEANINGS[n];
              return (
                <div key={n} className="bg-white/[0.04] rounded-2xl border border-white/10 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-11 h-11 bg-gradient-to-r from-gold to-purple rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0">{n}</span>
                    <h3 className="font-serif font-semibold text-cream">Year {n} — {m.theme}</h3>
                  </div>
                  <p className="text-lav/85 leading-relaxed mb-3">{m.description}</p>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm mb-3">
                    <p className="text-lav/80 leading-relaxed"><span className="text-goldlight font-medium">Lean into:</span> {m.focus}</p>
                    <p className="text-lav/80 leading-relaxed"><span className="text-goldlight font-medium">Be careful:</span> {m.avoid}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <p className="text-lav/80 leading-relaxed"><span className="text-goldlight font-medium">Love:</span> {m.love}</p>
                    <p className="text-lav/80 leading-relaxed"><span className="text-goldlight font-medium">Money & work:</span> {m.money}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-cream mb-6 text-center">Personal Year questions</h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.q} className="bg-white/[0.04] rounded-2xl border border-white/10 p-6">
                <h3 className="font-serif font-semibold text-lg text-cream mb-2">{f.q}</h3>
                <p className="text-lav/80 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-cream mb-6 text-center">Keep exploring</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link to="/tools/year-forecast" className="bg-white/[0.04] rounded-2xl border border-white/10 p-5 hover:border-goldlight/50 transition-all block">
              <h3 className="font-serif font-semibold text-cream mb-1">Year Forecast</h3>
              <p className="text-sm text-lav/70">This year inside your full Destiny Matrix chart.</p>
            </Link>
            <Link to="/tools/moon-phase" className="bg-white/[0.04] rounded-2xl border border-white/10 p-5 hover:border-goldlight/50 transition-all block">
              <h3 className="font-serif font-semibold text-cream mb-1">Moon Phase Today</h3>
              <p className="text-sm text-lav/70">The shortest cycle of all — tonight's moon, live.</p>
            </Link>
            <Link to="/tools/life-path" className="bg-white/[0.04] rounded-2xl border border-white/10 p-5 hover:border-goldlight/50 transition-all block">
              <h3 className="font-serif font-semibold text-cream mb-1">Life Path Number</h3>
              <p className="text-sm text-lav/70">The number that never cycles — your road itself.</p>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
