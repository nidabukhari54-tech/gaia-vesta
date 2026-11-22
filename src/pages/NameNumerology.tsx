import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Type, Sparkles } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { DESC } from '../lib/meta';
import { faqPageSchema, webAppSchema, toolBreadcrumb } from '../lib/schema';
import { nameNumbers } from '../lib/numerology';
import { NAME_NUMBER_TITLES, nameNumberBlurb, LIFE_PATH_MEANINGS } from '../lib/numerology-meanings';

const EXPRESSION_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33];

const FAQS = [
  {
    q: 'Which name should I use — birth name or current name?',
    a: 'For the classic reading, use your full birth name exactly as it was first given — that is the name the traditional system reads as your blueprint. If you have married, changed your name, or simply go by another name, run that too: many readers treat the current name as a later layer that describes the self you have grown into, while the birth name stays the root.',
  },
  {
    q: 'How are the three name numbers different?',
    a: 'The Expression number uses every letter and describes your natural talents and direction — what you are equipped to do. The Soul Urge uses only vowels and describes your inner motivation — what you secretly want. The Personality number uses only consonants and describes the surface others meet first. A full reading holds all three together; they often explain why you can seem one way and feel another.',
  },
  {
    q: 'What if my number is 11, 22 or 33?',
    a: 'Those are the Master Numbers, and this calculator never reduces them away. They carry the meaning of their root (2, 4 and 6) at higher voltage — more intuition, more capacity, and usually more internal pressure. Read both the master meaning and the root meaning; most people live somewhere between the two.',
  },
  {
    q: 'Can a name number change my fate?',
    a: 'No — and be wary of anyone who sells that idea. Name numerology describes tendencies, talents and friction points; it does not override your choices. Think of the three numbers as the instruments you were handed. What music you make with them is still yours.',
  },
];

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
        description={DESC.nameNumerology}
        image="/images/name-numerology-illustration.webp"
        imageAlt="An open ancient book with golden light and sparkles swirling up from its glowing pages"
        eyebrow="Numerology · Name numbers"
        title="Name Numerology Calculator"
        subtitle="Your name is a number in disguise. One form reveals three: your Expression (talents), Soul Urge (heart's desire) and Personality (outer self) — using the Pythagorean system."
        schema={[webAppSchema('Name Numerology Calculator', '/tools/name-numerology', "Your name is a number in disguise. One form reveals three: your Expression (talents), Soul Urge (heart's desire) and Personality (outer self) — using the Pythagorean system."), faqPageSchema(FAQS), toolBreadcrumb('Name Numerology Calculator', '/tools/name-numerology')]}
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
              <div key={c.kind} className="bg-white/80 rounded-2xl p-6 border border-gold/20 flex gap-5 text-text-primary">
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
                  <p className="text-sm text-text-primary/60 leading-relaxed mt-2">
                    <strong className="text-text-primary/75">Strengths:</strong> {LIFE_PATH_MEANINGS[c.value]?.strengths.join(', ') ?? ''}
                    {'  ·  '}
                    <strong className="text-text-primary/75">Watch for:</strong> {LIFE_PATH_MEANINGS[c.value]?.challenges.join(', ') ?? ''}
                  </p>
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

        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-cream mb-3 text-center">A worked example</h2>
          <p className="text-lav/75 leading-relaxed max-w-2xl mx-auto text-center mb-6">
            Take the name <strong className="text-cream">Ayesha Khan</strong>. In the Pythagorean system every letter
            carries a number — A=1, B=2, C=3, on through I=9, then the pattern repeats (J=1, K=2 …).
          </p>
          <div className="bg-white/[0.04] rounded-2xl border border-white/10 p-6 max-w-2xl mx-auto">
            <ul className="space-y-2.5 text-lav/85 leading-relaxed">
              <li><strong className="text-cream">Every letter:</strong> A(1) Y(7) E(5) S(1) H(8) A(1) K(2) H(8) A(1) N(5) = 39 → 3+9 = 12 → 1+2 = <strong className="text-cream">Expression 3, The Expressive</strong> — talents built on voice, ideas and creative communication.</li>
              <li><strong className="text-cream">Vowels only:</strong> A(1) E(5) A(1) A(1) = 8 → <strong className="text-cream">Soul Urge 8</strong> — underneath, the heart wants achievement, security and results it can point to.</li>
              <li><strong className="text-cream">Consonants only:</strong> Y(7) S(1) H(8) K(2) H(8) N(5) = 31 → 3+1 = <strong className="text-cream">Personality 4</strong> — the face the world meets first is steady, capable and grounded.</li>
              <li>Read together: a grounded exterior (4), a creative gift (3), and an ambitious heart (8) quietly steering both.</li>
            </ul>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-cream mb-3 text-center">Every Expression number, explained</h2>
          <p className="text-lav/70 text-center max-w-2xl mx-auto mb-8">
            Your Expression number is the headline, but the same numbers speak through all three lenses — the Soul Urge
            reads them as desire, the Personality number as the surface others meet.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {EXPRESSION_NUMBERS.map((n) => {
              const m = LIFE_PATH_MEANINGS[n];
              return (
                <div key={n} className="bg-white/[0.04] rounded-2xl border border-white/10 p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-10 h-10 bg-gradient-to-r from-gold to-purple rounded-full flex items-center justify-center text-white font-bold shrink-0">{n}</span>
                    <h3 className="font-serif font-semibold text-cream">{NAME_NUMBER_TITLES[n]}</h3>
                  </div>
                  <p className="text-sm text-lav/85 leading-relaxed mb-2">{m.description}</p>
                  <p className="text-sm text-lav/75 leading-relaxed">
                    <span className="text-goldlight font-medium">Strengths:</span> {m.strengths.join(', ')}
                    {'  ·  '}
                    <span className="text-goldlight font-medium">Watch for:</span> {m.challenges.join(', ')}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-cream mb-6 text-center">Name numerology questions</h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.q} className="bg-white/[0.04] rounded-2xl border border-white/10 p-6">
                <h3 className="font-serif font-semibold text-lg text-cream mb-2">{f.q}</h3>
                <p className="text-lav/80 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-cream mb-6 text-center">Keep exploring</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link to="/tools/life-path" className="bg-white/[0.04] rounded-2xl border border-white/10 p-5 hover:border-goldlight/50 transition-all block">
              <h3 className="font-serif font-semibold text-cream mb-1">Life Path Number</h3>
              <p className="text-sm text-lav/70">Your birth date's core number — the other half of the story.</p>
            </Link>
            <Link to="/tools/pythagorean-square" className="bg-white/[0.04] rounded-2xl border border-white/10 p-5 hover:border-goldlight/50 transition-all block">
              <h3 className="font-serif font-semibold text-cream mb-1">Pythagoras Square</h3>
              <p className="text-sm text-lav/70">Your birth digits in the ancient 3×3 psychomatrix.</p>
            </Link>
            <Link to="/tools/angel-numbers" className="bg-white/[0.04] rounded-2xl border border-white/10 p-5 hover:border-goldlight/50 transition-all block">
              <h3 className="font-serif font-semibold text-cream mb-1">Angel Numbers</h3>
              <p className="text-sm text-lav/70">The repeating number hidden inside your birth date.</p>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
