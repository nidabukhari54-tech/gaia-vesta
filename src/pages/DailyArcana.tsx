import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sparkles } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { ArcanaModal, type SelectedArcana } from '../components/chart/ArcanaModal';
import { dailyArcana, moonPhase } from '../lib/numerology';
import { getArcana } from '../lib/arcana-meanings';

export function DailyArcana() {
  const today = new Date();
  const arcana = getArcana(dailyArcana(today));
  const moon = moonPhase(today);
  const [selected, setSelected] = useState<SelectedArcana | null>(null);

  const yesterday = getArcana(dailyArcana(new Date(today.getTime() - 86400000)));
  const tomorrow = getArcana(dailyArcana(new Date(today.getTime() + 86400000)));

  return (
    <PublicLayout>
      <ToolHero
        eyebrow="Daily guidance"
        title="Arcana of the Day"
        subtitle="Every date carries an arcana of its own. This is today's — drawn from the date itself, the same for everyone, and different tomorrow."
      />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gold/25 shadow-xl p-8 text-center mb-6">
          <p className="text-sm text-text-primary/55 mb-4">
            {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            {' '}· Moon: {moon.emoji} {moon.name}
          </p>
          <button
            onClick={() => setSelected({ position: 'Arcana of the Day', arcana })}
            className="block mx-auto group"
          >
            <div className="w-28 h-28 bg-gradient-to-r from-gold to-purple rounded-full flex items-center justify-center text-white text-5xl font-bold mx-auto shadow-lg group-hover:scale-105 transition-transform">
              {arcana.id}
            </div>
          </button>
          <h2 className="text-3xl font-serif font-bold mt-5 mb-2">{arcana.name}</h2>
          <p className="text-lg text-text-primary/60 italic mb-5">"{arcana.description}"</p>
          <p className="text-text-primary/78 leading-relaxed max-w-xl mx-auto mb-5">{arcana.personality}</p>
          <div className="bg-gradient-to-r from-purple/10 to-gold/10 rounded-xl p-4 max-w-xl mx-auto mb-6">
            <p className="italic font-medium text-text-primary/85">"{arcana.affirmation}"</p>
            <p className="text-xs text-text-primary/50 mt-1">Today's affirmation</p>
          </div>
          <button
            onClick={() => setSelected({ position: 'Arcana of the Day', arcana })}
            className="px-6 py-3 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-lg transition-all"
          >
            Read the full interpretation
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-white/60 rounded-2xl border border-purple/15 p-5 text-center">
            <p className="text-xs font-semibold tracking-widest uppercase text-text-primary/45 mb-1.5">Yesterday</p>
            <p className="font-serif font-semibold">{yesterday.id} · {yesterday.name}</p>
          </div>
          <div className="bg-white/60 rounded-2xl border border-purple/15 p-5 text-center">
            <p className="text-xs font-semibold tracking-widest uppercase text-text-primary/45 mb-1.5">Tomorrow</p>
            <p className="font-serif font-semibold">{tomorrow.id} · {tomorrow.name}</p>
          </div>
        </div>

        <div className="bg-white/70 rounded-2xl border border-gold/25 p-7 text-center">
          <Moon className="w-7 h-7 text-purple mx-auto mb-2" />
          <h2 className="font-serif font-semibold text-xl mb-2">Your personal daily number is different</h2>
          <p className="text-text-primary/60 mb-5 max-w-md mx-auto">
            The Arcana of the Day is collective. Your <em>Personal Day</em> number is yours alone — see both, every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/tools/personal-year" className="px-6 py-3 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-lg transition-all">
              My Personal Day number
            </Link>
            <Link to="/#demo" className="px-6 py-3 bg-white/80 border border-gold/40 text-text-primary font-medium rounded-xl hover:border-gold transition-all inline-flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" /> My full Destiny Matrix
            </Link>
          </div>
        </div>
      </section>

      <ArcanaModal selected={selected} onClose={() => setSelected(null)} />
    </PublicLayout>
  );
}
