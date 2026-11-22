import { Link } from 'react-router-dom';
import { ArrowRight, Moon, Sparkles } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { DESC } from '../lib/meta';
import { faqPageSchema, webAppSchema, toolBreadcrumb } from '../lib/schema';
import { YEAR_2027_READINGS, MOON_CALENDAR_2027, ordinal } from '../lib/horoscope-2027';

const FAQS = [
  {
    q: 'How is the 2027 horoscope made?',
    a: 'Written by us, sign by sign — not scraped from an astrology feed and not generated from a transit database. Each sign\u2019s year is anchored to things that are genuinely true: the tropical sign-season calendar, the rhythm of the seasons, and the real 2027 moon dates in the calendar below, which are calculated day by day with the same astronomy as our Moon Phase tool. The rest is what a horoscope has always been: guidance and reflection in the astrological tradition.',
  },
  {
    q: 'Is the 2027 horoscope free?',
    a: 'Completely — all twelve signs, the full month-by-month readings and the moon calendar, with no account and no card. And the deeper reading is free too: your Destiny Matrix chart is calculated from your exact birth date rather than your sign alone, and it never expires.',
  },
  {
    q: 'When does this update? Will there be a 2028 horoscope?',
    a: 'This is the 2027 edition, and it stays as written for the whole year — a yearly horoscope is a map, not a feed. The 2028 edition will be published next autumn, ahead of the new year. For guidance that moves faster, the Daily Horoscope refreshes every midnight and the Daily Tarot Card turns with the date.',
  },
  {
    q: 'Which zodiac system do you use?',
    a: 'The tropical zodiac — the one used by nearly all Western newspapers, magazines and horoscope apps, where Aries begins at the March equinox and each sign season follows the calendar in our sign cards. If you follow the sidereal (Vedic) system, your sign may sit one place earlier; both are long traditions, and we are simply honest about which one we use.',
  },
];

const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function Horoscope2027() {
  return (
    <PublicLayout>
      <ToolHero
        description={DESC.horoscope2027}
        image="/images/zodiac-illustration.webp"
        imageAlt="Two overlapping golden rings studded with star dots in an indigo night sky"
        eyebrow="2027 Horoscope · Free"
        title="2027 Horoscope — Your Year Ahead, Sign by Sign"
        subtitle="Twelve full year-ahead readings, written by Gaia for each sign's character: the year's theme, love, money, growth, best months — and all twelve months, one by one. Plus the real 2027 moon calendar, calculated in full."
        schema={[webAppSchema('2027 Horoscope', '/tools/horoscope-2027', "Twelve full year-ahead readings, written by Gaia for each sign's character: the year's theme, love, money, growth, best months — and all twelve months, one by one. Plus the real 2027 moon calendar, calculated in full."), faqPageSchema(FAQS), toolBreadcrumb('2027 Horoscope', '/tools/horoscope-2027')]}
      />


      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream text-center mb-2">
          Choose your sign
        </h2>
        <p className="text-center text-lav/70 mb-8">
          Every sign gets a theme, a power word, and a year that unfolds month by month.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {YEAR_2027_READINGS.map(({ sign, year }) => (
            <Link
              key={sign.slug}
              to={`/tools/horoscope-2027/${sign.slug}`}
              className="group bg-white/[0.04] rounded-2xl border border-white/10 hover:border-goldlight/60 hover:shadow-[0_20px_50px_-20px_rgba(231,200,115,0.35)] transition-all p-6 flex flex-col"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-5xl text-goldlight leading-none">{sign.glyph}</span>
                <span className="text-[11px] font-semibold tracking-wider uppercase bg-goldlight/10 border border-goldlight/30 text-goldlight px-2.5 py-1 rounded-full">
                  {year.powerWord}
                </span>
              </div>
              <h3 className="font-serif text-2xl text-cream">{sign.name}</h3>
              <p className="text-xs tracking-wider text-lavdim mb-3">
                {sign.dates} · {sign.element}
              </p>
              <p className="font-serif italic text-lg text-cream/90 leading-snug flex-1">
                {year.yearThemeTitle}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-goldlight">
                Read your 2027
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="text-center mb-8">
          <Moon className="w-8 h-8 text-goldlight mx-auto mb-3" />
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream mb-2">
            The 2027 moon calendar
          </h2>
          <p className="text-lav/70 max-w-2xl mx-auto">
            Every new moon and full moon of 2027 — calculated day by day with the same astronomy as
            our{' '}
            <Link to="/tools/moon-phase" className="text-goldlight font-medium hover:underline">
              Moon Phase
            </Link>{' '}
            tool. New moons for planting intentions; full moons for seeing what has ripened.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MOON_CALENDAR_2027.map((m, i) => (
            <div key={m.month} className="bg-white/[0.04] rounded-2xl border border-white/10 p-5">
              <h3 className="font-serif text-xl text-cream mb-3">{m.month}</h3>
              <p className="text-sm text-lav/85 mb-1.5">
                🌑 <span className="text-cream font-medium">New Moon</span> —{' '}
                {m.newMoons.length
                  ? m.newMoons.map((d) => `${SHORT_MONTHS[i]} ${ordinal(d)}`).join(' & ')
                  : '—'}
              </p>
              <p className="text-sm text-lav/85">
                🌕 <span className="text-cream font-medium">Full Moon</span> —{' '}
                {m.fullMoons.length
                  ? m.fullMoons.map((d) => `${SHORT_MONTHS[i]} ${ordinal(d)}`).join(' & ')
                  : '—'}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="relative bg-gradient-to-b from-night3 to-night2 rounded-3xl p-8 sm:p-10 border border-goldlight/50 text-center overflow-hidden">
          <Sparkles className="w-8 h-8 text-goldlight mx-auto mb-4" />
          <h2 className="font-serif text-2xl sm:text-3xl text-cream mb-3">
            A year is a season. Your chart is the whole story.
          </h2>
          <p className="text-lav/85 leading-relaxed max-w-2xl mx-auto mb-7">
            This horoscope is written for everyone born under your sign, for one year. Your Destiny
            Matrix is calculated from your exact birth date — your soul purpose, love line, money line
            and karmic tail — and it reads the same deep patterns in every year of your life.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 font-semibold rounded-full hover:shadow-[0_0_28px_rgba(231,200,115,0.5)] transition-all"
          >
            Calculate your Destiny Matrix chart — free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-serif font-bold text-cream mb-6 text-center">
          2027 horoscope questions
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
