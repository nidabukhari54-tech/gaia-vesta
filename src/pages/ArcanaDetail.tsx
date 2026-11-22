import { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Heart, Coins, Compass, Sparkles } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { RelatedRail } from '../components/RelatedRail';
import { articleSchema, breadcrumbSchema } from '../lib/schema';
import { getArcana, arcanaMeanings } from '../lib/arcana-meanings';
import { arcanaPageTitle, arcanaDesc } from '../lib/meta';

export function ArcanaDetail() {
  const { id } = useParams<{ id: string }>();
  const num = Number(id);

  if (!num || num < 1 || num > 22 || !arcanaMeanings[num]) {
    return <Navigate to="/arcana" replace />;
  }

  const a = getArcana(num);
  const prev = num > 1 ? getArcana(num - 1) : null;
  const next = num < 22 ? getArcana(num + 1) : null;

  useEffect(() => {
    document.title = arcanaPageTitle(a.name);
  }, [a.name]);

  return (
    <PublicLayout
      description={arcanaDesc(a)}
      schema={[
        articleSchema(a.name, `/arcana/${a.id}`, a.description),
        breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Arcana Guide', path: '/arcana' },
          { name: a.name, path: `/arcana/${a.id}` },
        ]),
      ]}
    >
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        <Link to="/arcana" className="inline-flex items-center gap-2 text-sm text-lavdim hover:text-cream mb-8">
          <ArrowLeft className="w-4 h-4" /> All 22 arcana
        </Link>

        <div className="text-center mb-10">
          <div className="relative max-w-md mx-auto mb-9">
            <div className="absolute -inset-8 bg-gold/[0.20] rounded-full blur-3xl pointer-events-none" />
            <div className="relative animate-breathe">
              <img
                src={`/images/arcana-${a.id}.webp`}
                alt={`${a.name} — Destiny Matrix arcana illustration`}
                decoding="async"
                className="w-full h-72 sm:h-80 object-cover [mask-image:radial-gradient(ellipse_88%_84%_at_50%_46%,black_56%,transparent_98%)]"
              />
            </div>
            <div className="absolute bottom-1 left-5 w-16 h-16 rounded-full bg-[radial-gradient(circle_at_35%_35%,#F6E3AC,#C9963C)] ring-4 ring-night flex items-center justify-center shadow-[0_0_26px_rgba(231,200,115,0.5)]">
              <span className="font-serif text-2xl font-semibold text-night3">{a.id}</span>
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-cream mb-2">{a.name}</h1>
          <p className="text-lg text-lav/75 italic">"{a.description}"</p>
        </div>

        <div className="bg-gradient-to-r from-purple/10 to-gold/10 rounded-2xl p-6 text-center mb-8">
          <Sparkles className="w-5 h-5 text-gold mx-auto mb-2" />
          <p className="font-medium italic text-cream">"{a.affirmation}"</p>
          <p className="text-xs text-lavdim mt-1">Affirmation for Arcana {a.id}</p>
        </div>

        <div className="space-y-5">
          <div className="bg-white/80 rounded-2xl p-6 border border-gold/25 text-text-primary">
            <h2 className="font-serif font-semibold text-lg mb-2">The {a.name} tarot meaning</h2>
            <p className="text-text-primary/75 leading-relaxed mb-4">
              In tarot, {a.name} is the card of {a.description.charAt(0).toLowerCase() + a.description.slice(1)}.
              The {a.name} tarot meaning centres on {a.strengths[0].toLowerCase()} and{' '}
              {a.strengths[1].toLowerCase()} — the upright message readers look for when this card
              turns up in a spread, and the energy it asks the querent to work with.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 text-sm mb-4">
              <p className="bg-green-50 rounded-lg p-3">
                <span className="font-semibold text-green-700">Upright keywords:</span>{' '}
                {a.strengths.join(' · ')}
              </p>
              <p className="bg-red-50 rounded-lg p-3">
                <span className="font-semibold text-red-600">Shadow keywords:</span>{' '}
                {a.challenges.join(' · ')}
              </p>
            </div>
            <p className="text-text-primary/75 leading-relaxed">
              The Destiny Matrix reads the same arcana through a different lens: not as an answer
              drawn for a question, but as one of the 22 arcana fixed in the chart calculated from
              your birth date — where {a.name} colours your personality, your love line and your
              money line for life. The sections below give that reading.
            </p>
          </div>

          <div className="bg-white/80 rounded-2xl p-6 border border-purple/20 text-text-primary">
            <div className="flex items-center gap-2 mb-2">
              <Compass className="w-5 h-5 text-purple" />
              <h2 className="font-serif font-semibold text-lg">Personality</h2>
            </div>
            <p className="text-text-primary/75 leading-relaxed">{a.personality}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white/80 rounded-2xl p-6 border border-gold/20 text-text-primary">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-purple" />
                <h2 className="font-serif font-semibold text-lg">In love</h2>
              </div>
              <p className="text-text-primary/75 leading-relaxed">{a.loveMeaning}</p>
            </div>
            <div className="bg-white/80 rounded-2xl p-6 border border-gold/20 text-text-primary">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-5 h-5 text-gold" />
                <h2 className="font-serif font-semibold text-lg">With money</h2>
              </div>
              <p className="text-text-primary/75 leading-relaxed">{a.moneyMeaning}</p>
            </div>
          </div>

          <div className="bg-white/80 rounded-2xl p-6 border border-purple/20 text-text-primary">
            <h2 className="font-serif font-semibold text-lg mb-2">Karmic lesson</h2>
            <p className="text-text-primary/75 leading-relaxed">{a.karmicLesson}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
              <h2 className="font-serif font-semibold text-lg text-green-800 mb-3">Strengths</h2>
              <ul className="space-y-2">
                {a.strengths.map((s) => (
                  <li key={s} className="text-green-700 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
              <h2 className="font-serif font-semibold text-lg text-red-800 mb-3">Challenges</h2>
              <ul className="space-y-2">
                {a.challenges.map((c) => (
                  <li key={c} className="text-red-700 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full" /> {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white/[0.04] rounded-2xl border border-goldlight/30 p-7 text-center mt-10">
          <h2 className="font-serif font-semibold text-xl text-cream mb-2">Where does {a.name} sit in your chart?</h2>
          <p className="text-lav/70 mb-5">Calculate your free Destiny Matrix and tap any node to see your own arcana in context.</p>
          <Link to="/#demo" className="inline-block px-7 py-3 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-lg transition-all">
            Calculate my chart — free
          </Link>
        </div>

        <div className="mt-14">
          <RelatedRail
            title="Every other arcana"
            items={Object.values(arcanaMeanings)
              .filter((x) => x.id !== num)
              .map((x) => ({
                to: `/arcana/${x.id}`,
                title: x.name,
                essence: x.description,
                image: `/images/arcana-${x.id}.webp`,
                imageAlt: `${x.name} — Destiny Matrix arcana illustration`,
                badge: `Arcana ${x.id}`,
              }))}
          />
        </div>

        <div className="flex justify-between mt-8">
          {prev ? (
            <Link to={`/arcana/${prev.id}`} className="inline-flex items-center gap-2 text-sm font-medium text-lav/80 hover:text-cream">
              <ArrowLeft className="w-4 h-4" /> {prev.id} · {prev.name}
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`/arcana/${next.id}`} className="inline-flex items-center gap-2 text-sm font-medium text-lav/80 hover:text-cream">
              {next.id} · {next.name} <ArrowRight className="w-4 h-4" />
            </Link>
          ) : <span />}
        </div>
      </section>
    </PublicLayout>
  );
}
