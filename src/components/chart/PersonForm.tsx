import { useEffect, useState } from 'react';

type PersonFormProps = {
  title: string;
  nameLabel?: string;
  onChange: (date: Date | null, name: string) => void;
};

function daysInMonth(m: number, y: number): number {
  return new Date(y, m, 0).getDate();
}

/** A name + birth-date input block that lifts a validated Date (or null) up. */
export function PersonForm({ title, nameLabel = 'Name (optional)', onChange }: PersonFormProps) {
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  useEffect(() => {
    const d = parseInt(day, 10);
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    if (
      d >= 1 && m >= 1 && m <= 12 && y >= 1900 && y <= new Date().getFullYear() &&
      d <= daysInMonth(m, y)
    ) {
      onChange(new Date(y, m - 1, d), name || 'Unknown');
    } else {
      onChange(null, name || 'Unknown');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, month, year, name]);

  const inputCls =
    'w-full px-3 py-3 bg-white/80 border border-purple/30 rounded-lg text-text-primary placeholder:text-text-primary/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all duration-200 text-center';

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 shadow border border-purple/20">
      <h3 className="font-serif font-semibold text-text-primary mb-4">{title}</h3>
      <label className="block text-sm font-medium text-text-primary mb-2">{nameLabel}</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter name"
        className="w-full px-4 py-3 mb-4 bg-white/80 border border-purple/30 rounded-lg text-text-primary placeholder:text-text-primary/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all duration-200"
      />
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Day</label>
          <input type="number" min="1" max="31" value={day} onChange={(e) => setDay(e.target.value)} placeholder="DD" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Month</label>
          <input type="number" min="1" max="12" value={month} onChange={(e) => setMonth(e.target.value)} placeholder="MM" className={inputCls} />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">Year</label>
          <input type="number" min="1900" max={new Date().getFullYear()} value={year} onChange={(e) => setYear(e.target.value)} placeholder="YYYY" className={inputCls} />
        </div>
      </div>
    </div>
  );
}
