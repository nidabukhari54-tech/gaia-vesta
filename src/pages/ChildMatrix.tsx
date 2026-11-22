import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Sparkles, GraduationCap, Heart, Compass } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { faqPageSchema, webAppSchema, toolBreadcrumb } from '../lib/schema';
import { ChartCalculator } from '../components/chart/ChartCalculator';
import { DestinyMatrixChart } from '../components/chart/DestinyMatrixChart';
import { ChakraMap } from '../components/chart/ChakraMap';
import { ArcanaModal, type SelectedArcana } from '../components/chart/ArcanaModal';
import { calculateDestinyMatrix, type DestinyMatrixResult } from '../lib/matrix-calculator';
import { childZones } from '../lib/zones';
import { ZoneCards } from '../components/ZoneCards';
import { getArcana, type Arcana } from '../lib/arcana-meanings';
import { exportChartPng } from '../lib/export-chart';

const ZONE_GUIDE = [
  {
    title: 'Child’s Core',
    text: 'The arcana at the centre of the chart: the energy your child returns to when they are simply being themselves — and the sentence they most need to hear.',
  },
  {
    title: 'Temperament',
    text: 'The four outer points: how your child meets the world day to day — the face others see first, their drive, their comfort base, and their quieter inner layer.',
  },
  {
    title: 'Talents & Gifts',
    text: 'The gift cluster near the top of the chart: the abilities that show up before any training — the things they do for fun, for hours, unprompted.',
  },
  {
    title: 'Learning Style',
    text: 'The wisdom point, talent point and centre read together: how this child’s mind likes to take the world in. Experiments to try, not a school report.',
  },
  {
    title: 'Emotional World',
    text: 'The moon side of the chart: feelings, comfort, and how love and safety register for this child — the tone of voice, the rituals, the repair after a rupture.',
  },
  {
    title: 'Family Connection',
    text: 'The parent–child line: what flows into your child from both family lines, and what they will carry as “just how things are” until they are old enough to choose.',
  },
  {
    title: 'Growth & Support',
    text: 'Where growing will take longer and where your patience changes the most. Edges, not warnings — each one is a strength in training.',
  },
];

const FAQS = [
  {
    q: 'What is a children’s Destiny Matrix chart?',
    a: 'It is the same Destiny Matrix an adult receives — calculated from the birth date in exactly the same way — but read through a parent’s eyes. Instead of career and karmic language, the reading is translated into the things parents actually ask about: core nature, temperament, natural talents, learning style, emotional needs, and where support will matter most.',
  },
  {
    q: 'What age is it for?',
    a: 'Any age. The chart is fixed by the birth date, so it can be drawn for a newborn, a toddler or a teenager, and it does not change as they grow — what changes is which zones speak loudest. For a baby, temperament and emotional comfort tend to be the useful parts; for a school-age child, talents and learning style come to the front.',
  },
  {
    q: 'Is this a diagnosis or a label for my child?',
    a: 'No. The reading is a reflective tool, not an assessment: it describes tendencies and offers support ideas to try. It does not diagnose, measure or fix who your child is, and it is never a substitute for professional guidance — if you have real concerns about your child’s development, learning or health, a qualified professional is the right reader.',
  },
  {
    q: 'Whose birth date do I enter?',
    a: 'Your child’s — the day, month and year they were born. The name is only a label for the reading. Nothing is stored or sent anywhere: the chart is calculated in your browser, on your device.',
  },
  {
    q: 'Is the children’s matrix reading free?',
    a: 'Yes — the chart, all seven zones, the chakra map and the chart download are completely free. A free account is only needed if you want to save the reading to come back to it later.',
  },
];

export function ChildMatrix() {
  const [result, setResult] = useState<DestinyMatrixResult | null>(null);
  const [childName, setChildName] = useState('');
  const [selected, setSelected] = useState<SelectedArcana | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleNodeClick = (position: string, arcana: Arcana) => setSelected({ position, arcana });

  const core = result ? getArcana(result.X) : null;
  const talent = result ? getArcana(result.E) : null;
  const comfort = result ? getArcana(result.A) : null;

  return (
    <PublicLayout>
      <ToolHero
        image="/images/child-matrix-illustration.webp"
        imageAlt="A mother and young child sitting together at night, reading a small glowing golden star chart"
        eyebrow="Destiny Matrix · For parents"
        title="Children's Destiny Matrix — Your Child's Chart, Translated"
        subtitle="A child's Destiny Matrix, translated into what parents actually need: innate talents, emotional needs, learning style, and how to support who they already are."
        schema={[webAppSchema("Children's Destiny Matrix Calculator", '/tools/child-matrix', "A child's Destiny Matrix, translated into what parents actually need: innate talents, emotional needs, learning style, and how to support who they already are."), faqPageSchema(FAQS), toolBreadcrumb("Children's Destiny Matrix", '/tools/child-matrix')]}
      />


      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {!result ? (
          <>
            <ChartCalculator
              onCalculate={(date, name) => {
                setResult(calculateDestinyMatrix(date));
                setChildName(name);
              }}
            />
            <p className="text-center text-xs text-lavdim mt-5 max-w-md mx-auto">
              Enter your child's birth date. Nothing is stored — the chart is calculated in your browser.
            </p>
          </>
        ) : (
          <div className="animate-fadeIn">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream">{childName}'s Matrix</h2>
              <p className="text-lav/70 text-sm mt-1">Tap any point to read what it means for your child</p>
            </div>

            <div ref={chartRef} className="bg-[#FAF5EA] backdrop-blur-sm rounded-[1.75rem] p-5 sm:p-8 mb-6 shadow-[0_30px_80px_-20px_rgba(124,92,191,0.45)] border border-purple/20 text-text-primary">
              <DestinyMatrixChart result={result} onNodeClick={handleNodeClick} />
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/80 rounded-2xl p-5 border border-gold/20 text-text-primary">
                <div className="flex items-center gap-2 mb-2">
                  <Compass className="w-5 h-5 text-purple" />
                  <p className="text-xs font-semibold tracking-wide uppercase text-purple">Core nature</p>
                </div>
                <p className="font-serif font-semibold text-lg mb-2">{core?.id} · {core?.name}</p>
                <p className="text-sm text-text-primary/70">{core?.personality}</p>
              </div>
              <div className="bg-white/80 rounded-2xl p-5 border border-gold/20 text-text-primary">
                <div className="flex items-center gap-2 mb-2">
                  <GraduationCap className="w-5 h-5 text-gold" />
                  <p className="text-xs font-semibold tracking-wide uppercase text-gold">Talents & learning</p>
                </div>
                <p className="font-serif font-semibold text-lg mb-2">{talent?.id} · {talent?.name}</p>
                <p className="text-sm text-text-primary/70">
                  Strengths to nurture: {talent?.strengths.join(', ').toLowerCase()}. Learning lands best when it
                  connects to these natural gifts rather than fighting them.
                </p>
              </div>
              <div className="bg-white/80 rounded-2xl p-5 border border-gold/20 text-text-primary">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-purple" />
                  <p className="text-xs font-semibold tracking-wide uppercase text-purple">Emotional comfort</p>
                </div>
                <p className="font-serif font-semibold text-lg mb-2">{comfort?.id} · {comfort?.name}</p>
                <p className="text-sm text-text-primary/70">
                  {comfort?.description}. Gentle watch-outs as they grow: {comfort?.challenges.join(', ').toLowerCase()} —
                  met with patience, these become strengths.
                </p>
              </div>
            </div>

            <div className="mb-8">
              <ZoneCards
                zones={childZones(result)}
                heading="Your Child — 7 Zones"
                sub="The full reading, zone by zone — written for parents: what to nurture, what to make room for, and where your patience will matter most."
                variant="light"
              />
            </div>

            <div className="bg-[#FAF5EA] rounded-[1.75rem] border border-purple/20 p-5 sm:p-8 mb-8 text-text-primary shadow-[0_30px_80px_-20px_rgba(124,92,191,0.45)]">
              <h3 className="font-serif font-semibold text-xl mb-1">Chakra map</h3>
              <p className="text-sm text-text-primary/60 mb-6">
                Your child's energy centres — where they are naturally strong, and where they may need extra gentleness.
              </p>
              <ChakraMap result={result} onArcanaClick={handleNodeClick} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => exportChartPng(chartRef.current, 'child-matrix.png')}
                className="px-6 py-3 bg-white/[0.04] border border-white/25 text-cream font-medium rounded-xl hover:border-goldlight/60 hover:shadow transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> Download chart (free)
              </button>
              <button
                onClick={() => setResult(null)}
                className="px-6 py-3 bg-white/[0.04] border border-white/25 text-cream font-medium rounded-xl hover:border-goldlight/60 transition-all"
              >
                Another child
              </button>
              <Link
                to="/auth"
                className="px-6 py-3 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" /> Save — free account
              </Link>
            </div>
          </div>
        )}
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-serif font-bold text-cream mb-4 text-center">How the Children’s Matrix Reading Works</h2>
        <p className="text-lav/80 leading-relaxed max-w-3xl mx-auto text-center mb-10">
          Your child’s chart is calculated from their birth date exactly as an adult’s Destiny Matrix is — the
          difference is in the translation. Every zone below is written for a parent: what to nurture, what to
          make room for, and where your patience will matter most. Read it as tendencies and ideas to try, never
          as a verdict on who your child is.
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-16">
          {ZONE_GUIDE.map((z, i) => (
            <div key={z.title} className="bg-white/[0.04] rounded-2xl border border-white/10 p-6">
              <p className="text-xs font-semibold tracking-widest text-goldlight mb-1">Zone {i + 1}</p>
              <h3 className="font-serif font-semibold text-lg text-cream mb-2">{z.title}</h3>
              <p className="text-sm text-lav/80 leading-relaxed">{z.text}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-serif font-bold text-cream mb-6 text-center">Questions parents ask</h2>
        <div className="space-y-4">
          {FAQS.map((f) => (
            <div key={f.q} className="bg-white/[0.04] rounded-2xl border border-white/10 p-6">
              <h3 className="font-serif font-semibold text-lg text-cream mb-2">{f.q}</h3>
              <p className="text-lav/80 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <ArcanaModal selected={selected} onClose={() => setSelected(null)} />
    </PublicLayout>
  );
}
