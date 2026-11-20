import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Sparkles, GraduationCap, Heart, Compass } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { ChartCalculator } from '../components/chart/ChartCalculator';
import { DestinyMatrixChart } from '../components/chart/DestinyMatrixChart';
import { ChakraMap } from '../components/chart/ChakraMap';
import { ArcanaModal, type SelectedArcana } from '../components/chart/ArcanaModal';
import { calculateDestinyMatrix, type DestinyMatrixResult } from '../lib/matrix-calculator';
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
            <p className="text-center text-xs text-text-primary/45 mt-5 max-w-md mx-auto">
              Enter your child's birth date. Nothing is stored — the chart is calculated in your browser.
            </p>
          </>
        ) : (
          <div className="animate-fadeIn">
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-serif font-bold">{childName}'s Matrix</h2>
              <p className="text-text-primary/60 text-sm mt-1">Tap any point to read what it means for your child</p>
            </div>

            <div ref={chartRef} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-xl border border-purple/20">
              <DestinyMatrixChart result={result} onNodeClick={handleNodeClick} />
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white/80 rounded-2xl p-5 border border-gold/20">
                <div className="flex items-center gap-2 mb-2">
                  <Compass className="w-5 h-5 text-purple" />
                  <p className="text-xs font-semibold tracking-wide uppercase text-purple">Core nature</p>
                </div>
                <p className="font-serif font-semibold text-lg mb-2">{core?.id} · {core?.name}</p>
                <p className="text-sm text-text-primary/70">{core?.personality}</p>
              </div>
              <div className="bg-white/80 rounded-2xl p-5 border border-gold/20">
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
              <div className="bg-white/80 rounded-2xl p-5 border border-gold/20">
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

            <div className="bg-white/70 rounded-2xl border border-purple/20 p-6 mb-8">
              <h3 className="font-serif font-semibold text-xl mb-1">Chakra map</h3>
              <p className="text-sm text-text-primary/60 mb-6">
                Your child's energy centres — where they are naturally strong, and where they may need extra gentleness.
              </p>
              <ChakraMap result={result} onArcanaClick={handleNodeClick} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => exportChartPng(chartRef.current, 'child-matrix.png')}
                className="px-6 py-3 bg-white/80 border border-gold/40 text-text-primary font-medium rounded-xl hover:border-gold hover:shadow transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> Download chart (free)
              </button>
              <button
                onClick={() => setResult(null)}
                className="px-6 py-3 bg-white/80 border border-purple/30 text-text-primary font-medium rounded-xl hover:border-purple/60 transition-all"
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
