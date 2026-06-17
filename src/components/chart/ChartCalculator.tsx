import React, { useState } from 'react';
import { Calendar, Sparkles } from 'lucide-react';

type ChartCalculatorProps = {
  onCalculate: (birthDate: Date, name: string) => void;
  isCalculating?: boolean;
};

export function ChartCalculator({ onCalculate, isCalculating = false }: ChartCalculatorProps) {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const daysInMonth = (m: number, y: number): number => {
    return new Date(y, m, 0).getDate();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (!dayNum || !monthNum || !yearNum) {
      setError('Please enter a valid date');
      return;
    }

    if (monthNum < 1 || monthNum > 12) {
      setError('Month must be between 1 and 12');
      return;
    }

    if (dayNum < 1 || dayNum > daysInMonth(monthNum, yearNum)) {
      setError('Invalid day for the selected month');
      return;
    }

    if (yearNum < 1900 || yearNum > new Date().getFullYear()) {
      setError('Please enter a valid birth year');
      return;
    }

    const birthDate = new Date(yearNum, monthNum - 1, dayNum);
    onCalculate(birthDate, name || 'Unknown');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-purple/20">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-gold to-purple rounded-full flex items-center justify-center mx-auto mb-3">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-xl font-serif font-semibold text-text-primary">
          Calculate Your Destiny Matrix
        </h2>
        <p className="text-sm text-text-primary/60 mt-1">
          Enter your birth date to reveal your cosmic blueprint
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-primary mb-2">
            Your Name (optional)
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 bg-white/80 border border-purple/30 rounded-lg
                       text-text-primary placeholder:text-text-primary/40
                       focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
                       transition-all duration-200"
            placeholder="Enter your name"
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label htmlFor="day" className="block text-sm font-medium text-text-primary mb-2">
              Day
            </label>
            <input
              id="day"
              type="number"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              min="1"
              max="31"
              className="w-full px-3 py-3 bg-white/80 border border-purple/30 rounded-lg
                         text-text-primary placeholder:text-text-primary/40
                         focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
                         transition-all duration-200 text-center"
              placeholder="DD"
              required
            />
          </div>

          <div>
            <label htmlFor="month" className="block text-sm font-medium text-text-primary mb-2">
              Month
            </label>
            <input
              id="month"
              type="number"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              min="1"
              max="12"
              className="w-full px-3 py-3 bg-white/80 border border-purple/30 rounded-lg
                         text-text-primary placeholder:text-text-primary/40
                         focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
                         transition-all duration-200 text-center"
              placeholder="MM"
              required
            />
          </div>

          <div>
            <label htmlFor="year" className="block text-sm font-medium text-text-primary mb-2">
              Year
            </label>
            <input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min="1900"
              max={new Date().getFullYear()}
              className="w-full px-3 py-3 bg-white/80 border border-purple/30 rounded-lg
                         text-text-primary placeholder:text-text-primary/40
                         focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
                         transition-all duration-200 text-center"
              placeholder="YYYY"
              required
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isCalculating}
          className="w-full py-3 px-4 bg-gradient-to-r from-gold to-purple text-white font-medium
                     rounded-lg shadow-md hover:shadow-lg disabled:opacity-50
                     disabled:cursor-not-allowed transition-all duration-200
                     flex items-center justify-center gap-2"
        >
          {isCalculating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Calculating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Calculate My Chart
            </>
          )}
        </button>
      </form>
    </div>
  );
}
