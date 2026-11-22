import { useEffect } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Heart, Flame, ArrowRight } from 'lucide-react';
import { PublicLayout } from '../components/PublicLayout';
import { SalesCTA } from '../components/SalesCTA';
import { ZODIAC_SIGNS, zodiacCompatibility, type ZodiacSign } from '../lib/numerology';

const ELEMENT_DYNAMICS: Record<string, { strengths: string; watchOut: string }> = {
  'Fire|Fire': {
    strengths: 'Double fire means double momentum: this pair inspires, challenges and excites each other, and boredom rarely survives a week. Adventures, projects and bold plans keep the bond blazing.',
    watchOut: 'Two flames compete for oxygen. Arguments ignite fast and pride slows the apology — the couple that learns to take turns leading wins.',
  },
  'Fire|Earth': {
    strengths: 'Fire brings the vision, Earth brings the blueprint. Together they can actually build the life other couples only talk about — ambition with a foundation under it.',
    watchOut: 'Fire wants it now, Earth wants it right. Impatience versus caution is the recurring argument; respecting the other\'s tempo is the whole lesson.',
  },
  'Air|Fire': {
    strengths: 'Air feeds fire — this is one of the most naturally compatible element pairings. Conversation, curiosity and shared ideas keep the attraction intellectual as well as physical.',
    watchOut: 'Both partners live in the future and the abstract. Feelings can get analysed instead of felt; somebody has to say the tender thing out loud.',
  },
  'Fire|Water': {
    strengths: 'Steam. Fire gives Water courage and momentum; Water gives Fire depth and emotional intelligence. At its best this pairing is transformative for both people.',
    watchOut: 'Fire can boil Water, and Water can drown Fire. Intensity needs handling: blunt honesty wounds one, silent withdrawal frightens the other.',
  },
  'Earth|Earth': {
    strengths: 'Two Earth signs build slowly and keep what they build. Loyalty, sensuality and shared routines make this one of the most durable pairings in the zodiac.',
    watchOut: 'Comfort can harden into routine. If neither partner initiates change, the relationship can become a very stable rut — schedule the adventure.',
  },
  'Air|Earth': {
    strengths: 'Earth grounds Air\'s ideas into something real; Air keeps Earth from fossilising. A thinking-and-building couple with genuine long-term potential.',
    watchOut: 'Air processes by talking, Earth by doing. One partner\'s need to discuss everything can feel like pressure; the other\'s silence can feel like distance.',
  },
  'Earth|Water': {
    strengths: 'The classic fertile pairing — Water nourishes Earth, Earth gives Water banks to flow between. Devotion, home and family come naturally here.',
    watchOut: 'Both signs avoid confrontation until it floods or cracks. Small resentments stored silently are the danger; early, gentle honesty prevents both.',
  },
  'Air|Air': {
    strengths: 'A meeting of minds first, everything else second. This pair talks for hours, shares friends and ideas easily, and rarely feels trapped.',
    watchOut: 'Two Air signs can intellectualise the relationship to death. The bond needs deliberate emotional and physical anchoring, not just great conversation.',
  },
  'Air|Water': {
    strengths: 'Water feels what Air thinks. When it works, this pairing produces unusual emotional honesty — one names the feeling, the other finally understands it.',
    watchOut: 'The classic mismatch of processing styles: one wants to talk it through logically, the other needs to feel it first. Neither is wrong; timing is everything.',
  },
  'Water|Water': {
    strengths: 'Two Water signs understand each other without words. Emotional intimacy, loyalty and private rituals make this bond feel fated to both partners.',
    watchOut: 'Moods amplify in both directions. Without one partner occasionally playing anchor, shared lows can spiral — outside friendships and daylight help.',
  },
};

function elementKey(a: ZodiacSign, b: ZodiacSign): string {
  return [a.element, b.element].sort().join('|');
}

export function pairSlug(a: ZodiacSign, b: ZodiacSign): string {
  return `${a.name.toLowerCase()}-${b.name.toLowerCase()}`;
}

export function ZodiacPairDetail() {
  const { pair } = useParams<{ pair: string }>();
  const parts = (pair ?? '').split('-');
  const rawA = ZODIAC_SIGNS.find((s) => s.name.toLowerCase() === parts[0]);
  const rawB = ZODIAC_SIGNS.find((s) => s.name.toLowerCase() === parts[1]);

  const valid = rawA && rawB;
  // Normalise order by zodiac position so /scorpio-cancer == /cancer-scorpio
  const [a, b] = valid
    ? ZODIAC_SIGNS.indexOf(rawA) <= ZODIAC_SIGNS.indexOf(rawB)
      ? [rawA, rawB]
      : [rawB, rawA]
    : [undefined, undefined];

  useEffect(() => {
    if (a && b) {
      document.title = `${a.name} and ${b.name} Compatibility — Love Match, Score & Meaning | Gaia Vesta`;
    }
  }, [a, b]);

  if (!a || !b) {
    return <Navigate to="/tools/zodiac-compatibility" replace />;
  }

  const match = zodiacCompatibility(a, b);
  const dynamics = ELEMENT_DYNAMICS[elementKey(a, b)];
  const aPairs = ZODIAC_SIGNS.filter((s) => s.name !== a.name);
  const bPairs = ZODIAC_SIGNS.filter((s) => s.name !== b.name && s.name !== a.name);

  const signCard = (s: ZodiacSign) => (
    <div className="bg-white/80 rounded-2xl p-6 border border-purple/20 text-left text-text-primary">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-4xl">{s.symbol}</span>
        <div>
          <h3 className="font-serif font-semibold text-lg leading-tight">{s.name}</h3>
          <p className="text-xs text-text-primary/50">{s.dates}</p>
        </div>
      </div>
      <div className="space-y-1.5 text-sm text-text-primary/70">
        <p><span className="font-medium text-text-primary">Element:</span> {s.element}</p>
        <p><span className="font-medium text-text-primary">Ruled by:</span> {s.ruler}</p>
        <p><span className="font-medium text-text-primary">Known for:</span> {s.traits.join(', ')}</p>
      </div>
    </div>
  );

  return (
    <PublicLayout>
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-20">
        <div className="text-center mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-goldlight mb-3">Zodiac compatibility</p>
          <p className="text-6xl mb-3">{a.symbol} {b.symbol}</p>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-cream">
            {a.name} and {b.name} Compatibility
          </h1>
          <div className="mt-5 inline-flex flex-col items-center">
            <span className="text-5xl font-serif font-bold bg-gradient-to-r from-gold to-purple bg-clip-text text-transparent">
              {match.score}%
            </span>
            <span className="text-sm font-medium text-lavdim mt-1">{match.verdict}</span>
          </div>
          <div className="w-64 max-w-full h-2.5 bg-white/10 rounded-full mx-auto mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold to-purple rounded-full"
              style={{ width: `${match.score}%` }}
            />
          </div>
        </div>

        <div className="bg-gradient-to-br from-gold/12 to-purple/12 rounded-2xl border border-gold/30 p-7 mb-6">
          <h2 className="font-serif font-semibold text-xl text-cream mb-3">
            Are {a.name} and {b.name} a good match?
          </h2>
          <p className="text-lav/85 leading-relaxed">{match.summary}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-6">
          {signCard(a)}
          {signCard(b)}
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mb-10">
          <div className="bg-white/80 rounded-2xl p-6 border border-gold/25 text-text-primary">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-gold" />
              <h2 className="font-serif font-semibold text-lg">Where this pair shines</h2>
            </div>
            <p className="text-text-primary/75 leading-relaxed">{dynamics.strengths}</p>
          </div>
          <div className="bg-white/80 rounded-2xl p-6 border border-purple/20 text-text-primary">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-purple" />
              <h2 className="font-serif font-semibold text-lg">What to watch</h2>
            </div>
            <p className="text-text-primary/75 leading-relaxed">{dynamics.watchOut}</p>
          </div>
        </div>

        <div className="bg-white/[0.04] rounded-2xl border border-goldlight/30 p-7 text-center mb-10">
          <h2 className="font-serif font-semibold text-xl text-cream mb-2">Go deeper than sun signs</h2>
          <p className="text-lav/70 mb-5 max-w-md mx-auto">
            Sun signs are only the surface. Compare your full Destiny Matrix charts — love line, money line and shared purpose.
          </p>
          <Link
            to="/tools/compatibility"
            className="inline-flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-lg transition-all"
          >
            Try the Compatibility Matrix <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <SalesCTA
          headline={`${a.name} + ${b.name} is the surface. Your charts go deeper.`}
          context="Sun-sign scores are a first glance. The AI deep reading compares your full Destiny Matrix charts — love lines, money lines and shared karmic lessons — and tells the real story of this pairing."
        />

        <h2 className="font-serif font-semibold text-xl text-cream mb-4 text-center mt-14">More pairs</h2>
        <div className="flex flex-wrap justify-center gap-2">
          {aPairs.slice(0, 6).map((s) => {
            const [x, y] = ZODIAC_SIGNS.indexOf(a) <= ZODIAC_SIGNS.indexOf(s) ? [a, s] : [s, a];
            return (
              <Link key={`a-${s.name}`} to={`/tools/zodiac-compatibility/${pairSlug(x, y)}`} className="px-4 py-2 rounded-full font-medium text-sm bg-white/[0.06] border border-white/10 text-lav hover:bg-white/[0.12] hover:text-cream transition-all">
                {a.name} + {s.name}
              </Link>
            );
          })}
          {bPairs.slice(0, 6).map((s) => {
            const [x, y] = ZODIAC_SIGNS.indexOf(b) <= ZODIAC_SIGNS.indexOf(s) ? [b, s] : [s, b];
            return (
              <Link key={`b-${s.name}`} to={`/tools/zodiac-compatibility/${pairSlug(x, y)}`} className="px-4 py-2 rounded-full font-medium text-sm bg-goldlight/10 border border-goldlight/20 text-lav hover:bg-goldlight/20 hover:text-cream transition-all">
                {b.name} + {s.name}
              </Link>
            );
          })}
        </div>
      </section>
    </PublicLayout>
  );
}
