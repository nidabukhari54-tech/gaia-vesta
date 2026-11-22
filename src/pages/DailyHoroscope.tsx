import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Moon, Sparkles } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { faqPageSchema, webAppSchema, toolBreadcrumb } from '../lib/schema';
import { SIGNS, getDailyHoroscope, getSignForDate } from '../lib/horoscope';

const FAQS = [
  {
    q: 'How is Gaia Vesta\u2019s daily horoscope made?',
    a: 'It is written by us, not scraped from an astrology feed. Each sign has its own bank of daily themes written for that sign\u2019s character, and shared banks for love, money and mood. A simple date seed chooses one of each per sign per day — so every Aries reader sees the same Aries reading all day, and a fresh one tomorrow. The moon line is real astronomy: the phase and illumination are calculated live from the date, exactly as on our Moon Phase page.',
  },
  {
    q: 'Is the daily horoscope free?',
    a: 'Completely — all twelve signs, every day, no account and no card. It is our smallest reading. The deeper one — your full Destiny Matrix chart, drawn from your exact birth date rather than your sign alone — is free too, and linked at the bottom of every horoscope page.',
  },
  {
    q: 'Which zodiac system do you use?',
    a: 'The tropical zodiac — the one used by nearly all Western newspapers, magazines and horoscope apps, where Aries begins at the March equinox. If you follow the sidereal (Vedic) system, your sign may sit one place earlier; both are long traditions, and we are simply honest about which one we use.',
  },
  {
    q: 'Can I read yesterday\u2019s or tomorrow\u2019s horoscope?',
    a: 'Honestly: no — and that is deliberate. Each page shows today\u2019s reading only and updates at midnight, the way a daily practice should. If you want guidance that does not expire at midnight, your Destiny Matrix chart is drawn once from your birth date and reads the same patterns for your whole life.',
  },
];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

const selectCls =
  'w-full bg-night2/70 border border-lav/25 rounded-xl px-4 py-3 text-cream focus:outline-none focus:ring-2 focus:ring-goldlight/60 focus:border-goldlight/60 transition-all [color-scheme:dark]';

export function DailyHoroscope() {
  const today = useMemo(() => new Date(), []);
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');

  const mySign =
    month && day ? getSignForDate(Number(month), Number(day)) : null;
  const moonToday = getDailyHoroscope(SIGNS[0], today);

  return (
    <PublicLayout>
      <ToolHero
        eyebrow="Daily Horoscope · Free"
        title="Daily Horoscope"
        subtitle="Today's reading for all twelve signs — written by Gaia, seeded by the date, and paired with tonight's real moon. Choose your sign, or find it below."
        schema={[webAppSchema('Daily Horoscope', '/tools/daily-horoscope', "Today's reading for all twelve signs — written by Gaia, seeded by the date, and paired with tonight's real moon. Choose your sign, or find it below."), faqPageSchema(FAQS), toolBreadcrumb('Daily Horoscope', '/tools/daily-horoscope')]}
      />

      <div className="relative max-w-md mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="absolute -inset-4 bg-gold/15 rounded-[2.25rem] blur-2xl pointer-events-none" />
        <div className="relative rounded-[1.75rem] overflow-hidden border border-goldlight/30 shadow-[0_30px_70px_-25px_rgba(231,200,115,0.4)]">
          <img
            src="/images/zodiac-illustration.webp"
            alt="Two overlapping golden rings studded with star dots in an indigo night sky"
            loading="lazy"
            decoding="async"
            className="w-full h-auto block"
          />
        </div>
      </div>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
        <div className="bg-white/[0.04] rounded-3xl border border-goldlight/25 p-6 sm:p-8 mb-6">
          <h2 className="font-serif text-2xl text-cream mb-1">What&rsquo;s my sign?</h2>
          <p className="text-sm text-lav/75 mb-5">
            Pick your birth month and day — we&rsquo;ll place you in the tropical zodiac.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={month}
              onChange={(e) => {
                setMonth(e.target.value);
                setDay('');
              }}
              className={selectCls}
              aria-label="Birth month"
            >
              <option value="">Month</option>
              {MONTHS.map((m, idx) => (
                <option key={m} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className={selectCls}
              aria-label="Birth day"
              disabled={!month}
            >
              <option value="">Day</option>
              {Array.from({ length: month ? DAYS_IN_MONTH[Number(month) - 1] : 31 }, (_, i) => i + 1).map(
                (d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ),
              )}
            </select>
          </div>
          {mySign && (
            <div className="mt-5 flex flex-wrap items-center gap-4 bg-night2/60 border border-goldlight/30 rounded-2xl px-5 py-4">
              <span className="text-4xl text-goldlight leading-none">{mySign.glyph}</span>
              <div className="flex-1 min-w-[10rem]">
                <p className="font-serif text-xl text-cream">
                  You are {mySign.name}
                </p>
                <p className="text-sm text-lav/70">
                  {mySign.dates} · {mySign.element} · Ruled by {mySign.ruler}
                </p>
              </div>
              <Link
                to={`/tools/daily-horoscope/${mySign.slug}`}
                className="px-5 py-2.5 bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 text-sm font-semibold rounded-full hover:shadow-[0_0_24px_rgba(231,200,115,0.45)] transition-all inline-flex items-center gap-1.5"
              >
                Read your horoscope <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        <Link
          to="/tools/moon-phase"
          className="flex items-center gap-4 bg-white/[0.04] rounded-2xl border border-white/10 hover:border-goldlight/50 transition-all px-6 py-5 mb-14"
        >
          <Moon className="w-8 h-8 text-goldlight shrink-0" />
          <div className="flex-1">
            <p className="text-xs font-semibold tracking-widest uppercase text-goldlight mb-1">
              Tonight&rsquo;s moon
            </p>
            <p className="font-serif text-xl text-cream">
              {moonToday.moonEmoji} {moonToday.moonName} · {moonToday.moonIllumination}% lit
            </p>
            <p className="text-sm text-lav/75">{moonToday.moonLine}</p>
          </div>
          <ArrowRight className="w-5 h-5 text-lavdim shrink-0" />
        </Link>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream text-center mb-2">
          Today, sign by sign
        </h2>
        <p className="text-center text-lav/70 mb-8">{moonToday.dateString} — every reading refreshes at midnight.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SIGNS.map((sign) => {
            const daily = getDailyHoroscope(sign, today);
            return (
              <Link
                key={sign.slug}
                to={`/tools/daily-horoscope/${sign.slug}`}
                className="group bg-white/[0.04] rounded-2xl border border-white/10 hover:border-goldlight/60 hover:shadow-[0_20px_50px_-20px_rgba(231,200,115,0.35)] transition-all p-6 flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-5xl text-goldlight leading-none">{sign.glyph}</span>
                  <span className="text-[11px] font-semibold tracking-wider uppercase text-lavdim">
                    Lucky {daily.luckyNumber}
                  </span>
                </div>
                <h3 className="font-serif text-2xl text-cream">{sign.name}</h3>
                <p className="text-xs tracking-wider text-lavdim mb-3">
                  {sign.dates} · {sign.element}
                </p>
                <p className="text-sm text-lav/85 leading-relaxed flex-1">{daily.themeHeadline}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-goldlight">
                  Read today&rsquo;s horoscope
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
            A horoscope reads one day. Your chart reads your whole story.
          </h2>
          <p className="text-lav/85 leading-relaxed max-w-2xl mx-auto mb-7">
            Today&rsquo;s reading is written for everyone born under your sign. Your Destiny Matrix is
            calculated from your exact birth date — your soul purpose, love line, money line and the
            karmic pattern underneath it all. It does not expire at midnight.
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
          Daily horoscope questions
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
