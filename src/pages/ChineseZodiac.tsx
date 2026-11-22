import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Search, Sparkles } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { faqPageSchema, webAppSchema, toolBreadcrumb } from '../lib/schema';
import {
  ANIMALS, YEAR_2027, animalForBirthDate, type BirthAnimalResult,
} from '../lib/chinese-zodiac';

const FAQS = [
  {
    q: 'What is my Chinese zodiac animal?',
    a: 'Your Chinese zodiac animal is set by your birth year — but the year turns at Chinese New Year, not on 1 January. If you were born in January or February, you may belong to the previous year’s animal. Enter your full birth date in the finder above and it will place you exactly, using the real Chinese New Year date for your year.',
  },
  {
    q: 'Why does the Chinese zodiac change in January or February, not on 1 January?',
    a: 'The Chinese calendar is lunisolar: its new year falls on the second new moon after the winter solstice, which lands between 21 January and 20 February. Each zodiac year begins on that day — so a baby born on 5 February 2027 is a Fire Horse, while a baby born one day later, on 6 February, is a Fire Goat.',
  },
  {
    q: 'What are the five elements in the Chinese zodiac?',
    a: 'Alongside the 12 animals runs a cycle of five elements — Wood, Fire, Earth, Metal and Water — each ruling two years in turn, one Yang and one Yin. Animal and element together repeat only every 60 years, which is why 2027 is not just a Goat year but a Fire Goat year, the first since 1967. Your element is set by your birth year: years ending in 4–5 are Wood, 6–7 Fire, 8–9 Earth, 0–1 Metal and 2–3 Water.',
  },
  {
    q: 'What is the Chinese zodiac animal for 2027?',
    a: '2027 is the year of the Fire Goat (also translated as Sheep or Ram). It begins at Chinese New Year on February 6, 2027 and runs to January 25, 2028. The Goat is the zodiac’s artist — gentle, creative and harmony-loving — and Fire adds warmth and visibility, making 2027 a year of craft, community and home.',
  },
  {
    q: 'How is the Chinese zodiac different from my Destiny Matrix chart?',
    a: 'Your Chinese zodiac animal is shared with everyone born in your zodiac year — it describes the climate of a generation. Your Destiny Matrix chart is calculated from your exact birth date, day, month and year, so it is yours alone: soul purpose, love line, money line and karmic tail. The two systems read different layers, and many people enjoy holding both.',
  },
];

export function ChineseZodiac() {
  const [birthDate, setBirthDate] = useState('');
  const [result, setResult] = useState<BirthAnimalResult | null>(null);

  const find = () => {
    if (!birthDate) return;
    const d = new Date(`${birthDate}T12:00:00`);
    if (Number.isNaN(d.getTime())) return;
    setResult(animalForBirthDate(d));
  };

  return (
    <PublicLayout>
      <ToolHero
        image="/images/chinese-zodiac-illustration.webp"
        imageAlt="A golden celestial wheel of the twelve Chinese zodiac animals around a radiant star, on a deep indigo night sky"
        eyebrow="Chinese Zodiac · Year Animals & Elements"
        title="Chinese Zodiac — What Is Your Animal?"
        subtitle="Twelve animals, five elements, one sixty-year wheel. Enter your birth date and find your animal exactly — placed by the real Chinese New Year, not by 1 January."
        schema={[
          webAppSchema('Chinese Zodiac Finder', '/tools/chinese-zodiac', 'Twelve animals, five elements, one sixty-year wheel. Enter your birth date and find your animal exactly — placed by the real Chinese New Year, not by 1 January.'),
          faqPageSchema(FAQS),
          toolBreadcrumb('Chinese Zodiac', '/tools/chinese-zodiac'),
        ]}
      />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Finder */}
        <div className="bg-white/[0.04] rounded-3xl border border-goldlight/30 p-7 sm:p-8 mb-6">
          <h2 className="font-serif text-2xl text-cream mb-2 flex items-center gap-2.5">
            <Search className="w-5 h-5 text-goldlight" /> Find your animal
          </h2>
          <p className="text-lav/75 mb-5">
            Your date of birth — we check it against the actual Chinese New Year of your year,
            so January and February birthdays land on the right animal.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className="flex-1 rounded-xl bg-night2 border border-white/15 px-4 py-3 text-cream [color-scheme:dark] focus:outline-none focus:border-goldlight/60"
            />
            <button
              onClick={find}
              className="px-6 py-3 bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 font-semibold rounded-xl hover:shadow-[0_0_24px_rgba(231,200,115,0.45)] transition-all"
            >
              Reveal my animal
            </button>
          </div>

          {result && (
            <div className="mt-7 bg-night2/70 rounded-2xl border border-goldlight/40 p-6 sm:p-7 animate-fadeIn">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="text-7xl leading-none select-none" aria-hidden="true">{result.animal.glyph}</div>
                <div className="flex-1">
                  <p className="text-xs font-semibold tracking-widest uppercase text-goldlight mb-1">
                    Your Chinese zodiac animal
                  </p>
                  <h3 className="font-serif text-3xl text-cream mb-2">
                    {result.element} {result.animal.name}
                    <span className="text-lav/60 text-xl"> · {result.polarity} · {result.animal.name} year of {result.effectiveYear}</span>
                  </h3>
                  <p className="text-lav/85 leading-relaxed mb-4">
                    {result.animal.traits.split('. ')[0]}. {result.animal.traits.split('. ')[1] ?? ''}
                  </p>
                  {result.beforeNewYear && (
                    <p className="text-sm text-goldlight/90 bg-goldlight/[0.07] border border-goldlight/25 rounded-xl px-4 py-3 mb-4">
                      You were born before Chinese New Year in {result.effectiveYear + 1} — so you belong to the{' '}
                      {result.animal.name} year that began the year before, not to the animal of your calendar year.
                      This is the most common Chinese zodiac mistake, and you just avoided it.
                    </p>
                  )}
                  {!result.exact && (
                    <p className="text-sm text-lavdim bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 mb-4">
                      Your birth year sits outside our verified Chinese New Year table (1990–2032), so this is a
                      year-based result. If you were born in January or February, your animal may be the previous
                      year’s — the animal changes on Chinese New Year, not on 1 January.
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to={`/tools/chinese-zodiac/${result.animal.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-goldlight to-[#C9963C] text-night3 text-sm font-semibold hover:shadow-[0_0_22px_rgba(231,200,115,0.45)] transition-all"
                    >
                      Your full {result.animal.name} profile <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to={`/tools/chinese-zodiac/2027/${result.animal.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-goldlight/40 text-goldlight text-sm font-medium hover:bg-goldlight/10 transition-all"
                    >
                      {result.animal.name} in 2027 — the Fire Goat year
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 2027 banner */}
        <Link
          to="/tools/chinese-zodiac/2027"
          className="block relative overflow-hidden bg-gradient-to-b from-night3 to-night2 rounded-3xl border border-goldlight/50 p-7 sm:p-8 mb-12 group"
        >
          <div className="absolute -top-8 -right-2 text-[9rem] leading-none text-goldlight/[0.08] select-none pointer-events-none">羊</div>
          <p className="flex items-center gap-2 text-xs font-semibold tracking-widest uppercase text-goldlight mb-2">
            <CalendarDays className="w-4 h-4" /> Chinese New Year · {YEAR_2027.cnyDate}
          </p>
          <h2 className="relative font-serif text-2xl sm:text-3xl text-cream mb-2 group-hover:text-goldlight transition-colors">
            2027 is the Year of the Fire Goat
          </h2>
          <p className="relative text-lav/85 leading-relaxed max-w-2xl">
            A Yin Fire year of craft, harmony and home — and a very different climate for each of the
            twelve animals. Read the year, and your animal’s place in it.
          </p>
          <span className="relative inline-flex items-center gap-2 mt-4 text-goldlight font-medium">
            Explore 2027 for every animal <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Link>

        {/* The twelve animals */}
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream mb-2 text-center">The twelve animals</h2>
        <p className="text-lav/70 text-center mb-8 max-w-xl mx-auto">
          In the order they arrived at the Jade Emperor’s river crossing — the race that fixed the wheel for good.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {ANIMALS.map((a) => (
            <Link
              key={a.slug}
              to={`/tools/chinese-zodiac/${a.slug}`}
              className="bg-white/[0.04] rounded-2xl border border-white/10 p-6 hover:border-goldlight/50 hover:shadow-[0_24px_55px_-20px_rgba(231,200,115,0.4)] transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-5xl leading-none text-goldlight/90" aria-hidden="true">{a.glyph}</span>
                <span className="text-[11px] font-semibold tracking-wide uppercase bg-night/70 text-goldlight px-2.5 py-1 rounded-full">
                  {a.branchElement} branch
                </span>
              </div>
              <h3 className="font-serif text-xl text-cream mb-1 group-hover:text-goldlight transition-colors">
                Year of the {a.name}
              </h3>
              <p className="text-xs text-lavdim mb-2.5">
                {a.years.slice(-3).join(' · ')} · every 12 years
              </p>
              <p className="text-sm text-lav/75 leading-relaxed">{a.traits.split('. ')[0]}.</p>
            </Link>
          ))}
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-serif font-bold text-cream mb-6 text-center flex items-center justify-center gap-2.5">
            <Sparkles className="w-5 h-5 text-goldlight" /> Chinese zodiac questions
          </h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.q} className="bg-white/[0.04] rounded-2xl border border-white/10 p-6">
                <h3 className="font-serif font-semibold text-lg text-cream mb-2">{f.q}</h3>
                <p className="text-lav/80 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-lavdim mt-10">
            Want the chart that is yours alone? Calculate your{' '}
            <Link to="/#demo" className="text-goldlight font-medium hover:underline inline-flex items-center gap-1">
              Destiny Matrix <ArrowRight className="w-3.5 h-3.5" />
            </Link>{' '}
            from your exact birth date.
          </p>
        </div>
      </section>
    </PublicLayout>
  );
}
