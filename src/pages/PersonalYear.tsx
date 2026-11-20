import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SunMoon } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { ChartCalculator } from '../components/chart/ChartCalculator';
import { personalYearNumber, personalMonthNumber, personalDayNumber } from '../lib/numerology';
import { PERSONAL_YEAR_MEANINGS } from '../lib/numerology-meanings';

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
        eyebrow="Numerology · Cycles"
        title="Personal Year, Month & Day"
        subtitle="Life moves in 9-year cycles. Find the year you are in right now, the theme of this month inside it, and the energy of today — all from your birth date."
      />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {!birthDate ? (
          <ChartCalculator onCalculate={(date) => setBirthDate(date)} />
        ) : (
          meaning && (
            <div className="animate-fadeIn">
              <div className="text-center mb-8">
                <p className="text-sm text-text-primary/55 mb-1">Your Personal Year for {today.getFullYear()}</p>
                <div className="w-24 h-24 bg-gradient-to-r from-gold to-purple rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto shadow-lg">
                  {meaning.year}
                </div>
                <h2 className="text-3xl font-serif font-bold mt-4">{meaning.theme}</h2>
              </div>

              <div className="bg-white/80 rounded-2xl p-6 border border-gold/20 mb-5">
                <p className="text-text-primary/80 leading-relaxed mb-4">{meaning.description}</p>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <p className="bg-green-50 rounded-lg p-3"><span className="font-semibold text-green-700">Lean in:</span> {meaning.focus}</p>
                  <p className="bg-red-50 rounded-lg p-3"><span className="font-semibold text-red-600">Watch out:</span> {meaning.avoid}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <div className="bg-white/80 rounded-2xl p-6 border border-purple/20 text-center">
                  <p className="text-xs font-semibold tracking-widest uppercase text-purple mb-2">
                    This month · {today.toLocaleDateString('en-US', { month: 'long' })}
                  </p>
                  <p className="text-5xl font-serif font-bold mb-2">{pm}</p>
                  <p className="text-sm text-text-primary/65">
                    {PERSONAL_YEAR_MEANINGS[pm!].theme} energy, nested inside your {meaning.theme.toLowerCase()} year.
                  </p>
                </div>
                <div className="bg-white/80 rounded-2xl p-6 border border-purple/20 text-center">
                  <p className="text-xs font-semibold tracking-widest uppercase text-purple mb-2">Today</p>
                  <p className="text-5xl font-serif font-bold mb-2">{pd}</p>
                  <p className="text-sm text-text-primary/65">
                    A {PERSONAL_YEAR_MEANINGS[pd!].theme.toLowerCase()} day — {PERSONAL_YEAR_MEANINGS[pd!].focus.toLowerCase()}
                  </p>
                </div>
              </div>

              {nextPy && (
                <div className="bg-gradient-to-br from-gold/10 to-purple/10 rounded-2xl p-6 border border-gold/25 text-center mb-8">
                  <p className="text-sm text-text-primary/65">
                    Next year ({nextYear}) you enter a <strong>Personal Year {nextPy} — {PERSONAL_YEAR_MEANINGS[nextPy].theme}</strong>.
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setBirthDate(null)}
                  className="px-6 py-3 bg-white/80 border border-gold/40 text-text-primary font-medium rounded-xl hover:border-gold transition-all flex items-center justify-center gap-2"
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
      </section>
    </PublicLayout>
  );
}
