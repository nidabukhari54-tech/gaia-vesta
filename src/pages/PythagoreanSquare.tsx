import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { ChartCalculator } from '../components/chart/ChartCalculator';
import { pythagoreanSquare } from '../lib/numerology';

const CELL_THEMES: Record<number, string> = {
  1: 'Character & will', 2: 'Energy & vitality', 3: 'Curiosity & knowledge',
  4: 'Health & body', 5: 'Heart & emotion', 6: 'Work & mastery',
  7: 'Luck & fortune', 8: 'Kindness & truth', 9: 'Mind & wisdom',
};

const GRID_ORDER = [3, 1, 2, 6, 7, 5, 9, 8, 4]; // classic psychomatrix layout (columns)

export function PythagoreanSquare() {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const result = birthDate ? pythagoreanSquare(birthDate) : null;

  return (
    <PublicLayout>
      <ToolHero
        eyebrow="Numerology · Psychomatrix"
        title="Pythagorean Square Calculator"
        subtitle="The ancient psychomatrix: every digit of your birth date placed in a 3×3 grid. Repeated digits amplify a trait; empty cells show the lessons you are here to develop."
      />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {!result ? (
          <ChartCalculator onCalculate={(date) => setBirthDate(date)} />
        ) : (
          <div className="animate-fadeIn">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gold/20 shadow mb-6">
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                {GRID_ORDER.map((d) => {
                  const count = result.counts[d];
                  return (
                    <div
                      key={d}
                      className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 text-center ${
                        count > 0
                          ? 'border-gold/50 bg-gradient-to-br from-gold/15 to-purple/10'
                          : 'border-dashed border-purple/25 bg-white/40'
                      }`}
                    >
                      <span className={`font-serif font-bold leading-none mb-1 ${count > 0 ? 'text-2xl text-text-primary' : 'text-2xl text-text-primary/25'}`}>
                        {count > 0 ? String(d).repeat(count) : d}
                      </span>
                      <span className="text-[10px] leading-tight text-text-primary/55">{CELL_THEMES[d]}</span>
                      {count === 0 && <span className="text-[10px] text-purple font-medium mt-0.5">to develop</span>}
                    </div>
                  );
                })}
              </div>
              <p className="text-center text-sm text-text-primary/60 mt-6">
                Destiny (Life Path) number: <strong className="text-text-primary">{result.destinyNumber}</strong>
              </p>
            </div>

            <div className="bg-white/80 rounded-2xl p-6 border border-purple/20 mb-6">
              <h3 className="font-serif font-semibold text-lg mb-3">Reading your square</h3>
              <ul className="space-y-2.5 text-sm text-text-primary/75">
                {Object.entries(result.counts)
                  .filter(([, c]) => c > 0)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([d, c]) => (
                    <li key={d}>
                      <strong>{CELL_THEMES[Number(d)]} ({d})</strong> appears {c}× —{' '}
                      {c >= 3 ? 'a dominant, defining force in your character.' : c === 2 ? 'strong and reliable in you.' : 'present as a natural seed.'}
                    </li>
                  ))}
                {result.missing.length > 0 && (
                  <li>
                    <strong>Empty cells:</strong> {result.missing.map((d) => `${d} (${CELL_THEMES[d].toLowerCase()})`).join(', ')} —
                    these are not weaknesses, they are the qualities this lifetime asks you to consciously build.
                  </li>
                )}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setBirthDate(null)}
                className="px-6 py-3 bg-white/80 border border-gold/40 text-text-primary font-medium rounded-xl hover:border-gold transition-all"
              >
                Different birth date
              </button>
              <Link
                to="/#demo"
                className="px-6 py-3 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-lg transition-all text-center"
              >
                Go deeper: full Destiny Matrix — free
              </Link>
            </div>
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
