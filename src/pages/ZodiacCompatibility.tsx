import { useState } from 'react';
import { Heart } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { ZODIAC_SIGNS, zodiacCompatibility, type ZodiacSign } from '../lib/numerology';

function SignPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: ZodiacSign;
  onChange: (s: ZodiacSign) => void;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-text-primary mb-2">{label}</p>
      <div className="grid grid-cols-4 gap-2">
        {ZODIAC_SIGNS.map((s) => (
          <button
            key={s.name}
            onClick={() => onChange(s)}
            className={`py-2.5 rounded-lg text-center transition-all ${
              value.name === s.name
                ? 'bg-gradient-to-r from-gold to-purple text-white shadow'
                : 'bg-white/70 border border-purple/20 hover:border-gold/50'
            }`}
          >
            <span className="block text-lg leading-none">{s.symbol}</span>
            <span className="block text-[11px] font-medium mt-1">{s.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function ZodiacCompatibility() {
  const [a, setA] = useState<ZodiacSign>(ZODIAC_SIGNS[4]); // Leo
  const [b, setB] = useState<ZodiacSign>(ZODIAC_SIGNS[10]); // Aquarius
  const match = zodiacCompatibility(a, b);

  return (
    <PublicLayout>
      <ToolHero
        eyebrow="Astrology · Compatibility"
        title="Zodiac Compatibility Checker"
        subtitle="Pick any two signs — all 144 pairings — and get an honest harmony score based on elements, rulers and temperament."
      />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-purple/20">
            <SignPicker label="First sign" value={a} onChange={setA} />
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-purple/20">
            <SignPicker label="Second sign" value={b} onChange={setB} />
          </div>
        </div>

        <div className="bg-gradient-to-br from-gold/12 to-purple/12 rounded-3xl border border-gold/30 p-8 text-center animate-fadeIn" key={a.name + b.name}>
          <div className="flex items-center justify-center gap-4 mb-3">
            <span className="text-5xl">{a.symbol}</span>
            <Heart className="w-7 h-7 text-gold" />
            <span className="text-5xl">{b.symbol}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold mb-1">
            {a.name} + {b.name}
          </h2>
          <p className="text-sm text-text-primary/55 mb-5">
            {a.element} sign ruled by {a.ruler} · {b.element} sign ruled by {b.ruler}
          </p>
          <div className="max-w-md mx-auto mb-5">
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="font-medium">{match.verdict}</span>
              <span className="font-bold">{match.score}%</span>
            </div>
            <div className="w-full bg-white/70 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-gold to-purple transition-all duration-700"
                style={{ width: `${match.score}%` }}
              />
            </div>
          </div>
          <p className="text-text-primary/75 leading-relaxed max-w-2xl mx-auto">{match.summary}</p>
        </div>

        <p className="text-center text-sm text-text-primary/55 mt-8 max-w-xl mx-auto">
          Want the deeper version? The <a href="/tools/compatibility" className="text-purple font-medium hover:underline">Destiny Matrix compatibility</a> reads
          both partners' full birth charts — not just sun signs.
        </p>
      </section>
    </PublicLayout>
  );
}
