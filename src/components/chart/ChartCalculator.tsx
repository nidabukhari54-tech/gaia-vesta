import React, { useState } from 'react';
import { Calendar, Sparkles } from 'lucide-react';

type ChartCalculatorProps = {
  onCalculate: (birthDate: Date, name: string) => void;
  isCalculating?: boolean;
  size?: 'default' | 'large';
};

export function ChartCalculator({ onCalculate, isCalculating = false, size = 'default' }: ChartCalculatorProps) {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const large = size === 'large';

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

  const labelCls = `block font-medium text-text-primary mb-2 ${large ? 'text-[15px]' : 'text-sm'}`;
  const inputCls = `w-full bg-white/80 border border-[#D4A574]/35 rounded-lg
                       text-text-primary placeholder:text-text-primary/40
                       focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold
                       transition-all duration-200 ${large ? 'px-4 py-4 text-lg' : 'px-4 py-3'}`;
  const dateInputCls = `${inputCls} text-center ${large ? '' : 'px-3'}`;

  return (
    <div
      className={`w-full mx-auto bg-white/80 backdrop-blur-sm shadow-lg border border-[#D4A574]/40 ${
        large ? 'max-w-none rounded-2xl p-8 sm:p-10' : 'max-w-md rounded-xl p-6'
      }`}
    >
      <div className={`text-center ${large ? 'mb-8' : 'mb-6'}`}>
        <div
          className={`bg-gradient-to-br from-goldlight to-[#C9963C] rounded-full flex items-center justify-center mx-auto ${
            large ? 'w-16 h-16 mb-4' : 'w-12 h-12 mb-3'
          }`}
        >
          <Calendar className={`${large ? 'w-8 h-8' : 'w-6 h-6'} text-[#2A1850]`} />
        </div>
        <h2 className={`font-serif font-semibold text-text-primary ${large ? 'text-3xl leading-tight' : 'text-xl'}`}>
          Calculate Your <em className="italic text-[#A67C2E]">Destiny Matrix</em>
        </h2>
        <p className={`text-text-primary/60 ${large ? 'text-base mt-2' : 'text-sm mt-1'}`}>
          Enter your birth date to reveal your cosmic blueprint
        </p>
      </div>

      <form onSubmit={handleSubmit} className={large ? 'space-y-6' : 'space-y-4'}>
        <div>
          <label htmlFor="name" className={labelCls}>
            Your Name (optional)
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
            placeholder="Enter your name"
          />
        </div>

        <div className={`grid grid-cols-3 ${large ? 'gap-4' : 'gap-3'}`}>
          <div>
            <label htmlFor="day" className={labelCls}>
              Day
            </label>
            <input
              id="day"
              type="number"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              min="1"
              max="31"
              className={dateInputCls}
              placeholder="DD"
              required
            />
          </div>

          <div>
            <label htmlFor="month" className={labelCls}>
              Month
            </label>
            <input
              id="month"
              type="number"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              min="1"
              max="12"
              className={dateInputCls}
              placeholder="MM"
              required
            />
          </div>

          <div>
            <label htmlFor="year" className={labelCls}>
              Year
            </label>
            <input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min="1900"
              max={new Date().getFullYear()}
              className={dateInputCls}
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
          className={`w-full px-4 bg-gradient-to-r from-goldlight to-[#C9963C] text-[#2A1850] font-semibold
                     rounded-lg shadow-md hover:shadow-lg disabled:opacity-50
                     disabled:cursor-not-allowed transition-all duration-200
                     flex items-center justify-center gap-2 ${large ? 'py-4 text-lg' : 'py-3'}`}
        >
          {isCalculating ? (
            <>
              <div className="w-5 h-5 border-2 border-[#2A1850]/30 border-t-[#2A1850] rounded-full animate-spin" />
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
