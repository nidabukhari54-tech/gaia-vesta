import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { ChartCalculator } from '../components/chart/ChartCalculator';
import { pythagoreanSquare } from '../lib/numerology';

const CELL_THEMES: Record<number, string> = {
  1: 'Character & will', 2: 'Energy & vitality', 3: 'Curiosity & knowledge',
  4: 'Health & body', 5: 'Heart & emotion', 6: 'Work & mastery',
  7: 'Luck & fortune', 8: 'Kindness & truth', 9: 'Mind & wisdom',
};

const GRID_ORDER = [3, 1, 2, 6, 7, 5, 9, 8, 4]; // classic psychomatrix layout (columns)

const CELL_MEANINGS: Record<number, { present: string; absent: string }> = {
  1: {
    present: 'A defined sense of self and the will to act on it. One 1 is balanced self-belief; two or more add determination that can tip into stubbornness.',
    absent: 'Willpower and self-definition are built consciously in this lifetime — often through situations that ask you to state who you are, and hold the line kindly.',
  },
  2: {
    present: 'A natural reserve of energy, and a fine sensitivity to the states of others. Two or more 2s can mean you give energy away faster than you refill it.',
    absent: 'Energy management is a learned skill for you: rest, food and pacing matter more than for most people, and saying no is part of the lesson.',
  },
  3: {
    present: 'Curiosity and a quick, associative mind — you learn by connecting ideas across subjects, and boredom is your real enemy.',
    absent: 'Knowledge comes to you through experience rather than study for its own sake. The lesson is trusting what you know from living, not only from books.',
  },
  4: {
    present: 'A grounded relationship with the body and with work done properly. Health, craft and order quietly support everything else you attempt.',
    absent: 'The body asks for deliberate care: routines, movement and rest built by choice, rather than left to chance or crisis.',
  },
  5: {
    present: 'An open heart and a wide emotional range — feeling is your compass, and people sense your warmth quickly.',
    absent: 'Emotions are processed privately and slowly. The lesson is letting feelings be named and shared before they harden into distance.',
  },
  6: {
    present: 'Devotion to work done well and to the people you serve. Mastery grows in you through practice and patience, not shortcuts.',
    absent: 'Your relationship with labour and duty is itself the lesson: work as craft rather than burden, and help given without keeping score.',
  },
  7: {
    present: 'A streak of fortune and faith — life tends to open doors for you when you trust the longer pattern instead of forcing the short one.',
    absent: 'Luck is made, not found, in this lifetime. Your lesson is building trust in life through your own kept promises, one at a time.',
  },
  8: {
    present: 'Kindness with a conscience — a duty toward truth and fairness, and generosity that notices who actually needs it.',
    absent: 'Truth-telling and boundaries are the practice here: kindness that costs you your honesty is the pattern to outgrow.',
  },
  9: {
    present: 'A wise, synthesising mind — you see the whole picture, remember what matters, and connect today to the long story.',
    absent: 'Wisdom arrives through experience and reflection. Keeping notes, stories and lessons is how you build your inner library.',
  },
};

const PLANES = [
  {
    name: 'The Mental Plane',
    cells: 'Top row · 3 — 1 — 2',
    text: 'Curiosity, will and energy: the thinking band of the square. A full top row suggests a mind that leads; an empty one suggests thought that ripens through action and experience first.',
  },
  {
    name: 'The Emotional Plane',
    cells: 'Middle row · 6 — 7 — 5',
    text: 'Work, luck and heart: the feeling band. It shows how you engage with life — how you love (5), how you labour (6), and how much you trust life\'s timing (7).',
  },
  {
    name: 'The Physical Plane',
    cells: 'Bottom row · 9 — 8 — 4',
    text: 'Wisdom, kindness and body: the grounding band. It shows how insight becomes daily practice — care for the body (4), fairness in action (8), and wisdom lived rather than merely known (9).',
  },
];

const FAQS = [
  {
    q: 'What is the Pythagoras Square (psychomatrix)?',
    a: 'A numerology system attributed to Pythagoras and developed in the last century by the mathematician Alexander Alexandrov. Every digit of your birth date is placed into a 3×3 grid of qualities — character, energy, curiosity, health, heart, work, luck, kindness and mind. The pattern of filled and empty cells is read as a map of your natural equipment and your lessons.',
  },
  {
    q: 'What do repeated digits mean?',
    a: 'Repetition is amplification. A digit appearing once is a seed, twice is a strength you can rely on, and three or more times becomes a dominant force — powerful, but with a shadow side when it is the only tool you reach for. The reading above weights your strongest cells first for exactly this reason.',
  },
  {
    q: 'Are empty cells a flaw in my chart?',
    a: 'No — and this is the most misunderstood part of the psychomatrix. An empty cell is not a missing quality; it is a quality this lifetime asks you to build deliberately rather than inherit. Many readers consider the empty cells the most important part of the square, because they show where your conscious growth happens.',
  },
  {
    q: 'How is the psychomatrix different from the Destiny Matrix?',
    a: 'They are cousins, not twins. The psychomatrix works with the raw digits of your birth date and reads character traits. The Destiny Matrix reduces your birth date into the 22 Major Arcana placed at specific points — with love and money lines, a karmic tail and life purposes. The square tells you what you are made of; the matrix tells you the story it wants to live.',
  },
];

export function PythagoreanSquare() {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const result = birthDate ? pythagoreanSquare(birthDate) : null;

  return (
    <PublicLayout>
      <ToolHero
        eyebrow="Numerology · Psychomatrix"
        title="Pythagoras Square (Psychomatrix) Calculator"
        subtitle="The ancient psychomatrix of Pythagoras: every digit of your birth date placed in a 3×3 grid. Repeated digits amplify a trait; empty cells show the lessons you are here to develop."
      />

      <div className="relative max-w-md mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="absolute -inset-4 bg-gold/15 rounded-[2.25rem] blur-2xl pointer-events-none" />
        <div className="relative rounded-[1.75rem] overflow-hidden border border-goldlight/30 shadow-[0_30px_70px_-25px_rgba(231,200,115,0.4)]">
          <img
            src="/images/pythagoras-illustration.webp"
            alt="A glowing three-by-three grid of golden light dots joined by fine lines in indigo darkness"
            loading="lazy"
            decoding="async"
            className="w-full h-auto block"
          />
        </div>
      </div>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {!result ? (
          <ChartCalculator onCalculate={(date) => setBirthDate(date)} />
        ) : (
          <div className="animate-fadeIn">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gold/20 shadow mb-6 text-text-primary">
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                {GRID_ORDER.map((d) => {
                  const count = result.counts[d];
                  return (
                    <div
                      key={d}
                      className={`aspect-square rounded-xl border-2 flex flex-col items-center justify-center p-2 text-center ${
                        count > 0
                          ? 'border-gold/50 bg-gradient-to-br from-gold/15 to-purple/10'
                          : 'border-dashed border-purple/25 bg-white/40'
                      }`}
                    >
                      <span className={`font-serif font-bold leading-none mb-1 ${count > 0 ? 'text-2xl text-text-primary' : 'text-2xl text-text-primary/25'}`}>
                        {count > 0 ? String(d).repeat(count) : d}
                      </span>
                      <span className="text-[10px] leading-tight text-text-primary/55">{CELL_THEMES[d]}</span>
                      {count === 0 && <span className="text-[10px] text-purple font-medium mt-0.5">to develop</span>}
                    </div>
                  );
                })}
              </div>
              <p className="text-center text-sm text-text-primary/60 mt-6">
                Destiny (Life Path) number: <strong className="text-text-primary">{result.destinyNumber}</strong>
              </p>
            </div>

            <div className="bg-white/80 rounded-2xl p-6 border border-purple/20 mb-6 text-text-primary">
              <h3 className="font-serif font-semibold text-lg mb-3">Reading your square</h3>
              <ul className="space-y-2.5 text-sm text-text-primary/75">
                {Object.entries(result.counts)
                  .filter(([, c]) => c > 0)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 3)
                  .map(([d, c]) => (
                    <li key={d}>
                      <strong>{CELL_THEMES[Number(d)]} ({d})</strong> appears {c}× —{' '}
                      {c >= 3 ? 'a dominant, defining force in your character.' : c === 2 ? 'strong and reliable in you.' : 'present as a natural seed.'}
                    </li>
                  ))}
                {result.missing.length > 0 && (
                  <li>
                    <strong>Empty cells:</strong> {result.missing.map((d) => `${d} (${CELL_THEMES[d].toLowerCase()})`).join(', ')} —
                    these are not weaknesses, they are the qualities this lifetime asks you to consciously build.
                  </li>
                )}
              </ul>
            </div>

            <div className="bg-white/80 rounded-2xl p-6 border border-purple/20 mb-6 text-text-primary">
              <h3 className="font-serif font-semibold text-lg mb-3">Your square, cell by cell</h3>
              <ul className="space-y-3 text-sm text-text-primary/75">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => {
                  const count = result.counts[d];
                  return (
                    <li key={d}>
                      <strong>
                        {d} · {CELL_THEMES[d]}
                        {count > 0 ? ` — appears ${count}×` : ' — empty in your square'}:
                      </strong>{' '}
                      {count > 0 ? CELL_MEANINGS[d].present : CELL_MEANINGS[d].absent}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setBirthDate(null)}
                className="px-6 py-3 bg-white/[0.04] border border-white/25 text-cream font-medium rounded-xl hover:border-goldlight/60 transition-all"
              >
                Different birth date
              </button>
              <Link
                to="/#demo"
                className="px-6 py-3 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-lg transition-all text-center"
              >
                Go deeper: full Destiny Matrix — free
              </Link>
            </div>
          </div>
        )}

        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-cream mb-3 text-center">A worked example</h2>
          <p className="text-lav/75 leading-relaxed max-w-2xl mx-auto text-center mb-6">
            Take a birth date of <strong className="text-cream">14 March 1990</strong>. Write out every digit —
            1, 4, 0, 3, 1, 9, 9, 0 — and drop the zeros, which hold no cell. What remains fills the square:
          </p>
          <div className="bg-white/[0.04] rounded-2xl border border-white/10 p-6 max-w-2xl mx-auto">
            <ul className="space-y-2.5 text-lav/85 leading-relaxed">
              <li><strong className="text-cream">1 appears twice</strong> and <strong className="text-cream">9 appears twice</strong> — will and wisdom are the twin engines of this character.</li>
              <li><strong className="text-cream">3 and 4 appear once</strong> — curiosity and a grounded body are present as natural seeds.</li>
              <li><strong className="text-cream">2, 5, 6, 7 and 8 are empty</strong> — energy management, an openly shared heart, devotion to craft, trust and truth-telling are this lifetime's conscious lessons.</li>
              <li>The digits also reduce to a <strong className="text-cream">Destiny (Life Path) number of 9</strong> — the humanitarian thread running underneath the whole square.</li>
            </ul>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-cream mb-3 text-center">Every cell of the square, explained</h2>
          <p className="text-lav/70 text-center max-w-2xl mx-auto mb-8">
            Whether a cell is filled or empty in your square, both sides of its story matter — the gift and the lesson.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
              <div key={d} className="bg-white/[0.04] rounded-2xl border border-white/10 p-5">
                <p className="font-serif font-bold text-2xl text-goldlight mb-1">{d}</p>
                <h3 className="font-serif font-semibold text-cream mb-2">{CELL_THEMES[d]}</h3>
                <p className="text-sm text-lav/80 leading-relaxed mb-2"><span className="text-goldlight font-medium">Filled:</span> {CELL_MEANINGS[d].present}</p>
                <p className="text-sm text-lav/80 leading-relaxed"><span className="text-goldlight font-medium">Empty:</span> {CELL_MEANINGS[d].absent}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-cream mb-3 text-center">The three planes of the square</h2>
          <p className="text-lav/70 text-center max-w-2xl mx-auto mb-8">
            The square is often read in three horizontal bands — mind, heart and body. Count how full each band is in your own square to see where your weight naturally sits.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {PLANES.map((p) => (
              <div key={p.name} className="bg-white/[0.04] rounded-2xl border border-white/10 p-5">
                <h3 className="font-serif font-semibold text-cream mb-1">{p.name}</h3>
                <p className="text-xs font-semibold tracking-widest uppercase text-goldlight mb-2">{p.cells}</p>
                <p className="text-sm text-lav/80 leading-relaxed">{p.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-cream mb-6 text-center">Pythagoras Square questions</h2>
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
              <p className="text-sm text-lav/70">The destiny number inside your square, read in full.</p>
            </Link>
            <Link to="/tools/karmic-tail" className="bg-white/[0.04] rounded-2xl border border-white/10 p-5 hover:border-goldlight/50 transition-all block">
              <h3 className="font-serif font-semibold text-cream mb-1">Karmic Tail Calculator</h3>
              <p className="text-sm text-lav/70">The three-number code behind your repeating patterns.</p>
            </Link>
            <Link to="/tools/personal-year" className="bg-white/[0.04] rounded-2xl border border-white/10 p-5 hover:border-goldlight/50 transition-all block">
              <h3 className="font-serif font-semibold text-cream mb-1">Personal Year</h3>
              <p className="text-sm text-lav/70">Which year of the 9-year cycle you are living now.</p>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
