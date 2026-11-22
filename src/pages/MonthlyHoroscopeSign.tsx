import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowRight, Briefcase, CalendarHeart, Hash, Heart, Moon, Sparkles, Sprout,
} from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { monthlySignDesc } from '../lib/meta';
import { faqPageSchema, webAppSchema, breadcrumbSchema } from '../lib/schema';
import { SIGNS, formatDate, getSignBySlug, type HoroscopeSign } from '../lib/horoscope';
import { getMonthlyHoroscope } from '../lib/horoscope-monthly';
import { ordinal } from '../lib/horoscope-2027';

function signFaqs(sign: HoroscopeSign, monthName: string) {
  return [
    {
      q: `What is the ${sign.name} monthly horoscope based on?`,
      a: `${sign.name} (${sign.dates}) is a ${sign.element} sign ruled by ${sign.ruler}, and this reading is written for that character — ${sign.traits.join(', ').toLowerCase()} — then chosen for ${monthName} by a sign-and-month seed. Every ${sign.name} reader sees the same reading all month, and a new one on the first of next month. It follows the tropical zodiac, the system used by Western astrology.`,
    },
    {
      q: `When does the monthly reading update?`,
      a: `At midnight on the first of each month. The monthly reading is the slow lens — the season ${sign.name} is moving through rather than the weather of a single day — so it is written to be read at the month's start and revisited as the weeks unfold. For faster guidance, ${sign.name}'s weekly horoscope turns every Monday and the daily horoscope every midnight.`,
    },
    {
      q: `How is this different from my Destiny Matrix chart?`,
      a: `This horoscope is shared by everyone born under ${sign.name}, for one month. Your Destiny Matrix chart is yours alone — calculated from your exact birth date, it maps your soul purpose, love line, money line and karmic tail, and it never expires. Think of the monthly horoscope as the season; your chart is the landscape it moves across.`,
    },
  ];
}

const cardCls = 'bg-white/[0.04] rounded-2xl border border-white/10 p-6';
const cardLabel =
  'flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-goldlight mb-2.5';

function luckyDayLabel(year: number, monthIndex: number, day: number): string {
  const d = new Date(year, monthIndex, day);
  const weekday = d.toLocaleDateString('en-GB', { weekday: 'long' });
  return `${weekday} ${ordinal(day)}`;
}

export function MonthlyHoroscopeSignPage() {
  const { sign: slug } = useParams();
  const today = useMemo(() => new Date(), []);
  const sign = getSignBySlug(slug ?? '');

  if (!sign) {
    return <Navigate to="/tools/monthly-horoscope" replace />;
  }

  const monthly = getMonthlyHoroscope(sign, today);
  const faqs = signFaqs(sign, monthly.monthName);
  const newMoonStr = monthly.newMoons.length
    ? formatDate(new Date(monthly.year, monthly.monthIndex, monthly.newMoons[0]))
    : null;
  const fullMoonStr = monthly.fullMoons.length
    ? formatDate(new Date(monthly.year, monthly.monthIndex, monthly.fullMoons[0]))
    : null;

  const rhythmLinks = [
    {
      to: `/tools/daily-horoscope/${sign.slug}`,
      title: `${sign.name} today`,
      text: 'The daily lens — today\u2019s theme, love, money and mood.',
    },
    {
      to: `/tools/weekly-horoscope/${sign.slug}`,
      title: `${sign.name} this week`,
      text: 'The weekly lens — the week\u2019s theme and your best day.',
    },
    {
      to: `/tools/horoscope-2027/${sign.slug}`,
      title: `${sign.name} in 2027`,
      text: 'The whole year — theme, love, money and all twelve months.',
    },
  ];

  return (
    <PublicLayout>
      <ToolHero
        description={monthlySignDesc(sign.name, monthly.monthName)}
        image="/images/zodiac-illustration.webp"
        imageAlt="Two overlapping golden rings studded with star dots in an indigo night sky"
        eyebrow={`${sign.glyph} ${sign.element} sign · Ruled by ${sign.ruler} · ${sign.dates}`}
        title={`${sign.name} Horoscope — ${monthly.monthYear}`}
        subtitle={`For every ${sign.name}: ${sign.traits.join(' · ')}. Here is what ${monthly.monthName} asks of you.`}
        schema={[
          webAppSchema(
            `${sign.name} Monthly Horoscope`,
            `/tools/monthly-horoscope/${sign.slug}`,
            `For every ${sign.name}: ${sign.traits.join(' · ')}. Here is what ${monthly.monthName} asks of you.`,
          ),
          faqPageSchema(faqs),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Tools', path: '/tools' },
            { name: 'Monthly Horoscope', path: '/tools/monthly-horoscope' },
            { name: `${sign.name} Horoscope`, path: `/tools/monthly-horoscope/${sign.slug}` },
          ]),
        ]}
      />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <p className="text-lav/85 leading-relaxed mb-6">
          Your {sign.name} monthly horoscope for {monthly.monthYear} — the month&rsquo;s theme, love,
          money, growth, lucky days and moons, gathered in one reading.
        </p>
        <div className="relative bg-gradient-to-b from-night3 to-night2 rounded-3xl border border-goldlight/50 p-7 sm:p-9 mb-6 overflow-hidden">
          <div className="absolute -top-10 -right-6 text-[11rem] leading-none text-goldlight/[0.08] select-none pointer-events-none">
            {sign.glyph}
          </div>
          <p className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-goldlight mb-3">
            <Sparkles className="w-4 h-4" /> {sign.name} · {monthly.monthName}&rsquo;s theme
          </p>
          <p className="relative font-serif text-xl sm:text-2xl text-cream leading-relaxed">
            {monthly.theme}
          </p>
          <p className="relative mt-5">
            <span className="text-[11px] font-semibold tracking-wider uppercase bg-goldlight/10 border border-goldlight/30 text-goldlight px-2.5 py-1 rounded-full">
              Power word · {monthly.powerWord}
            </span>
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className={cardCls}>
            <p className={cardLabel}>
              <Heart className="w-4 h-4" /> Love in {monthly.monthName}
            </p>
            <p className="text-lav/85 leading-relaxed">{monthly.love}</p>
          </div>
          <div className={cardCls}>
            <p className={cardLabel}>
              <Briefcase className="w-4 h-4" /> Money &amp; work
            </p>
            <p className="text-lav/85 leading-relaxed">{monthly.money}</p>
          </div>
          <div className={cardCls}>
            <p className={cardLabel}>
              <Sprout className="w-4 h-4" /> Growth this month
            </p>
            <p className="text-lav/85 leading-relaxed">{monthly.growth}</p>
          </div>
          <div className={cardCls}>
            <p className={cardLabel}>
              <CalendarHeart className="w-4 h-4" /> Lucky days
            </p>
            <div className="flex flex-wrap gap-2">
              {monthly.luckyDays.map((d) => (
                <span
                  key={d}
                  className="px-3.5 py-1.5 rounded-full bg-goldlight/10 border border-goldlight/30 text-sm text-goldlight"
                >
                  {luckyDayLabel(monthly.year, monthly.monthIndex, d)}
                </span>
              ))}
            </div>
            <p className="text-sm text-lav/75 leading-relaxed mt-3">
              The days this month when {sign.name}&rsquo;s energy runs clearest — schedule the thing
              that matters on one of them.
            </p>
          </div>
          <Link
            to="/tools/moon-phase"
            className={`${cardCls} hover:border-goldlight/50 transition-all block sm:col-span-2`}
          >
            <p className={cardLabel}>
              <Moon className="w-4 h-4" /> {monthly.monthName}&rsquo;s moons
            </p>
            <p className="font-serif text-xl sm:text-2xl text-cream mb-1">
              🌑 {newMoonStr ?? '—'} · 🌕 {fullMoonStr ?? '—'}
            </p>
            <p className="text-lav/85 leading-relaxed">
              The new moon is the month&rsquo;s blank page — plant the intention the theme describes.
              The full moon is its first harvest — the moment to see what the month has actually
              grown. Check tonight&rsquo;s phase any day with the Moon Phase tool.
            </p>
          </Link>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream mb-5">
          {sign.name} at every speed
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {rhythmLinks.map((r) => (
            <Link
              key={r.to}
              to={r.to}
              className="group bg-white/[0.04] rounded-2xl border border-white/10 hover:border-goldlight/60 transition-all p-5"
            >
              <p className="font-serif text-lg text-cream mb-1.5">{r.title}</p>
              <p className="text-sm text-lav/75 leading-relaxed mb-3">{r.text}</p>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-goldlight">
                Read <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
        <p className="text-sm text-lav/75 leading-relaxed mt-6">
          <Hash className="w-4 h-4 inline text-goldlight mr-1 -mt-0.5" />
          {sign.name} at a glance: {sign.strengths.join('; ').toLowerCase()} — and a growth edge in{' '}
          {sign.challenges[0].toLowerCase()}. The full profile lives on{' '}
          <Link to={`/tools/daily-horoscope/${sign.slug}`} className="text-goldlight font-medium hover:underline">
            {sign.name}&rsquo;s daily page
          </Link>
          .
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="relative bg-gradient-to-b from-night3 to-night2 rounded-3xl p-8 sm:p-10 border border-goldlight/50 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-cream mb-3">
            {sign.name}, your sign is the season. Your birth date is the landscape.
          </h2>
          <p className="text-lav/85 leading-relaxed max-w-2xl mx-auto mb-7">
            This horoscope is shared by everyone born under {sign.name}. Your Destiny Matrix chart is
            yours alone — calculated from your exact birth date, it maps your soul purpose, love line,
            money line and karmic tail, and it never expires.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 font-semibold rounded-full hover:shadow-[0_0_28px_rgba(231,200,115,0.5)] transition-all"
          >
            Calculate your Destiny Matrix chart — free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <h2 className="text-2xl font-serif font-bold text-cream mb-6 text-center">
          Questions for {sign.name} this month
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
          All twelve signs, this month
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          {SIGNS.map((s) => (
            <Link
              key={s.slug}
              to={`/tools/monthly-horoscope/${s.slug}`}
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
            to="/tools/monthly-horoscope"
            className="text-sm text-lavdim hover:text-goldlight transition-colors"
          >
            ← Back to the monthly horoscope hub
          </Link>
        </p>
      </section>
    </PublicLayout>
  );
}
