import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon, Sparkles } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { faqPageSchema, webAppSchema, toolBreadcrumb } from '../lib/schema';
import { SalesCTA } from '../components/SalesCTA';
import { ArcanaModal, type SelectedArcana } from '../components/chart/ArcanaModal';
import { dailyArcana, moonPhase } from '../lib/numerology';
import { getArcana } from '../lib/arcana-meanings';

const FAQS = [
  {
    q: 'Is the daily tarot card the same for everyone?',
    a: 'Yes. The Arcana of the Day is drawn from the calendar date itself, so everyone who visits today meets the same card. That is the point of it — a shared weather report for the day. Your personal numbers (your Personal Day, your own chart) are where the reading becomes yours alone.',
  },
  {
    q: 'How is the daily card chosen?',
    a: 'By arithmetic, not by shuffle. The digits of today\'s day, month and year are added together and reduced into the 1–22 range of the Major Arcana — the worked example below shows today\'s exact sums. The same date always produces the same card, anywhere in the world.',
  },
  {
    q: 'When does the daily card change?',
    a: 'At midnight, with the date. Yesterday\'s and tomorrow\'s cards are shown beside today\'s so you can feel the sequence — practitioners often notice that a difficult card makes more sense once you see what it was following, and what it is preparing.',
  },
  {
    q: 'How is this different from a tarot reading?',
    a: 'A tarot reading draws cards in response to a question, and the reader interprets their positions and combinations. The Arcana of the Day is a single date-derived card — closer to a daily theme or meditation than to a reading. Use it as a lens for the day: a quality to lean into, a trap to watch for, and one honest question to carry.',
  },
];

function digitSum(n: number): number {
  return String(n).split('').reduce((a, c) => a + Number(c), 0);
}

function reductionChain(total: number): number[] {
  const chain = [total];
  let x = total;
  while (x > 22) {
    x = digitSum(x);
    chain.push(x);
  }
  return chain;
}

export function DailyArcana() {
  const today = new Date();
  const arcana = getArcana(dailyArcana(today));
  const moon = moonPhase(today);
  const daySum = digitSum(today.getDate());
  const monthSum = digitSum(today.getMonth() + 1);
  const yearSum = digitSum(today.getFullYear());
  const chain = reductionChain(daySum + monthSum + yearSum);
  const [selected, setSelected] = useState<SelectedArcana | null>(null);

  const yesterday = getArcana(dailyArcana(new Date(today.getTime() - 86400000)));
  const tomorrow = getArcana(dailyArcana(new Date(today.getTime() + 86400000)));

  return (
    <PublicLayout>
      <ToolHero
        image="/images/daily-arcana-illustration.webp"
        imageAlt="An ornate tarot-like card with a golden eight-pointed star on its face, standing among the stars"
        eyebrow="Daily tarot · Guidance"
        title="Daily Tarot Card — Arcana of the Day"
        subtitle="Every date carries an arcana of its own — your daily tarot draw. This is today's card, drawn from the date itself, the same for everyone, and different tomorrow."
        schema={[webAppSchema('Daily Tarot Card — Arcana of the Day', '/tools/daily-arcana', "Every date carries an arcana of its own — your daily tarot draw. This is today's card, drawn from the date itself, the same for everyone, and different tomorrow."), faqPageSchema(FAQS), toolBreadcrumb('Daily Tarot Card', '/tools/daily-arcana')]}
      />


      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-gold/25 shadow-xl p-8 text-center mb-6 text-text-primary">
          <p className="text-sm text-text-primary/55 mb-4">
            {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            {' '}· Moon: {moon.emoji} {moon.name}
          </p>
          <button
            onClick={() => setSelected({ position: 'Arcana of the Day', arcana })}
            className="block mx-auto group"
          >
            <div className="w-28 h-28 bg-gradient-to-r from-gold to-purple rounded-full flex items-center justify-center text-white text-5xl font-bold mx-auto shadow-lg group-hover:scale-105 transition-transform">
              {arcana.id}
            </div>
          </button>
          <h2 className="text-3xl font-serif font-bold mt-5 mb-2">{arcana.name}</h2>
          <p className="text-lg text-text-primary/60 italic mb-5">"{arcana.description}"</p>
          <p className="text-text-primary/78 leading-relaxed max-w-xl mx-auto mb-5">{arcana.personality}</p>
          <div className="bg-gradient-to-r from-purple/10 to-gold/10 rounded-xl p-4 max-w-xl mx-auto mb-6">
            <p className="italic font-medium text-text-primary/85">"{arcana.affirmation}"</p>
            <p className="text-xs text-text-primary/50 mt-1">Today's affirmation</p>
          </div>
          <button
            onClick={() => setSelected({ position: 'Arcana of the Day', arcana })}
            className="px-6 py-3 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-lg transition-all"
          >
            Read the full interpretation
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/[0.04] rounded-2xl border border-white/10 p-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-goldlight mb-2">Theme</p>
            <p className="text-lav/85 leading-relaxed">
              <strong className="text-cream">{arcana.description}.</strong> {arcana.personality}
            </p>
          </div>
          <div className="bg-white/[0.04] rounded-2xl border border-white/10 p-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-goldlight mb-2">Lean into</p>
            <ul className="text-lav/85 leading-relaxed space-y-1.5">
              {arcana.strengths.map((s) => <li key={s}>• {s}</li>)}
            </ul>
            <p className="text-lav/70 text-sm mt-3">These are the qualities today's card rewards when you use them deliberately.</p>
          </div>
          <div className="bg-white/[0.04] rounded-2xl border border-white/10 p-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-goldlight mb-2">Be careful</p>
            <ul className="text-lav/85 leading-relaxed space-y-1.5">
              {arcana.challenges.map((c) => <li key={c}>• {c}</li>)}
            </ul>
            <p className="text-lav/70 text-sm mt-3">Every card has a shadow side. Today, these are the forms it is most likely to take.</p>
          </div>
          <div className="bg-white/[0.04] rounded-2xl border border-goldlight/30 p-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-goldlight mb-2">Reflection</p>
            <p className="text-lav/85 leading-relaxed mb-3">{arcana.karmicLesson}</p>
            <p className="text-lav/85 leading-relaxed">
              Carry one sentence with you today: <em className="text-cream">“{arcana.affirmation}”</em>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <div className="bg-white/[0.04] rounded-2xl border border-white/10 p-5 text-center">
            <p className="text-xs font-semibold tracking-widest uppercase text-lavdim mb-1.5">Yesterday</p>
            <p className="font-serif font-semibold text-cream">{yesterday.id} · {yesterday.name}</p>
          </div>
          <div className="bg-white/[0.04] rounded-2xl border border-white/10 p-5 text-center">
            <p className="text-xs font-semibold tracking-widest uppercase text-lavdim mb-1.5">Tomorrow</p>
            <p className="font-serif font-semibold text-cream">{tomorrow.id} · {tomorrow.name}</p>
          </div>
        </div>

        <div className="bg-white/[0.04] rounded-2xl border border-goldlight/30 p-7 text-center">
          <Moon className="w-7 h-7 text-goldlight mx-auto mb-2" />
          <h2 className="font-serif font-semibold text-xl text-cream mb-2">Your personal daily number is different</h2>
          <p className="text-lav/75 mb-5 max-w-md mx-auto">
            The Arcana of the Day is collective. Your <em>Personal Day</em> number is yours alone — see both, every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/tools/personal-year" className="px-6 py-3 bg-gradient-to-r from-gold to-purple text-white font-medium rounded-xl hover:shadow-lg transition-all">
              My Personal Day number
            </Link>
            <Link to="/#demo" className="px-6 py-3 bg-white/[0.04] border border-white/25 text-cream font-medium rounded-xl hover:border-goldlight/60 transition-all inline-flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" /> My full Destiny Matrix
            </Link>
          </div>
        </div>
        <div className="mt-14">
          <h2 className="text-2xl font-serif font-bold text-cream mb-3 text-center">How your daily card is chosen</h2>
          <p className="text-lav/75 leading-relaxed max-w-2xl mx-auto text-center mb-6">
            No shuffle, no randomness — the card is hidden inside the date itself. The digits of the day, the month and
            the year are each added up, the three sums are combined, and the total is reduced, digit by digit, until it
            lands in the 1–22 range of the Major Arcana. Because the arithmetic never changes, the same date always
            draws the same card — for everyone, all day, until midnight turns the page.
          </p>
          <div className="bg-white/[0.04] rounded-2xl border border-white/10 p-6 max-w-2xl mx-auto">
            <p className="text-xs font-semibold tracking-widest uppercase text-goldlight mb-3 text-center">Today's working, live</p>
            <ul className="space-y-2.5 text-lav/85 leading-relaxed">
              <li>
                <strong className="text-cream">Day:</strong> {today.getDate()} → digit sum {daySum}.{' '}
                <strong className="text-cream">Month:</strong> {today.getMonth() + 1} → digit sum {monthSum}.{' '}
                <strong className="text-cream">Year:</strong> {today.getFullYear()} → digit sum {yearSum}.
              </li>
              <li>
                <strong className="text-cream">Combined:</strong> {daySum} + {monthSum} + {yearSum} = {chain[0]}
                {chain.length > 1 && (
                  <> → reduced digit by digit: {chain.slice(1).join(' → ')}</>
                )}
                .
              </li>
              <li>
                <strong className="text-cream">Card {arcana.id}:</strong> {arcana.name} — {arcana.description.toLowerCase()}. That is today's theme, from sunrise to midnight.
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-cream mb-6 text-center">Daily card questions</h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.q} className="bg-white/[0.04] rounded-2xl border border-white/10 p-6">
                <h3 className="font-serif font-semibold text-lg text-cream mb-2">{f.q}</h3>
                <p className="text-lav/80 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <SalesCTA
          headline="Today's card is a hint. Your chart is the whole message."
          context="The daily tarot card speaks to everyone. Your AI deep reading speaks only to you — your love line, money line and karmic pattern, read from your own birth date."
        />
      </section>

      <ArcanaModal selected={selected} onClose={() => setSelected(null)} />
    </PublicLayout>
  );
}
