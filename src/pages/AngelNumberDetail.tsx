import { Link, useParams, Navigate } from 'react-router-dom';
import { Heart, Coins, ArrowRight } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { ANGEL_NUMBERS, ANGEL_NUMBER_LIST } from '../lib/numerology-meanings';
import { useEffect } from 'react';

export function AngelNumberDetail() {
  const { number } = useParams<{ number: string }>();
  const meaning = number ? ANGEL_NUMBERS[number] : undefined;

  useEffect(() => {
    if (meaning) {
      document.title = `${meaning.number} Angel Number Meaning — ${meaning.title} | Gaia Vesta`;
    }
  }, [meaning]);

  if (!meaning) {
    return <Navigate to="/tools/angel-numbers" replace />;
  }

  const others = ANGEL_NUMBER_LIST.filter((n) => n !== meaning.number);

  return (
    <PublicLayout>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-20">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-purple mb-3">Angel number meaning</p>
          <p className="text-7xl font-serif font-bold bg-gradient-to-r from-gold to-purple bg-clip-text text-transparent leading-tight">
            {meaning.number}
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold mt-2">
            {meaning.number} Angel Number — {meaning.title}
          </h1>
        </div>

        <div className="bg-gradient-to-br from-gold/12 to-purple/12 rounded-2xl border border-gold/30 p-7 mb-6">
          <h2 className="font-serif font-semibold text-xl mb-3">What does {meaning.number} mean?</h2>
          <p className="text-text-primary/80 leading-relaxed">{meaning.meaning}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          <div className="bg-white/80 rounded-2xl p-6 border border-purple/20">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-purple" />
              <h2 className="font-serif font-semibold text-lg">{meaning.number} in love</h2>
            </div>
            <p className="text-text-primary/75 leading-relaxed">{meaning.love}</p>
          </div>
          <div className="bg-white/80 rounded-2xl p-6 border border-gold/25">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-5 h-5 text-gold" />
              <h2 className="font-serif font-semibold text-lg">{meaning.number} for money & work</h2>
            </div>
            <p className="text-text-primary/75 leading-relaxed">{meaning.money}</p>
          </div>
        </div>

        <div className="bg-white/70 rounded-2xl border border-gold/25 p-7 text-center mb-10">
          <h2 className="font-serif font-semibold text-xl mb-2">Is {meaning.number} YOUR angel number?</h2>
          <p className="text-text-primary/60 mb-5 max-w-md mx-auto">
            Your birth date hides a personal angel number. Find yours — and see what it has been trying to tell you.
          </p>
          <Link
            to="/tools/angel-numbers"
            className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-lg transition-all"
          >
            Find my personal angel number <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <h2 className="font-serif font-semibold text-xl mb-4 text-center">All angel number meanings</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {others.map((n) => (
            <Link
              key={n}
              to={`/tools/angel-numbers/${n}`}
              className="px-4 py-2 rounded-full font-semibold text-sm bg-purple/10 text-text-primary hover:bg-purple/20 transition-all"
            >
              {n}
            </Link>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
