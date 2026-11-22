import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Hash, Heart, Briefcase } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { faqPageSchema, webAppSchema, toolBreadcrumb } from '../lib/schema';
import { SalesCTA } from '../components/SalesCTA';
import { ChartCalculator } from '../components/chart/ChartCalculator';
import { lifePathNumber } from '../lib/numerology';
import { lifePathMeaning, LIFE_PATH_MEANINGS } from '../lib/numerology-meanings';

const LIFE_PATH_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

const FAQS = [
  {
    q: 'How is the Life Path number calculated?',
    a: 'Add the digits of your birth year, your birth month and your birth day separately, combine the three sums, and reduce to a single digit — except that the Master Numbers 11, 22 and 33 are never reduced away. The worked example below walks through a real date step by step.',
  },
  {
    q: 'Why is the Life Path considered the most important number?',
    a: 'Because it is derived from your complete birth date — the one part of your chart that can never change. Your name numbers can shift with a new name, and your personal years cycle every nine years, but the Life Path is the road itself: the recurring lessons, talents and themes your whole life keeps returning to.',
  },
  {
    q: 'What if two people share my Life Path number?',
    a: 'Then you share a theme, not a life. Millions of people walk each number. How it expresses depends on the rest of your chart — your Destiny Matrix points, name numbers and cycles — plus your choices. Read the number as the landscape, not the itinerary.',
  },
  {
    q: 'Can my Life Path number be "bad"?',
    a: 'No number is bad — each has a gift form and a shadow form, which is why every reading here lists strengths and challenges side by side. A 4 is not doomed to drudgery and an 8 is not guaranteed wealth; the number describes the terrain, and awareness is what turns its challenges into its strengths.',
  },
];

export function LifePath() {
  const [result, setResult] = useState<{ num: number; name: string } | null>(null);

  const meaning = result ? lifePathMeaning(result.num) : null;

  return (
    <PublicLayout>
      <ToolHero
        eyebrow="Numerology · Core number"
        title="Life Path Number Calculator"
        subtitle="The most important number in numerology — the road you are here to walk, calculated from your full birth date. Master Numbers 11, 22 and 33 are honoured, never reduced away."
        schema={[webAppSchema('Life Path Number Calculator', '/tools/life-path', "The most important number in numerology — the road you are here to walk, calculated from your full birth date. Master Numbers 11, 22 and 33 are honoured, never reduced away."), faqPageSchema(FAQS), toolBreadcrumb('Life Path Number Calculator', '/tools/life-path')]}
      />

      <div className="relative max-w-md mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="absolute -inset-4 bg-gold/15 rounded-[2.25rem] blur-2xl pointer-events-none" />
        <div className="relative rounded-[1.75rem] overflow-hidden border border-goldlight/30 shadow-[0_30px_70px_-25px_rgba(231,200,115,0.4)]">
          <img
            src="/images/life-path-illustration.webp"
            alt="A winding golden path of light climbing through indigo hills toward one bright guiding star"
            loading="lazy"
            decoding="async"
            className="w-full h-auto block"
          />
        </div>
      </div>

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
                <p className="text-sm text-lavdim">{result.name}'s Life Path</p>
                <h2 className="text-3xl font-serif font-bold text-cream">{meaning.title}</h2>
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {meaning.keywords.map((k) => (
                    <span key={k} className="text-xs bg-white/[0.06] border border-white/10 text-goldlight px-3 py-1 rounded-full font-medium">{k}</span>
                  ))}
                </div>
              </div>

              <div className="bg-white/80 rounded-2xl p-6 border border-gold/20 mb-5 text-text-primary">
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
                <div className="bg-white/80 rounded-2xl p-5 border border-purple/20 text-text-primary">
                  <div className="flex items-center gap-2 mb-2"><Heart className="w-5 h-5 text-purple" /><h3 className="font-semibold">In love</h3></div>
                  <p className="text-sm text-text-primary/75">{meaning.love}</p>
                </div>
                <div className="bg-white/80 rounded-2xl p-5 border border-purple/20 text-text-primary">
                  <div className="flex items-center gap-2 mb-2"><Briefcase className="w-5 h-5 text-gold" /><h3 className="font-semibold">Career paths</h3></div>
                  <p className="text-sm text-text-primary/75">{meaning.career}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setResult(null)}
                  className="px-6 py-3 bg-white/[0.04] border border-white/25 text-cream font-medium rounded-xl hover:border-goldlight/60 transition-all flex items-center justify-center gap-2"
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

        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-cream mb-3 text-center">A worked example</h2>
          <p className="text-lav/75 leading-relaxed max-w-2xl mx-auto text-center mb-6">
            Take a birth date of <strong className="text-cream">1 November 1988</strong> — a good example, because it
            produces a Master Number:
          </p>
          <div className="bg-white/[0.04] rounded-2xl border border-white/10 p-6 max-w-2xl mx-auto">
            <ul className="space-y-2.5 text-lav/85 leading-relaxed">
              <li><strong className="text-cream">Year:</strong> 1+9+8+8 = 26. <strong className="text-cream">Month:</strong> 1+1 = 2. <strong className="text-cream">Day:</strong> 1.</li>
              <li><strong className="text-cream">Combine:</strong> 26 + 2 + 1 = 29.</li>
              <li><strong className="text-cream">Reduce:</strong> 2+9 = 11 — and here the calculator stops. 11 is a Master Number, honoured rather than reduced to 2.</li>
              <li><strong className="text-cream">Result: Life Path 11, The Illuminated Intuitive</strong> — the 2's sensitivity carried at spiritual voltage.</li>
            </ul>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-cream mb-3 text-center">Every Life Path number, explained</h2>
          <p className="text-lav/70 text-center max-w-2xl mx-auto mb-8">
            All twelve possible results — the nine roads and the three Master Numbers — whether you calculate yours or not.
          </p>
          <div className="space-y-4">
            {LIFE_PATH_NUMBERS.map((n) => {
              const m = LIFE_PATH_MEANINGS[n];
              return (
                <div key={n} className="bg-white/[0.04] rounded-2xl border border-white/10 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-11 h-11 bg-gradient-to-r from-gold to-purple rounded-full flex items-center justify-center text-white text-lg font-bold shrink-0">{n}</span>
                    <div>
                      <h3 className="font-serif font-semibold text-cream leading-tight">{m.title}</h3>
                      <p className="text-xs text-goldlight">{m.keywords.join(' · ')}</p>
                    </div>
                  </div>
                  <p className="text-lav/85 leading-relaxed mb-3">{m.description}</p>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm mb-3">
                    <p className="text-lav/80 leading-relaxed"><span className="text-goldlight font-medium">Strengths:</span> {m.strengths.join(', ')}</p>
                    <p className="text-lav/80 leading-relaxed"><span className="text-goldlight font-medium">Challenges:</span> {m.challenges.join(', ')}</p>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <p className="text-lav/80 leading-relaxed"><span className="text-goldlight font-medium">In love:</span> {m.love}</p>
                    <p className="text-lav/80 leading-relaxed"><span className="text-goldlight font-medium">Career:</span> {m.career}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-cream mb-6 text-center">Life Path questions</h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.q} className="bg-white/[0.04] rounded-2xl border border-white/10 p-6">
                <h3 className="font-serif font-semibold text-lg text-cream mb-2">{f.q}</h3>
                <p className="text-lav/80 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <SalesCTA
          headline="One number is a clue. Your full chart is the answer."
          context="Your Life Path number is a single thread. The AI deep reading pulls the whole tapestry — love, money, karma and the year ahead — from your complete Destiny Matrix."
        />
      </section>
    </PublicLayout>
  );
}
