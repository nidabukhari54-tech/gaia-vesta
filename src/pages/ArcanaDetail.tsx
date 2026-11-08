import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Heart, Coins, Compass, Sparkles } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { getArcana, arcanaMeanings } from '../lib/arcana-meanings';

export function ArcanaDetail() {
  const { id } = useParams<{ id: string }>();
  const num = Number(id);

  if (!num || num < 1 || num > 22 || !arcanaMeanings[num]) {
    return <Navigate to="/arcana" replace />;
  }

  const a = getArcana(num);
  const prev = num > 1 ? getArcana(num - 1) : null;
  const next = num < 22 ? getArcana(num + 1) : null;

  return (
    <PublicLayout>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        <Link to="/arcana" className="inline-flex items-center gap-2 text-sm text-text-primary/60 hover:text-text-primary mb-8">
          <ArrowLeft className="w-4 h-4" /> All 22 arcana
        </Link>

        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-r from-gold to-purple rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-lg">
            {a.id}
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold mb-2">{a.name}</h1>
          <p className="text-lg text-text-primary/60 italic">"{a.description}"</p>
        </div>

        <div className="bg-gradient-to-r from-purple/10 to-gold/10 rounded-2xl p-6 text-center mb-8">
          <Sparkles className="w-5 h-5 text-gold mx-auto mb-2" />
          <p className="font-medium italic text-text-primary/85">"{a.affirmation}"</p>
          <p className="text-xs text-text-primary/50 mt-1">Affirmation for Arcana {a.id}</p>
        </div>

        <div className="space-y-5">
          <div className="bg-white/80 rounded-2xl p-6 border border-purple/20">
            <div className="flex items-center gap-2 mb-2">
              <Compass className="w-5 h-5 text-purple" />
              <h2 className="font-serif font-semibold text-lg">Personality</h2>
            </div>
            <p className="text-text-primary/75 leading-relaxed">{a.personality}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div className="bg-white/80 rounded-2xl p-6 border border-gold/20">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-5 h-5 text-purple" />
                <h2 className="font-serif font-semibold text-lg">In love</h2>
              </div>
              <p className="text-text-primary/75 leading-relaxed">{a.loveMeaning}</p>
            </div>
            <div className="bg-white/80 rounded-2xl p-6 border border-gold/20">
              <div className="flex items-center gap-2 mb-2">
                <Coins className="w-5 h-5 text-gold" />
                <h2 className="font-serif font-semibold text-lg">With money</h2>
              </div>
              <p className="text-text-primary/75 leading-relaxed">{a.moneyMeaning}</p>
            </div>
          </div>

          <div className="bg-white/80 rounded-2xl p-6 border border-purple/20">
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

        <div className="bg-white/70 rounded-2xl border border-gold/30 p-7 text-center mt-10">
          <h2 className="font-serif font-semibold text-xl mb-2">Where does {a.name} sit in your chart?</h2>
          <p className="text-text-primary/60 mb-5">Calculate your free Destiny Matrix and tap any node to see your own arcana in context.</p>
          <Link to="/#demo" className="inline-block px-7 py-3 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-lg transition-all">
            Calculate my chart — free
          </Link>
        </div>

        <div className="flex justify-between mt-8">
          {prev ? (
            <Link to={`/arcana/${prev.id}`} className="inline-flex items-center gap-2 text-sm font-medium text-text-primary/70 hover:text-text-primary">
              <ArrowLeft className="w-4 h-4" /> {prev.id} · {prev.name}
            </Link>
          ) : <span />}
          {next ? (
            <Link to={`/arcana/${next.id}`} className="inline-flex items-center gap-2 text-sm font-medium text-text-primary/70 hover:text-text-primary">
              {next.id} · {next.name} <ArrowRight className="w-4 h-4" />
            </Link>
          ) : <span />}
        </div>
      </section>
    </PublicLayout>
  );
}
