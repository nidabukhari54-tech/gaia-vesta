import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Sparkles, GraduationCap, Heart, Compass } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { webAppSchema, toolBreadcrumb } from '../lib/schema';
import { ChartCalculator } from '../components/chart/ChartCalculator';
import { DestinyMatrixChart } from '../components/chart/DestinyMatrixChart';
import { ChakraMap } from '../components/chart/ChakraMap';
import { ArcanaModal, type SelectedArcana } from '../components/chart/ArcanaModal';
import { calculateDestinyMatrix, type DestinyMatrixResult } from '../lib/matrix-calculator';
import { childZones } from '../lib/zones';
import { ZoneCards } from '../components/ZoneCards';
import { getArcana, type Arcana } from '../lib/arcana-meanings';
import { exportChartPng } from '../lib/export-chart';

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
        eyebrow="Destiny Matrix · For parents"
        title="Your child's cosmic blueprint"
        subtitle="A child's Destiny Matrix, translated into what parents actually need: innate talents, emotional needs, learning style, and how to support who they already are."
        schema={[webAppSchema("Children's Destiny Matrix Calculator", '/tools/child-matrix', "A child's Destiny Matrix, translated into what parents actually need: innate talents, emotional needs, learning style, and how to support who they already are."), toolBreadcrumb("Children's Destiny Matrix", '/tools/child-matrix')]}
      />

      <div className="relative max-w-md mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="absolute -inset-4 bg-gold/15 rounded-[2.25rem] blur-2xl pointer-events-none" />
        <div className="relative rounded-[1.75rem] overflow-hidden border border-goldlight/30 shadow-[0_30px_70px_-25px_rgba(231,200,115,0.4)]">
          <img
            src="/images/child-matrix-illustration.webp"
            alt="A mother and young child sitting together at night, reading a small glowing golden star chart"
            loading="lazy"
            decoding="async"
            className="w-full h-auto block"
          />
        </div>
      </div>

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

      <ArcanaModal selected={selected} onClose={() => setSelected(null)} />
    </PublicLayout>
  );
}
