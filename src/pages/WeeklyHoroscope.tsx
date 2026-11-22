import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Moon, Sparkles } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { HoroscopeLinks } from '../components/HoroscopeLinks';
import { faqPageSchema, webAppSchema, toolBreadcrumb } from '../lib/schema';
import { SIGNS } from '../lib/horoscope';
import { getWeeklyHoroscope } from '../lib/horoscope-weekly';

const FAQS = [
  {
    q: 'How is Gaia Vesta\u2019s weekly horoscope made?',
    a: 'It is written by us, not scraped from an astrology feed. Each sign has its own bank of week themes written for that sign\u2019s character, and the love, money and mood lines rotate from shared banks. A seed built from the sign and the ISO week number chooses one of each — so every reader of a sign shares the same reading from Monday to Sunday, and a fresh one next week. The moon arc is real astronomy: the phase is calculated at the week\u2019s first and last day with the same engine as our Moon Phase tool.',
  },
  {
    q: 'Is the weekly horoscope free?',
    a: 'Completely — all twelve signs, every week, no account and no card. The daily and monthly horoscopes are free too, and so is the deepest reading of all: your full Destiny Matrix chart, calculated from your exact birth date rather than your sign alone.',
  },
  {
    q: 'When does the weekly horoscope change?',
    a: 'At midnight between Sunday and Monday. The week runs Monday to Sunday, the rhythm most calendars and workweeks already use. For faster guidance, the daily horoscope turns every midnight; for the slower view, the monthly horoscope turns on the first of the month.',
  },
  {
    q: 'Which zodiac system do you use?',
    a: 'The tropical zodiac — the one used by nearly all Western newspapers, magazines and horoscope apps, where Aries begins at the March equinox. If you follow the sidereal (Vedic) system, your sign may sit one place earlier; both are long traditions, and we are simply honest about which one we use.',
  },
];

function shortRange(start: Date, end: Date): string {
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  if (start.getFullYear() !== end.getFullYear()) {
    return `${start.toLocaleDateString('en-GB', opts)} – ${end.toLocaleDateString('en-GB', opts)}`;
  }
  if (start.getMonth() === end.getMonth()) {
    return `${start.getDate()} – ${end.toLocaleDateString('en-GB', opts)}`;
  }
  return `${start.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })} – ${end.toLocaleDateString('en-GB', opts)}`;
}

export function WeeklyHoroscope() {
  const today = useMemo(() => new Date(), []);
  const sample = getWeeklyHoroscope(SIGNS[0], today);
  const range = shortRange(sample.weekStart, sample.weekEnd);

  return (
    <PublicLayout>
      <ToolHero
        image="/images/zodiac-illustration.webp"
        imageAlt="Two overlapping golden rings studded with star dots in an indigo night sky"
        eyebrow="Weekly Horoscope · Free"
        title={`Weekly Horoscope — ${range}`}
        subtitle="The week's theme for all twelve signs — love, money, mood, your best day, and the moon's arc from Monday to Sunday. Choose your sign."
        schema={[webAppSchema('Weekly Horoscope', '/tools/weekly-horoscope', "The week's theme for all twelve signs — love, money, mood, your best day, and the moon's arc from Monday to Sunday. Choose your sign."), faqPageSchema(FAQS), toolBreadcrumb('Weekly Horoscope', '/tools/weekly-horoscope')]}
      />


      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <Link
          to="/tools/moon-phase"
          className="flex items-center gap-4 bg-white/[0.04] rounded-2xl border border-white/10 hover:border-goldlight/50 transition-all px-6 py-5 mb-8"
        >
          <Moon className="w-8 h-8 text-goldlight shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-semibold tracking-widest uppercase text-goldlight mb-1">
              This week&rsquo;s moon arc
            </p>
            <p className="font-serif text-xl text-cream">
              {sample.moonStartEmoji} {sample.moonStartName} → {sample.moonEndEmoji} {sample.moonEndName}
            </p>
            <p className="text-sm text-lav/75">
              The moon every sign shares this week — calculated at Monday and Sunday with the same
              astronomy as our Moon Phase tool.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-lavdim shrink-0" />
        </Link>

        <div className="mb-14">
          <p className="text-center text-xs font-semibold tracking-widest uppercase text-lavdim mb-4">
            More rhythms
          </p>
          <HoroscopeLinks current="weekly" />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream text-center mb-2">
          This week, sign by sign
        </h2>
        <p className="text-center text-lav/70 mb-8">{sample.weekRange} — every reading refreshes on Monday.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SIGNS.map((sign) => {
            const weekly = getWeeklyHoroscope(sign, today);
            return (
              <Link
                key={sign.slug}
                to={`/tools/weekly-horoscope/${sign.slug}`}
                className="group bg-white/[0.04] rounded-2xl border border-white/10 hover:border-goldlight/60 hover:shadow-[0_20px_50px_-20px_rgba(231,200,115,0.35)] transition-all p-6 flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-5xl text-goldlight leading-none">{sign.glyph}</span>
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-lavdim">
                    Best day · {weekly.bestDay}
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-cream">{sign.name}</h3>
                <p className="text-xs tracking-wider text-lavdim mb-3">
                  {sign.dates} · {sign.element}
                </p>
                <p className="text-sm text-lav/85 leading-relaxed flex-1">{weekly.themeHeadline}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-goldlight">
                  Read this week&rsquo;s horoscope
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative bg-gradient-to-b from-night3 to-night2 rounded-3xl p-8 sm:p-10 border border-goldlight/50 text-center overflow-hidden">
          <Sparkles className="w-8 h-8 text-goldlight mx-auto mb-4" />
          <h2 className="font-serif text-2xl sm:text-3xl text-cream mb-3">
            A week is a chapter. Your chart is the whole book.
          </h2>
          <p className="text-lav/85 leading-relaxed max-w-2xl mx-auto mb-7">
            This reading is written for everyone born under your sign, for one week. Your Destiny
            Matrix is calculated from your exact birth date — your soul purpose, love line, money line
            and karmic tail — and it reads the same deep patterns in every week of your life.
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
          Weekly horoscope questions
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
