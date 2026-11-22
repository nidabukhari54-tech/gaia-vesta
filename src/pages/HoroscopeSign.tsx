import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowRight, Briefcase, Hash, Heart, HeartHandshake, Moon, Palette, Sparkles,
} from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { RelatedRail, firstSentence } from '../components/RelatedRail';
import { dailySignDesc, dailySignPageTitle } from '../lib/meta';
import { faqPageSchema, webAppSchema, breadcrumbSchema } from '../lib/schema';
import { SIGNS, getDailyHoroscope, getSignBySlug, type HoroscopeSign } from '../lib/horoscope';

function signFaqs(sign: HoroscopeSign) {
  return [
    {
      q: `What is the ${sign.name} horoscope based on?`,
      a: `${sign.name} (${sign.dates}) is a ${sign.element} sign ruled by ${sign.ruler}, and this daily reading is written for that character — ${sign.traits.join(', ').toLowerCase()} — then chosen for today by a date seed. Every ${sign.name} reader sees the same reading on the same day, and a new one tomorrow. It follows the tropical zodiac, the system used by Western astrology.`,
    },
    {
      q: `Is the ${sign.name} horoscope the same for everyone with my sign?`,
      a: `Yes — a sun-sign horoscope is written for the whole sign at once, which is why it reads as a theme for the day rather than a personal forecast. Your own chart is far more specific: your Destiny Matrix is calculated from your exact birth date, and no one born on a different day shares it. Think of this page as the weather for ${sign.name}; your chart is the map of your own country.`,
    },
    {
      q: `What is ${sign.name}'s growth edge?`,
      a: `Every sign has a gift and a shadow that travels with it. ${sign.name}'s strengths — ${sign.strengths.join('; ').toLowerCase()} — are real and reliable. The growth edge lives in the challenges: ${sign.challenges.join('; ').toLowerCase()}. Today's reading is written with both sides in mind, so the advice works with your nature instead of against it.`,
    },
  ];
}

const cardCls = 'bg-white/[0.04] rounded-2xl border border-white/10 p-6';
const cardLabel =
  'flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-goldlight mb-2.5';

export function HoroscopeSignPage() {
  const { sign: slug } = useParams();
  const today = useMemo(() => new Date(), []);
  const sign = getSignBySlug(slug ?? '');

  if (!sign) {
    return <Navigate to="/tools/daily-horoscope" replace />;
  }

  const daily = getDailyHoroscope(sign, today);
  const faqs = signFaqs(sign);
  const signIdx = SIGNS.indexOf(sign);
  const prevSign = SIGNS[(signIdx + 11) % 12];
  const nextSign = SIGNS[(signIdx + 1) % 12];

  return (
    <PublicLayout>
      <ToolHero
        description={dailySignDesc(sign.name)}
        pageTitle={dailySignPageTitle(sign.name)}
        image="/images/zodiac-illustration.webp"
        imageAlt="Two overlapping golden rings studded with star dots in an indigo night sky"
        eyebrow={`${sign.glyph} ${sign.element} sign · Ruled by ${sign.ruler} · ${sign.dates}`}
        title={`${sign.name} Horoscope Today — ${daily.dateString}`}
        subtitle={`For every ${sign.name}: ${sign.traits.join(' · ')}. Here is what today asks of you.`}
        schema={[
          webAppSchema(
            `${sign.name} Daily Horoscope`,
            `/tools/daily-horoscope/${sign.slug}`,
            `For every ${sign.name}: ${sign.traits.join(' · ')}. Here is what today asks of you.`,
          ),
          faqPageSchema(faqs),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Tools', path: '/tools' },
            { name: 'Daily Horoscope', path: '/tools/daily-horoscope' },
            { name: `${sign.name} Horoscope`, path: `/tools/daily-horoscope/${sign.slug}` },
          ]),
        ]}
      />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="relative bg-gradient-to-b from-night3 to-night2 rounded-3xl border border-goldlight/50 p-7 sm:p-9 mb-6 overflow-hidden">
          <div className="absolute -top-10 -right-6 text-[11rem] leading-none text-goldlight/[0.08] select-none pointer-events-none">
            {sign.glyph}
          </div>
          <p className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-goldlight mb-3">
            <Sparkles className="w-4 h-4" /> {sign.name} · Today&rsquo;s theme
          </p>
          <p className="relative font-serif text-xl sm:text-2xl text-cream leading-relaxed">
            {daily.theme}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className={cardCls}>
            <p className={cardLabel}>
              <Heart className="w-4 h-4" /> Love today
            </p>
            <p className="text-lav/85 leading-relaxed">{daily.love}</p>
          </div>
          <div className={cardCls}>
            <p className={cardLabel}>
              <Briefcase className="w-4 h-4" /> Money &amp; work today
            </p>
            <p className="text-lav/85 leading-relaxed">{daily.money}</p>
          </div>
          <div className={cardCls}>
            <p className={cardLabel}>
              <Sparkles className="w-4 h-4" /> Mood
            </p>
            <p className="font-serif text-2xl text-cream mb-1">{daily.moodWord}</p>
            <p className="text-lav/85 leading-relaxed">{daily.moodNote}</p>
          </div>
          <Link
            to="/tools/moon-phase"
            className={`${cardCls} hover:border-goldlight/50 transition-all block`}
          >
            <p className={cardLabel}>
              <Moon className="w-4 h-4" /> Moon today
            </p>
            <p className="font-serif text-2xl text-cream mb-1">
              {daily.moonEmoji} {daily.moonName} · {daily.moonIllumination}% lit
            </p>
            <p className="text-lav/85 leading-relaxed">{daily.moonLine}</p>
          </Link>
          <div className="grid grid-cols-2 gap-4">
            <div className={cardCls}>
              <p className={cardLabel}>
                <Hash className="w-4 h-4" /> Lucky number
              </p>
              <p className="font-serif text-4xl text-cream">{daily.luckyNumber}</p>
            </div>
            <div className={cardCls}>
              <p className={cardLabel}>
                <Palette className="w-4 h-4" /> Lucky colour
              </p>
              <p className="font-serif text-2xl text-cream leading-tight">{daily.luckyColour}</p>
            </div>
          </div>
          <Link
            to={`/tools/daily-horoscope/${daily.bestMatch.slug}`}
            className={`${cardCls} hover:border-goldlight/50 transition-all block`}
          >
            <p className={cardLabel}>
              <HeartHandshake className="w-4 h-4" /> Best match today
            </p>
            <p className="font-serif text-2xl text-cream mb-1">
              {daily.bestMatch.glyph} {daily.bestMatch.name}
            </p>
            <p className="text-lav/85 leading-relaxed">
              Your energies sit well together today — read {daily.bestMatch.name}&rsquo;s horoscope to
              see the day from their side.
            </p>
          </Link>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <Link
          to={`/tools/horoscope-2027/${sign.slug}`}
          className="flex items-center gap-4 bg-gradient-to-b from-night3 to-night2 rounded-2xl border border-goldlight/40 hover:border-goldlight/70 hover:shadow-[0_20px_50px_-20px_rgba(231,200,115,0.35)] transition-all px-6 py-5"
        >
          <span className="text-4xl text-goldlight leading-none shrink-0">{sign.glyph}</span>
          <div className="flex-1">
            <p className="font-serif text-xl text-cream">
              {sign.name} in 2027 — your whole year
            </p>
            <p className="text-sm text-lav/75">
              The year&rsquo;s theme, love, money and best months — plus all twelve months, one by one.
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-goldlight shrink-0" />
        </Link>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream mb-4">
          The {sign.name} profile
        </h2>
        <p className="text-lav/85 leading-relaxed mb-6">{sign.description}</p>
        <div className="flex flex-wrap gap-2 mb-8">
          {sign.traits.map((t) => (
            <span
              key={t}
              className="px-3.5 py-1.5 rounded-full bg-goldlight/10 border border-goldlight/30 text-sm text-goldlight"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className={cardCls}>
            <h3 className="font-serif font-semibold text-lg text-cream mb-3">Strengths</h3>
            <ul className="space-y-2">
              {sign.strengths.map((s) => (
                <li key={s} className="flex gap-2.5 text-lav/85 leading-relaxed">
                  <span className="text-goldlight mt-0.5">✦</span> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className={cardCls}>
            <h3 className="font-serif font-semibold text-lg text-cream mb-3">Challenges</h3>
            <ul className="space-y-2">
              {sign.challenges.map((c) => (
                <li key={c} className="flex gap-2.5 text-lav/85 leading-relaxed">
                  <span className="text-lavdim mt-0.5">✦</span> {c}
                </li>
              ))}
            </ul>
          </div>
          <div className={cardCls}>
            <h3 className="font-serif font-semibold text-lg text-cream mb-2">{sign.name} in love</h3>
            <p className="text-lav/85 leading-relaxed">{sign.loveStyle}</p>
          </div>
          <div className={cardCls}>
            <h3 className="font-serif font-semibold text-lg text-cream mb-2">{sign.name} at work</h3>
            <p className="text-lav/85 leading-relaxed">{sign.careerStyle}</p>
          </div>
        </div>
        <p className="text-sm text-lav/75 leading-relaxed">
          Want the deep compatibility read — not just today&rsquo;s match? See how {sign.name} pairs
          with every sign in{' '}
          <Link to="/tools/zodiac-compatibility" className="text-goldlight font-medium hover:underline">
            Zodiac Compatibility
          </Link>
          , with harmony scores for all 144 pairings.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="relative bg-gradient-to-b from-night3 to-night2 rounded-3xl p-8 sm:p-10 border border-goldlight/50 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-cream mb-3">
            {sign.name}, your sign is the weather. Your birth date is the climate.
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
          {sign.name} horoscope questions
        </h2>
        <div className="space-y-4 mb-12">
          {faqs.map((f) => (
            <div key={f.q} className="bg-white/[0.04] rounded-2xl border border-white/10 p-6">
              <h3 className="font-serif font-semibold text-lg text-cream mb-2">{f.q}</h3>
              <p className="text-lav/80 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>

        <RelatedRail
          title="All twelve signs, today"
          items={SIGNS.filter((s) => s.slug !== sign.slug).map((s) => ({
            to: `/tools/daily-horoscope/${s.slug}`,
            title: s.name,
            essence: firstSentence(getDailyHoroscope(s, today).theme),
            glyph: s.glyph,
            badge: s.dates,
          }))}
          prev={{
            to: `/tools/daily-horoscope/${prevSign.slug}`,
            label: `${prevSign.glyph} ${prevSign.name}`,
          }}
          next={{
            to: `/tools/daily-horoscope/${nextSign.slug}`,
            label: `${nextSign.glyph} ${nextSign.name}`,
          }}
        />
        <p className="text-center mt-8">
          <Link
            to="/tools/daily-horoscope"
            className="text-sm text-lavdim hover:text-goldlight transition-colors"
          >
            ← Back to the daily horoscope hub
          </Link>
        </p>
      </section>
    </PublicLayout>
  );
}
