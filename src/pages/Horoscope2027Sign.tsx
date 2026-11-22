import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowRight, Briefcase, CalendarDays, Hash, Heart, Moon, Sparkles, Sprout, Sun,
} from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { SIGNS, getSignBySlug, type HoroscopeSign } from '../lib/horoscope';
import {
  getYear2027, moonsForMonth, ordinal, type SignYear2027,
} from '../lib/horoscope-2027';

function signFaqs(sign: HoroscopeSign, year: SignYear2027) {
  return [
    {
      q: `What is ${sign.name}'s theme for 2027?`,
      a: `${year.yearThemeTitle}. ${year.yearTheme.split('. ')[0]}. The power word we would give your year is "${year.powerWord}" — and your lucky number for 2027 is ${year.luckyNumberYear}. The full reading above walks through your love life, your money and work, your growth edge, and then all twelve months one by one.`,
    },
    {
      q: `Which are ${sign.name}'s best months in 2027?`,
      a: `${year.bestMonths.map((b) => b.month).join(', ')} carry the year's best weather for you. ${year.bestMonths[0].month} leads: ${year.bestMonths[0].why.charAt(0).toLowerCase()}${year.bestMonths[0].why.slice(1)} Take a gentler pace in ${year.gentleMonths.map((g) => g.month).join(' and ')} — not because those months are bad, but because they ask for rest, care or patience rather than force.`,
    },
    {
      q: `How is this different from my Destiny Matrix chart?`,
      a: `This horoscope is written for every ${sign.name} (${sign.dates}) at once, for one year — think of it as the climate of your sign. Your Destiny Matrix chart is calculated from your exact birth date, so no one born on a different day shares it: it maps your soul purpose, love line, money line and karmic tail across your whole life. Read the year for the season you are in; read your chart for the country you live in.`,
    },
  ];
}

const cardCls = 'bg-white/[0.04] rounded-2xl border border-white/10 p-6';
const cardLabel =
  'flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-goldlight mb-2.5';

export function Horoscope2027SignPage() {
  const { sign: slug } = useParams();
  const sign = getSignBySlug(slug ?? '');

  if (!sign) {
    return <Navigate to="/tools/horoscope-2027" replace />;
  }

  const { year } = getYear2027(sign);
  const faqs = signFaqs(sign, year);

  return (
    <PublicLayout>
      <ToolHero
        eyebrow={`${sign.glyph} ${sign.element} sign · Ruled by ${sign.ruler} · ${sign.dates}`}
        title={`${sign.name} Horoscope 2027 — Love, Money & Your Year Ahead`}
        subtitle={`Power word for your year: ${year.powerWord}. Lucky number: ${year.luckyNumberYear}. Here is your 2027, ${sign.name} — the whole of it.`}
      />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="relative bg-gradient-to-b from-night3 to-night2 rounded-3xl border border-goldlight/50 p-7 sm:p-9 mb-6 overflow-hidden">
          <div className="absolute -top-10 -right-6 text-[11rem] leading-none text-goldlight/[0.08] select-none pointer-events-none">
            {sign.glyph}
          </div>
          <p className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-goldlight mb-3">
            <Sparkles className="w-4 h-4" /> {sign.name} · Your 2027 theme
          </p>
          <h2 className="relative font-serif text-2xl sm:text-3xl text-cream mb-4">
            {year.yearThemeTitle}
          </h2>
          <p className="relative text-lav/90 leading-relaxed">{year.yearTheme}</p>
          <div className="relative flex flex-wrap gap-2 mt-6">
            <span className="px-3.5 py-1.5 rounded-full bg-goldlight/10 border border-goldlight/30 text-sm text-goldlight">
              Power word · {year.powerWord}
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-goldlight/10 border border-goldlight/30 text-sm text-goldlight">
              Lucky number · {year.luckyNumberYear}
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-sm text-lav">
              {sign.element} sign · Ruled by {sign.ruler}
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className={cardCls}>
            <p className={cardLabel}>
              <Heart className="w-4 h-4" /> Love in 2027
            </p>
            <p className="text-lav/85 leading-relaxed">{year.yearLove}</p>
          </div>
          <div className={cardCls}>
            <p className={cardLabel}>
              <Briefcase className="w-4 h-4" /> Money &amp; work in 2027
            </p>
            <p className="text-lav/85 leading-relaxed">{year.yearMoney}</p>
          </div>
        </div>
        <div className={`${cardCls} mb-4`}>
          <p className={cardLabel}>
            <Sprout className="w-4 h-4" /> Growth in 2027
          </p>
          <p className="text-lav/85 leading-relaxed">{year.yearGrowth}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className={cardCls}>
            <p className={cardLabel}>
              <Sun className="w-4 h-4" /> Best months
            </p>
            <ul className="space-y-3">
              {year.bestMonths.map((b) => (
                <li key={b.month} className="text-lav/85 leading-relaxed">
                  <span className="font-serif text-cream">{b.month}</span> — {b.why}
                </li>
              ))}
            </ul>
          </div>
          <div className={cardCls}>
            <p className={cardLabel}>
              <Moon className="w-4 h-4" /> Gentle months
            </p>
            <ul className="space-y-3">
              {year.gentleMonths.map((g) => (
                <li key={g.month} className="text-lav/85 leading-relaxed">
                  <span className="font-serif text-cream">{g.month}</span> — {g.why}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream mb-2">
          Your 2027, month by month
        </h2>
        <p className="text-lav/70 mb-6 flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-goldlight shrink-0" />
          Each month carries its real new and full moon dates — calculated, not copied.
        </p>
        <div className="space-y-3">
          {year.months.map((m, i) => {
            const moons = moonsForMonth(i);
            const isBirthdayMonth =
              sign.start[0] === i + 1 || sign.end[0] === i + 1;
            return (
              <div
                key={m.month}
                className={`rounded-2xl border p-5 sm:p-6 ${
                  isBirthdayMonth
                    ? 'bg-goldlight/[0.06] border-goldlight/40'
                    : 'bg-white/[0.04] border-white/10'
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                  <h3 className="font-serif text-xl text-cream">
                    {m.month}
                    {isBirthdayMonth && (
                      <span className="ml-2.5 text-[11px] font-sans font-semibold tracking-wider uppercase text-goldlight align-middle">
                        Your season
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-lavdim">
                    🌑 New{' '}
                    {moons.newMoons.length ? moons.newMoons.map((d) => ordinal(d)).join(' & ') : '—'}
                    {'  ·  '}🌕 Full{' '}
                    {moons.fullMoons.length ? moons.fullMoons.map((d) => ordinal(d)).join(' & ') : '—'}
                  </p>
                </div>
                <p className="text-lav/85 leading-relaxed">{m.note}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="flex flex-wrap gap-3">
          <Link
            to={`/tools/daily-horoscope/${sign.slug}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.04] border border-goldlight/40 text-goldlight font-medium hover:bg-goldlight/10 transition-all"
          >
            <Hash className="w-4 h-4" /> {sign.name} today — your daily horoscope
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/tools/moon-phase"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.04] border border-white/15 text-lav font-medium hover:border-goldlight/40 hover:text-cream transition-all"
          >
            <Moon className="w-4 h-4" /> Tonight&rsquo;s moon phase
          </Link>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="relative bg-gradient-to-b from-night3 to-night2 rounded-3xl p-8 sm:p-10 border border-goldlight/50 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-cream mb-3">
            {sign.name}, 2027 is one year. Your chart is every year.
          </h2>
          <p className="text-lav/85 leading-relaxed max-w-2xl mx-auto mb-7">
            This reading is shared by everyone born under {sign.name}. Your Destiny Matrix chart is
            yours alone — calculated from your exact birth date, it maps your soul purpose, love line,
            money line and karmic tail, in 2027 and every year after.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 font-semibold rounded-full hover:shadow-[0_0_28px_rgba(231,200,115,0.5)] transition-all"
          >
            Calculate your Destiny Matrix — free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <h2 className="text-2xl font-serif font-bold text-cream mb-6 text-center">
          {sign.name} in 2027 — questions
        </h2>
        <div className="space-y-4 mb-12">
          {faqs.map((f) => (
            <div key={f.q} className="bg-white/[0.04] rounded-2xl border border-white/10 p-6">
              <h3 className="font-serif font-semibold text-lg text-cream mb-2">{f.q}</h3>
              <p className="text-lav/80 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>

        <h3 className="font-serif font-semibold text-lg text-cream mb-4 text-center">
          All twelve signs in 2027
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          {SIGNS.map((s) => (
            <Link
              key={s.slug}
              to={`/tools/horoscope-2027/${s.slug}`}
              className={`px-4 py-2 rounded-full border text-sm transition-all ${
                s.slug === sign.slug
                  ? 'bg-goldlight/15 border-goldlight/60 text-goldlight font-semibold'
                  : 'bg-white/[0.04] border-white/10 text-lav hover:border-goldlight/50 hover:text-cream'
              }`}
            >
              {s.glyph} {s.name}
            </Link>
          ))}
        </div>
        <p className="text-center mt-8">
          <Link
            to="/tools/horoscope-2027"
            className="text-sm text-lavdim hover:text-goldlight transition-colors"
          >
            ← Back to the 2027 horoscope hub
          </Link>
        </p>
      </section>
    </PublicLayout>
  );
}
