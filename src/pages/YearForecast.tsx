import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Sparkles, CalendarClock } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { ChartCalculator } from '../components/chart/ChartCalculator';
import { DestinyMatrixChart } from '../components/chart/DestinyMatrixChart';
import { ChartLines } from '../components/chart/ChartLines';
import { ArcanaModal, type SelectedArcana } from '../components/chart/ArcanaModal';
import { yearForecast } from '../lib/forecast';
import { PERSONAL_YEAR_MEANINGS } from '../lib/numerology-meanings';
import { getArcana, type Arcana } from '../lib/arcana-meanings';
import { exportChartPng } from '../lib/export-chart';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 9 }, (_, i) => CURRENT_YEAR - 2 + i);

export function YearForecast() {
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [personName, setPersonName] = useState('');
  const [targetYear, setTargetYear] = useState(CURRENT_YEAR);
  const [selected, setSelected] = useState<SelectedArcana | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  const forecast = birthDate ? yearForecast(birthDate, targetYear) : null;
  const pyMeaning = forecast ? PERSONAL_YEAR_MEANINGS[forecast.personalYear] : null;
  const themeArcana = forecast ? getArcana(forecast.matrix.X) : null;

  const handleNodeClick = (position: string, arcana: Arcana) => setSelected({ position, arcana });

  return (
    <PublicLayout>
      <ToolHero
        eyebrow="Destiny Matrix · Forecast"
        title="What does this year hold for you?"
        subtitle="Your birth matrix recalculated with the target year — see the energies, lessons and opportunities a specific year activates for you."
      />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {!birthDate ? (
          <ChartCalculator
            onCalculate={(date, name) => {
              setBirthDate(date);
              setPersonName(name);
            }}
          />
        ) : (
          <div className="animate-fadeIn">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-serif font-bold">
                  {personName}'s {targetYear} Forecast
                </h2>
                <p className="text-sm text-text-primary/60">
                  Turning {forecast?.turningAge} this year · Personal Year {forecast?.personalYear}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-purple" />
                <select
                  value={targetYear}
                  onChange={(e) => setTargetYear(Number(e.target.value))}
                  className="px-4 py-2.5 bg-white/80 border border-purple/30 rounded-lg text-text-primary font-medium focus:outline-none focus:ring-2 focus:ring-gold/50"
                >
                  {YEARS.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            {pyMeaning && (
              <div className="bg-gradient-to-br from-gold/15 to-purple/15 rounded-2xl p-6 border border-gold/30 mb-6">
                <p className="text-xs font-semibold tracking-widest uppercase text-purple mb-1">
                  Personal Year {pyMeaning.year} theme
                </p>
                <h3 className="text-xl font-serif font-bold mb-2">{pyMeaning.theme}</h3>
                <p className="text-text-primary/75 mb-4">{pyMeaning.description}</p>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <p className="bg-white/70 rounded-lg p-3"><span className="font-semibold text-green-700">Lean in:</span> {pyMeaning.focus}</p>
                  <p className="bg-white/70 rounded-lg p-3"><span className="font-semibold text-red-600">Watch out:</span> {pyMeaning.avoid}</p>
                </div>
              </div>
            )}

            <div ref={chartRef} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 mb-6 shadow-xl border border-purple/20">
              <DestinyMatrixChart result={forecast!.matrix} onNodeClick={handleNodeClick} />
              <p className="text-center text-sm text-text-primary/50 mt-2">Tap any node for its meaning</p>
            </div>

            <div className="mb-6">
              <ChartLines result={forecast!.matrix} onNodeClick={handleNodeClick} />
            </div>

            {themeArcana && (
              <div className="bg-white/80 rounded-2xl p-6 border border-gold/20 mb-8">
                <p className="text-xs font-semibold tracking-wide uppercase text-purple mb-1">The year's ruling energy</p>
                <p className="font-serif font-semibold text-lg mb-2">{themeArcana.id} · {themeArcana.name}</p>
                <p className="text-sm text-text-primary/75 mb-2">{themeArcana.personality}</p>
                <p className="text-sm italic text-text-primary/60">"{themeArcana.affirmation}"</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => exportChartPng(chartRef.current, `year-forecast-${targetYear}.png`)}
                className="px-6 py-3 bg-white/80 border border-gold/40 text-text-primary font-medium rounded-xl hover:border-gold hover:shadow transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> Download forecast (free)
              </button>
              <button
                onClick={() => setBirthDate(null)}
                className="px-6 py-3 bg-white/80 border border-purple/30 text-text-primary font-medium rounded-xl hover:border-purple/60 transition-all"
              >
                Different birth date
              </button>
              <Link
                to="/auth"
                className="px-6 py-3 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" /> Save — free account
              </Link>
            </div>
          </div>
        )}
      </section>

      <ArcanaModal selected={selected} onClose={() => setSelected(null)} />
    </PublicLayout>
  );
}
