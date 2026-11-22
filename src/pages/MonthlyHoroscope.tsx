import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Moon, Sparkles } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { HoroscopeLinks } from '../components/HoroscopeLinks';
import { faqPageSchema, webAppSchema, toolBreadcrumb } from '../lib/schema';
import { SIGNS, formatDate } from '../lib/horoscope';
import { getMonthlyHoroscope } from '../lib/horoscope-monthly';
import { ordinal } from '../lib/horoscope-2027';

const FAQS = [
  {
    q: 'How is Gaia Vesta\u2019s monthly horoscope made?',
    a: 'It is written by us, not scraped from an astrology feed. Each sign has its own bank of month themes written for that sign\u2019s character, and shared monthly banks cover love, money and growth. A seed built from the sign and the calendar month chooses one of each — so every reader of a sign shares the same reading all month, and a fresh one on the first of next month. The new and full moon dates are real astronomy, calculated with the same engine as our Moon Phase tool.',
  },
  {
    q: 'Is the monthly horoscope free?',
    a: 'Completely — all twelve signs, every month, no account and no card. The daily and weekly horoscopes are free too, and so is the deepest reading of all: your full Destiny Matrix chart, calculated from your exact birth date rather than your sign alone.',
  },
  {
    q: 'When does the monthly horoscope change?',
    a: 'At midnight on the first of the month. A monthly horoscope is the slow lens — the season you are in rather than the weather of one day — so it is written to be read at the start of the month and revisited as the weeks unfold. For faster-moving guidance, the weekly horoscope turns every Monday and the daily horoscope every midnight.',
  },
  {
    q: 'Which zodiac system do you use?',
    a: 'The tropical zodiac — the one used by nearly all Western newspapers, magazines and horoscope apps, where Aries begins at the March equinox. If you follow the sidereal (Vedic) system, your sign may sit one place earlier; both are long traditions, and we are simply honest about which one we use.',
  },
];

export function MonthlyHoroscope() {
  const today = useMemo(() => new Date(), []);
  const sample = getMonthlyHoroscope(SIGNS[0], today);
  const newMoonDate = sample.newMoons.length
    ? formatDate(new Date(sample.year, sample.monthIndex, sample.newMoons[0]))
    : null;
  const fullMoonDate = sample.fullMoons.length
    ? formatDate(new Date(sample.year, sample.monthIndex, sample.fullMoons[0]))
    : null;

  return (
    <PublicLayout>
      <ToolHero
        image="/images/zodiac-illustration.webp"
        imageAlt="Two overlapping golden rings studded with star dots in an indigo night sky"
        eyebrow="Monthly Horoscope · Free"
        title={`Monthly Horoscope — ${sample.monthYear}`}
        subtitle={`The slow lens: ${sample.monthName}'s theme for all twelve signs — love, money, growth, lucky days and the month's real moons. Choose your sign.`}
        schema={[webAppSchema('Monthly Horoscope', '/tools/monthly-horoscope', `The slow lens: ${sample.monthName}'s theme for all twelve signs — love, money, growth, lucky days and the month's real moons. Choose your sign.`), faqPageSchema(FAQS), toolBreadcrumb('Monthly Horoscope', '/tools/monthly-horoscope')]}
      />


      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <Link
          to="/tools/moon-phase"
          className="flex items-center gap-4 bg-white/[0.04] rounded-2xl border border-white/10 hover:border-goldlight/50 transition-all px-6 py-5 mb-8"
        >
          <Moon className="w-8 h-8 text-goldlight shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-semibold tracking-widest uppercase text-goldlight mb-1">
              {sample.monthName}&rsquo;s moons
            </p>
            <p className="font-serif text-xl text-cream">
              🌑 New Moon — {newMoonDate ?? '—'} · 🌕 Full Moon — {fullMoonDate ?? '—'}
            </p>
            <p className="text-sm text-lav/75">
              Calculated day by day with the same astronomy as our Moon Phase tool. New moons for
              planting intentions; full moons for seeing what has ripened.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-lavdim shrink-0" />
        </Link>

        <div className="mb-14">
          <p className="text-center text-xs font-semibold tracking-widest uppercase text-lavdim mb-4">
            More rhythms
          </p>
          <HoroscopeLinks current="monthly" />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream text-center mb-2">
          {sample.monthName}, sign by sign
        </h2>
        <p className="text-center text-lav/70 mb-8">
          One theme per sign for the whole month — refreshed on the first of {sample.monthName === 'December' ? 'January' : 'next month'}.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SIGNS.map((sign) => {
            const monthly = getMonthlyHoroscope(sign, today);
            return (
              <Link
                key={sign.slug}
                to={`/tools/monthly-horoscope/${sign.slug}`}
                className="group bg-white/[0.04] rounded-2xl border border-white/10 hover:border-goldlight/60 hover:shadow-[0_20px_50px_-20px_rgba(231,200,115,0.35)] transition-all p-6 flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-5xl text-goldlight leading-none">{sign.glyph}</span>
                  <span className="text-[11px] font-semibold tracking-wider uppercase bg-goldlight/10 border border-goldlight/30 text-goldlight px-2.5 py-1 rounded-full">
                    {monthly.powerWord}
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-cream">{sign.name}</h3>
                <p className="text-xs tracking-wider text-lavdim mb-3">
                  {sign.dates} · {sign.element}
                </p>
                <p className="text-sm text-lav/85 leading-relaxed flex-1">{monthly.themeHeadline}</p>
                <p className="mt-4 text-xs tracking-wider text-lavdim">
                  Lucky days:{' '}
                  <span className="text-goldlight">
                    {monthly.luckyDays.map((d) => ordinal(d)).join(' · ')}
                  </span>
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-goldlight">
                  Read {sample.monthName}&rsquo;s horoscope
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
            A month is a season. Your chart is the whole story.
          </h2>
          <p className="text-lav/85 leading-relaxed max-w-2xl mx-auto mb-7">
            This reading is written for everyone born under your sign, for one month. Your Destiny
            Matrix is calculated from your exact birth date — your soul purpose, love line, money line
            and karmic tail — and it reads the same deep patterns in every month of your life.
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
          Monthly horoscope questions
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
