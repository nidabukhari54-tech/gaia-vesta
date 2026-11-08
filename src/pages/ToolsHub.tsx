import { Link } from 'react-router-dom';
import {
  Heart, CalendarClock, Baby, BookOpen, Hash, Type, SunMoon, Grid3X3,
  Sparkles, Moon, HeartHandshake, Download, Shapes,
} from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { dailyArcana, moonPhase } from '../lib/numerology';
import { getArcana } from '../lib/arcana-meanings';

const TOOLS = [
  {
    to: '/', hash: '#demo', icon: Sparkles, title: 'Destiny Matrix Calculator',
    text: 'Your full 22-arcana chart from your birth date — soul purpose, love, money, life path.', tag: 'Flagship',
  },
  {
    to: '/tools/compatibility', icon: HeartHandshake, title: 'Compatibility Matrix',
    text: 'Two birth dates, one combined chart. Love, money and purpose scores for any couple.', tag: 'New',
  },
  {
    to: '/tools/year-forecast', icon: CalendarClock, title: 'Year Forecast',
    text: 'Your Destiny Matrix recalculated for any year, plus your Personal Year theme.', tag: 'New',
  },
  {
    to: '/tools/child-matrix', icon: Baby, title: 'Children\'s Matrix',
    text: 'Your child\'s chart, translated into guidance on talents, learning style and support.', tag: 'New',
  },
  {
    to: '/arcana', icon: BookOpen, title: 'Arcana Encyclopedia',
    text: 'All 22 Major Arcana explained: personality, love, money, karmic lessons and affirmations.', tag: 'Guide',
  },
  {
    to: '/tools/life-path', icon: Hash, title: 'Life Path Number',
    text: 'The classic numerology calculation — your core number, including Master Numbers 11, 22, 33.', tag: 'New tool',
  },
  {
    to: '/tools/name-numerology', icon: Type, title: 'Name Numerology',
    text: 'Expression, Soul Urge and Personality numbers hidden inside your full name.', tag: 'New tool',
  },
  {
    to: '/tools/personal-year', icon: SunMoon, title: 'Personal Year, Month & Day',
    text: 'Where you are in your 9-year cycle — and the energy of this month and today.', tag: 'New tool',
  },
  {
    to: '/tools/angel-numbers', icon: Sparkles, title: 'Angel Numbers',
    text: 'Keep seeing 111, 444 or 1111? Look up the meaning, or find your personal angel number.', tag: 'New tool',
  },
  {
    to: '/tools/moon-phase', icon: Moon, title: 'Moon Phase Today',
    text: 'Tonight\'s moon phase and illumination — and the phase on any date, including your birth.', tag: 'New tool',
  },
  {
    to: '/tools/pythagorean-square', icon: Grid3X3, title: 'Pythagorean Square',
    text: 'The psychomatrix: a 3×3 grid of your birth-date digits revealing character and gaps.', tag: 'New tool',
  },
  {
    to: '/tools/zodiac-compatibility', icon: Heart, title: 'Zodiac Compatibility',
    text: 'All 144 sign pairings with a harmony score and an honest read on the match.', tag: 'New tool',
  },
  {
    to: '/tools/daily-arcana', icon: Shapes, title: 'Daily Arcana Draw',
    text: 'One arcana for today — your daily guidance card, drawn from the date itself.', tag: 'Daily',
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
          <Link to="/tools/daily-arcana" className="bg-gradient-to-br from-gold/15 to-purple/15 rounded-2xl p-6 border border-gold/30 hover:shadow-lg transition-all">
            <p className="text-xs font-semibold tracking-widest uppercase text-purple mb-2">Today's arcana</p>
            <p className="text-2xl font-serif font-bold text-text-primary mb-1">
              {arcana.id} · {arcana.name}
            </p>
            <p className="text-sm text-text-primary/65 italic">"{arcana.description}"</p>
          </Link>
          <Link to="/tools/moon-phase" className="bg-white/70 rounded-2xl p-6 border border-purple/20 hover:shadow-lg transition-all">
            <p className="text-xs font-semibold tracking-widest uppercase text-purple mb-2">Tonight's moon</p>
            <p className="text-2xl font-serif font-bold text-text-primary mb-1">
              {moon.emoji} {moon.name}
            </p>
            <p className="text-sm text-text-primary/65">
              {Math.round(moon.illumination * 100)}% illuminated · {moon.age.toFixed(1)} days into the cycle
            </p>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-16">
          {TOOLS.map((t) => (
            <Link
              key={t.title}
              to={t.hash ? { pathname: t.to, hash: t.hash } : t.to}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gold/20 hover:border-gold/50 hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-gold to-purple rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <t.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[11px] font-semibold tracking-wide uppercase bg-purple/10 text-purple px-2.5 py-1 rounded-full">
                  {t.tag}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-text-primary mb-1.5">{t.title}</h2>
              <p className="text-sm text-text-primary/60">{t.text}</p>
            </Link>
          ))}
        </div>

        <div className="bg-white/70 rounded-2xl border border-gold/20 p-8 text-center mb-16">
          <Download className="w-8 h-8 text-gold mx-auto mb-3" />
          <h2 className="text-xl font-serif font-semibold mb-2">Every chart is downloadable</h2>
          <p className="text-text-primary/60 max-w-xl mx-auto">
            Unlike other Destiny Matrix sites that charge for downloads, Gaia Vesta lets you save any chart
            as a high-resolution image — free, forever.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
