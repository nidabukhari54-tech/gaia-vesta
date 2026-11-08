import { useState } from 'react';
import { Moon } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { moonPhase, zodiacSign } from '../lib/numerology';

const PHASE_GUIDANCE: Record<string, string> = {
  'New Moon': 'The sky resets. Set intentions, plant seeds, start quietly — this is the cycle\'s blank page.',
  'Waxing Crescent': 'First light, first steps. Momentum is fragile but real; take the smallest brave action toward your intention.',
  'First Quarter': 'The moon is half-lit and pushing. Obstacles appear specifically so you can prove the intention matters.',
  'Waxing Gibbous': 'Refinement time. Adjust, polish, and trust the build-up — the full picture is close.',
  'Full Moon': 'Peak illumination. Things come to light, emotions run high, and results — good or awkward — become visible. Harvest and release.',
  'Waning Gibbous': 'The light softens into gratitude and sharing. Teach what you learned; give something back.',
  'Last Quarter': 'Forgiveness and clearing. Let go of what the cycle proved is not working; make space.',
  'Waning Crescent': 'The darkening moon asks for rest, dreams, and surrender. Charge yourself before the next beginning.',
};

function daysUntilFull(age: number): number {
  const fullAt = 14.77;
  const diff = fullAt - age;
  return diff >= 0 ? Math.ceil(diff) : Math.ceil(diff + 29.53);
}

function daysUntilNew(age: number): number {
  return Math.ceil(29.53 - age);
}

export function MoonPhase() {
  const today = new Date();
  const [customDate, setCustomDate] = useState<string>('');
  const [birthPhase, setBirthPhase] = useState<ReturnType<typeof moonPhase> | null>(null);
  const [birthSign, setBirthSign] = useState<string | null>(null);

  const now = moonPhase(today);

  const handleDate = (value: string) => {
    setCustomDate(value);
    if (!value) {
      setBirthPhase(null);
      setBirthSign(null);
      return;
    }
    const d = new Date(value + 'T12:00:00');
    if (isNaN(d.getTime())) return;
    setBirthPhase(moonPhase(d));
    const sign = zodiacSign(d.getMonth() + 1, d.getDate());
    setBirthSign(`${sign.symbol} ${sign.name}`);
  };

  return (
    <PublicLayout>
      <ToolHero
        eyebrow="Lunar · Daily"
        title="Moon Phase Today"
        subtitle="Tonight's exact moon phase, illumination and age — calculated live. Then check the moon (and your sun sign) on the day you were born."
      />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gradient-to-br from-[#2b2440] to-[#4a3f6b] rounded-3xl p-8 text-center text-white shadow-xl mb-8">
          <p className="text-7xl mb-4">{now.emoji}</p>
          <h2 className="text-3xl font-serif font-bold mb-1">{now.name}</h2>
          <p className="text-white/70 text-sm mb-5">
            {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <div className="flex justify-center gap-6 sm:gap-10 text-center mb-6">
            <div>
              <p className="text-2xl font-bold">{Math.round(now.illumination * 100)}%</p>
              <p className="text-xs text-white/60">Illuminated</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{now.age.toFixed(1)}</p>
              <p className="text-xs text-white/60">Days old</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{daysUntilFull(now.age)}d</p>
              <p className="text-xs text-white/60">To full moon</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{daysUntilNew(now.age)}d</p>
              <p className="text-xs text-white/60">To new moon</p>
            </div>
          </div>
          <p className="text-white/85 max-w-lg mx-auto leading-relaxed">{PHASE_GUIDANCE[now.name]}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow border border-purple/20">
          <div className="flex items-center gap-2 mb-3">
            <Moon className="w-5 h-5 text-purple" />
            <h3 className="font-serif font-semibold text-lg">The moon on your birth day</h3>
          </div>
          <input
            type="date"
            value={customDate}
            onChange={(e) => handleDate(e.target.value)}
            className="w-full px-4 py-3 bg-white/80 border border-purple/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
          />
          {birthPhase && (
            <div className="mt-5 text-center animate-fadeIn">
              <p className="text-5xl mb-2">{birthPhase.emoji}</p>
              <p className="font-serif font-semibold text-xl">{birthPhase.name}</p>
              <p className="text-sm text-text-primary/60 mt-1">
                {Math.round(birthPhase.illumination * 100)}% illuminated · born under a {birthSign} sun
              </p>
              <p className="text-sm text-text-primary/70 mt-3 max-w-md mx-auto">{PHASE_GUIDANCE[birthPhase.name]}</p>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
