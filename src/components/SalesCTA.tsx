import { Link } from 'react-router-dom';
import { Sparkles, Heart, Coins, RefreshCcw, CalendarClock, ArrowRight } from 'lucide-react';

/**
 * Conversion block shown at the moment of peak curiosity (right after a
 * free result). Sells the AI deep reading honestly: the free chart shows
 * the map; the reading connects it into a personal story.
 */
export function SalesCTA({
  headline = 'Your chart shows the map. The reading tells your story.',
  context = 'Numbers and nodes are only the skeleton. The AI deep reading weaves your love line, money line and karmic lessons into one personal narrative — with what to actually do about them.',
}: {
  headline?: string;
  context?: string;
}) {
  const points = [
    { icon: Heart, label: 'Love & relationship patterns' },
    { icon: Coins, label: 'Money energy — and its blocks' },
    { icon: RefreshCcw, label: 'Karmic lessons you keep repeating' },
    { icon: CalendarClock, label: 'Your year ahead, month by month' },
  ];
  return (
    <div className="max-w-4xl mx-auto mt-14">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple/90 via-purple to-gold/80 text-white p-8 sm:p-10 shadow-xl">
        <Sparkles className="absolute -top-4 -right-4 w-32 h-32 text-white/10" />
        <p className="text-xs font-semibold tracking-widest uppercase text-white/70 mb-2">AI Deep Reading</p>
        <h2 className="font-serif font-bold text-2xl sm:text-3xl leading-snug mb-3 max-w-xl">{headline}</h2>
        <p className="text-white/85 leading-relaxed max-w-xl mb-6">{context}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-w-xl mb-7">
          {points.map((p) => (
            <div key={p.label} className="flex items-center gap-2.5 text-sm text-white/90">
              <span className="w-7 h-7 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                <p.icon className="w-4 h-4" />
              </span>
              {p.label}
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-7 py-3 bg-white text-purple font-semibold rounded-xl hover:shadow-2xl hover:scale-[1.02] transition-all"
          >
            Get my AI reading <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-sm text-white/75">
            Free plan includes <span className="font-semibold text-white">5 AI readings every month</span> — no card needed.
          </p>
        </div>
      </div>
    </div>
  );
}
