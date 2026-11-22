import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Moon } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { moonMonthDesc } from '../lib/meta';
import { faqPageSchema, webAppSchema, breadcrumbSchema } from '../lib/schema';
import { moonsInMonth } from '../lib/moons';
import { moonPhase } from '../lib/numerology';
import { formatDate } from '../lib/horoscope';
import { MONTH_NAMES } from '../lib/horoscope-2027';

// Traditional North American names for each month's full moon.
const FULL_MOON_NAMES: Record<string, string> = {
  january: 'Wolf Moon',
  february: 'Snow Moon',
  march: 'Worm Moon',
  april: 'Pink Moon',
  may: 'Flower Moon',
  june: 'Strawberry Moon',
  july: 'Buck Moon',
  august: 'Sturgeon Moon',
  september: 'Corn Moon',
  october: 'Hunter\u2019s Moon',
  november: 'Beaver Moon',
  december: 'Cold Moon',
};

const MONTH_SLUGS = MONTH_NAMES.map((m) => m.toLowerCase());

const cardCls = 'bg-white/[0.04] rounded-2xl border border-white/10 p-6';
const cardLabel =
  'flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-goldlight mb-2.5';

function joinDates(year: number, monthIndex: number, days: number[]): string {
  return days.map((d) => formatDate(new Date(year, monthIndex, d))).join(' & ');
}

export function MoonCalendarMonthPage() {
  const { month: slugParam } = useParams();
  const slug = (slugParam ?? '').toLowerCase();
  const monthIndex = MONTH_SLUGS.indexOf(slug);

  if (monthIndex < 0) {
    return <Navigate to="/tools/moon-calendar-2027" replace />;
  }

  const monthName = MONTH_NAMES[monthIndex];
  const fullMoonName = FULL_MOON_NAMES[slug];
  const moons = moonsInMonth(2027, monthIndex);
  const daysInMonth = new Date(2027, monthIndex + 1, 0).getDate();

  const quarterDays = new Map<number, string>();
  moons.newMoons.forEach((d) => quarterDays.set(d, 'New Moon'));
  moons.firstQuarters.forEach((d) => quarterDays.set(d, 'First Quarter'));
  moons.fullMoons.forEach((d) => quarterDays.set(d, 'Full Moon'));
  moons.lastQuarters.forEach((d) => quarterDays.set(d, 'Last Quarter'));

  const days = Array.from({ length: daysInMonth }, (_, k) => {
    const day = k + 1;
    const date = new Date(2027, monthIndex, day);
    const phase = moonPhase(date);
    return {
      day,
      weekday: date.toLocaleDateString('en-GB', { weekday: 'short' }),
      phaseName: phase.name,
      emoji: phase.emoji,
      illumination: Math.round(phase.illumination * 100),
      quarter: quarterDays.get(day),
    };
  });

  const faqs = [
    {
      q: `When is the full moon in ${monthName} 2027?`,
      a: `The full moon of ${monthName} 2027 falls on ${joinDates(2027, monthIndex, moons.fullMoons)}. Its traditional name is the ${fullMoonName} — one of the old North American season names that described what the land was doing under that moon. The date is calculated with our moon engine, the same astronomy behind the Moon Phase tool; an observatory calendar for a very different time zone can occasionally place it a day either side.`,
    },
    {
      q: `When is the new moon in ${monthName} 2027?`,
      a: `The new moon of ${monthName} 2027 falls on ${joinDates(2027, monthIndex, moons.newMoons)}. The month's first quarter follows on ${joinDates(2027, monthIndex, moons.firstQuarters)} and the last quarter on ${joinDates(2027, monthIndex, moons.lastQuarters)} — all four quarter dates, and the phase of every single day, are in the table on this page.`,
    },
    {
      q: 'How are these dates calculated?',
      a: 'Day by day, by us — no almanac is copied. Our engine works out the moon\u2019s age for every date from a known new moon and the moon\u2019s true cycle length (about 29.53 days), and records the day each quarter point falls on. It is a simplified model of the moon\u2019s orbit, so treat a date as accurate to the day rather than to the hour.',
    },
  ];

  const prev =
    monthIndex > 0
      ? { to: `/tools/moon-calendar-2027/${MONTH_SLUGS[monthIndex - 1]}`, label: MONTH_NAMES[monthIndex - 1] }
      : { to: '/tools/moon-calendar-2027', label: 'All of 2027' };
  const next =
    monthIndex < 11
      ? { to: `/tools/moon-calendar-2027/${MONTH_SLUGS[monthIndex + 1]}`, label: MONTH_NAMES[monthIndex + 1] }
      : { to: '/tools/moon-calendar-2027', label: 'All of 2027' };

  return (
    <PublicLayout>
      <ToolHero
        description={moonMonthDesc(monthName, fullMoonName, moons.newMoons[0], moons.fullMoons[0])}
        image="/images/moon-phase-illustration.webp"
        imageAlt="A glowing full moon rising over a calm indigo sea beneath an arc of moon phases"
        eyebrow="Moon Calendar · 2027"
        title={`${monthName} 2027 Moon Calendar`}
        subtitle={`Every moon of ${monthName} 2027: the new moon, both quarters and the ${fullMoonName} — plus the phase and illumination of every single day, calculated.`}
        schema={[
          webAppSchema(
            `${monthName} 2027 Moon Calendar`,
            `/tools/moon-calendar-2027/${slug}`,
            `Every moon of ${monthName} 2027: the new moon, both quarters and the ${fullMoonName} — plus the phase and illumination of every single day, calculated.`,
          ),
          faqPageSchema(faqs),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Tools', path: '/tools' },
            { name: 'Moon Calendar 2027', path: '/tools/moon-calendar-2027' },
            { name: `${monthName} 2027`, path: `/tools/moon-calendar-2027/${slug}` },
          ]),
        ]}
      />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <p className="text-lav/85 leading-relaxed mb-6">
          The Full Moon in {monthName} 2027 is the {fullMoonName} on{' '}
          {joinDates(2027, monthIndex, moons.fullMoons)}; the New Moon falls on{' '}
          {joinDates(2027, monthIndex, moons.newMoons)}.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className={cardCls}>
            <p className={cardLabel}>
              <Moon className="w-4 h-4" /> New Moon 🌑
            </p>
            <p className="font-serif text-xl text-cream leading-snug">
              {joinDates(2027, monthIndex, moons.newMoons)}
            </p>
            <p className="text-sm text-lav/75 leading-relaxed mt-2">
              The dark reset — the traditional moment for planting intentions quietly.
            </p>
          </div>
          <div className={cardCls}>
            <p className={cardLabel}>
              <Moon className="w-4 h-4" /> First Quarter 🌓
            </p>
            <p className="font-serif text-xl text-cream leading-snug">
              {joinDates(2027, monthIndex, moons.firstQuarters)}
            </p>
            <p className="text-sm text-lav/75 leading-relaxed mt-2">
              Half lit and pushing — the intention meets its first friction.
            </p>
          </div>
          <div className={cardCls}>
            <p className={cardLabel}>
              <Moon className="w-4 h-4" /> Full Moon 🌕 · {fullMoonName}
            </p>
            <p className="font-serif text-xl text-cream leading-snug">
              {joinDates(2027, monthIndex, moons.fullMoons)}
            </p>
            <p className="text-sm text-lav/75 leading-relaxed mt-2">
              The {fullMoonName} in full light — see what the cycle has ripened, and release what has
              peaked.
            </p>
          </div>
          <div className={cardCls}>
            <p className={cardLabel}>
              <Moon className="w-4 h-4" /> Last Quarter 🌗
            </p>
            <p className="font-serif text-xl text-cream leading-snug">
              {joinDates(2027, monthIndex, moons.lastQuarters)}
            </p>
            <p className="text-sm text-lav/75 leading-relaxed mt-2">
              The clearing — forgive, declutter and close what the cycle has finished.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream mb-2">
          {monthName} 2027, day by day
        </h2>
        <p className="text-lav/70 mb-6">
          The moon&rsquo;s phase and illumination for every day of the month — quarter days are
          marked in gold.
        </p>
        <div className="bg-white/[0.04] rounded-2xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left">
                <th className="px-5 py-3.5 text-xs font-semibold tracking-widest uppercase text-lavdim">Day</th>
                <th className="px-5 py-3.5 text-xs font-semibold tracking-widest uppercase text-lavdim">Phase</th>
                <th className="px-5 py-3.5 text-xs font-semibold tracking-widest uppercase text-lavdim text-right">Illumination</th>
              </tr>
            </thead>
            <tbody>
              {days.map((d) => (
                <tr
                  key={d.day}
                  className={`border-b border-white/[0.05] last:border-0 ${
                    d.quarter ? 'bg-goldlight/[0.07]' : ''
                  }`}
                >
                  <td className={`px-5 py-2.5 whitespace-nowrap ${d.quarter ? 'text-goldlight font-medium' : 'text-cream'}`}>
                    {d.weekday} {d.day}
                    {d.quarter && (
                      <span className="ml-2 text-[11px] font-semibold tracking-wider uppercase">
                        {d.quarter}
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-2.5 text-lav/85">
                    {d.emoji} {d.phaseName}
                  </td>
                  <td className="px-5 py-2.5 text-right text-lav/85">{d.illumination}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-lav/70 leading-relaxed mt-5">
          Want the moon for a different date — tonight, your birthday, a day that matters? The{' '}
          <Link to="/tools/moon-phase" className="text-goldlight font-medium hover:underline">
            Moon Phase tool
          </Link>{' '}
          calculates it for any day you choose.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="flex items-center justify-between gap-4">
          <Link
            to={prev.to}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.04] border border-white/10 text-sm text-lav hover:border-goldlight/50 hover:text-cream transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> {prev.label}
          </Link>
          <Link
            to={next.to}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.04] border border-white/10 text-sm text-lav hover:border-goldlight/50 hover:text-cream transition-all"
          >
            {next.label} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-serif font-bold text-cream mb-6 text-center">
          {monthName} 2027 moon questions
        </h2>
        <div className="space-y-4">
          {faqs.map((f) => (
            <div key={f.q} className="bg-white/[0.04] rounded-2xl border border-white/10 p-6">
              <h3 className="font-serif font-semibold text-lg text-cream mb-2">{f.q}</h3>
              <p className="text-lav/80 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
        <p className="text-center mt-10">
          <Link
            to="/tools/moon-calendar-2027"
            className="text-sm text-lavdim hover:text-goldlight transition-colors"
          >
            ← Back to the 2027 moon calendar
          </Link>
        </p>
      </section>
    </PublicLayout>
  );
}
