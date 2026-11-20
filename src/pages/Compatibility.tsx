import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Coins, Compass, Download, Sparkles, HeartHandshake } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { PersonForm } from '../components/chart/PersonForm';
import { DestinyMatrixChart } from '../components/chart/DestinyMatrixChart';
import { ChartLines } from '../components/chart/ChartLines';
import { ArcanaModal, type SelectedArcana } from '../components/chart/ArcanaModal';
import { calculateCompatibility, type CompatibilityResult } from '../lib/compatibility';
import { getArcana, type Arcana } from '../lib/arcana-meanings';
import { exportChartPng } from '../lib/export-chart';

function ScoreBar({ label, icon: Icon, score, color }: { label: string; icon: typeof Heart; score: number; color: string }) {
  return (
    <div className="bg-white/80 rounded-xl p-4 border border-gold/20">
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-2 text-sm font-medium text-text-primary">
          <Icon className="w-4 h-4" style={{ color }} /> {label}
        </span>
        <span className="font-bold text-text-primary">{score}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5">
        <div
          className="h-2.5 rounded-full transition-all duration-700"
          style={{ width: `${score}%`, background: `linear-gradient(to right, #D4A574, ${color})` }}
        />
      </div>
    </div>
  );
}

export function Compatibility() {
  const [dateA, setDateA] = useState<Date | null>(null);
  const [nameA, setNameA] = useState('Partner One');
  const [dateB, setDateB] = useState<Date | null>(null);
  const [nameB, setNameB] = useState('Partner Two');
  const [result, setResult] = useState<CompatibilityResult | null>(null);
  const [selected, setSelected] = useState<SelectedArcana | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleCalculate = () => {
    if (!dateA || !dateB) return;
    setResult(calculateCompatibility(dateA, dateB));
    setSelected(null);
  };

  const handleNodeClick = (position: string, arcana: Arcana) => setSelected({ position, arcana });

  const loveArcana = result ? getArcana(result.combined.loveLine.center) : null;
  const moneyArcana = result ? getArcana(result.combined.moneyLine.center) : null;
  const purposeArcana = result ? getArcana(result.combined.X) : null;

  return (
    <PublicLayout>
      <ToolHero
        eyebrow="Destiny Matrix · Compatibility"
        title="Are your charts written for each other?"
        subtitle="Enter two birth dates. Gaia Vesta merges both Destiny Matrices into one combined chart and reads the couple's love, money and shared purpose."
      />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-2 gap-5 mb-5">
          <PersonForm title="First person" onChange={(d, n) => { setDateA(d); setNameA(n); }} />
          <PersonForm title="Second person" onChange={(d, n) => { setDateB(d); setNameB(n); }} />
        </div>

        <button
          onClick={handleCalculate}
          disabled={!dateA || !dateB}
          className="w-full py-3.5 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 mb-10"
        >
          <HeartHandshake className="w-5 h-5" /> Reveal our compatibility
        </button>

        {result && (
          <div className="animate-fadeIn">
            <div className="text-center mb-6">
              <p className="text-sm text-text-primary/55">Combined chart for</p>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold">
                {nameA} <span className="text-gold">&</span> {nameB}
              </h2>
              <p className="mt-2 inline-block bg-gradient-to-r from-gold to-purple text-white font-semibold px-5 py-1.5 rounded-full">
                Harmony score: {result.harmonyScore}%
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              <ScoreBar label="Love" icon={Heart} score={result.loveScore} color="#B06AB3" />
              <ScoreBar label="Money" icon={Coins} score={result.moneyScore} color="#D4A574" />
              <ScoreBar label="Shared purpose" icon={Compass} score={result.purposeScore} color="#7A6AAE" />
            </div>

            <div ref={chartRef} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-xl border border-purple/20">
              <DestinyMatrixChart result={result.combined} onNodeClick={handleNodeClick} />
              <p className="text-center text-sm text-text-primary/50 mt-2">Tap any node for its meaning</p>
            </div>

            <div className="mb-6">
              <ChartLines result={result.combined} onNodeClick={handleNodeClick} />
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {[
                { title: 'Your love language', arcana: loveArcana, text: loveArcana?.loveMeaning },
                { title: 'Money as a couple', arcana: moneyArcana, text: moneyArcana?.moneyMeaning },
                { title: 'Why you met', arcana: purposeArcana, text: purposeArcana?.karmicLesson },
              ].map((card) => (
                <div key={card.title} className="bg-white/80 rounded-2xl p-5 border border-gold/20">
                  <p className="text-xs font-semibold tracking-wide uppercase text-purple mb-1">{card.title}</p>
                  <p className="font-serif font-semibold text-lg mb-2">
                    {card.arcana?.id} · {card.arcana?.name}
                  </p>
                  <p className="text-sm text-text-primary/70">{card.text}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => exportChartPng(chartRef.current, 'compatibility-matrix.png')}
                className="px-6 py-3 bg-white/80 border border-gold/40 text-text-primary font-medium rounded-xl hover:border-gold hover:shadow transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> Download chart (free)
              </button>
              <Link
                to="/auth"
                className="px-6 py-3 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" /> Save this reading — free account
              </Link>
            </div>
          </div>
        )}
      </section>

      <ArcanaModal selected={selected} onClose={() => setSelected(null)} />
    </PublicLayout>
  );
}
