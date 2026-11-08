import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hash, Heart, Briefcase } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { ChartCalculator } from '../components/chart/ChartCalculator';
import { lifePathNumber } from '../lib/numerology';
import { lifePathMeaning } from '../lib/numerology-meanings';

export function LifePath() {
  const [result, setResult] = useState<{ num: number; name: string } | null>(null);

  const meaning = result ? lifePathMeaning(result.num) : null;

  return (
    <PublicLayout>
      <ToolHero
        eyebrow="Numerology · Core number"
        title="Life Path Number Calculator"
        subtitle="The most important number in numerology — the road you are here to walk, calculated from your full birth date. Master Numbers 11, 22 and 33 are honoured, never reduced away."
      />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {!result ? (
          <ChartCalculator
            onCalculate={(date, name) => setResult({ num: lifePathNumber(date), name })}
          />
        ) : (
          meaning && (
            <div className="animate-fadeIn">
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-gold to-purple rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4 shadow-lg">
                  {meaning.number}
                </div>
                <p className="text-sm text-text-primary/55">{result.name}'s Life Path</p>
                <h2 className="text-3xl font-serif font-bold">{meaning.title}</h2>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {meaning.keywords.map((k) => (
                    <span key={k} className="text-xs bg-purple/10 text-purple px-3 py-1 rounded-full font-medium">{k}</span>
                  ))}
                </div>
              </div>

              <div className="bg-white/80 rounded-2xl p-6 border border-gold/20 mb-5">
                <p className="text-text-primary/80 leading-relaxed">{meaning.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-5 mb-5">
                <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
                  <h3 className="font-semibold text-green-800 mb-2">Strengths</h3>
                  <ul className="text-sm text-green-700 space-y-1.5">
                    {meaning.strengths.map((s) => <li key={s}>• {s}</li>)}
                  </ul>
                </div>
                <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
                  <h3 className="font-semibold text-red-800 mb-2">Challenges</h3>
                  <ul className="text-sm text-red-700 space-y-1.5">
                    {meaning.challenges.map((c) => <li key={c}>• {c}</li>)}
                  </ul>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5 mb-8">
                <div className="bg-white/80 rounded-2xl p-5 border border-purple/20">
                  <div className="flex items-center gap-2 mb-2"><Heart className="w-5 h-5 text-purple" /><h3 className="font-semibold">In love</h3></div>
                  <p className="text-sm text-text-primary/75">{meaning.love}</p>
                </div>
                <div className="bg-white/80 rounded-2xl p-5 border border-purple/20">
                  <div className="flex items-center gap-2 mb-2"><Briefcase className="w-5 h-5 text-gold" /><h3 className="font-semibold">Career paths</h3></div>
                  <p className="text-sm text-text-primary/75">{meaning.career}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setResult(null)}
                  className="px-6 py-3 bg-white/80 border border-gold/40 text-text-primary font-medium rounded-xl hover:border-gold transition-all flex items-center justify-center gap-2"
                >
                  <Hash className="w-5 h-5" /> Calculate another
                </button>
                <Link
                  to="/#demo"
                  className="px-6 py-3 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-lg transition-all text-center"
                >
                  Go deeper: full Destiny Matrix — free
                </Link>
              </div>
            </div>
          )
        )}
      </section>
    </PublicLayout>
  );
}
