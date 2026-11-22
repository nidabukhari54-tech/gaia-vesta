import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles, ArrowRight, Heart, Coins, Compass,
  ChevronDown, ChevronLeft, ChevronRight, Menu, X, Star, HeartHandshake,
  CalendarClock, Baby, Moon, Check, Minus, RefreshCcw, Users,
  ShieldCheck, Zap, Eye, Gem, MessagesSquare,
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import {
  calculateDestinyMatrix,
  getChartPositions,
  type DestinyMatrixResult,
} from '../lib/matrix-calculator';
import { arcanaMeanings, getArcana } from '../lib/arcana-meanings';
import { dailyArcana } from '../lib/numerology';
import { DestinyMatrixChart } from '../components/chart/DestinyMatrixChart';
import { ChartCalculator } from '../components/chart/ChartCalculator';
import { ArcanaModal, type SelectedArcana } from '../components/chart/ArcanaModal';

const SAMPLE_RESULT = calculateDestinyMatrix(new Date(1990, 4, 21));
const ARCANA_LIST = Object.values(arcanaMeanings);

const STARS = [
  { l: '6%', t: '12%', d: '0s' }, { l: '14%', t: '64%', d: '0.7s' }, { l: '22%', t: '28%', d: '1.3s' },
  { l: '33%', t: '8%', d: '0.4s' }, { l: '41%', t: '78%', d: '1.8s' }, { l: '52%', t: '18%', d: '0.9s' },
  { l: '60%', t: '58%', d: '0.2s' }, { l: '68%', t: '10%', d: '1.5s' }, { l: '74%', t: '82%', d: '0.6s' },
  { l: '82%', t: '34%', d: '1.1s' }, { l: '89%', t: '66%', d: '0.3s' }, { l: '94%', t: '16%', d: '1.9s' },
  { l: '48%', t: '88%', d: '1.4s' }, { l: '27%', t: '90%', d: '0.8s' }, { l: '87%', t: '92%', d: '1.7s' },
];

function Stars() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {STARS.map((s, i) => (
        <span
          key={i}
          className="absolute w-1 h-1 rounded-full bg-goldlight animate-twinkle"
          style={{ left: s.l, top: s.t, animationDelay: s.d }}
        />
      ))}
    </div>
  );
}

function GlowChart({ result }: { result: DestinyMatrixResult }) {
  const positions = getChartPositions(result);
  const pos = Object.fromEntries(positions.map((p) => [p.id, p]));
  const seg = (a: string, b: string, gold = false) => (
    <line
      key={`${a}-${b}`}
      x1={pos[a].x}
      y1={pos[a].y}
      x2={pos[b].x}
      y2={pos[b].y}
      stroke={gold ? '#E7C873' : '#7C6BD9'}
      strokeOpacity={gold ? 0.75 : 0.45}
      strokeWidth={gold ? 1.6 : 1.2}
    />
  );
  return (
    <svg viewBox="0 0 400 400" className="w-full h-auto" role="img" aria-label="A glowing Destiny Matrix chart">
      <defs>
        <radialGradient id="goldCore" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F6E3AC" />
          <stop offset="55%" stopColor="#E7C873" />
          <stop offset="100%" stopColor="#C9963C" />
        </radialGradient>
        <radialGradient id="halo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7C5CBF" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#7C5CBF" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="200" cy="200" r="198" fill="url(#halo)" />
      <g className="animate-spin-slower">
        <circle cx="200" cy="200" r="190" fill="none" stroke="#E7C873" strokeOpacity="0.28" strokeDasharray="2 7" />
        <circle cx="200" cy="200" r="152" fill="none" stroke="#B7A6E3" strokeOpacity="0.16" strokeDasharray="1 6" />
      </g>
      {seg('A', 'B')}{seg('B', 'C')}{seg('C', 'D')}{seg('D', 'A')}
      {seg('E', 'F')}{seg('F', 'G')}{seg('G', 'H')}{seg('H', 'E')}
      {seg('A', 'C')}{seg('D', 'B')}
      {seg('H', 'F', true)}{seg('E', 'G', true)}
      {positions.map((p) => {
        const centre = p.id === 'X';
        const r = centre ? 19 : p.id.length === 1 && 'ABCDEFGH'.includes(p.id) ? 14.5 : 11;
        return (
          <g key={p.id}>
            <circle
              cx={p.x}
              cy={p.y}
              r={r}
              fill={centre ? 'url(#goldCore)' : '#221344'}
              stroke={centre ? '#F6E3AC' : '#8B7FE0'}
              strokeWidth={centre ? 1.6 : 1.3}
            />
            <text
              x={p.x}
              y={p.y + 4}
              textAnchor="middle"
              fontSize={centre ? 13 : 11}
              fontWeight={700}
              fill={centre ? '#2A1850' : '#F5EFE3'}
            >
              {p.arcana}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.22em] uppercase text-goldlight/90 border border-goldlight/25 rounded-full px-4 py-1.5 bg-white/[0.03]">
      <Sparkles className="w-3.5 h-3.5" />
      {children}
    </p>
  );
}

type Accent = { kind: 'star' | 'sun' | 'moon'; cls: string; size: number; delay: string; dur: string };

function CelestialAccents({ items }: { items: Accent[] }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
      {items.map((a, i) => (
        <span
          key={i}
          className={`absolute ${a.cls} animate-float`}
          style={{ animationDelay: a.delay, animationDuration: a.dur }}
        >
          {a.kind === 'star' && (
            <svg width={a.size} height={a.size} viewBox="0 0 24 24" fill="#E7C873">
              <path d="M12 0 L14.6 9.4 L24 12 L14.6 14.6 L12 24 L9.4 14.6 L0 12 L9.4 9.4 Z" />
            </svg>
          )}
          {a.kind === 'moon' && (
            <svg width={a.size} height={a.size} viewBox="0 0 24 24" fill="#C9BEE3">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
            </svg>
          )}
          {a.kind === 'sun' && (
            <svg width={a.size} height={a.size} viewBox="0 0 24 24" fill="none" stroke="#E7C873" strokeWidth="1.7" strokeLinecap="round">
              <circle cx="12" cy="12" r="4.2" fill="#E7C873" stroke="none" />
              <path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5 5l1.7 1.7M17.3 17.3L19 19M19 5l-1.7 1.7M6.7 17.3L5 19" />
            </svg>
          )}
        </span>
      ))}
    </div>
  );
}

function Marquee() {
  const items = [
    'Destiny Matrix Chart', 'Karmic Tail', 'Compatibility', 'Family Lines', 'Angel Numbers',
    'Year Forecast', "Children's Matrix", 'Moon Phase', 'Life Path Number', 'Free PDF Report',
  ];
  const row = [...items, ...items];
  return (
    <div className="relative border-y border-white/[0.08] bg-white/[0.02] py-4 overflow-hidden marquee-paused">
      <div className="flex w-max animate-marquee">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-6 px-6 whitespace-nowrap">
            <span className={`font-serif text-lg ${i % 2 ? 'italic text-goldlight/90' : 'text-cream/85'}`}>{t}</span>
            <Sparkles className="w-3.5 h-3.5 text-goldlight/50" />
          </span>
        ))}
      </div>
    </div>
  );
}

function Nav() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    { label: 'The Reading', href: '#demo' },
    { label: 'Family Lines', href: '/tools/family-lines' },
    { label: 'Tools', href: '/tools' },
    { label: 'Arcana', href: '/arcana' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-40 bg-night/85 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[radial-gradient(circle_at_35%_35%,#F6E3AC,#C9963C)] flex items-center justify-center shadow-[0_0_18px_rgba(231,200,115,0.45)]">
              <Sparkles className="w-4 h-4 text-night3" />
            </div>
            <span className="leading-none">
              <span className="block text-lg font-serif font-semibold tracking-wide text-cream">GAIA VESTA</span>
              <span className="block text-[9px] tracking-[0.3em] text-lavdim mt-0.5">DESTINY MATRIX</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) =>
              l.href.startsWith('#') ? (
                <a key={l.href} href={l.href} className="text-sm font-medium text-lav hover:text-cream transition-colors">
                  {l.label}
                </a>
              ) : (
                <Link key={l.href} to={l.href} className="text-sm font-medium text-lav hover:text-cream transition-colors">
                  {l.label}
                </Link>
              ),
            )}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link to={user ? '/dashboard' : '/auth'} className="text-sm font-medium text-lav hover:text-cream transition-colors">
              {user ? 'Dashboard' : 'Sign in'}
            </Link>
            <a
              href="#demo"
              className="px-5 py-2.5 bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 text-sm font-semibold rounded-full hover:shadow-[0_0_24px_rgba(231,200,115,0.45)] transition-all"
            >
              Begin Reading →
            </a>
          </div>

          <button className="md:hidden p-2 text-cream" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-white/10 bg-night2/95 px-4 py-4 space-y-3">
          {links.map((l) =>
            l.href.startsWith('#') ? (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block text-sm font-medium text-lav">
                {l.label}
              </a>
            ) : (
              <Link key={l.href} to={l.href} onClick={() => setOpen(false)} className="block text-sm font-medium text-lav">
                {l.label}
              </Link>
            ),
          )}
          <a
            href="#demo"
            onClick={() => setOpen(false)}
            className="block text-center px-5 py-2.5 bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 text-sm font-semibold rounded-full"
          >
            Begin Reading →
          </a>
        </div>
      )}
    </header>
  );
}

function ShootingStars() {
  const stars = [
    { cls: 'top-[10%] right-[6%]', delay: '1.2s', dur: '9s' },
    { cls: 'top-[3%] right-[36%]', delay: '5.8s', dur: '12s' },
    { cls: 'top-[24%] right-[1%]', delay: '9.4s', dur: '10.5s' },
  ];
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {stars.map((s, i) => (
        <span
          key={i}
          className={`absolute ${s.cls} block w-[130px] h-[2px] rounded-full bg-gradient-to-r from-goldlight via-goldlight/60 to-transparent shadow-[0_0_8px_rgba(231,200,115,0.9)] opacity-0 animate-shoot`}
          style={{ animationDelay: s.delay, animationDuration: s.dur }}
        />
      ))}
    </div>
  );
}

function Hero() {
  const ticks = ['Free full chart', 'No credit card', 'Instant reading', 'Private — demo stores nothing'];
  return (
    <section className="relative pt-24 pb-14 overflow-hidden">
      <Stars />
      <ShootingStars />
      <CelestialAccents
        items={[
          { kind: 'sun', cls: 'top-24 right-[6%] opacity-80 hidden sm:block', size: 30, delay: '0.4s', dur: '9s' },
          { kind: 'moon', cls: 'top-40 left-[3%] opacity-70 hidden md:block', size: 24, delay: '1.2s', dur: '8s' },
          { kind: 'star', cls: 'bottom-16 right-[38%] opacity-80 hidden lg:block', size: 18, delay: '0.8s', dur: '7s' },
        ]}
      />
      <div className="absolute -top-32 right-0 w-[34rem] h-[34rem] bg-purple/25 rounded-full blur-3xl pointer-events-none animate-drift" />
      <div className="absolute top-72 -left-40 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center relative">
        <div className="animate-fadeIn">
          <Eyebrow>A new kind of Destiny Matrix insight</Eyebrow>
          <h1 className="text-4xl sm:text-5xl lg:text-[3.6rem] font-serif font-medium text-cream leading-[1.12] mt-6 mb-6">
            Discover the <em className="italic text-goldlight">hidden story</em> written in your birth date
          </h1>
          <p className="text-lg text-lav/90 mb-8 max-w-lg leading-relaxed">
            Why do you keep falling for the same kind of person? Why does money arrive — then quietly
            disappear? Your personal Destiny Matrix chart maps the pattern: soul purpose, love, money,
            and the karmic tail beneath it all. Read it for yourself — or for the people you love most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#demo"
              className="px-8 py-3.5 bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 font-semibold rounded-full hover:shadow-[0_0_28px_rgba(231,200,115,0.5)] transition-all flex items-center justify-center gap-2"
            >
              Reveal my chart — free
              <ArrowRight className="w-5 h-5" />
            </a>
            <Link
              to="/tools/family-lines"
              className="px-8 py-3.5 bg-white/[0.04] border border-white/20 text-cream font-medium rounded-full hover:border-goldlight/60 transition-all flex items-center justify-center"
            >
              Explore family lines
            </Link>
          </div>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 mt-7">
            {ticks.map((t) => (
              <li key={t} className="flex items-center gap-1.5 text-[13px] text-lavdim">
                <Check className="w-3.5 h-3.5 text-goldlight" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative animate-fadeIn animate-breathe max-w-md mx-auto w-full lg:max-w-[540px]">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] bg-gold/[0.13] rounded-full blur-3xl pointer-events-none" />
          <div
            className="relative lg:h-[590px]"
            style={{
              WebkitMaskImage: 'radial-gradient(ellipse 94% 94% at 50% 46%, black 52%, transparent 98%)',
              maskImage: 'radial-gradient(ellipse 94% 94% at 50% 46%, black 52%, transparent 98%)',
            }}
          >
            <img
              src="/images/hero-gaia-scene.webp"
              alt="Gaia presenting your glowing Destiny Matrix chart, one hand open in welcome"
              className="w-full h-auto lg:h-full lg:object-cover lg:object-[50%_30%]"
              loading="eager"
              decoding="async"
            />
          </div>
          <span className="absolute bottom-[5%] left-[5%] whitespace-nowrap bg-night2/85 backdrop-blur border border-goldlight/35 rounded-full px-3.5 py-1.5 text-[11px] font-medium text-cream shadow-lg animate-float">
            Gaia · your guide
          </span>
        </div>
      </div>

      <div className="flex justify-center mt-14 relative">
        <a href="#demo" className="text-lavdim hover:text-goldlight transition-colors" aria-label="Scroll down">
          <ChevronDown className="w-8 h-8 animate-bounce" />
        </a>
      </div>
    </section>
  );
}

function Demo() {
  const { user } = useAuth();
  const [matrixResult, setMatrixResult] = useState<DestinyMatrixResult | null>(null);
  const [personName, setPersonName] = useState('');
  const [selectedArcana, setSelectedArcana] = useState<SelectedArcana | null>(null);

  const handleCalculate = (date: Date, name: string) => {
    setMatrixResult(calculateDestinyMatrix(date));
    setPersonName(name);
    setSelectedArcana(null);
  };

  const handleNodeClick = (position: string, arcanaId: number) => {
    setSelectedArcana({ position, arcana: getArcana(arcanaId) });
  };

  return (
    <section id="demo" className="py-20 relative">
      <div data-reveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.25em] uppercase text-lavdim mb-3">— the living chart —</p>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-cream mb-4">
            Your chart, <em className="italic text-goldlight">drawn in light</em>
          </h2>
          <p className="text-lav/80">No account, no email. Your birth date never leaves your browser in this demo.</p>
        </div>

        <div className="relative max-w-2xl mx-auto">
          <div className="absolute -inset-6 bg-gold/[0.22] rounded-[2.5rem] blur-2xl pointer-events-none" />
          <div
            className="relative bg-[#FAF5EA] rounded-[1.75rem] p-5 sm:p-8 shadow-[0_30px_80px_-20px_rgba(124,92,191,0.45)] ring-1 ring-[#D4A574]/60 text-text-primary overflow-hidden"
            style={{
              backgroundImage:
                'radial-gradient(rgba(201,150,60,0.13) 1px, transparent 1.6px), radial-gradient(rgba(124,92,191,0.10) 1px, transparent 1.6px)',
              backgroundSize: '26px 26px, 34px 34px',
              backgroundPosition: '0 0, 13px 17px',
            }}
          >
          <div className="text-center mb-6 relative">
            <img
              src="/images/gaia-character.webp"
              alt="Gaia"
              className="w-14 h-14 rounded-full object-cover object-top border-2 border-[#D4A574]/70 shadow-md mx-auto mb-3"
              loading="lazy"
              decoding="async"
            />
            <p className="font-serif text-xl text-text-primary">Begin your reading</p>
            <p className="text-[11px] tracking-[0.18em] uppercase text-text-primary/50 mt-1.5">
              Enter your date · See your chart · Read your story
            </p>
          </div>
          {!matrixResult ? (
            <ChartCalculator onCalculate={handleCalculate} />
          ) : (
            <div className="animate-fadeIn">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-serif font-semibold text-text-primary">
                  {personName}'s Destiny Matrix
                </h3>
                <p className="text-text-primary/60 text-sm mt-1">Tap any number to reveal its meaning</p>
              </div>

              <div className="bg-white/80 rounded-2xl p-6 mb-6 shadow border border-purple/20">
                <DestinyMatrixChart
                  result={matrixResult}
                  onNodeClick={(position, arcana) => handleNodeClick(position, arcana.id)}
                />
              </div>

              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                {[
                  { icon: Heart, label: 'Love line', value: `${matrixResult.loveLine.left} → ${matrixResult.loveLine.center} → ${matrixResult.loveLine.right}` },
                  { icon: Coins, label: 'Money line', value: `${matrixResult.moneyLine.left} → ${matrixResult.moneyLine.center} → ${matrixResult.moneyLine.right}` },
                  { icon: Compass, label: 'Life path', value: `${matrixResult.lifePath.left} → ${matrixResult.lifePath.center} → ${matrixResult.lifePath.right}` },
                ].map((l) => (
                  <div key={l.label} className="bg-white/80 rounded-xl p-4 border border-gold/30 text-center">
                    <div className="w-10 h-10 bg-purple/10 rounded-full flex items-center justify-center mx-auto mb-2">
                      <l.icon className="w-5 h-5 text-purple" />
                    </div>
                    <p className="text-sm font-medium text-text-primary/60">{l.label}</p>
                    <p className="font-semibold text-text-primary">{l.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-gold/10 to-purple/10 border border-gold/40 rounded-2xl p-8 text-center">
                <h4 className="text-xl font-serif font-semibold text-text-primary mb-2">This is only the map</h4>
                <p className="text-text-primary/60 mb-5">
                  {user
                    ? 'Open the full chart studio for the complete reading — every line, your karmic tail, and a free PDF report.'
                    : 'Create a free account to save this chart, read every line in full, and download your complete PDF report — free.'}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setMatrixResult(null)}
                    className="px-6 py-3 bg-white/80 border border-gold/40 text-text-primary font-medium rounded-xl hover:border-gold transition-all"
                  >
                    Calculate another
                  </button>
                  <Link
                    to={user ? '/chart' : '/auth'}
                    className="px-6 py-3 bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 font-semibold rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {user ? 'Open chart studio' : 'Save my chart — free'}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>

      <ArcanaModal selected={selectedArcana} onClose={() => setSelectedArcana(null)} />
    </section>
  );
}

function WhyCards() {
  const cards = [
    {
      icon: Eye,
      img: '/images/why-self.webp',
      alt: 'A woman gazing into a glowing golden orb with a star inside',
      title: 'Understand yourself',
      text: 'See how your inner nature, needs and gifts meet the person the world thinks you are — and where the two pull apart.',
    },
    {
      icon: HeartHandshake,
      img: '/images/why-love.webp',
      alt: 'A couple connected by a golden thread of light shaped like a heart',
      title: 'Strengthen relationships',
      text: 'Soft, specific guidance for the bonds that hold you: partners, parents, children — the dynamics, named plainly.',
    },
    {
      icon: RefreshCcw,
      img: '/images/why-patterns.webp',
      alt: 'A golden labyrinth cracking open with light escaping',
      title: 'Break repeating patterns',
      text: 'Follow a recurring lesson from its root in your karmic tail, through the challenge it keeps setting you, to its resolution.',
    },
    {
      icon: Gem,
      img: '/images/why-strengths.webp',
      alt: 'A dark stone blossom opening to reveal glowing golden gems',
      title: 'Discover hidden strengths',
      text: 'Reveal the quiet gifts in your chart — talents so natural to you that you may mistake them for ordinary.',
    },
  ];
  return (
    <section className="py-20 relative overflow-hidden">
      <CelestialAccents
        items={[
          { kind: 'moon', cls: 'top-10 right-[7%] opacity-70 hidden sm:block', size: 24, delay: '0.3s', dur: '8.5s' },
          { kind: 'star', cls: 'top-28 left-[4%] opacity-80 hidden md:block', size: 16, delay: '1s', dur: '7s' },
          { kind: 'sun', cls: 'bottom-12 right-[5%] opacity-70 hidden lg:block', size: 26, delay: '0.6s', dur: '9.5s' },
        ]}
      />
      <div data-reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <Eyebrow>Why people choose Gaia Vesta</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-cream mt-5">
            What your chart can help you <em className="italic text-goldlight">explore</em>
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((c) => (
            <div
              key={c.title}
              className="bg-white/[0.04] border border-white/10 rounded-3xl overflow-hidden shadow-[0_22px_55px_-20px_rgba(231,200,115,0.45)] hover:border-goldlight/50 hover:bg-white/[0.06] hover:shadow-[0_30px_65px_-18px_rgba(231,200,115,0.6)] transition-all group"
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src={c.img}
                  alt={c.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A0C33] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 w-9 h-9 rounded-xl bg-night/70 backdrop-blur border border-goldlight/30 flex items-center justify-center">
                  <c.icon className="w-4 h-4 text-goldlight" />
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-serif text-xl text-cream mb-2.5">{c.title}</h3>
                <p className="text-sm text-lav/75 leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArcanaCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const scroll = (dir: number) => trackRef.current?.scrollBy({ left: dir * 336, behavior: 'smooth' });

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      const el = trackRef.current;
      if (!el) return;
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 24) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: 336, behavior: 'smooth' });
      }
    }, 3400);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-purple/15 rounded-full blur-3xl pointer-events-none" />
      <div data-reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <div>
            <Eyebrow>The 22 Major Arcana</Eyebrow>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium text-cream mt-5">
              Meet the energies <em className="italic text-goldlight">in your chart</em>
            </h2>
            <p className="text-lav/80 mt-3 max-w-xl">
              Every Destiny Matrix is woven from these twenty-two archetypes. The ones in your chart — and the ones missing from it — tell the story.
            </p>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => scroll(-1)}
              aria-label="Previous arcana"
              className="w-11 h-11 rounded-full border border-white/20 text-cream flex items-center justify-center hover:border-goldlight/60 hover:text-goldlight transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Next arcana"
              className="w-11 h-11 rounded-full border border-white/20 text-cream flex items-center justify-center hover:border-goldlight/60 hover:text-goldlight transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[44rem] h-[20rem] bg-gold/[0.16] rounded-full blur-3xl pointer-events-none" />
        <div
          ref={trackRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="relative flex gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory px-4 sm:px-6 lg:px-8 pb-2 max-w-7xl mx-auto"
        >
        {ARCANA_LIST.map((a) => (
          <Link
            key={a.id}
            to={`/arcana/${a.id}`}
            className="snap-start shrink-0 w-[300px] bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 rounded-[1.75rem] p-7 hover:border-goldlight/60 hover:shadow-[0_24px_50px_-20px_rgba(231,200,115,0.45)] transition-all group"
          >
            <div className="w-16 h-16 rounded-full bg-[radial-gradient(circle_at_35%_35%,#F6E3AC,#C9963C)] flex items-center justify-center shadow-[0_0_26px_rgba(231,200,115,0.5)] mb-5">
              <span className="font-serif text-2xl font-semibold text-night3">{a.id}</span>
            </div>
            <h3 className="font-serif text-xl text-cream mb-1.5 group-hover:text-goldlight transition-colors">{a.name}</h3>
            <p className="text-sm text-lav/75 leading-relaxed mb-4">{a.description}</p>
            <p className="flex flex-wrap gap-1.5">
              {a.strengths.slice(0, 3).map((s) => (
                <span key={s} className="text-[11px] font-medium bg-white/[0.06] border border-white/10 text-lav rounded-full px-2.5 py-1">
                  {s}
                </span>
              ))}
            </p>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-goldlight mt-5">
              Read its meaning <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        ))}
        </div>
      </div>
    </section>
  );
}

function ChartFan() {
  const cards = [
    { img: '/images/fan-staircase.webp', alt: 'A golden staircase rising through night clouds toward a bright star', cls: '-rotate-[13deg] translate-y-6 z-0' },
    { img: '/images/fan-crystal.webp', alt: 'A hand holding a glowing golden crystal', cls: '-rotate-[6deg] translate-y-2 z-10' },
    { img: '/images/fan-moonwave.webp', alt: 'A golden crescent moon above curling ocean waves', cls: 'rotate-[6deg] translate-y-2 z-10' },
    { img: '/images/fan-meditate.webp', alt: 'Gaia meditating peacefully on soft clouds', cls: 'rotate-[13deg] translate-y-6 z-0' },
  ];
  return (
    <div className="mt-16">
      <div className="flex justify-center items-start">
        <div className={`relative w-32 sm:w-44 aspect-[3/4.3] rounded-2xl overflow-hidden border border-goldlight/40 shadow-[0_24px_50px_-18px_rgba(231,200,115,0.5)] transition-all duration-500 hover:rotate-0 hover:scale-[1.05] hover:z-30 -mr-4 sm:-mr-5 ${cards[0].cls}`}>
          <img src={cards[0].img} alt={cards[0].alt} loading="lazy" decoding="async" className="w-full h-full object-cover" />
        </div>
        <div className={`relative w-32 sm:w-44 aspect-[3/4.3] rounded-2xl overflow-hidden border border-goldlight/40 shadow-[0_24px_50px_-18px_rgba(231,200,115,0.5)] transition-all duration-500 hover:rotate-0 hover:scale-[1.05] hover:z-30 -mr-4 sm:-mr-5 ${cards[1].cls}`}>
          <img src={cards[1].img} alt={cards[1].alt} loading="lazy" decoding="async" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-20 w-36 sm:w-48 aspect-[3/4.3] rounded-2xl bg-[#FAF5EA] border border-goldlight/70 shadow-[0_30px_60px_-18px_rgba(231,200,115,0.6)] p-3 flex flex-col items-center transition-all duration-500 hover:scale-[1.04]">
          <p className="text-[8px] sm:text-[9px] tracking-[0.28em] text-[#8a6d3b] font-semibold">THE MATRIX</p>
          <div className="w-full max-w-[9.5rem]">
            <GlowChart result={SAMPLE_RESULT} />
          </div>
          <p className="font-serif text-[#3D3D3D] text-sm sm:text-base text-center leading-tight">Your chart, at the centre of it all</p>
        </div>
        <div className={`relative w-32 sm:w-44 aspect-[3/4.3] rounded-2xl overflow-hidden border border-goldlight/40 shadow-[0_24px_50px_-18px_rgba(231,200,115,0.5)] transition-all duration-500 hover:rotate-0 hover:scale-[1.05] hover:z-30 -ml-4 sm:-ml-5 ${cards[2].cls}`}>
          <img src={cards[2].img} alt={cards[2].alt} loading="lazy" decoding="async" className="w-full h-full object-cover" />
        </div>
        <div className={`relative w-32 sm:w-44 aspect-[3/4.3] rounded-2xl overflow-hidden border border-goldlight/40 shadow-[0_24px_50px_-18px_rgba(231,200,115,0.5)] transition-all duration-500 hover:rotate-0 hover:scale-[1.05] hover:z-30 -ml-4 sm:-ml-5 ${cards[3].cls}`}>
          <img src={cards[3].img} alt={cards[3].alt} loading="lazy" decoding="async" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="text-center mt-10">
        <a
          href="#demo"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 font-semibold rounded-full hover:shadow-[0_0_28px_rgba(231,200,115,0.5)] transition-all"
        >
          Calculate your personal chart — free
          <ArrowRight className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
}

function WhatIs() {
  return (
    <section className="py-20 relative overflow-hidden">
      <CelestialAccents
        items={[
          { kind: 'star', cls: 'top-14 left-[46%] opacity-80 hidden lg:block', size: 18, delay: '0.5s', dur: '7.5s' },
          { kind: 'moon', cls: 'bottom-16 left-[5%] opacity-70 hidden sm:block', size: 22, delay: '1.4s', dur: '8s' },
          { kind: 'sun', cls: 'top-10 right-[9%] opacity-60 hidden md:block', size: 24, delay: '0.9s', dur: '9s' },
        ]}
      />
      <div data-reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <Eyebrow>What is the Destiny Matrix</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-cream leading-snug mt-5 mb-5">
            A quiet, ancient geometry — <em className="italic text-goldlight">read for your life today</em>
          </h2>
          <p className="text-lav/85 leading-relaxed mb-4">
            The Destiny Matrix — also called the Matrix of Destiny — turns your date of birth into a personal
            chart. Its numbers draw on the 22 Major Arcana and sit in positions tied to the areas of a life:
            relationships, money, talents, family and purpose.
          </p>
          <p className="text-lav/85 leading-relaxed mb-7">
            The chart is shaped like an eight-pointed star. Rather than giving you one number to define who
            you are, it brings several energies together — so you can explore how they relate: where you feel
            at ease, where tension may arise, and which themes seem to return.
          </p>
          <ul className="space-y-3">
            {[
              'Twenty-two facets of personality, plotted into a single chart',
              'Love, money and life-path lines with real, named patterns',
              'Family lines that show what you inherited — and what you pass on',
              'Designed to be warm and useful — never mystical or heavy',
            ].map((t) => (
              <li key={t} className="flex items-start gap-2.5 text-lav/90">
                <Star className="w-4 h-4 text-goldlight mt-1 shrink-0" /> {t}
              </li>
            ))}
          </ul>
          <Link
            to="/tools/how-to-read-destiny-matrix"
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 border border-goldlight/40 text-goldlight font-medium rounded-full hover:bg-goldlight/10 transition-all"
          >
            Read the full guide <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="relative max-w-sm mx-auto w-full">
          <div className="absolute -inset-4 bg-gold/15 rounded-[2.5rem] blur-2xl pointer-events-none" />
          <div className="relative rounded-[2rem] overflow-hidden border border-goldlight/30 shadow-[0_30px_70px_-25px_rgba(231,200,115,0.4)]">
            <img
              src="/images/seeker-illustration.webp"
              alt="A seeker in a flowing cream shawl gazing up at a giant glowing golden Destiny Matrix star chart in an indigo night sky"
              loading="lazy"
              decoding="async"
              className="w-full h-auto block"
            />
          </div>
          <p className="text-center text-xs text-lavdim mt-4">Your energetic blueprint — every point holds an arcana</p>
        </div>
      </div>
      <ChartFan />
    </section>
  );
}

function FamilySection() {
  const pairs = [
    { pair: 'Mother ↔ Father', note: 'The couple line — companionship and friction' },
    { pair: 'Father ↔ Child', note: 'Guidance, protection, quiet mentorship' },
    { pair: 'Mother ↔ Child', note: 'The nurturing bond and its patterns' },
    { pair: 'You ↔ Family', note: 'Where both family lines meet — in you' },
  ];
  const members = [
    { initial: 'M', label: 'Mother', role: 'The root', x: 78, y: 62 },
    { initial: 'F', label: 'Father', role: 'The protector', x: 322, y: 62 },
    { initial: 'S', label: 'Son', role: 'The seeker', x: 96, y: 238 },
    { initial: 'D', label: 'Daughter', role: 'The spark', x: 304, y: 238 },
  ];
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute -bottom-24 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div data-reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <Eyebrow>Family connection map</Eyebrow>
        <div className="grid lg:grid-cols-2 gap-14 items-center mt-5">
          <div>
            <h2 className="text-3xl sm:text-4xl font-serif font-medium text-cream leading-snug mb-5">
              See the lines that <em className="italic text-goldlight">already exist</em> between you
            </h2>
            <p className="text-lav/85 leading-relaxed mb-8 max-w-lg">
              Hover a chart and the lines light up — the rest of the family. Each line carries a quality:
              patience, play, protection, growth. Gaia Vesta reads your father's line, your mother's line,
              and the parent–child pattern where they meet.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mb-9">
              {pairs.map((p) => (
                <div key={p.pair} className="bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 shadow-[0_16px_40px_-20px_rgba(231,200,115,0.35)]">
                  <p className="font-serif text-cream">{p.pair}</p>
                  <p className="text-xs text-lavdim mt-0.5">{p.note}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-3.5">
              <Link
                to="/tools/family-lines"
                className="px-7 py-3 bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 font-semibold rounded-full hover:shadow-[0_0_24px_rgba(231,200,115,0.45)] transition-all flex items-center justify-center gap-2"
              >
                Read my family lines <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/tools/child-matrix"
                className="px-7 py-3 bg-white/[0.04] border border-white/20 text-cream font-medium rounded-full hover:border-goldlight/60 transition-all flex items-center justify-center"
              >
                My child's matrix
              </Link>
            </div>
          </div>

          <div className="relative max-w-md mx-auto w-full">
            <div className="relative rounded-[2rem] overflow-hidden border border-goldlight/30 shadow-[0_30px_70px_-25px_rgba(231,200,115,0.4)] mb-8 animate-breathe">
              <img
                src="/images/family-illustration.webp"
                alt="A family — mother, father, son and daughter — gazing together at a glowing golden Destiny Matrix star"
                className="w-full h-auto block"
                loading="lazy"
              />
              <span className="absolute bottom-3.5 left-3.5 flex items-center gap-2 bg-night/85 backdrop-blur border border-goldlight/30 rounded-full px-4 py-2 text-xs font-medium text-cream">
                <Heart className="w-3.5 h-3.5 text-goldlight" /> One family — one map
              </span>
            </div>
            <svg viewBox="0 0 400 300" className="w-full h-auto" role="img" aria-label="A family connection map">
              {members.map((m) => (
                <line key={m.label} x1="200" y1="150" x2={m.x} y2={m.y} stroke="#7C6BD9" strokeOpacity="0.55" strokeWidth="1.4" />
              ))}
              <circle cx="200" cy="150" r="30" fill="url(#goldCore)" />
              <text x="200" y="158" textAnchor="middle" fontSize="19" fill="#2A1850">♥</text>
              {members.map((m) => (
                <g key={m.label}>
                  <circle cx={m.x} cy={m.y} r="24" fill="#221344" stroke="#8B7FE0" strokeWidth="1.4" />
                  <text x={m.x} y={m.y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="#F5EFE3">
                    {m.initial}
                  </text>
                  <text x={m.x} y={m.y + 42} textAnchor="middle" fontSize="11.5" fill="#C9BEE3">
                    {m.label}
                  </text>
                  <text x={m.x} y={m.y + 56} textAnchor="middle" fontSize="8.5" letterSpacing="1.5" fill="#9A8CC4">
                    {m.role.toUpperCase()}
                  </text>
                </g>
              ))}
            </svg>
            <p className="text-center text-xs text-lavdim mt-2">Every family has a map. Yours is drawn from real birth dates — not guesses.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ToolsSection() {
  const todayArcana = getArcana(dailyArcana(new Date()));
  const tools = [
    { icon: HeartHandshake, img: '/images/compatibility-illustration.webp', alt: 'A couple beneath two overlapping golden rings of light', title: 'Compatibility Matrix', text: 'Two birth dates, one shared chart — with love, money and purpose scores.', to: '/tools/compatibility' },
    { icon: RefreshCcw, img: '/images/karmic-tail-illustration.webp', alt: 'A golden thread knot loosening into light', title: 'Karmic Tail Calculator', text: 'Why does the same pattern keep returning? Your three-number tail: root, repetition, resolution.', to: '/tools/karmic-tail' },
    { icon: Users, img: '/images/family-illustration.webp', alt: 'A family gazing at a glowing golden matrix star', title: 'Family & Talent Lines', text: "Your father's line, your mother's line, the parent–child pattern — plus your gifts and missing numbers.", to: '/tools/family-lines' },
    { icon: CalendarClock, img: '/images/year-forecast-illustration.webp', alt: 'A golden wheel of the year with moon phases', title: 'Year Forecast', text: 'Your matrix for any year, plus your Personal Year theme and lessons.', to: '/tools/year-forecast' },
    { icon: Baby, img: '/images/child-matrix-illustration.webp', alt: 'A mother and child reading a glowing star chart together', title: "Children's Matrix", text: "Your child's talents, emotional needs and learning style, decoded for parents.", to: '/tools/child-matrix' },
    { icon: Moon, img: '/images/moon-phase-illustration.webp', alt: 'A glowing full moon rising over an indigo sea', title: "Today's Arcana", text: `${todayArcana.id} · ${todayArcana.name} — "${todayArcana.description}"`, to: '/tools/daily-arcana' },
  ];
  return (
    <section id="tools" className="py-20 relative overflow-hidden">
      <CelestialAccents
        items={[
          { kind: 'sun', cls: 'top-12 left-[6%] opacity-70 hidden sm:block', size: 26, delay: '0.2s', dur: '9s' },
          { kind: 'star', cls: 'top-24 right-[6%] opacity-80 hidden md:block', size: 16, delay: '1.1s', dur: '7s' },
          { kind: 'moon', cls: 'bottom-14 left-[44%] opacity-60 hidden lg:block', size: 22, delay: '0.7s', dur: '8.5s' },
        ]}
      />
      <div data-reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Eyebrow>The toolkit</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-cream mt-5 mb-4">
            A full suite of <em className="italic text-goldlight">free</em> cosmic tools
          </h2>
          <p className="text-lav/80 max-w-2xl mx-auto">
            Compatibility charts, karmic tails, family lines, year forecasts, children's matrices and classic
            numerology — free, instant, no account needed.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((t) => (
            <Link
              key={t.title}
              to={t.to}
              className="bg-white/[0.04] rounded-3xl overflow-hidden border border-white/10 shadow-[0_22px_55px_-20px_rgba(231,200,115,0.5)] hover:border-goldlight/60 hover:bg-white/[0.06] hover:shadow-[0_30px_65px_-18px_rgba(231,200,115,0.65)] transition-all group"
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src={t.img}
                  alt={t.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A0C33] via-transparent to-transparent" />
                <div className="absolute bottom-3 left-4 w-9 h-9 rounded-xl bg-night/70 backdrop-blur border border-goldlight/30 flex items-center justify-center">
                  <t.icon className="w-4 h-4 text-goldlight" />
                </div>
              </div>
              <div className="p-6">
              <h3 className="font-serif text-xl text-cream mb-2">{t.title}</h3>
              <p className="text-sm text-lav/75 leading-relaxed">{t.text}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-goldlight mt-4">
                Try it free <ArrowRight className="w-4 h-4" />
              </span>
              </div>
            </Link>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 px-7 py-3 bg-white/[0.04] border border-white/20 text-cream font-medium rounded-full hover:border-goldlight/60 transition-all"
          >
            Browse every tool <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function ReceiveSection() {
  const items = [
    'Complete Destiny Matrix chart',
    'Full interpretations of all 16 points',
    'Love, money & life-path lines',
    'Karmic tail reading',
    'Family dynamics lines',
    'Compatibility report',
    'Downloadable keepsake PDF',
    'AI guidance — 5 deep readings free monthly',
  ];
  return (
    <section className="py-20 relative overflow-hidden">
      <CelestialAccents
        items={[
          { kind: 'star', cls: 'top-12 right-[10%] opacity-80 hidden sm:block', size: 18, delay: '0.4s', dur: '7s' },
          { kind: 'moon', cls: 'bottom-14 right-[5%] opacity-70 hidden md:block', size: 22, delay: '1.3s', dur: '8s' },
        ]}
      />
      <div data-reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <div className="relative order-2 lg:order-1 h-[400px] sm:h-[440px] max-w-md mx-auto w-full">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[26rem] h-[18rem] bg-gold/[0.17] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-0 sm:left-1 top-8 w-44 sm:w-52 aspect-[3/4.2] bg-[#FAF5EA] rounded-xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.65)] border border-gold/40 rotate-[-8deg] p-3">
            <p className="text-[8px] tracking-[0.25em] text-[#8a6d3b] font-semibold mb-1.5">YOUR DESTINY MATRIX</p>
            <GlowChart result={SAMPLE_RESULT} />
            <p className="text-center font-serif text-[#3D3D3D] text-[13px] mt-1">Your chart</p>
          </div>
          <div className="absolute right-0 sm:right-1 top-8 w-44 sm:w-52 aspect-[3/4.2] bg-[#FAF5EA] rounded-xl shadow-[0_30px_60px_-20px_rgba(0,0,0,0.65)] border border-gold/40 rotate-[7deg] p-4 hidden sm:block">
            <p className="text-[8px] tracking-[0.25em] text-[#8a6d3b] font-semibold mb-3">INSIDE YOUR READING</p>
            {[
              { label: 'Love line', w: 'w-4/5', c: '#C4557A' },
              { label: 'Money line', w: 'w-3/5', c: '#C9963C' },
              { label: 'Life path', w: 'w-5/6', c: '#7C5CBF' },
              { label: 'Karmic tail', w: 'w-2/3', c: '#3E7C59' },
              { label: 'Family lines', w: 'w-3/4', c: '#4A6FA5' },
            ].map((r) => (
              <div key={r.label} className="mb-3">
                <p className="flex items-center gap-1.5 text-[11px] font-medium text-[#3D3D3D]">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: r.c }} />
                  {r.label}
                </p>
                <div className={`h-1.5 rounded-full bg-[#3D3D3D]/10 mt-1.5 ${r.w}`} />
              </div>
            ))}
            <p className="font-serif italic text-[#8a6d3b] text-[12px] mt-4 leading-snug">
              "The pattern is not your prison. Read clearly, it is your map."
            </p>
          </div>
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-52 sm:w-60 aspect-[3/4.2] bg-[#FAF5EA] rounded-xl shadow-[0_35px_70px_-20px_rgba(231,200,115,0.5)] border border-goldlight/60 overflow-hidden rotate-[-1.5deg]">
            <img
              src="/images/gaia-character.webp"
              alt="Gaia on the cover of your Destiny Matrix report"
              loading="lazy"
              decoding="async"
              className="w-full h-[64%] object-cover object-top"
            />
            <div className="p-4 text-center">
              <p className="text-[9px] tracking-[0.3em] text-[#8a6d3b] font-semibold">GAIA VESTA</p>
              <p className="font-serif text-[#3D3D3D] text-lg leading-tight mt-1">Your Destiny Matrix Report</p>
              <p className="text-[11px] text-[#3D3D3D]/60 mt-1">Free · Instant · Yours to keep</p>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <Eyebrow>What you receive</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-cream mt-5 mb-8">
            A keepsake reading, <em className="italic text-goldlight">written for your life</em>
          </h2>
          <ul className="grid sm:grid-cols-2 gap-3.5">
            {items.map((i) => (
              <li key={i} className="flex items-center gap-3 bg-white/[0.04] border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-cream/90 shadow-[0_16px_40px_-22px_rgba(231,200,115,0.35)]">
                <span className="w-6 h-6 rounded-full bg-goldlight/20 border border-goldlight/30 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-goldlight" />
                </span>
                {i}
              </li>
            ))}
          </ul>
          <a
            href="#demo"
            className="inline-flex items-center gap-2 mt-8 px-7 py-3 bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 font-semibold rounded-full hover:shadow-[0_0_24px_rgba(231,200,115,0.45)] transition-all"
          >
            Get my free reading <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}

function TransformSection() {
  const cards = [
    {
      img: '/images/spot-break.webp',
      alt: 'A golden chain breaking into butterflies and stars',
      title: 'Break free from repeating patterns',
      text: 'Do you feel like life keeps throwing the same challenge at you — in love, in work, in growth? Your chart reveals the deep-rooted pattern and the karmic lesson beneath it, so you can finally choose a different ending.',
    },
    {
      img: '/images/spot-embrace.webp',
      alt: 'A woman opening her arms to a golden sunrise',
      title: 'Embrace your authentic self',
      text: "So many of us live by everyone else's expectations, quietly doubting our own nature. Your matrix uncovers the qualities you were born with — so you can step into your power and live a life that feels natural.",
    },
    {
      img: '/images/spot-peace.webp',
      alt: 'Hands releasing a glowing golden bird over calm water',
      title: 'Make peace with your past',
      text: "The experiences you've been through shaped your journey — but they don't have to write your future. See the influences behind past events clearly, release the old weight, and move forward lighter.",
    },
    {
      img: '/images/spot-intuition.webp',
      alt: 'A golden lotus opening beneath a crescent moon and star',
      title: 'Tap into your intuition & inner wisdom',
      text: 'Have you ever ignored a gut feeling, only to regret it later? Your chart strengthens your connection to that quiet inner knowing — helping you trust yourself and navigate life with a deeper sense of direction.',
    },
  ];
  return (
    <section className="py-20 relative overflow-hidden">
      <CelestialAccents
        items={[
          { kind: 'moon', cls: 'top-12 right-[6%] opacity-70 hidden sm:block', size: 24, delay: '0.9s', dur: '8.5s' },
          { kind: 'star', cls: 'bottom-16 left-[5%] opacity-80 hidden md:block', size: 16, delay: '0.4s', dur: '7s' },
        ]}
      />
      <div data-reveal className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Eyebrow>The transformation</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-cream mt-5">
            How the Destiny Matrix <em className="italic text-goldlight">transforms</em> your life
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((c) => (
            <div
              key={c.title}
              className="bg-white/[0.04] rounded-3xl overflow-hidden border border-white/10 shadow-[0_22px_55px_-20px_rgba(231,200,115,0.45)] hover:border-goldlight/50 hover:shadow-[0_30px_65px_-18px_rgba(231,200,115,0.6)] transition-all group"
            >
              <div className="relative h-36 overflow-hidden">
                <img
                  src={c.img}
                  alt={c.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A0C33] via-transparent to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-serif text-lg text-goldlight mb-2.5 leading-snug">{c.title}</h3>
                <p className="text-sm text-lav/80 leading-relaxed">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyGaia() {
  const rows: { label: string; gaia: string; others: string }[] = [
    { label: 'Full Destiny Matrix chart', gaia: 'Free', others: 'Free' },
    { label: 'Complete PDF reading report', gaia: 'Free', others: '$14.99 and up' },
    { label: 'Karmic tail & family lines readings', gaia: 'Free', others: 'Locked or sold as add-ons' },
    { label: 'Deep personal reading', gaia: 'AI reading — 5 free every month', others: '$19 per reading' },
    { label: 'Compatibility matrix for couples', gaia: 'Free', others: 'Locked in paid bundles' },
    { label: 'Angel numbers, moon phase, forecasts & 10+ more tools', gaia: 'All free', others: '€9–14 each, or weekly plans' },
  ];
  return (
    <section className="py-20 relative overflow-hidden">
      <CelestialAccents
        items={[
          { kind: 'sun', cls: 'top-10 right-[9%] opacity-70 hidden sm:block', size: 26, delay: '0.5s', dur: '9s' },
          { kind: 'star', cls: 'bottom-14 left-[6%] opacity-80 hidden md:block', size: 16, delay: '1.2s', dur: '7.5s' },
        ]}
      />
      <div data-reveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <Eyebrow>The honest comparison</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-cream mt-5 mb-4">
            Everything they charge for. <em className="italic text-goldlight">Free here.</em>
          </h2>
          <p className="text-lav/80 max-w-2xl mx-auto">
            Leading Destiny Matrix sites give you the chart for free — then paywall every answer.
            Gaia Vesta gives you the answers too.
          </p>
        </div>
        <div className="bg-white/[0.04] rounded-3xl border border-white/10 overflow-hidden shadow-[0_30px_70px_-30px_rgba(231,200,115,0.35)]">
          <div className="grid grid-cols-[1.2fr_1fr_1fr] text-sm font-semibold bg-white/[0.05] px-5 py-3.5 text-cream">
            <span></span>
            <span className="text-center text-goldlight">Gaia Vesta</span>
            <span className="text-center text-lavdim">Typical paid sites</span>
          </div>
          {rows.map((r) => (
            <div key={r.label} className="grid grid-cols-[1.2fr_1fr_1fr] items-center px-5 py-3.5 border-t border-white/[0.07] text-sm">
              <span className="font-medium text-cream/85 pr-3">{r.label}</span>
              <span className="flex items-center justify-center gap-1.5 text-center font-medium text-cream">
                <Check className="w-4 h-4 text-goldlight shrink-0" /> {r.gaia}
              </span>
              <span className="flex items-center justify-center gap-1.5 text-center text-lavdim">
                <Minus className="w-4 h-4 shrink-0" /> {r.others}
              </span>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-lavdim/70 mt-4">
          Comparison based on the public pricing of leading Destiny Matrix sites, November 2026.
        </p>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="py-20 relative overflow-hidden">
      <CelestialAccents
        items={[
          { kind: 'moon', cls: 'top-12 left-[7%] opacity-70 hidden sm:block', size: 24, delay: '0.6s', dur: '8.5s' },
          { kind: 'star', cls: 'top-24 right-[8%] opacity-80 hidden md:block', size: 16, delay: '1s', dur: '7.5s' },
          { kind: 'sun', cls: 'bottom-12 left-[42%] opacity-60 hidden lg:block', size: 26, delay: '0.2s', dur: '9.5s' },
        ]}
      />
      <div data-reveal className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Eyebrow>Access</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-cream mt-5 mb-4">Simple pricing</h2>
          <p className="text-lav/80">Start free. Go deeper when you're ready — for less than one paid reading elsewhere.</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto items-stretch">
          <div className="bg-white/[0.04] rounded-3xl p-8 border border-white/10 flex flex-col shadow-[0_25px_60px_-25px_rgba(124,92,191,0.4)]">
            <h3 className="font-serif text-2xl text-cream mb-1">Starseed</h3>
            <p className="text-lavdim text-sm mb-5">For the curious</p>
            <p className="text-5xl font-serif text-cream mb-7">Free</p>
            <ul className="space-y-3 text-sm text-lav/90 mb-9">
              {[
                'Unlimited chart calculations',
                'Full 22-arcana interpretations',
                'Karmic tail & family lines',
                'Free PDF reading report',
                'Save charts & share links',
                '5 AI deep readings / month',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-goldlight mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link
              to="/auth"
              className="mt-auto block text-center px-6 py-3 bg-white/[0.04] border border-white/25 text-cream font-medium rounded-full hover:border-goldlight/60 transition-all"
            >
              Start free
            </Link>
          </div>
          <div className="relative bg-gradient-to-b from-night3 to-night2 rounded-3xl p-8 border border-goldlight/50 shadow-[0_25px_60px_-20px_rgba(231,200,115,0.35)] flex flex-col">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 text-[11px] font-bold tracking-wider px-4 py-1 rounded-full">
              MOST LOVED
            </div>
            <h3 className="font-serif text-2xl text-cream mb-1">Cosmic</h3>
            <p className="text-lavdim text-sm mb-5">For the devoted</p>
            <p className="text-5xl font-serif text-cream mb-7">
              $9<span className="text-lg font-normal text-lavdim">/month</span>
            </p>
            <ul className="space-y-3 text-sm text-lav/90 mb-9">
              {[
                'Everything in Starseed',
                'Unlimited AI deep readings',
                'Priority new features',
                'Ad-free experience',
                'Support indie astrology',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Star className="w-4 h-4 text-goldlight mt-0.5 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Link
              to="/pricing"
              className="mt-auto block text-center px-6 py-3 bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 font-semibold rounded-full hover:shadow-[0_0_24px_rgba(231,200,115,0.45)] transition-all"
            >
              Go Cosmic — $9/mo
            </Link>
          </div>
        </div>
        <p className="text-center text-sm text-lavdim mt-8 flex flex-wrap justify-center gap-x-6 gap-y-1.5">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-goldlight" /> No card needed to start</span>
          <span className="flex items-center gap-1.5"><Zap className="w-4 h-4 text-goldlight" /> Instant — readings in seconds</span>
          <span className="flex items-center gap-1.5"><MessagesSquare className="w-4 h-4 text-goldlight" /> Cancel anytime</span>
        </p>
      </div>
    </section>
  );
}

function Faq() {
  const faqs = [
    {
      q: 'Is the Destiny Matrix chart really free?',
      a: 'Yes — the full chart, every interpretation, the karmic tail, family lines and even the complete PDF report are free, with no card required. The only paid tier is Cosmic ($9/month), which makes the AI deep readings unlimited; the free plan already includes 5 AI readings every month.',
    },
    {
      q: 'What do I need to begin a reading?',
      a: 'Just a birth date — a name is optional and only personalises the headings. In the demo above, the calculation happens entirely in your browser and nothing is stored.',
    },
    {
      q: 'Can I read charts for my family too?',
      a: 'Absolutely. Use the Compatibility Matrix for two people, the Children\u2019s Matrix for your child, and the Family & Talent Lines tool to read your father\u2019s line, your mother\u2019s line and the parent–child pattern from a single chart.',
    },
    {
      q: 'How is the chart calculated?',
      a: 'Your birth date is reduced to the 22 Major Arcana and plotted onto the matrix: four foundation points, the centre (your soul purpose), and the derived points between them. Our guide walks through every step with a worked example.',
    },
    {
      q: 'Is my family\u2019s data private?',
      a: 'The public calculators run in your browser and store nothing. Charts are only saved when you create a free account and choose to save them, and share links are created only by you.',
    },
  ];
  const [open, setOpen] = useState(0);
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[38rem] h-[26rem] bg-gold/[0.19] rounded-full blur-3xl pointer-events-none" />
      <CelestialAccents
        items={[
          { kind: 'star', cls: 'top-16 left-[10%] opacity-80 hidden md:block', size: 16, delay: '0.8s', dur: '7s' },
          { kind: 'moon', cls: 'bottom-20 right-[9%] opacity-70 hidden sm:block', size: 22, delay: '0.3s', dur: '8s' },
        ]}
      />
      <div data-reveal className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-10">
          <Eyebrow>Frequently asked</Eyebrow>
          <h2 className="text-3xl sm:text-4xl font-serif font-medium text-cream mt-5">
            Questions, <em className="italic text-goldlight">answered plainly</em>
          </h2>
        </div>
        <div className="space-y-3.5">
          {faqs.map((f, i) => (
            <div
              key={f.q}
              className={`bg-white/[0.04] border rounded-3xl overflow-hidden transition-all ${
                open === i
                  ? 'border-goldlight/45 shadow-[0_24px_55px_-20px_rgba(231,200,115,0.5)] bg-white/[0.05]'
                  : 'border-white/10'
              }`}
            >
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-serif text-lg text-cream">{f.q}</span>
                <span className="text-goldlight text-2xl leading-none shrink-0">{open === i ? '−' : '+'}</span>
              </button>
              {open === i && <p className="px-6 pb-6 text-lav/85 leading-relaxed text-[15px]">{f.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 pt-14 pb-10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-[1.4fr_1fr_1fr] gap-10 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-[radial-gradient(circle_at_35%_35%,#F6E3AC,#C9963C)] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-night3" />
              </div>
              <span className="leading-none">
                <span className="block text-lg font-serif font-semibold tracking-wide text-cream">GAIA VESTA</span>
                <span className="block text-[9px] tracking-[0.3em] text-lavdim mt-0.5">DESTINY MATRIX</span>
              </span>
            </div>
            <p className="text-sm text-lav/70 max-w-xs leading-relaxed">
              Personal Destiny Matrix charts for the people you love most — modern, warm, and free in full.
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-lavdim mb-4">Discover</p>
            <ul className="space-y-2.5 text-sm text-lav/85">
              <li><a href="#demo" className="hover:text-goldlight transition-colors">The Reading</a></li>
              <li><Link to="/tools/family-lines" className="hover:text-goldlight transition-colors">Family Lines</Link></li>
              <li><Link to="/tools/compatibility" className="hover:text-goldlight transition-colors">Compatibility</Link></li>
              <li><Link to="/tools" className="hover:text-goldlight transition-colors">All tools</Link></li>
              <li><Link to="/arcana" className="hover:text-goldlight transition-colors">Arcana guide</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-lavdim mb-4">Gaia Vesta</p>
            <ul className="space-y-2.5 text-sm text-lav/85">
              <li><Link to="/pricing" className="hover:text-goldlight transition-colors">Pricing</Link></li>
              <li><Link to="/auth" className="hover:text-goldlight transition-colors">Sign in</Link></li>
              <li><Link to="/tools/how-to-read-destiny-matrix" className="hover:text-goldlight transition-colors">How to read your chart</Link></li>
              <li><Link to="/tools/karmic-tail" className="hover:text-goldlight transition-colors">Karmic Tail Calculator</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/[0.07] pt-7 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-lavdim">© 2026 Gaia Vesta · Written with care, for seekers and their families.</p>
          <p className="text-xs text-lavdim/70">A tool for reflection — not a substitute for professional advice.</p>
        </div>
      </div>
    </footer>
  );
}

export function Landing() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.1 },
    );
    els.forEach((el) => {
      el.classList.add('reveal');
      obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-night text-cream relative overflow-x-clip">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(60rem_30rem_at_85%_-5%,rgba(124,92,191,0.28),transparent),radial-gradient(50rem_26rem_at_-10%_30%,rgba(212,165,116,0.10),transparent),radial-gradient(46rem_24rem_at_50%_110%,rgba(124,92,191,0.16),transparent)]" />
      <div className="relative">
        <Nav />
        <main>
          <Hero />
          <Marquee />
          <Demo />
          <WhyCards />
          <ArcanaCarousel />
          <WhatIs />
          <FamilySection />
          <ToolsSection />
          <ReceiveSection />
          <TransformSection />
          <WhyGaia />
          <Pricing />
          <Faq />
        </main>
        <Footer />
      </div>
    </div>
  );
}
