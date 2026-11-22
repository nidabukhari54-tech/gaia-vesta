import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Coins, Compass, Download, Sparkles, HeartHandshake } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { faqPageSchema, webAppSchema, toolBreadcrumb } from '../lib/schema';
import { SalesCTA } from '../components/SalesCTA';
import { PersonForm } from '../components/chart/PersonForm';
import { DestinyMatrixChart } from '../components/chart/DestinyMatrixChart';
import { ChartLines } from '../components/chart/ChartLines';
import { ArcanaModal, type SelectedArcana } from '../components/chart/ArcanaModal';
import { calculateCompatibility, type CompatibilityResult } from '../lib/compatibility';
import { calculateDestinyMatrix, type DestinyMatrixResult } from '../lib/matrix-calculator';
import { compatibilityZones } from '../lib/zones';
import { ZoneCards } from '../components/ZoneCards';
import { getArcana, type Arcana } from '../lib/arcana-meanings';
import { exportChartPng } from '../lib/export-chart';

const ZONE_GUIDE = [
  {
    title: 'Two Cores',
    text: 'Your two centre arcana, side by side, and the third centre they blend into — the flavour the relationship itself takes on when you are together.',
  },
  {
    title: 'Shared Strengths',
    text: 'The arcana that appear in both charts: the instincts you never have to explain to each other — and, where you share none, how difference itself becomes the bridge.',
  },
  {
    title: 'Love & Connection',
    text: 'How each of you enters love, what sits at the heart of the combined love line, and what the bond is building toward.',
  },
  {
    title: 'Money & Work Together',
    text: 'Each partner’s money drive, the household’s money centre, and the material foundation you build on together.',
  },
  {
    title: 'Communication',
    text: 'Your blend point and each centre’s stress pattern: how you two talk, how you misread each other under pressure, and the repair language that suits this bond.',
  },
  {
    title: 'Main Challenge & Breakup Risks',
    text: 'The positions where the combined chart carries tenser energy — friction patterns named early so they can be worked with. Patterns to notice, never a prediction.',
  },
  {
    title: 'Children & Parenting',
    text: 'Each partner’s parent–child line and what each of you hands on — parenting styles and inherited patterns, whether or not children are part of your story.',
  },
  {
    title: 'Karmic Lesson Together',
    text: 'Both karmic tails and the combined one: the old pattern each of you arrived with, and the lesson the relationship keeps seating you across from.',
  },
  {
    title: 'Purpose Together',
    text: 'The combined life path, stage by stage: the direction this relationship itself is travelling, separate from either partner’s individual road.',
  },
];

const FAQS = [
  {
    q: 'What is a Destiny Matrix compatibility chart?',
    a: 'It is a single chart built from two birth dates. Each partner’s own Destiny Matrix is calculated first, then the two charts are merged into one combined chart that is read as the relationship itself — its love line, its money line, its shared purpose, and the places where the two of you are likely to rub. The reading describes the bond, not either individual.',
  },
  {
    q: 'How is the combined chart calculated?',
    a: 'Every position is added together. For each point of the chart, the two partners’ numbers at that same position are summed and reduced back into the 1–22 arcana range — so if one partner’s centre is 6 and the other’s is 14, the combined centre is 20. The love, money and shared-purpose scores are read from the combined chart’s lines, and the harmony score is the average of the three.',
  },
  {
    q: 'What does the ‘Main Challenge & Breakup Risks’ zone actually mean?',
    a: 'It names the positions where your combined chart carries arcana that are traditionally read as tense — Death, The Devil, The Tower or The Fool among them — and describes the friction patterns couples with those placements most often report. It is not a breakup prediction, and no chart can say whether a relationship will last. The zone exists because risk in a relationship usually lives in patterns that repeat without being named; naming them early is most of the protection there is.',
  },
  {
    q: 'Do both partners need accounts?',
    a: 'No. Two birth dates are all the calculator needs — names are only optional labels. The combined chart, the scores and the full nine-zone reading are generated in your browser without any account. A free account is only needed if you want to save the reading, or to open an AI deep reading of it.',
  },
  {
    q: 'Is the compatibility reading free?',
    a: 'Yes — the combined chart, the love, money and purpose scores, and all nine reading zones are free in full, and you can download the chart image free too. The paid layer is the AI deep reading: a free account includes 5 AI readings a month, and Cosmic ($9/month) makes them unlimited.',
  },
];

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
  const [pair, setPair] = useState<{ r1: DestinyMatrixResult; r2: DestinyMatrixResult } | null>(null);
  const [selected, setSelected] = useState<SelectedArcana | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const handleCalculate = () => {
    if (!dateA || !dateB) return;
    setResult(calculateCompatibility(dateA, dateB));
    setPair({ r1: calculateDestinyMatrix(dateA), r2: calculateDestinyMatrix(dateB) });
    setSelected(null);
  };

  // Arriving from the homepage hero calculator: /tools/compatibility?d1=..&n1=..&d2=..&n2=..
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const parse = (v: string | null) => {
      if (!v) return null;
      const [y, m, dd] = v.split('-').map(Number);
      return y && m && dd ? new Date(y, m - 1, dd) : null;
    };
    const a = parse(q.get('d1'));
    const b = parse(q.get('d2'));
    if (q.get('n1')) setNameA(q.get('n1') as string);
    if (q.get('n2')) setNameB(q.get('n2') as string);
    if (a) setDateA(a);
    if (b) setDateB(b);
    if (a && b) {
      setResult(calculateCompatibility(a, b));
      setPair({ r1: calculateDestinyMatrix(a), r2: calculateDestinyMatrix(b) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNodeClick = (position: string, arcana: Arcana) => setSelected({ position, arcana });

  const loveArcana = result ? getArcana(result.combined.loveLine.center) : null;
  const moneyArcana = result ? getArcana(result.combined.moneyLine.center) : null;
  const purposeArcana = result ? getArcana(result.combined.X) : null;

  return (
    <PublicLayout>
      <ToolHero
        image="/images/compatibility-illustration.webp"
        imageAlt="A couple holding hands beneath two overlapping golden rings of light merging into one glowing chart in an indigo night sky"
        eyebrow="Destiny Matrix · Compatibility"
        title="Destiny Matrix Compatibility Calculator"
        subtitle="Are your charts written for each other? Enter two birth dates — Gaia Vesta merges both Destiny Matrices into one combined chart and reads the couple's love, money and shared purpose."
        schema={[webAppSchema('Destiny Matrix Compatibility Calculator', '/tools/compatibility', "Enter two birth dates. Gaia Vesta merges both Destiny Matrices into one combined chart and reads the couple's love, money and shared purpose."), faqPageSchema(FAQS), toolBreadcrumb('Compatibility Matrix', '/tools/compatibility')]}
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
              <p className="text-sm text-lavdim">Combined chart for</p>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream">
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

            <div ref={chartRef} className="bg-[#FAF5EA] backdrop-blur-sm rounded-[1.75rem] p-5 sm:p-8 mb-6 shadow-[0_30px_80px_-20px_rgba(124,92,191,0.45)] border border-purple/20 text-text-primary">
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
                <div key={card.title} className="bg-white/80 rounded-2xl p-5 border border-gold/20 text-text-primary">
                  <p className="text-xs font-semibold tracking-wide uppercase text-purple mb-1">{card.title}</p>
                  <p className="font-serif font-semibold text-lg mb-2">
                    {card.arcana?.id} · {card.arcana?.name}
                  </p>
                  <p className="text-sm text-text-primary/70">{card.text}</p>
                </div>
              ))}
            </div>

            {pair && (
              <div className="mb-8">
                <ZoneCards
                  zones={compatibilityZones(pair.r1, pair.r2, result.combined, { name: nameA, partnerName: nameB })}
                  heading="Your Compatibility — 9 Zones"
                  sub="Both charts read together, zone by zone — including the friction patterns most readings leave out."
                  variant="light"
                />
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => exportChartPng(chartRef.current, 'compatibility-matrix.png')}
                className="px-6 py-3 bg-white/[0.04] border border-white/25 text-cream font-medium rounded-xl hover:border-goldlight/60 hover:shadow transition-all flex items-center justify-center gap-2"
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <SalesCTA
          headline="Two charts. One story. Read yours together."
          context="Compatibility scores tell you the weather. The AI deep reading tells you the climate — how your love lines, money lines and karmic lessons interact as a couple, and what this year holds for you both."
        />
      </div>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-serif font-bold text-cream mb-4 text-center">How the Compatibility Reading Works</h2>
        <p className="text-lav/80 leading-relaxed max-w-3xl mx-auto text-center mb-10">
          Enter two birth dates and Gaia Vesta first calculates each person’s own Destiny Matrix. Then the two
          charts are merged: every position of the combined chart is the sum of both partners’ numbers at that
          position, reduced into the 1–22 arcana range. What you get is a third chart — neither person’s, but the
          relationship’s — and it is read in nine zones:
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {ZONE_GUIDE.map((z, i) => (
            <div key={z.title} className="bg-white/[0.04] rounded-2xl border border-white/10 p-6">
              <p className="text-xs font-semibold tracking-widest text-goldlight mb-1">Zone {i + 1}</p>
              <h3 className="font-serif font-semibold text-lg text-cream mb-2">{z.title}</h3>
              <p className="text-sm text-lav/80 leading-relaxed">{z.text}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-serif font-bold text-cream mb-6 text-center">Compatibility questions</h2>
        <div className="space-y-4 max-w-4xl mx-auto">
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
