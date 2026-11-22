import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, RefreshCcw, KeyRound, ArrowRight } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { SalesCTA } from '../components/SalesCTA';
import { ChartCalculator } from '../components/chart/ChartCalculator';
import { DestinyMatrixChart } from '../components/chart/DestinyMatrixChart';
import { ArcanaModal, type SelectedArcana } from '../components/chart/ArcanaModal';
import { calculateDestinyMatrix, type DestinyMatrixResult } from '../lib/matrix-calculator';
import { getKarmicTail } from '../lib/karmic-tail';
import type { Arcana } from '../lib/arcana-meanings';

const ROLE_ICONS = [Sprout, RefreshCcw, KeyRound];

const FAQS = [
  {
    q: 'What is a karmic tail in the Destiny Matrix?',
    a: 'The karmic tail is a chain of three arcana running down the lower-left edge of your Destiny Matrix chart. Practitioners read it as your deepest repeating pattern: an unfinished lesson carried into this life that keeps resurfacing — in relationships, money, or the same old inner struggle — until it is understood and resolved.',
  },
  {
    q: 'How is the karmic tail calculated?',
    a: 'It comes entirely from your birth date. Your full Destiny Matrix is calculated first; the tail is the three-point chain that starts at the bottom point of the diamond (derived from your birth year) and runs up the lower-left edge, each next point derived from the ones before it. The three numbers are written as a code, for example 18-9-9.',
  },
  {
    q: 'What does a tail like 18-9-9 mean?',
    a: 'Read the three arcana in order — root, repetition, resolution. In 18-9-9, the root is 18, The Moon: hidden fears and illusions carried in. The repetition and resolution are both 9, The Hermit: the pattern returns as withdrawal and isolation, and it is also the way through — solitude turned into wisdom instead of hiding. Your own reading above does exactly this with your three numbers.',
  },
  {
    q: 'Can my karmic tail change?',
    a: 'The numbers never change — they are fixed by your birth date. What changes is how you live them. Every tail has a burden form and a gift form: the same arcana that describe your repeating struggle also describe the strength it is training in you. The third point of the tail shows the resolved form.',
  },
];

export function KarmicTail() {
  const [result, setResult] = useState<DestinyMatrixResult | null>(null);
  const [name, setName] = useState('');
  const [selected, setSelected] = useState<SelectedArcana | null>(null);

  const handleNodeClick = (_position: string, arcana: Arcana) => setSelected({ position: _position, arcana });
  const tail = result ? getKarmicTail(result) : null;

  return (
    <PublicLayout>
      <ToolHero
        eyebrow="Destiny Matrix · Karmic Tail"
        title="Karmic Tail Calculator"
        subtitle="Why does the same pattern keep returning — the same kind of partner, the same money leak, the same inner wall? Your karmic tail is the three-number code at the root of it. Find yours."
      />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {!result || !tail ? (
          <>
            <ChartCalculator
              onCalculate={(date, personName) => {
                setResult(calculateDestinyMatrix(date));
                setName(personName);
              }}
            />
            <p className="text-center text-xs text-lavdim mt-5 max-w-md mx-auto">
              Enter your birth date. Nothing is stored — your tail is calculated in your browser.
            </p>
          </>
        ) : (
          <div className="animate-fadeIn">
            <div className="text-center mb-8">
              <p className="text-xs font-semibold tracking-widest uppercase text-goldlight mb-2">
                {name ? `${name}'s karmic tail` : 'Your karmic tail'}
              </p>
              <p className="text-6xl sm:text-7xl font-serif font-bold bg-gradient-to-r from-gold to-purple bg-clip-text text-transparent leading-tight">
                {tail.code}
              </p>
              <p className="text-lav/75 mt-2 max-w-lg mx-auto">
                Three arcana, one story: what you carried in, how it keeps returning, and the lesson that ends the loop.
              </p>
            </div>

            <div className="space-y-5 mb-10">
              {tail.points.map((p, i) => {
                const Icon = ROLE_ICONS[i];
                return (
                  <div key={p.key} className="bg-white/80 rounded-2xl border border-purple/15 p-7 text-text-primary">
                    <div className="flex items-start gap-4">
                      <span className="w-11 h-11 rounded-xl bg-gradient-to-br from-gold/25 to-purple/25 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-purple" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold tracking-widest uppercase text-purple">
                          {p.role} · Arcana {p.arcana.id}
                        </p>
                        <h2 className="font-serif font-semibold text-xl mt-0.5">
                          {p.heading} — {p.arcana.name}
                        </h2>
                        <p className="text-sm font-medium text-text-primary/50 mb-3">{p.arcana.description}</p>
                        {i === 0 && (
                          <p className="text-text-primary/75 leading-relaxed">
                            {p.arcana.karmicLesson} In your earliest years this showed up as {p.arcana.challenges.join(', ').toLowerCase()} energy around you — the atmosphere you absorbed before you had words for it.
                          </p>
                        )}
                        {i === 1 && (
                          <p className="text-text-primary/75 leading-relaxed">
                            This is where the loop closes today. Watch for {p.arcana.challenges.join(', ').toLowerCase()} — in yourself or in the people you keep choosing. {p.arcana.personality}
                          </p>
                        )}
                        {i === 2 && (
                          <p className="text-text-primary/75 leading-relaxed">
                            The resolution is not escaping the pattern but graduating from it: {p.arcana.strengths.join(', ').toLowerCase()}.{' '}
                            <span className="italic">“{p.arcana.affirmation}”</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-[#FAF5EA] backdrop-blur-sm rounded-[1.75rem] p-5 sm:p-8 mb-6 shadow-[0_30px_80px_-20px_rgba(124,92,191,0.45)] border border-purple/20 text-text-primary">
              <p className="text-center text-sm font-medium text-text-primary/60 mb-2">
                Your tail inside the full chart — the chain runs down the lower-left edge
              </p>
              <DestinyMatrixChart result={result} onNodeClick={handleNodeClick} />
            </div>

            <div className="text-center mb-4">
              <button
                onClick={() => setResult(null)}
                className="px-6 py-3 bg-white/[0.04] border border-white/25 text-cream font-medium rounded-xl hover:border-goldlight/60 transition-all"
              >
                Calculate another tail
              </button>
            </div>

            <SalesCTA
              headline="The tail is one thread. Your full reading is the whole weave."
              context="You have found the root pattern. The AI deep reading traces how it touches your love line, your money line and your year ahead — and what to do with it, practically."
            />
          </div>
        )}

        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-cream mb-6 text-center">Karmic tail questions</h2>
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
          New to the matrix? Read the{' '}
          <Link to="/tools/how-to-read-destiny-matrix" className="text-goldlight font-medium hover:underline">
            guide to reading your full chart
          </Link>{' '}
          — or calculate the{' '}
          <Link to="/#demo" className="text-goldlight font-medium hover:underline inline-flex items-center gap-1">
            complete Destiny Matrix <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </p>
      </section>

      <ArcanaModal selected={selected} onClose={() => setSelected(null)} />
    </PublicLayout>
  );
}
