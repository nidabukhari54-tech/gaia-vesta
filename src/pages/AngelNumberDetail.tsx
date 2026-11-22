import { Link, useParams, Navigate } from 'react-router-dom';
import { Heart, Coins, ArrowRight, Sparkles, Repeat } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { SalesCTA } from '../components/SalesCTA';
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

  const faqs = [
    {
      q: `Why do I keep seeing ${meaning.number} everywhere?`,
      a: `Partly attention, honestly — once a number registers, your mind flags every clock, plate and receipt that carries it. Practitioners read that noticing itself as the point: ${meaning.number} is ${meaning.title.toLowerCase()} energy, and the repetition is an invitation to work with its theme rather than a coincidence to decode once and forget.`,
    },
    {
      q: `Is ${meaning.number} a lucky number?`,
      a: `No angel number guarantees an outcome, and ${meaning.number} is no exception. It is better read as weather than as a promise: it describes the theme in the air — for ${meaning.number}, ${meaning.meaning.charAt(0).toLowerCase()}${meaning.meaning.slice(1)} What you do inside that weather is still yours.`,
    },
    {
      q: `What should I do when I see ${meaning.number}?`,
      a: `Keep it simple and physical: pause, notice what you were just thinking, and take one small action that matches the number's theme before the day ends. Angel numbers reward response, not rumination — a message sent, a step taken, a loop closed.`,
    },
    {
      q: `How is my personal angel number different from seeing ${meaning.number}?`,
      a: `Seeing ${meaning.number} is ambient — it belongs to the moment. Your personal angel number is derived from your birth date and belongs to you for life: the digits of your day, month and year are summed and reduced to a single digit, which is then tripled. The worked example below shows exactly how it is found.`,
    },
  ];

  return (
    <PublicLayout>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-20">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-goldlight mb-3">Angel number meaning</p>
          <p className="text-7xl font-serif font-bold bg-gradient-to-r from-gold to-purple bg-clip-text text-transparent leading-tight">
            {meaning.number}
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-cream mt-2">
            {meaning.number} Angel Number — {meaning.title}
          </h1>
        </div>

        <div className="bg-gradient-to-br from-gold/12 to-purple/12 rounded-2xl border border-gold/30 p-7 mb-6">
          <h2 className="font-serif font-semibold text-xl text-cream mb-3">What does {meaning.number} mean?</h2>
          <p className="text-lav/85 leading-relaxed">{meaning.meaning}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          <div className="bg-white/80 rounded-2xl p-6 border border-purple/20 text-text-primary">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-purple" />
              <h2 className="font-serif font-semibold text-lg">{meaning.number} in love</h2>
            </div>
            <p className="text-text-primary/75 leading-relaxed">{meaning.love}</p>
          </div>
          <div className="bg-white/80 rounded-2xl p-6 border border-gold/25 text-text-primary">
            <div className="flex items-center gap-2 mb-2">
              <Coins className="w-5 h-5 text-gold" />
              <h2 className="font-serif font-semibold text-lg">{meaning.number} for money & work</h2>
            </div>
            <p className="text-text-primary/75 leading-relaxed">{meaning.money}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          <div className="bg-white/[0.04] rounded-2xl p-6 border border-goldlight/25">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-goldlight" />
              <h2 className="font-serif font-semibold text-lg text-cream">The spiritual message of {meaning.number}</h2>
            </div>
            <p className="text-lav/85 leading-relaxed">{meaning.spiritual}</p>
          </div>
          <div className="bg-white/[0.04] rounded-2xl p-6 border border-goldlight/25">
            <div className="flex items-center gap-2 mb-2">
              <Repeat className="w-5 h-5 text-goldlight" />
              <h2 className="font-serif font-semibold text-lg text-cream">When you keep seeing {meaning.number}</h2>
            </div>
            <p className="text-lav/85 leading-relaxed">{meaning.seeing}</p>
          </div>
        </div>

        <div className="bg-white/[0.04] rounded-2xl border border-goldlight/30 p-7 text-center mb-10">
          <h2 className="font-serif font-semibold text-xl text-cream mb-2">Is {meaning.number} YOUR angel number?</h2>
          <p className="text-lav/70 mb-5 max-w-md mx-auto">
            Your birth date hides a personal angel number. Find yours — and see what it has been trying to tell you.
          </p>
          <Link
            to="/tools/angel-numbers"
            className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-lg transition-all"
          >
            Find my personal angel number <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <SalesCTA
          headline={`Why do you keep seeing ${meaning.number}? Your birth chart knows.`}
          context="Angel numbers are the universe knocking. Your Destiny Matrix explains what it is knocking about — the AI deep reading decodes your love line, money line and karmic lesson in one personal story."
        />

        <div className="mt-14 max-w-3xl mx-auto">
          <h2 className="text-2xl font-serif font-bold text-cream mb-3 text-center">How a personal angel number is found — a worked example</h2>
          <p className="text-lav/75 leading-relaxed text-center mb-6">
            Take a birth date of <strong className="text-cream">14 March 1990</strong>:
          </p>
          <div className="bg-white/[0.04] rounded-2xl border border-white/10 p-6">
            <ul className="space-y-2.5 text-lav/85 leading-relaxed">
              <li><strong className="text-cream">Day:</strong> 14 → 1+4 = 5. <strong className="text-cream">Month:</strong> March → 3. <strong className="text-cream">Year:</strong> 1990 → 1+9+9+0 = 19.</li>
              <li><strong className="text-cream">Combine:</strong> 5 + 3 + 19 = 27 → reduce: 2+7 = 9.</li>
              <li><strong className="text-cream">Triple the digit:</strong> 9 becomes <strong className="text-cream">999</strong> — this person's personal angel number, the number of completion and release.</li>
              <li>Yours is waiting in your own birth date — the finder on the Angel Numbers page runs these exact sums for you.</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 max-w-3xl mx-auto">
          <h2 className="text-2xl font-serif font-bold text-cream mb-6 text-center">{meaning.number} questions</h2>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div key={f.q} className="bg-white/[0.04] rounded-2xl border border-white/10 p-6">
                <h3 className="font-serif font-semibold text-lg text-cream mb-2">{f.q}</h3>
                <p className="text-lav/80 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <h2 className="font-serif font-semibold text-xl text-cream mb-4 text-center mt-14">All angel number meanings</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {others.map((n) => (
            <Link
              key={n}
              to={`/tools/angel-numbers/${n}`}
              className="px-4 py-2 rounded-full font-semibold text-sm bg-white/[0.06] border border-white/10 text-lav hover:bg-white/[0.12] hover:text-cream transition-all"
            >
              {n}
            </Link>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
