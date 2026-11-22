import { Link } from 'react-router-dom';

const ITEMS = [
  { key: 'daily', label: 'Daily Horoscope', to: '/tools/daily-horoscope' },
  { key: 'weekly', label: 'Weekly Horoscope', to: '/tools/weekly-horoscope' },
  { key: 'monthly', label: 'Monthly Horoscope', to: '/tools/monthly-horoscope' },
  { key: '2027', label: '2027 Horoscope', to: '/tools/horoscope-2027' },
  { key: 'moon', label: 'Moon Calendar 2027', to: '/tools/moon-calendar-2027' },
] as const;

export type HoroscopeLinkKey = (typeof ITEMS)[number]['key'];

/** Chip row cross-linking the horoscope family of pages. */
export function HoroscopeLinks({ current }: { current: HoroscopeLinkKey }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {ITEMS.filter((it) => it.key !== current).map((it) => (
        <Link
          key={it.key}
          to={it.to}
          className="px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 text-sm text-lav hover:border-goldlight/50 hover:text-cream transition-all"
        >
          {it.label}
        </Link>
      ))}
    </div>
  );
}
