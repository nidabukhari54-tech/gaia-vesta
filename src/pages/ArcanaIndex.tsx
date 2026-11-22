import { Link } from 'react-router-dom';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { DESC } from '../lib/meta';
import { webPageSchema, breadcrumbSchema } from '../lib/schema';
import { arcanaMeanings } from '../lib/arcana-meanings';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI', '0'];

export function ArcanaIndex() {
  const all = Object.values(arcanaMeanings).sort((a, b) => a.id - b.id);

  return (
    <PublicLayout>
      <ToolHero
        description={DESC.arcanaIndex}
        eyebrow="The guide"
        title="The 22 Major Arcana, explained"
        subtitle="Every number in your Destiny Matrix is one of these 22 archetypes. Read them all — personality, love, money, karmic lessons, strengths and shadows."
        schema={[webPageSchema('The 22 Major Arcana, explained', '/arcana', "Every number in your Destiny Matrix is one of these 22 archetypes. Read them all — personality, love, money, karmic lessons, strengths and shadows."), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Arcana Guide', path: '/arcana' }])]}
      />
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <p className="text-lav/85 leading-relaxed mb-4">
          These are the major arcana meanings as two traditions read them. In tarot, the 22 Major
          Arcana are the great turning points of a reading — the cards of fate, character and life
          lessons, and the heart of every guide to tarot card meanings. In the Destiny Matrix, the
          same 22 arcana are the building blocks of the chart calculated from your birth date: every
          point in your matrix — centre, love line, money line, karmic tail — is one of these
          archetypes, fixed for life.
        </p>
        <p className="text-lav/85 leading-relaxed">
          Open any card for its full meaning: what it says about personality, how it behaves in love
          and with money, the karmic lesson it carries, and the strengths and shadows it brings with
          it. If you already know your chart, start with the arcana at your centre. If you
          don&rsquo;t, calculate it free and come back to read yourself, point by point.
        </p>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {all.map((a) => (
            <Link
              key={a.id}
              to={`/arcana/${a.id}`}
              className="bg-white/[0.04] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-goldlight/50 hover:shadow-lg transition-all group"
            >
              <div className="-mx-6 -mt-6 mb-5 overflow-hidden rounded-t-2xl">
                <img
                  src={`/images/arcana-${a.id}.webp`}
                  alt={a.name}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-gold to-purple rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                  {a.id}
                </div>
                <span className="text-xs font-serif text-lavdim">{ROMAN[a.id - 1] ?? a.id}</span>
              </div>
              <h2 className="font-serif font-semibold text-lg text-cream mb-1">{a.name}</h2>
              <p className="text-sm text-lav/70 italic">"{a.description}"</p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {a.strengths.slice(0, 3).map((s) => (
                  <span key={s} className="text-[11px] bg-white/[0.06] border border-white/10 text-lav px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
