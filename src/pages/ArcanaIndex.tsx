import { Link } from 'react-router-dom';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { arcanaMeanings } from '../lib/arcana-meanings';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI', '0'];

export function ArcanaIndex() {
  const all = Object.values(arcanaMeanings).sort((a, b) => a.id - b.id);

  return (
    <PublicLayout>
      <ToolHero
        eyebrow="The guide"
        title="The 22 Major Arcana, explained"
        subtitle="Every number in your Destiny Matrix is one of these 22 archetypes. Read them all — personality, love, money, karmic lessons, strengths and shadows."
      />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {all.map((a) => (
            <Link
              key={a.id}
              to={`/arcana/${a.id}`}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gold/20 hover:border-gold/50 hover:shadow-lg transition-all group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-gold to-purple rounded-full flex items-center justify-center text-white font-bold group-hover:scale-110 transition-transform">
                  {a.id}
                </div>
                <span className="text-xs font-serif text-text-primary/40">{ROMAN[a.id - 1] ?? a.id}</span>
              </div>
              <h2 className="font-serif font-semibold text-lg text-text-primary mb-1">{a.name}</h2>
              <p className="text-sm text-text-primary/60 italic">"{a.description}"</p>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {a.strengths.slice(0, 3).map((s) => (
                  <span key={s} className="text-[11px] bg-green-50 text-green-700 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
