import { Link } from 'react-router-dom';
import {
  Heart, CalendarClock, Baby, BookOpen, Hash, Type, SunMoon, Grid3X3,
  Sparkles, Moon, HeartHandshake, Download, Shapes, RefreshCcw, Users,
} from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { dailyArcana, moonPhase } from '../lib/numerology';
import { getArcana } from '../lib/arcana-meanings';

const TOOLS = [
  {
    to: '/', hash: '#demo', icon: Sparkles, title: 'Destiny Matrix Calculator',
    img: '/images/gaia-character.webp', alt: 'Gaia, the Destiny Matrix guide, holding a glowing golden star',
    text: 'Your full 22-arcana chart from your birth date — soul purpose, love, money, life path.', tag: 'Flagship',
  },
  {
    to: '/tools/compatibility', icon: HeartHandshake, title: 'Compatibility Matrix',
    img: '/images/compatibility-illustration.webp', alt: 'A couple holding hands beneath two overlapping golden rings of light',
    text: 'Two birth dates, one combined chart. Love, money and purpose scores for any couple.', tag: 'New',
  },
  {
    to: '/tools/karmic-tail', icon: RefreshCcw, title: 'Karmic Tail Calculator',
    img: '/images/karmic-tail-illustration.webp', alt: 'A golden thread looping in a spiral knot that is beginning to untie',
    text: 'Why does the same pattern keep returning? Your three-number karmic tail — root, repetition, and the lesson that breaks the cycle.', tag: 'New',
  },
  {
    to: '/tools/family-lines', icon: Users, title: 'Family & Talent Lines',
    img: '/images/family-illustration.webp', alt: 'A family gazing together at a glowing golden Destiny Matrix star',
    text: 'Your father\u2019s line, your mother\u2019s line, the parent–child pattern where they meet in you — plus your talent line and a full repeated/missing numbers analysis. Free PDF report included.', tag: 'New',
  },
  {
    to: '/tools/year-forecast', icon: CalendarClock, title: 'Year Forecast',
    img: '/images/year-forecast-illustration.webp', alt: 'A golden year wheel of glowing segments and moon phases under the night sky',
    text: 'Your Destiny Matrix recalculated for any year, plus your Personal Year theme.', tag: 'New',
  },
  {
    to: '/tools/child-matrix', icon: Baby, title: 'Children\'s Matrix',
    img: '/images/child-matrix-illustration.webp', alt: 'A mother and child reading a small glowing golden star chart together',
    text: 'Your child\'s chart, translated into guidance on talents, learning style and support.', tag: 'New',
  },
  {
    to: '/arcana', icon: BookOpen, title: 'Arcana Encyclopedia',
    img: '/images/seeker-illustration.webp', alt: 'A lone seeker standing before a giant glowing golden matrix star',
    text: 'All 22 Major Arcana explained: personality, love, money, karmic lessons and affirmations.', tag: 'Guide',
  },
  {
    to: '/tools/life-path', icon: Hash, title: 'Life Path Number',
    img: '/images/life-path-illustration.webp', alt: 'A winding golden path of light climbing through indigo hills toward a guiding star',
    text: 'The classic numerology calculation — your core number, including Master Numbers 11, 22, 33.', tag: 'New tool',
  },
  {
    to: '/tools/name-numerology', icon: Type, title: 'Name Numerology',
    img: '/images/name-numerology-illustration.webp', alt: 'An open ancient book with golden light swirling up from its glowing pages',
    text: 'Expression, Soul Urge and Personality numbers hidden inside your full name.', tag: 'New tool',
  },
  {
    to: '/tools/personal-year', icon: SunMoon, title: 'Personal Year, Month & Day',
    img: '/images/personal-year-illustration.webp', alt: 'A golden sunrise cresting indigo hills inside a thin ring of light',
    text: 'Where you are in your 9-year cycle — and the energy of this month and today.', tag: 'New tool',
  },
  {
    to: '/tools/angel-numbers', icon: Sparkles, title: 'Angel Numbers',
    img: '/images/angel-numbers-illustration.webp', alt: 'Three glowing golden orbs of light floating in indigo mist',
    text: 'Keep seeing 111, 444 or 1111? Look up the meaning, or find your personal angel number.', tag: 'New tool',
  },
  {
    to: '/tools/moon-phase', icon: Moon, title: 'Moon Phase Today',
    img: '/images/moon-phase-illustration.webp', alt: 'A glowing full moon rising over a calm indigo sea beneath an arc of moon phases',
    text: 'Tonight\'s moon phase and illumination — and the phase on any date, including your birth.', tag: 'New tool',
  },
  {
    to: '/tools/pythagorean-square', icon: Grid3X3, title: 'Pythagorean Square',
    img: '/images/pythagoras-illustration.webp', alt: 'A glowing three-by-three grid of golden light dots joined by fine lines',
    text: 'The psychomatrix: a 3×3 grid of your birth-date digits revealing character and gaps.', tag: 'New tool',
  },
  {
    to: '/tools/zodiac-compatibility', icon: Heart, title: 'Zodiac Compatibility',
    img: '/images/zodiac-illustration.webp', alt: 'Two overlapping golden rings studded with star dots in an indigo night sky',
    text: 'All 144 sign pairings with a harmony score and an honest read on the match.', tag: 'New tool',
  },
  {
    to: '/tools/daily-arcana', icon: Shapes, title: 'Daily Tarot Card',
    img: '/images/daily-arcana-illustration.webp', alt: 'An ornate tarot-like card with a golden eight-pointed star, standing among the stars',
    text: "Today's arcana, drawn from the date itself — a one-card daily tarot reading.", tag: 'Daily',
  },
  {
    to: '/tools/how-to-read-destiny-matrix', icon: BookOpen, title: 'How to Read Your Chart',
    img: '/images/how-to-read-illustration.webp', alt: 'An unrolled parchment scroll with a golden geometric chart, beside a candle',
    text: 'New to the Destiny Matrix? This guide walks your chart point by point — centre, love line, money line, karmic foundation.', tag: 'Guide',
  },
];

export function ToolsHub() {
  const today = new Date();
  const arcana = getArcana(dailyArcana(today));
  const moon = moonPhase(today);

  return (
    <PublicLayout>
      <ToolHero
        eyebrow="Free tools"
        title="Every calculator, one home"
        subtitle="Destiny Matrix charts, compatibility, forecasts and classic numerology — all free, all instant, no account needed."
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <Link to="/tools/daily-arcana" className="bg-white/[0.04] rounded-2xl p-6 border border-goldlight/30 hover:border-goldlight/60 hover:shadow-lg transition-all">
            <p className="text-xs font-semibold tracking-widest uppercase text-goldlight mb-2">Today's arcana</p>
            <p className="text-2xl font-serif font-bold text-cream mb-1">
              {arcana.id} · {arcana.name}
            </p>
            <p className="text-sm text-lav/70 italic">"{arcana.description}"</p>
          </Link>
          <Link to="/tools/moon-phase" className="bg-white/[0.04] rounded-2xl p-6 border border-white/10 hover:border-goldlight/50 hover:shadow-lg transition-all">
            <p className="text-xs font-semibold tracking-widest uppercase text-goldlight mb-2">Tonight's moon</p>
            <p className="text-2xl font-serif font-bold text-cream mb-1">
              {moon.emoji} {moon.name}
            </p>
            <p className="text-sm text-lav/70">
              {Math.round(moon.illumination * 100)}% illuminated · {moon.age.toFixed(1)} days into the cycle
            </p>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-16">
          {TOOLS.map((t) => (
            <Link
              key={t.title}
              to={t.hash ? { pathname: t.to, hash: t.hash } : t.to}
              className="bg-white/[0.04] backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-goldlight/50 hover:shadow-[0_24px_55px_-20px_rgba(231,200,115,0.45)] transition-all group flex flex-col"
            >
              <div className="relative h-36 shrink-0 overflow-hidden">
                <img
                  src={t.img}
                  alt={t.alt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night via-night/25 to-transparent" />
                <div className="absolute bottom-3 left-4 w-10 h-10 bg-gradient-to-r from-gold to-purple rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <t.icon className="w-5 h-5 text-white" />
                </div>
                <span className="absolute top-3 right-3 text-[11px] font-semibold tracking-wide uppercase bg-night/70 backdrop-blur-sm text-goldlight px-2.5 py-1 rounded-full">
                  {t.tag}
                </span>
              </div>
              <div className="p-6 pt-4">
                <h2 className="text-lg font-semibold text-cream mb-1.5">{t.title}</h2>
                <p className="text-sm text-lav/70">{t.text}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white/[0.04] rounded-2xl border border-white/10 p-8 text-center mb-16">
          <Download className="w-8 h-8 text-goldlight mx-auto mb-3" />
          <h2 className="text-xl font-serif font-semibold text-cream mb-2">Every chart is downloadable</h2>
          <p className="text-lav/70 max-w-xl mx-auto">
            Unlike other Destiny Matrix sites that charge for downloads, Gaia Vesta lets you save any chart
            as a high-resolution image — free, forever.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
