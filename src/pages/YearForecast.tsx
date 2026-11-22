import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, Sparkles, CalendarClock } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { faqPageSchema, webAppSchema, toolBreadcrumb } from '../lib/schema';
import { ChartCalculator } from '../components/chart/ChartCalculator';
import { DestinyMatrixChart } from '../components/chart/DestinyMatrixChart';
import { ChartLines } from '../components/chart/ChartLines';
import { ArcanaModal, type SelectedArcana } from '../components/chart/ArcanaModal';
import { yearForecast } from '../lib/forecast';
import { PERSONAL_YEAR_MEANINGS } from '../lib/numerology-meanings';
import { getArcana, type Arcana } from '../lib/arcana-meanings';
import { exportChartPng } from '../lib/export-chart';

const FORECAST_PARTS = [
  {
    title: 'The year chart',
    text: 'Your full matrix for the chosen year. Its centre is the year’s ruling energy — the arcana the whole year is filtered through — and its love and money lines show where the year’s emphasis falls.',
  },
  {
    title: 'The Personal Year theme',
    text: 'A number from 1 to 9, worked out from your birth day and month plus the target year. It places the year inside your nine-year cycle — a 1 year opens a cycle, a 9 year closes one — and sets the theme, the focus to lean into and the pattern to watch.',
  },
  {
    title: 'Any year, past or ahead',
    text: 'The picker covers two years back to six years ahead, so you can look back at a year you have already lived to see how the reading matches it, or look ahead and plan with the grain of the coming year.',
  },
];

const FAQS = [
  {
    q: 'What is a year forecast in the Destiny Matrix?',
    a: 'It is your Destiny Matrix recalculated for one specific year. The target year takes the place of your birth year in the calculation, so the year-derived points of the chart show the energies, lessons and opportunities that year activates for you personally — read together with your Personal Year theme for that year.',
  },
  {
    q: 'How is my year energy calculated?',
    a: 'In two parts. First, your matrix is recalculated with the target year in place of your birth year, keeping your own birth day and month; the centre of that year chart is its ruling energy. Second, your Personal Year number is worked out from your birth day, your birth month and the target year, reduced to a single digit from 1 to 9 — the cycle position that sets the year’s theme.',
  },
  {
    q: 'When does my forecast year start — in January, or on my birthday?',
    a: 'On Gaia Vesta, in January. The forecast is read by calendar year: your Personal Year number is calculated from your birth day and month plus the calendar year, so it turns over on 1 January, and the year chart describes that calendar year as a whole. Some traditions count personal years from birthday to birthday instead — the number itself is worked out the same way; only the changeover date differs.',
  },
  {
    q: 'Is this a prediction of what will happen?',
    a: 'No. A forecast describes themes and tendencies — the energies a year activates and the lessons it tends to bring forward — not events. It cannot tell you what will happen; it shows you what to lean into and what to watch, so you can meet the year deliberately rather than by accident.',
  },
  {
    q: 'Is the year forecast free?',
    a: 'Yes — the year chart, the Personal Year theme, the ruling energy and the chart download are all free, for any year in the picker. A free account is only needed if you want to save the forecast.',
  },
];

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
        image="/images/year-forecast-illustration.webp"
        imageAlt="A circular golden wheel of twelve glowing segments ringed by moon phases in an indigo night sky"
        eyebrow="Destiny Matrix · Forecast"
        title="What does this year hold for you?"
        subtitle="Your birth matrix recalculated with the target year — see the energies, lessons and opportunities a specific year activates for you."
        schema={[webAppSchema('Destiny Matrix Year Forecast', '/tools/year-forecast', "Your birth matrix recalculated with the target year — see the energies, lessons and opportunities a specific year activates for you."), faqPageSchema(FAQS), toolBreadcrumb('Year Forecast', '/tools/year-forecast')]}
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
                <h2 className="text-2xl font-serif font-bold text-cream">
                  {personName}'s {targetYear} Forecast
                </h2>
                <p className="text-sm text-lav/70">
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
                <p className="text-xs font-semibold tracking-widest uppercase text-goldlight mb-1">
                  Personal Year {pyMeaning.year} theme
                </p>
                <h3 className="text-xl font-serif font-bold text-cream mb-2">{pyMeaning.theme}</h3>
                <p className="text-lav/85 mb-4">{pyMeaning.description}</p>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <p className="bg-white/[0.06] border border-white/10 rounded-lg p-3 text-lav/85"><span className="font-semibold text-emerald-300">Lean in:</span> {pyMeaning.focus}</p>
                  <p className="bg-white/[0.06] border border-white/10 rounded-lg p-3 text-lav/85"><span className="font-semibold text-rose-300">Watch out:</span> {pyMeaning.avoid}</p>
                </div>
              </div>
            )}

            <div ref={chartRef} className="bg-[#FAF5EA] backdrop-blur-sm rounded-[1.75rem] p-5 sm:p-8 mb-6 shadow-[0_30px_80px_-20px_rgba(124,92,191,0.45)] border border-purple/20 text-text-primary">
              <DestinyMatrixChart result={forecast!.matrix} onNodeClick={handleNodeClick} />
              <p className="text-center text-sm text-text-primary/50 mt-2">Tap any node for its meaning</p>
            </div>

            <div className="mb-6">
              <ChartLines result={forecast!.matrix} onNodeClick={handleNodeClick} />
            </div>

            {themeArcana && (
              <div className="bg-white/80 rounded-2xl p-6 border border-gold/20 mb-8 text-text-primary">
                <p className="text-xs font-semibold tracking-wide uppercase text-purple mb-1">The year's ruling energy</p>
                <p className="font-serif font-semibold text-lg mb-2">{themeArcana.id} · {themeArcana.name}</p>
                <p className="text-sm text-text-primary/75 mb-2">{themeArcana.personality}</p>
                <p className="text-sm italic text-text-primary/60">"{themeArcana.affirmation}"</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => exportChartPng(chartRef.current, `year-forecast-${targetYear}.png`)}
                className="px-6 py-3 bg-white/[0.04] border border-white/25 text-cream font-medium rounded-xl hover:border-goldlight/60 hover:shadow transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" /> Download forecast (free)
              </button>
              <button
                onClick={() => setBirthDate(null)}
                className="px-6 py-3 bg-white/[0.04] border border-white/25 text-cream font-medium rounded-xl hover:border-goldlight/60 transition-all"
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

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-serif font-bold text-cream mb-4 text-center">How the Year Forecast Works</h2>
        <p className="text-lav/80 leading-relaxed max-w-3xl mx-auto text-center mb-10">
          The forecast recalculates your Destiny Matrix with the target year standing in place of your birth
          year. Your birth day and month stay your own, so the points of the chart that are derived from the
          year — the foundation point, the karmic point and everything built on them — shift to the energies
          that year activates for you. That year chart is then read alongside your Personal Year theme:
        </p>
        <div className="grid md:grid-cols-3 gap-4 mb-16">
          {FORECAST_PARTS.map((p) => (
            <div key={p.title} className="bg-white/[0.04] rounded-2xl border border-white/10 p-6">
              <h3 className="font-serif font-semibold text-lg text-cream mb-2">{p.title}</h3>
              <p className="text-sm text-lav/80 leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>

        <h2 className="text-2xl font-serif font-bold text-cream mb-6 text-center">Year forecast questions</h2>
        <div className="space-y-4">
          {FAQS.map((f) => (
            <div key={f.q} className="bg-white/[0.04] rounded-2xl border border-white/10 p-6">
              <h3 className="font-serif font-semibold text-lg text-cream mb-2">{f.q}</h3>
              <p className="text-lav/80 leading-relaxed">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <ArcanaModal selected={selected} onClose={() => setSelected(null)} />
    </PublicLayout>
  );
}
