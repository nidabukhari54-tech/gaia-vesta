import { Link, Navigate, useParams } from 'react-router-dom';
import {
  ArrowRight, CalendarDays, Heart, HeartCrack, Hash, Palette, Sparkles, Sprout, AlertTriangle,
} from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { chineseAnimalDesc } from '../lib/meta';
import { articleSchema, breadcrumbSchema } from '../lib/schema';
import { ANIMALS, elementForYear, getAnimalBySlug, type ChineseAnimal } from '../lib/chinese-zodiac';

const cardCls = 'bg-white/[0.04] rounded-2xl border border-white/10 p-6';
const cardLabel =
  'flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-goldlight mb-2.5';

function animalFaqs(a: ChineseAnimal) {
  const recent = a.years.slice(-4);
  const elExamples = recent
    .map((y) => `${y} was a ${elementForYear(y).element} ${a.name}`)
    .join('; ');
  const matchNames = a.matches
    .map((s) => ANIMALS.find((x) => x.slug === s)?.name)
    .filter(Boolean)
    .join(' and ');
  const clashName = ANIMALS.find((x) => x.slug === a.clash)?.name;
  return [
    {
      q: `What years are ${a.name} years?`,
      a: `Recent ${a.name} years are ${recent.join(', ')} — and they arrive every twelve years. Remember that a ${a.name} year begins at Chinese New Year (late January to mid-February), not on 1 January, so people born in the first weeks of a ${a.name} year may actually belong to the previous animal. The finder on our Chinese Zodiac page places any birth date exactly.`,
    },
    {
      q: `Who is the ${a.name} most compatible with?`,
      a: `The ${a.name} belongs to a harmony trine with the ${matchNames} — the three animals are said to think in the same rhythm, which makes those pairings the classic best matches in love, friendship and business. The traditional difficult pairing is the ${clashName}, the ${a.name}’s opposite on the wheel: the chemistry is real, but so is the friction, and those relationships tend to demand the most honesty.`,
    },
    {
      q: `I’m a ${a.name} — what is my element?`,
      a: `It depends on which ${a.name} year you were born in, because the element changes every cycle: ${elExamples}. The full sixty-year wheel means two ${a.name}s born twelve years apart share an animal but not an element — a Fire ${a.name} and a Water ${a.name} are recognisably cousins, not twins. Enter your birth date in the finder to see your exact pairing.`,
    },
  ];
}

export function ChineseZodiacAnimalPage() {
  const { animal: slug } = useParams();
  const animal = getAnimalBySlug(slug ?? '');

  if (!animal) {
    return <Navigate to="/tools/chinese-zodiac" replace />;
  }

  const faqs = animalFaqs(animal);
  const matches = animal.matches
    .map((s) => ANIMALS.find((x) => x.slug === s))
    .filter((x): x is ChineseAnimal => Boolean(x));
  const clash = ANIMALS.find((x) => x.slug === animal.clash);
  const subtitle = `${animal.traits.split('. ')[0]}. Years, element, best matches and lucky colours — the full ${animal.name} profile.`;

  return (
    <PublicLayout>
      <ToolHero
        description={chineseAnimalDesc(animal)}
        image="/images/chinese-zodiac-illustration.webp"
        imageAlt="A golden celestial wheel of the twelve Chinese zodiac animals around a radiant star, on a deep indigo night sky"
        eyebrow={`Chinese Zodiac · ${animal.glyph} · ${animal.branchElement} branch`}
        title={`Year of the ${animal.name}`}
        subtitle={subtitle}
        schema={[
          articleSchema(
            `Year of the ${animal.name} — Traits, Years, Element & Compatibility`,
            `/tools/chinese-zodiac/${animal.slug}`,
            subtitle,
          ),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Tools', path: '/tools' },
            { name: 'Chinese Zodiac', path: '/tools/chinese-zodiac' },
            { name: `Year of the ${animal.name}`, path: `/tools/chinese-zodiac/${animal.slug}` },
          ]),
        ]}
      />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="relative bg-gradient-to-b from-night3 to-night2 rounded-3xl border border-goldlight/50 p-7 sm:p-9 mb-6 overflow-hidden">
          <div className="absolute -top-6 -right-2 text-[10rem] leading-none text-goldlight/[0.08] select-none pointer-events-none">
            {animal.glyph}
          </div>
          <p className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-goldlight mb-3">
            <Sparkles className="w-4 h-4" /> The {animal.name} character
          </p>
          <p className="relative text-lav/90 leading-relaxed text-[1.05rem]">{animal.traits}</p>
          <div className="relative flex flex-wrap gap-2 mt-6">
            <span className="px-3.5 py-1.5 rounded-full bg-goldlight/10 border border-goldlight/30 text-sm text-goldlight">
              Branch element · {animal.branchElement}
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-sm text-lav">
              Most recent year · {animal.years[animal.years.length - 1] > 2026 ? animal.years[animal.years.length - 2] : animal.years[animal.years.length - 1]}
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-sm text-lav">
              Next year · {animal.years.find((y) => y > 2026)}
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className={cardCls}>
            <p className={cardLabel}>
              <Sprout className="w-4 h-4" /> Strengths
            </p>
            <ul className="space-y-2">
              {animal.strengths.map((s) => (
                <li key={s} className="text-lav/85 flex items-start gap-2">
                  <span className="text-goldlight mt-0.5">✦</span> {s}
                </li>
              ))}
            </ul>
          </div>
          <div className={cardCls}>
            <p className={cardLabel}>
              <AlertTriangle className="w-4 h-4" /> Growth edges
            </p>
            <ul className="space-y-2">
              {animal.challenges.map((c) => (
                <li key={c} className="text-lav/85 flex items-start gap-2">
                  <span className="text-goldlight mt-0.5">✦</span> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`${cardCls} mb-4`}>
          <p className={cardLabel}>
            <Sparkles className="w-4 h-4" /> The {animal.name} element
          </p>
          <p className="text-lav/85 leading-relaxed">{animal.elementNote}</p>
        </div>

        <div className={`${cardCls} mb-4`}>
          <p className={cardLabel}>
            <CalendarDays className="w-4 h-4" /> {animal.name} years — and the element of each
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {animal.years.map((y) => {
              const { element, polarity } = elementForYear(y);
              return (
                <div key={y} className="rounded-xl bg-night2/70 border border-white/[0.07] px-3.5 py-2.5 text-center">
                  <span className="font-serif text-cream">{y}</span>
                  <span className="block text-xs text-lavdim">{element} · {polarity}</span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-lavdim mt-3.5">
            Each {animal.name} year begins at Chinese New Year of that year — between late January and
            mid-February — not on 1 January.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className={cardCls}>
            <p className={cardLabel}>
              <Heart className="w-4 h-4" /> Best matches
            </p>
            <div className="space-y-3">
              {matches.map((m) => (
                <Link
                  key={m.slug}
                  to={`/tools/chinese-zodiac/${m.slug}`}
                  className="flex items-center gap-3 group"
                >
                  <span className="text-3xl text-goldlight/90" aria-hidden="true">{m.glyph}</span>
                  <span>
                    <span className="block font-serif text-cream group-hover:text-goldlight transition-colors">
                      The {m.name}
                    </span>
                    <span className="block text-xs text-lavdim">Same harmony trine — an easy, lasting rhythm</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className={cardCls}>
            <p className={cardLabel}>
              <HeartCrack className="w-4 h-4" /> The clash
            </p>
            {clash && (
              <Link to={`/tools/chinese-zodiac/${clash.slug}`} className="flex items-center gap-3 group">
                <span className="text-3xl text-goldlight/90" aria-hidden="true">{clash.glyph}</span>
                <span>
                  <span className="block font-serif text-cream group-hover:text-goldlight transition-colors">
                    The {clash.name}
                  </span>
                  <span className="block text-xs text-lavdim">
                    Your opposite on the wheel — sparks and friction in equal measure; honesty is the price of peace
                  </span>
                </span>
              </Link>
            )}
            <div className="mt-5 pt-5 border-t border-white/[0.07] grid grid-cols-2 gap-4">
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-goldlight mb-1.5">
                  <Hash className="w-3.5 h-3.5" /> Lucky numbers
                </p>
                <p className="font-serif text-xl text-cream">{animal.luckyNumbers.join(' · ')}</p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-goldlight mb-1.5">
                  <Palette className="w-3.5 h-3.5" /> Lucky colours
                </p>
                <p className="text-lav/85">{animal.luckyColours.join(', ')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="flex flex-wrap gap-3 mb-4">
          <Link
            to={`/tools/chinese-zodiac/2027/${animal.slug}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.04] border border-goldlight/40 text-goldlight font-medium hover:bg-goldlight/10 transition-all"
          >
            The {animal.name} in 2027 — your Fire Goat year <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/tools/chinese-zodiac"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.04] border border-white/15 text-lav font-medium hover:border-goldlight/40 hover:text-cream transition-all"
          >
            Find another animal
          </Link>
        </div>

        <div className="relative bg-gradient-to-b from-night3 to-night2 rounded-3xl p-8 sm:p-10 border border-goldlight/50 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-cream mb-3">
            Your animal is your generation. Your Matrix is you.
          </h2>
          <p className="text-lav/85 leading-relaxed max-w-2xl mx-auto mb-7">
            Everyone born in a {animal.name} year shares this profile. Your Destiny Matrix chart is
            calculated from your exact birth date — no one born on a different day has it — and it maps
            your soul purpose, love line, money line and karmic tail.
          </p>
          <Link
            to="/#demo"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 font-semibold rounded-full hover:shadow-[0_0_28px_rgba(231,200,115,0.5)] transition-all"
          >
            Meet your Destiny Matrix — free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <h2 className="text-2xl font-serif font-bold text-cream mb-6 text-center">
          {animal.name} questions
        </h2>
        <div className="space-y-4 mb-12">
          {faqs.map((f) => (
            <div key={f.q} className="bg-white/[0.04] rounded-2xl border border-white/10 p-6">
              <h3 className="font-serif font-semibold text-lg text-cream mb-2">{f.q}</h3>
              <p className="text-lav/80 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>

        <h3 className="font-serif font-semibold text-lg text-cream mb-4 text-center">All twelve animals</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {ANIMALS.map((a) => (
            <Link
              key={a.slug}
              to={`/tools/chinese-zodiac/${a.slug}`}
              className={`px-4 py-2 rounded-full border text-sm transition-all ${
                a.slug === animal.slug
                  ? 'bg-goldlight/15 border-goldlight/60 text-goldlight font-semibold'
                  : 'bg-white/[0.04] border-white/10 text-lav hover:border-goldlight/50 hover:text-cream'
              }`}
            >
              {a.glyph} {a.name}
            </Link>
          ))}
        </div>
        <p className="text-center mt-8">
          <Link to="/tools/chinese-zodiac" className="text-sm text-lavdim hover:text-goldlight transition-colors">
            ← Back to the Chinese Zodiac hub
          </Link>
        </p>
      </section>
    </PublicLayout>
  );
}
