import { Link } from 'react-router-dom';
import { ArrowRight, Moon, Sparkles } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { HoroscopeLinks } from '../components/HoroscopeLinks';
import { faqPageSchema, webAppSchema, toolBreadcrumb } from '../lib/schema';
import { moonsInYear } from '../lib/moons';
import { MONTH_NAMES, ordinal } from '../lib/horoscope-2027';

const FAQS = [
  {
    q: 'How is the 2027 moon calendar calculated?',
    a: 'Day by day, by us — no almanac is copied. Our moon engine works out the moon\u2019s age for every date of 2027 from a known new moon and the moon\u2019s true cycle length (about 29.53 days), and records the day each quarter point falls on. It is exactly the same astronomy that powers our Moon Phase tool, run across the whole year.',
  },
  {
    q: 'Why might a date differ by a day from another calendar?',
    a: 'Two honest reasons. First, time zones: a full moon at 2 a.m. in London falls on the previous evening in New York, so calendars printed for different places can disagree by a day. Second, our engine is a simplified model of the moon\u2019s orbit — very close, but an observatory-grade calculation can occasionally place an event a day either side. For planning rituals, journals and quiet evenings, a day either side makes no practical difference.',
  },
  {
    q: 'What are the traditional full moon names?',
    a: 'Names like Wolf Moon, Pink Moon and Harvest Moon come from North American farming and Indigenous traditions that named each full moon for what the season was doing — wolves howling in January, pink phlox blooming in April, the harvest gathered under September\u2019s moon. Each month page in this calendar gives its full moon\u2019s traditional name alongside the calculated date.',
  },
  {
    q: 'Is the moon calendar free?',
    a: 'Completely — the whole year, every month page with its day-by-day phases, no account and no card. If you want tonight\u2019s moon rather than the calendar, the Moon Phase tool shows the live phase and illumination for today, or for any date you choose.',
  },
];

const PHASES = [
  {
    emoji: '🌑',
    name: 'New Moon',
    text: 'The dark reset. The moon sits between Earth and Sun and shows us nothing — the traditional moment for planting intentions quietly and letting them germinate unseen.',
  },
  {
    emoji: '🌓',
    name: 'First Quarter',
    text: 'Half lit and pushing. A week after the new moon, the cycle meets its first friction — the moment an intention proves it matters by surviving contact with real life.',
  },
  {
    emoji: '🌕',
    name: 'Full Moon',
    text: 'The harvest. Everything the cycle has grown stands in full light — the traditional moment for seeing clearly, celebrating what ripened and releasing what has peaked.',
  },
  {
    emoji: '🌗',
    name: 'Last Quarter',
    text: 'The clearing. Half lit and waning, a week after the full moon — the moment for forgiving, decluttering and closing what the cycle has finished, before the dark returns.',
  },
];

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_SLUGS = MONTH_NAMES.map((m) => m.toLowerCase());

const YEAR_MOONS = moonsInYear(2027);

export function MoonCalendar2027() {
  return (
    <PublicLayout>
      <ToolHero
        image="/images/moon-phase-illustration.webp"
        imageAlt="A glowing full moon rising over a calm indigo sea beneath an arc of moon phases"
        eyebrow="Moon Calendar · 2027 · Free"
        title="Moon Calendar 2027 — Every New & Full Moon"
        subtitle="All thirteen new moons and twelve full moons of 2027, calculated day by day with the same astronomy as our Moon Phase tool — plus every quarter, month by month."
        schema={[webAppSchema('Moon Calendar 2027', '/tools/moon-calendar-2027', "All thirteen new moons and twelve full moons of 2027, calculated day by day with the same astronomy as our Moon Phase tool — plus every quarter, month by month."), faqPageSchema(FAQS), toolBreadcrumb('Moon Calendar 2027', '/tools/moon-calendar-2027')]}
      />


      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream text-center mb-2">
          The four quarters of every moon
        </h2>
        <p className="text-center text-lav/70 mb-8 max-w-2xl mx-auto">
          One lunar cycle lasts about 29.5 days, and it turns on four quarter points. Every date in
          this calendar is one of them.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PHASES.map((p) => (
            <div key={p.name} className="bg-white/[0.04] rounded-2xl border border-white/10 p-6">
              <p className="text-4xl mb-3">{p.emoji}</p>
              <h3 className="font-serif text-xl text-cream mb-2">{p.name}</h3>
              <p className="text-sm text-lav/80 leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream text-center mb-2">
          2027, month by month
        </h2>
        <p className="text-center text-lav/70 mb-8">
          Open a month for all four quarter dates and the moon&rsquo;s phase on every single day.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {YEAR_MOONS.map((m, i) => (
            <Link
              key={MONTH_NAMES[i]}
              to={`/tools/moon-calendar-2027/${MONTH_SLUGS[i]}`}
              className="group bg-white/[0.04] rounded-2xl border border-white/10 hover:border-goldlight/60 hover:shadow-[0_20px_50px_-20px_rgba(231,200,115,0.35)] transition-all p-6 flex flex-col"
            >
              <h3 className="font-serif text-2xl text-cream mb-3">{MONTH_NAMES[i]}</h3>
              <p className="text-sm text-lav/85 mb-1.5">
                🌑 <span className="text-cream font-medium">New Moon</span> —{' '}
                {m.newMoons.length
                  ? m.newMoons.map((d) => `${SHORT_MONTHS[i]} ${ordinal(d)}`).join(' & ')
                  : '—'}
              </p>
              <p className="text-sm text-lav/85 flex-1">
                🌕 <span className="text-cream font-medium">Full Moon</span> —{' '}
                {m.fullMoons.length
                  ? m.fullMoons.map((d) => `${SHORT_MONTHS[i]} ${ordinal(d)}`).join(' & ')
                  : '—'}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-goldlight">
                See every day of {MONTH_NAMES[i]}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Link
          to="/tools/moon-phase"
          className="flex items-center gap-4 bg-white/[0.04] rounded-2xl border border-white/10 hover:border-goldlight/50 transition-all px-6 py-5 mb-10"
        >
          <Moon className="w-8 h-8 text-goldlight shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-semibold tracking-widest uppercase text-goldlight mb-1">
              Just want tonight&rsquo;s moon?
            </p>
            <p className="font-serif text-xl text-cream">Moon Phase — today, or any date</p>
            <p className="text-sm text-lav/75">
              The live phase and illumination for tonight, your birthday, or any day you choose.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-lavdim shrink-0" />
        </Link>

        <p className="text-center text-xs font-semibold tracking-widest uppercase text-lavdim mb-4">
          More rhythms
        </p>
        <HoroscopeLinks current="moon" />
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative bg-gradient-to-b from-night3 to-night2 rounded-3xl p-8 sm:p-10 border border-goldlight/50 text-center overflow-hidden">
          <Sparkles className="w-8 h-8 text-goldlight mx-auto mb-4" />
          <h2 className="font-serif text-2xl sm:text-3xl text-cream mb-3">
            The moon keeps the calendar. Your chart keeps the story.
          </h2>
          <p className="text-lav/85 leading-relaxed max-w-2xl mx-auto mb-7">
            Moon phases mark the rhythm of a month. Your Destiny Matrix is calculated from your exact
            birth date — including the moon you were born under — and maps your soul purpose, love
            line, money line and karmic tail for your whole life.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 font-semibold rounded-full hover:shadow-[0_0_28px_rgba(231,200,115,0.5)] transition-all"
          >
            Calculate your Destiny Matrix — free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-serif font-bold text-cream mb-6 text-center">
          Moon calendar questions
        </h2>
        <div className="space-y-4">
          {FAQS.map((f) => (
            <div key={f.q} className="bg-white/[0.04] rounded-2xl border border-white/10 p-6">
              <h3 className="font-serif font-semibold text-lg text-cream mb-2">{f.q}</h3>
              <p className="text-lav/80 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
