import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Search } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { ChartCalculator } from '../components/chart/ChartCalculator';
import { personalAngelNumber } from '../lib/numerology';
import { ANGEL_NUMBERS, ANGEL_NUMBER_LIST, type AngelMeaning } from '../lib/numerology-meanings';

export function AngelNumbers() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<AngelMeaning | null>(null);
  const [personal, setPersonal] = useState<string | null>(null);

  const filtered = ANGEL_NUMBER_LIST.filter((n) => n.includes(query.trim()));

  const lookup = (n: string) => {
    const m = ANGEL_NUMBERS[n];
    if (m) setActive(m);
  };

  return (
    <PublicLayout>
      <ToolHero
        eyebrow="Angel numbers · Meanings"
        title="Angel Number Meanings"
        subtitle="Seeing the same number everywhere — on clocks, receipts, plates? Look it up below, or calculate the personal angel number written into your birth date."
      />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow border border-purple/20 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-primary/40" />
            <input
              type="text"
              inputMode="numeric"
              value={query}
              onChange={(e) => setQuery(e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="Type a number — 111, 444, 1111…"
              className="w-full pl-12 pr-4 py-3.5 bg-white/80 border border-purple/30 rounded-xl text-lg text-text-primary placeholder:text-text-primary/40 focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {filtered.map((n) => (
              <button
                key={n}
                onClick={() => lookup(n)}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all ${
                  active?.number === n
                    ? 'bg-gradient-to-r from-gold to-purple text-white shadow'
                    : 'bg-purple/10 text-text-primary hover:bg-purple/20'
                }`}
              >
                {n}
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-text-primary/55">
                We don't have that exact sequence yet — try 111, 222, 444, 1111, 1212 or 1234.
              </p>
            )}
          </div>
        </div>

        {active && (
          <div className="bg-gradient-to-br from-gold/12 to-purple/12 rounded-2xl border border-gold/30 p-7 mb-10 animate-fadeIn" key={active.number}>
            <div className="text-center mb-5">
              <p className="text-5xl font-serif font-bold bg-gradient-to-r from-gold to-purple bg-clip-text text-transparent">
                {active.number}
              </p>
              <h2 className="text-2xl font-serif font-bold mt-1">{active.title}</h2>
            </div>
            <p className="text-text-primary/80 leading-relaxed text-center max-w-2xl mx-auto mb-6">{active.meaning}</p>
            <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/75 rounded-xl p-4">
                <p className="text-xs font-semibold tracking-wide uppercase text-purple mb-1">In love</p>
                <p className="text-sm text-text-primary/75">{active.love}</p>
              </div>
              <div className="bg-white/75 rounded-xl p-4">
                <p className="text-xs font-semibold tracking-wide uppercase text-gold mb-1">Money & work</p>
                <p className="text-sm text-text-primary/75">{active.money}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div>
            <h2 className="text-2xl font-serif font-bold mb-2">Your personal angel number</h2>
            <p className="text-text-primary/65 mb-5">
              Your birth date reduces to one guardian digit, repeated three times. When this number keeps
              appearing for you, it is rarely random — it is your personal sign.
            </p>
            {personal && (
              <div className="bg-white/80 rounded-2xl border border-gold/30 p-6 text-center animate-fadeIn">
                <p className="text-sm text-text-primary/55 mb-1">Your angel number is</p>
                <p className="text-5xl font-serif font-bold bg-gradient-to-r from-gold to-purple bg-clip-text text-transparent mb-2">
                  {personal}
                </p>
                <p className="text-sm text-text-primary/70">{ANGEL_NUMBERS[personal]?.meaning}</p>
              </div>
            )}
          </div>
          <ChartCalculator
            onCalculate={(date) => {
              const p = personalAngelNumber(date);
              setPersonal(p);
              if (ANGEL_NUMBERS[p]) setActive(ANGEL_NUMBERS[p]);
            }}
          />
        </div>

        <div className="text-center mt-12">
          <Link
            to="/tools"
            className="inline-flex items-center gap-2 text-sm font-medium text-purple hover:text-text-primary transition-colors"
          >
            <Sparkles className="w-4 h-4" /> Explore all free tools
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
