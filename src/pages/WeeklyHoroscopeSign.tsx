import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowRight, Briefcase, CalendarCheck, Heart, Moon, Sparkles,
} from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { weeklySignDesc, weeklySignPageTitle } from '../lib/meta';
import { faqPageSchema, webAppSchema, breadcrumbSchema } from '../lib/schema';
import { SIGNS, getSignBySlug, type HoroscopeSign } from '../lib/horoscope';
import { getWeeklyHoroscope } from '../lib/horoscope-weekly';

function signFaqs(sign: HoroscopeSign) {
  return [
    {
      q: `What is the ${sign.name} weekly horoscope based on?`,
      a: `${sign.name} (${sign.dates}) is a ${sign.element} sign ruled by ${sign.ruler}, and this reading is written for that character — ${sign.traits.join(', ').toLowerCase()} — then chosen for this week by a sign-and-week seed. Every ${sign.name} reader sees the same reading from Monday to Sunday, and a new one next week. It follows the tropical zodiac, the system used by Western astrology.`,
    },
    {
      q: `When does the weekly reading update?`,
      a: `At midnight between Sunday and Monday. The weekly reading is the middle lens — longer than a day's weather, shorter than a season — so it is written to be read on Monday and carried through the week. For faster guidance, ${sign.name}'s daily horoscope turns every midnight; for the slower view, the monthly horoscope turns on the first of the month.`,
    },
    {
      q: `How is this different from my Destiny Matrix chart?`,
      a: `This horoscope is shared by everyone born under ${sign.name}, for one week. Your Destiny Matrix chart is yours alone — calculated from your exact birth date, it maps your soul purpose, love line, money line and karmic tail, and it never expires. Think of the weekly horoscope as the chapter you are in; your chart is the whole book.`,
    },
  ];
}

const cardCls = 'bg-white/[0.04] rounded-2xl border border-white/10 p-6';
const cardLabel =
  'flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-goldlight mb-2.5';

export function WeeklyHoroscopeSignPage() {
  const { sign: slug } = useParams();
  const today = useMemo(() => new Date(), []);
  const sign = getSignBySlug(slug ?? '');

  if (!sign) {
    return <Navigate to="/tools/weekly-horoscope" replace />;
  }

  const weekly = getWeeklyHoroscope(sign, today);
  const faqs = signFaqs(sign);
  const weekOf = weekly.weekStart.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const rhythmLinks = [
    {
      to: `/tools/daily-horoscope/${sign.slug}`,
      title: `${sign.name} today`,
      text: 'The daily lens — today\u2019s theme, love, money and mood.',
    },
    {
      to: `/tools/monthly-horoscope/${sign.slug}`,
      title: `${sign.name} this month`,
      text: 'The monthly lens — the season\u2019s theme, lucky days and moons.',
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
        description={weeklySignDesc(sign.name)}
        pageTitle={weeklySignPageTitle(sign.name)}
        image="/images/zodiac-illustration.webp"
        imageAlt="Two overlapping golden rings studded with star dots in an indigo night sky"
        eyebrow={`${sign.glyph} ${sign.element} sign · Ruled by ${sign.ruler} · ${sign.dates}`}
        title={`${sign.name} Weekly Horoscope — Week of ${weekOf}`}
        subtitle={`For every ${sign.name}: ${sign.traits.join(' · ')}. Here is what this week asks of you.`}
        schema={[
          webAppSchema(
            `${sign.name} Weekly Horoscope`,
            `/tools/weekly-horoscope/${sign.slug}`,
            `For every ${sign.name}: ${sign.traits.join(' · ')}. Here is what this week asks of you.`,
          ),
          faqPageSchema(faqs),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Tools', path: '/tools' },
            { name: 'Weekly Horoscope', path: '/tools/weekly-horoscope' },
            { name: `${sign.name} Horoscope`, path: `/tools/weekly-horoscope/${sign.slug}` },
          ]),
        ]}
      />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="relative bg-gradient-to-b from-night3 to-night2 rounded-3xl border border-goldlight/50 p-7 sm:p-9 mb-6 overflow-hidden">
          <div className="absolute -top-10 -right-6 text-[11rem] leading-none text-goldlight/[0.08] select-none pointer-events-none">
            {sign.glyph}
          </div>
          <p className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-goldlight mb-3">
            <Sparkles className="w-4 h-4" /> {sign.name} · This week&rsquo;s theme
          </p>
          <p className="relative font-serif text-xl sm:text-2xl text-cream leading-relaxed">
            {weekly.theme}
          </p>
          <p className="relative text-sm text-lav/70 mt-4">{weekly.weekRange}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className={cardCls}>
            <p className={cardLabel}>
              <Heart className="w-4 h-4" /> Love this week
            </p>
            <p className="text-lav/85 leading-relaxed">{weekly.love}</p>
          </div>
          <div className={cardCls}>
            <p className={cardLabel}>
              <Briefcase className="w-4 h-4" /> Money &amp; work
            </p>
            <p className="text-lav/85 leading-relaxed">{weekly.money}</p>
          </div>
          <div className={cardCls}>
            <p className={cardLabel}>
              <Sparkles className="w-4 h-4" /> Mood of the week
            </p>
            <p className="font-serif text-2xl text-cream mb-1">{weekly.moodWord}</p>
            <p className="text-lav/85 leading-relaxed">{weekly.moodNote}</p>
          </div>
          <div className={cardCls}>
            <p className={cardLabel}>
              <CalendarCheck className="w-4 h-4" /> Best day
            </p>
            <p className="font-serif text-2xl text-cream mb-1">{weekly.bestDay}</p>
            <p className="text-lav/85 leading-relaxed">
              The day this week when {sign.name}&rsquo;s energy runs clearest — put the conversation,
              the ask or the start that matters on {weekly.bestDay}.
            </p>
          </div>
          <Link
            to="/tools/moon-phase"
            className={`${cardCls} hover:border-goldlight/50 transition-all block sm:col-span-2`}
          >
            <p className={cardLabel}>
              <Moon className="w-4 h-4" /> The week&rsquo;s moon arc
            </p>
            <p className="font-serif text-xl sm:text-2xl text-cream mb-1">
              {weekly.moonStartEmoji} {weekly.moonStartName} → {weekly.moonEndEmoji} {weekly.moonEndName}
            </p>
            <p className="text-lav/85 leading-relaxed">
              Your week opens under a {weekly.moonStartName.toLowerCase()} and closes under a{' '}
              {weekly.moonEndName.toLowerCase()} — the same moon for every sign, calculated for Monday
              and Sunday. See tonight&rsquo;s phase in full with the Moon Phase tool.
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
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="relative bg-gradient-to-b from-night3 to-night2 rounded-3xl p-8 sm:p-10 border border-goldlight/50 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-cream mb-3">
            {sign.name}, your sign is the chapter. Your birth date is the book.
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
          Questions for {sign.name} this week
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
          All twelve signs, this week
        </h3>
        <div className="flex flex-wrap justify-center gap-2">
          {SIGNS.map((s) => (
            <Link
              key={s.slug}
              to={`/tools/weekly-horoscope/${s.slug}`}
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
            to="/tools/weekly-horoscope"
            className="text-sm text-lavdim hover:text-goldlight transition-colors"
          >
            ← Back to the weekly horoscope hub
          </Link>
        </p>
      </section>
    </PublicLayout>
  );
}
