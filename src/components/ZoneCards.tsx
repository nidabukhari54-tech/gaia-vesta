import { useState } from 'react';
import {
  Sparkles, Compass, Heart, Coins, Gift, Users, Infinity as InfinityIcon, Activity,
  Target, Hash, Calendar, Moon, MessageCircle, AlertTriangle, Baby, Sun, BookOpen,
  Sprout, ChevronDown, type LucideIcon,
} from 'lucide-react';
import type { Zone } from '../lib/zones';

const ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  compass: Compass,
  heart: Heart,
  coins: Coins,
  gift: Gift,
  users: Users,
  infinity: InfinityIcon,
  activity: Activity,
  target: Target,
  hash: Hash,
  calendar: Calendar,
  moon: Moon,
  message: MessageCircle,
  alert: AlertTriangle,
  baby: Baby,
  sun: Sun,
  book: BookOpen,
  sprout: Sprout,
};

/**
 * Renders a reading as named zone cards — the zone system presentation used
 * by the Chart, Compatibility and Child Matrix pages. Dark variant matches
 * the Chart page shell; light variant matches the public tools' cream cards.
 */
export function ZoneCards({
  zones,
  heading,
  sub,
  variant = 'dark',
}: {
  zones: Zone[];
  heading: string;
  sub?: string;
  variant?: 'dark' | 'light';
}) {
  const [open, setOpen] = useState<Set<string>>(() => new Set(zones.slice(0, 3).map((z) => z.id)));
  const dark = variant === 'dark';

  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className={dark ? '' : 'text-text-primary'}>
      <div className="text-center mb-6">
        <h3 className={`font-serif font-semibold text-2xl ${dark ? 'text-cream' : 'text-text-primary'}`}>{heading}</h3>
        {sub && <p className={`text-sm mt-1 max-w-xl mx-auto ${dark ? 'text-lavdim' : 'text-text-primary/60'}`}>{sub}</p>}
      </div>
      <div className="space-y-4">
        {zones.map((zone, i) => {
          const Icon = ICONS[zone.icon] ?? Sparkles;
          const isOpen = open.has(zone.id);
          return (
            <div
              key={zone.id}
              className={
                dark
                  ? 'bg-night2 backdrop-blur-sm rounded-2xl border border-lav/15 overflow-hidden'
                  : 'bg-white/80 rounded-2xl border border-gold/20 overflow-hidden'
              }
            >
              <button
                onClick={() => toggle(zone.id)}
                className="w-full flex items-center gap-3 p-5 text-left"
                aria-expanded={isOpen}
              >
                <span
                  className={
                    dark
                      ? 'w-10 h-10 shrink-0 bg-goldlight/15 rounded-full flex items-center justify-center'
                      : 'w-10 h-10 shrink-0 bg-gold/15 rounded-full flex items-center justify-center'
                  }
                >
                  <Icon className={`w-5 h-5 ${dark ? 'text-goldlight' : 'text-gold'}`} />
                </span>
                <span className="flex-1 min-w-0">
                  <span className={`block font-serif font-semibold text-lg leading-tight ${dark ? 'text-cream' : 'text-text-primary'}`}>
                    <span className={dark ? 'text-goldlight/70' : 'text-gold'}>{String(i + 1).padStart(2, '0')} · </span>
                    {zone.title}
                  </span>
                  <span className={`block text-xs mt-0.5 truncate ${dark ? 'text-lavdim' : 'text-text-primary/50'}`}>{zone.points}</span>
                </span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''} ${dark ? 'text-lavdim' : 'text-text-primary/40'}`}
                />
              </button>
              {isOpen && (
                <div className={`px-5 pb-5 pt-0 ${dark ? 'text-lav' : 'text-text-primary/75'}`}>
                  {zone.body.map((para, j) => (
                    <p key={j} className="text-sm leading-relaxed mb-3 last:mb-0">
                      {para}
                    </p>
                  ))}
                  {(zone.light || zone.shadow) && (
                    <div className="grid sm:grid-cols-2 gap-3 mt-4">
                      {zone.light && (
                        <div className={dark ? 'bg-white/[0.04] rounded-xl p-4 border border-goldlight/25' : 'bg-gold/10 rounded-xl p-4 border border-gold/30'}>
                          <p className={`text-[11px] font-semibold tracking-widest uppercase mb-1.5 ${dark ? 'text-goldlight' : 'text-gold'}`}>In the light</p>
                          <p className="text-sm leading-relaxed">{zone.light}</p>
                        </div>
                      )}
                      {zone.shadow && (
                        <div className={dark ? 'bg-white/[0.04] rounded-xl p-4 border border-lav/15' : 'bg-purple/5 rounded-xl p-4 border border-purple/20'}>
                          <p className={`text-[11px] font-semibold tracking-widest uppercase mb-1.5 ${dark ? 'text-lav' : 'text-purple'}`}>In the shadow</p>
                          <p className="text-sm leading-relaxed">{zone.shadow}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
