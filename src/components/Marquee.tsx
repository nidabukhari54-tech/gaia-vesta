import { Sparkles } from 'lucide-react';

/** Gold marquee ribbon of tool names — shared by the Landing page and the Tools hub. */
export function Marquee() {
  const items = [
    'Destiny Matrix Chart', 'Karmic Tail', 'Compatibility', 'Family Lines', 'Angel Numbers',
    'Year Forecast', "Children's Matrix", 'Moon Phase', 'Life Path Number', 'Free PDF Report', 'Daily Horoscope', 'Weekly Horoscope', 'Monthly Horoscope', 'Moon Calendar 2027', '2027 Horoscope', 'Chinese Zodiac',
  ];
  const row = [...items, ...items];
  return (
    <div className="relative border-y border-white/[0.08] bg-white/[0.02] py-4 overflow-hidden marquee-paused">
      <div className="flex w-max animate-marquee">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-6 px-6 whitespace-nowrap">
            <span className={`font-serif text-lg ${i % 2 ? 'italic text-goldlight/90' : 'text-cream/85'}`}>{t}</span>
            <Sparkles className="w-3.5 h-3.5 text-goldlight/50" />
          </span>
        ))}
      </div>
    </div>
  );
}
