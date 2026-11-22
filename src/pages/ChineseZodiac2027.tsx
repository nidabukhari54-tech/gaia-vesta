import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Flame } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { articleSchema, breadcrumbSchema } from '../lib/schema';
import { ANIMALS, OUTLOOKS_2027, YEAR_2027 } from '../lib/chinese-zodiac';

export function ChineseZodiac2027() {
  return (
    <PublicLayout>
      <ToolHero
        image="/images/chinese-zodiac-illustration.webp"
        imageAlt="A golden celestial wheel of the twelve Chinese zodiac animals around a radiant star, on a deep indigo night sky"
        eyebrow="Chinese Zodiac · 2027 · Yin Fire Goat"
        title="2027 — Year of the Fire Goat"
        subtitle={`The Goat year begins at Chinese New Year on ${YEAR_2027.cnyDate} and runs to ${YEAR_2027.endsDate}. A year of craft, harmony and home — here is what it holds for every animal.`}
        schema={[
          articleSchema(
            '2027 — Year of the Fire Goat: Every Animal’s Outlook',
            '/tools/chinese-zodiac/2027',
            `The Goat year begins at Chinese New Year on ${YEAR_2027.cnyDate} and runs to ${YEAR_2027.endsDate}. A year of craft, harmony and home — here is what it holds for every animal.`,
          ),
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Tools', path: '/tools' },
            { name: 'Chinese Zodiac', path: '/tools/chinese-zodiac' },
            { name: '2027 Fire Goat Year', path: '/tools/chinese-zodiac/2027' },
          ]),
        ]}
      />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="relative bg-gradient-to-b from-night3 to-night2 rounded-3xl border border-goldlight/50 p-7 sm:p-9 mb-6 overflow-hidden">
          <div className="absolute -top-6 -right-2 text-[10rem] leading-none text-goldlight/[0.08] select-none pointer-events-none">羊</div>
          <p className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-goldlight mb-3">
            <Flame className="w-4 h-4" /> The year’s character
          </p>
          <div className="relative space-y-4">
            {YEAR_2027.overview.map((p) => (
              <p key={p.slice(0, 24)} className="text-lav/90 leading-relaxed">{p}</p>
            ))}
          </div>
          <div className="relative flex flex-wrap gap-2 mt-6">
            {YEAR_2027.themes.map((t) => (
              <span key={t} className="px-3.5 py-1.5 rounded-full bg-goldlight/10 border border-goldlight/30 text-sm text-goldlight">
                {t}
              </span>
            ))}
          </div>
          <p className="relative flex items-center gap-2 mt-6 text-sm text-lav/80">
            <CalendarDays className="w-4 h-4 text-goldlight shrink-0" />
            Chinese New Year: <span className="text-cream font-medium">{YEAR_2027.cnyDate}</span>
            · the Fire Goat year ends {YEAR_2027.endsDate}, when the Earth Monkey year begins.
          </p>
        </div>

        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream mb-2">Your animal in the Fire Goat year</h2>
        <p className="text-lav/70 mb-8">
          Every animal meets the Goat differently — allies are lifted, opposites are stretched, and the
          Goat itself comes home. Find yours.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {ANIMALS.map((a) => {
            const outlook = OUTLOOKS_2027[a.slug];
            return (
              <Link
                key={a.slug}
                to={`/tools/chinese-zodiac/2027/${a.slug}`}
                className="bg-white/[0.04] rounded-2xl border border-white/10 p-6 hover:border-goldlight/50 hover:shadow-[0_24px_55px_-20px_rgba(231,200,115,0.4)] transition-all group"
              >
                <div className="flex items-center gap-3.5 mb-2.5">
                  <span className="text-4xl leading-none text-goldlight/90" aria-hidden="true">{a.glyph}</span>
                  <h3 className="font-serif text-xl text-cream group-hover:text-goldlight transition-colors">
                    {a.name} in 2027
                  </h3>
                </div>
                <p className="text-sm text-lav/75 leading-relaxed mb-3">
                  {outlook ? `${outlook.theme.split('. ')[0]}.` : ''}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm text-goldlight font-medium">
                  Read your 2027 outlook <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            );
          })}
        </div>

        <p className="text-center text-sm text-lavdim mt-12">
          New to the Chinese zodiac?{' '}
          <Link to="/tools/chinese-zodiac" className="text-goldlight font-medium hover:underline">
            Find your animal from your birth date
          </Link>{' '}
          — placed by the real Chinese New Year, not by 1 January.
        </p>
      </section>
    </PublicLayout>
  );
}
