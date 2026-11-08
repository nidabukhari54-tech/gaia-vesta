import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Type, Sparkles } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { nameNumbers } from '../lib/numerology';
import { NAME_NUMBER_TITLES, nameNumberBlurb } from '../lib/numerology-meanings';

export function NameNumerology() {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ReturnType<typeof nameNumbers>>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const r = nameNumbers(name);
    if (!r) {
      setError('Please enter your full name (first and last) using letters A–Z.');
      setResult(null);
      return;
    }
    setResult(r);
  };

  const cards = result
    ? [
        { kind: 'expression' as const, label: 'Expression / Destiny', value: result.expression, note: 'All letters — your talents and direction' },
        { kind: 'soulUrge' as const, label: 'Soul Urge / Heart\'s Desire', value: result.soulUrge, note: 'Vowels only — what your heart truly wants' },
        { kind: 'personality' as const, label: 'Personality', value: result.personality, note: 'Consonants only — the face the world meets' },
      ]
    : [];

  return (
    <PublicLayout>
      <ToolHero
        eyebrow="Numerology · Name numbers"
        title="Name Numerology Calculator"
        subtitle="Your name is a number in disguise. One form reveals three: your Expression (talents), Soul Urge (heart's desire) and Personality (outer self) — using the Pythagorean system."
      />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow border border-purple/20 mb-8">
          <label htmlFor="fullname" className="block text-sm font-medium text-text-primary mb-2">
            Your full birth name
          </label>
          <input
            id="fullname"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Ayesha Khan"
            className="w-full px-4 py-3 bg-white/80 border border-purple/30 rounded-lg text-text-primary placeholder:text-text-primary/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all mb-4"
          />
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">{error}</div>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Type className="w-5 h-5" /> Decode my name
          </button>
          <p className="text-xs text-text-primary/45 mt-3 text-center">
            Use the name on your birth certificate for the classic reading — it never leaves your browser.
          </p>
        </form>

        {result && (
          <div className="animate-fadeIn space-y-5">
            {cards.map((c) => (
              <div key={c.kind} className="bg-white/80 rounded-2xl p-6 border border-gold/20 flex gap-5">
                <div className="shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-r from-gold to-purple rounded-full flex items-center justify-center text-white text-2xl font-bold shadow">
                    {c.value}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-wide uppercase text-purple">{c.label}</p>
                  <h3 className="font-serif font-semibold text-xl mb-1">{NAME_NUMBER_TITLES[c.value] ?? ''}</h3>
                  <p className="text-xs text-text-primary/50 mb-2">{c.note}</p>
                  <p className="text-sm text-text-primary/75 leading-relaxed">{nameNumberBlurb(c.kind, c.value)}</p>
                </div>
              </div>
            ))}

            <div className="text-center pt-2">
              <Link
                to="/#demo"
                className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-lg transition-all"
              >
                <Sparkles className="w-5 h-5" /> Now see your Destiny Matrix — free
              </Link>
            </div>
          </div>
        )}
      </section>
    </PublicLayout>
  );
}
