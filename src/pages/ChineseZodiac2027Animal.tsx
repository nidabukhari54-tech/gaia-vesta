import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight, Briefcase, Heart, Sparkles, Sprout } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { RelatedRail, firstSentence } from '../components/RelatedRail';
import { chinese2027Desc } from '../lib/meta';
import { articleSchema, breadcrumbSchema } from '../lib/schema';
import { ANIMALS, YEAR_2027, getAnimalBySlug, getOutlook2027 } from '../lib/chinese-zodiac';

const cardCls = 'bg-white/[0.04] rounded-2xl border border-white/10 p-6';
const cardLabel =
  'flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-goldlight mb-2.5';

export function ChineseZodiac2027AnimalPage() {
  const { animal: slug } = useParams();
  const animal = getAnimalBySlug(slug ?? '');
  const outlook = animal ? getOutlook2027(animal.slug) : undefined;

  if (!animal || !outlook) {
    return <Navigate to="/tools/chinese-zodiac/2027" replace />;
  }

  const faqs = [
    {
      q: `Is 2027 a good year for the ${animal.name}?`,
      a: `${outlook.theme.split('. ')[0]}. Like every outlook here, read it as weather rather than fate — a climate to dress for. The Fire Goat year generally favours patience, craft and kindness; how it treats the ${animal.name} specifically is in the reading above.`,
    },
    {
      q: 'When does the 2027 Fire Goat year start and end?',
      a: `The Fire Goat year begins at Chinese New Year on ${YEAR_2027.cnyDate} and ends on ${YEAR_2027.endsDate}, when the Earth Monkey year begins. Anyone born before ${YEAR_2027.cnyDate} belongs to the Fire Horse year of 2026, not to the Goat.`,
    },
  ];

  const subtitle = `${outlook.theme.split('. ')[0]}. The ${animal.name}’s love, career and wellbeing in the Fire Goat year.`;

  return (
    <PublicLayout>
      <ToolHero
        description={chinese2027Desc(animal)}
        image="/images/chinese-zodiac-illustration.webp"
        imageAlt="A golden celestial wheel of the twelve Chinese zodiac animals around a radiant star, on a deep indigo night sky"
        eyebrow={`Chinese Zodiac · ${animal.glyph} ${animal.name} · 2027 Fire Goat Year`}
        title={`The ${animal.name} in 2027`}
        subtitle={subtitle}
        schema={[
          articleSchema(
            `The ${animal.name} in 2027 — Fire Goat Year Outlook`,
            `/tools/chinese-zodiac/2027/${animal.slug}`,
            subtitle,
          ),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Tools', path: '/tools' },
            { name: 'Chinese Zodiac', path: '/tools/chinese-zodiac' },
            { name: '2027 Fire Goat Year', path: '/tools/chinese-zodiac/2027' },
            { name: `${animal.name} in 2027`, path: `/tools/chinese-zodiac/2027/${animal.slug}` },
          ]),
        ]}
      />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="relative bg-gradient-to-b from-night3 to-night2 rounded-3xl border border-goldlight/50 p-7 sm:p-9 mb-6 overflow-hidden">
          <div className="absolute -top-6 -right-2 text-[10rem] leading-none text-goldlight/[0.08] select-none pointer-events-none">
            {animal.glyph}
          </div>
          <p className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-goldlight mb-3">
            <Sparkles className="w-4 h-4" /> {animal.name} · Your 2027 theme
          </p>
          <p className="relative text-lav/90 leading-relaxed text-[1.05rem]">{outlook.theme}</p>
          <div className="relative flex flex-wrap gap-2 mt-6">
            <span className="px-3.5 py-1.5 rounded-full bg-goldlight/10 border border-goldlight/30 text-sm text-goldlight">
              Year · Yin Fire Goat
            </span>
            <span className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-sm text-lav">
              {YEAR_2027.cnyDate} — {YEAR_2027.endsDate}
            </span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          <div className={cardCls}>
            <p className={cardLabel}>
              <Heart className="w-4 h-4" /> Love in 2027
            </p>
            <p className="text-lav/85 leading-relaxed">{outlook.love}</p>
          </div>
          <div className={cardCls}>
            <p className={cardLabel}>
              <Briefcase className="w-4 h-4" /> Career &amp; money in 2027
            </p>
            <p className="text-lav/85 leading-relaxed">{outlook.career}</p>
          </div>
        </div>
        <div className={`${cardCls} mb-10`}>
          <p className={cardLabel}>
            <Sprout className="w-4 h-4" /> Wellbeing in 2027
          </p>
          <p className="text-lav/85 leading-relaxed">{outlook.wellbeing}</p>
        </div>

        <div className="flex flex-wrap gap-3 mb-4">
          <Link
            to={`/tools/chinese-zodiac/${animal.slug}`}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.04] border border-goldlight/40 text-goldlight font-medium hover:bg-goldlight/10 transition-all"
          >
            The full {animal.name} profile — traits, years & matches <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/tools/chinese-zodiac/2027"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/[0.04] border border-white/15 text-lav font-medium hover:border-goldlight/40 hover:text-cream transition-all"
          >
            All animals in 2027
          </Link>
        </div>

        <div className="relative bg-gradient-to-b from-night3 to-night2 rounded-3xl p-8 sm:p-10 border border-goldlight/50 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-cream mb-3">
            The year is shared. Your chart is not.
          </h2>
          <p className="text-lav/85 leading-relaxed max-w-2xl mx-auto mb-7">
            Every {animal.name} reads this same 2027 outlook. Your Destiny Matrix chart is calculated
            from your exact birth date and maps your soul purpose, love line, money line and karmic
            tail — in the Goat year and every year after it.
          </p>
          <Link
            to="/#demo"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 font-semibold rounded-full hover:shadow-[0_0_28px_rgba(231,200,115,0.5)] transition-all"
          >
            Calculate your Destiny Matrix chart — free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <h2 className="text-2xl font-serif font-bold text-cream mb-6 text-center">
          {animal.name} in 2027 — questions
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
          title="All twelve animals in 2027"
          items={ANIMALS.filter((a) => a.slug !== animal.slug).map((a) => ({
            to: `/tools/chinese-zodiac/2027/${a.slug}`,
            title: `The ${a.name} in 2027`,
            essence: firstSentence(getOutlook2027(a.slug)?.theme ?? ''),
            glyph: a.glyph,
            badge: 'Fire Goat year',
          }))}
          prev={{
            to: `/tools/chinese-zodiac/2027/${ANIMALS[(ANIMALS.indexOf(animal) + 11) % 12].slug}`,
            label: `The ${ANIMALS[(ANIMALS.indexOf(animal) + 11) % 12].name} in 2027`,
          }}
          next={{
            to: `/tools/chinese-zodiac/2027/${ANIMALS[(ANIMALS.indexOf(animal) + 1) % 12].slug}`,
            label: `The ${ANIMALS[(ANIMALS.indexOf(animal) + 1) % 12].name} in 2027`,
          }}
        />
        <p className="text-center mt-8">
          <Link to="/tools/chinese-zodiac/2027" className="text-sm text-lavdim hover:text-goldlight transition-colors">
            ← Back to the 2027 Fire Goat hub
          </Link>
        </p>
      </section>
    </PublicLayout>
  );
}
