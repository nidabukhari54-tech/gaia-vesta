import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Moon } from 'lucide-react';
import { PublicLayout, ToolHero } from '../components/PublicLayout';
import { faqPageSchema, webAppSchema, toolBreadcrumb } from '../lib/schema';
import { moonPhase, zodiacSign } from '../lib/numerology';

const PHASE_GUIDANCE: Record<string, string> = {
  'New Moon': 'The sky resets. Set intentions, plant seeds, start quietly — this is the cycle\'s blank page.',
  'Waxing Crescent': 'First light, first steps. Momentum is fragile but real; take the smallest brave action toward your intention.',
  'First Quarter': 'The moon is half-lit and pushing. Obstacles appear specifically so you can prove the intention matters.',
  'Waxing Gibbous': 'Refinement time. Adjust, polish, and trust the build-up — the full picture is close.',
  'Full Moon': 'Peak illumination. Things come to light, emotions run high, and results — good or awkward — become visible. Harvest and release.',
  'Waning Gibbous': 'The light softens into gratitude and sharing. Teach what you learned; give something back.',
  'Last Quarter': 'Forgiveness and clearing. Let go of what the cycle proved is not working; make space.',
  'Waning Crescent': 'The darkening moon asks for rest, dreams, and surrender. Charge yourself before the next beginning.',
};

const PHASE_DETAILS: Record<string, { bestFor: string; avoid: string; reflection: string }> = {
  'New Moon': {
    bestFor: 'Setting intentions, starting journals and projects quietly, clearing your desk and your calendar for the cycle ahead.',
    avoid: 'Launching publicly, demanding answers, or judging a seed for not being a tree yet.',
    reflection: 'If this cycle could only change one thing, what would I choose — and what is the smallest first step?',
  },
  'Waxing Crescent': {
    bestFor: 'First visible steps: sending the message, booking the appointment, telling one person what you intend.',
    avoid: 'Waiting for full confidence before moving, or sharing the plan with everyone for approval.',
    reflection: 'What is one small, brave action I can take in the next 48 hours that my future self will thank me for?',
  },
  'First Quarter': {
    bestFor: 'Decisions, deadlines and pushing through the first real resistance. Saying the honest no.',
    avoid: 'Quitting at the first obstacle, or treating friction as a sign you chose wrong.',
    reflection: 'Where is the resistance actually pointing — at a flaw in the plan, or at the size of my commitment?',
  },
  'Waxing Gibbous': {
    bestFor: 'Editing, refining and improving what is already in motion. Feedback is gold now — ask for it.',
    avoid: 'Starting something brand new, or polishing endlessly to delay the reveal.',
    reflection: 'What one adjustment would most improve what I am building — and what am I avoiding changing?',
  },
  'Full Moon': {
    bestFor: 'Harvesting results, celebrating honestly, having the conversation that brings things into the light, releasing what peaked.',
    avoid: 'Big irreversible decisions made at emotional maximum, or pretending not to see what is now obvious.',
    reflection: 'What has this cycle shown me, clearly, that I already knew but had not admitted?',
  },
  'Waning Gibbous': {
    bestFor: 'Sharing what you learned, teaching, mentoring, gratitude — and honest review while the lesson is fresh.',
    avoid: 'Hoarding the lesson, or rushing into the next beginning before this one has been digested.',
    reflection: 'Who taught me something this cycle — and have I actually thanked them?',
  },
  'Last Quarter': {
    bestFor: 'Forgiving, decluttering, ending what the cycle proved is finished, and renegotiating commitments.',
    avoid: 'Clinging to a plan because you announced it, or starting major new ventures on a clearing tide.',
    reflection: 'What am I still carrying that this cycle has already ended? What would putting it down make room for?',
  },
  'Waning Crescent': {
    bestFor: 'Rest, sleep, dreams, gentle closure and doing less on purpose. Charging the battery is the work now.',
    avoid: 'Forcing productivity, or making promises your rested self will have to keep.',
    reflection: 'If I did nothing but restore myself before the new moon, what would I protect first?',
  },
};

const FAQS = [
  {
    q: 'How is the moon phase calculated?',
    a: 'Astronomically, from a known new moon (6 January 2000). Count the days from that date to the day you ask about, and divide by the moon\'s full cycle of about 29.53 days. The remainder is the moon\'s age; its position in the cycle gives the phase, and a simple cosine curve gives the illuminated percentage. The calculator above does exactly this, live, for any date.',
  },
  {
    q: 'What does the moon phase I was born under mean?',
    a: 'In lunar tradition, your birth phase is read as the season of your emotional life. New Moon births are starters and seekers; First Quarter births are builders who thrive on challenge; Full Moon births are expressers who need to be seen and to see results; Last Quarter births are reflectors and finishers. It is a flavour, not a fate — read it alongside your Destiny Matrix for the fuller picture.',
  },
  {
    q: 'Does the moon phase really affect mood and sleep?',
    a: 'Honestly: the science is mixed. Some studies find small effects on sleep around the full moon; many find none. What is certain is the rhythm effect — people who plan rest, launches and reviews around a visible natural cycle tend to pace themselves better. Treat the phases as a planning rhythm and a reflection prompt, not a medical claim.',
  },
  {
    q: 'How often does each phase occur?',
    a: 'The full cycle — new moon to new moon — takes about 29.53 days, so each of the eight phases lasts roughly 3.7 days. There are about 12.4 cycles in a year, which is why the moon phases drift against the calendar and why your birthday moon is different most years.',
  },
];

function daysUntilFull(age: number): number {
  const fullAt = 14.77;
  const diff = fullAt - age;
  return diff >= 0 ? Math.ceil(diff) : Math.ceil(diff + 29.53);
}

function daysUntilNew(age: number): number {
  return Math.ceil(29.53 - age);
}

export function MoonPhase() {
  const today = new Date();
  const [customDate, setCustomDate] = useState<string>('');
  const [birthPhase, setBirthPhase] = useState<ReturnType<typeof moonPhase> | null>(null);
  const [birthSign, setBirthSign] = useState<string | null>(null);

  const now = moonPhase(today);

  const handleDate = (value: string) => {
    setCustomDate(value);
    if (!value) {
      setBirthPhase(null);
      setBirthSign(null);
      return;
    }
    const d = new Date(value + 'T12:00:00');
    if (isNaN(d.getTime())) return;
    setBirthPhase(moonPhase(d));
    const sign = zodiacSign(d.getMonth() + 1, d.getDate());
    setBirthSign(`${sign.symbol} ${sign.name}`);
  };

  return (
    <PublicLayout>
      <ToolHero
        image="/images/moon-phase-illustration.webp"
        imageAlt="A large glowing full moon rising over a calm indigo sea, with a gentle arc of moon phases above it"
        eyebrow="Lunar · Daily"
        title="Moon Phase Today"
        subtitle="Tonight's exact moon phase, illumination and age — calculated live. Then check the moon (and your sun sign) on the day you were born."
        schema={[webAppSchema('Moon Phase Today', '/tools/moon-phase', "Tonight's exact moon phase, illumination and age — calculated live. Then check the moon (and your sun sign) on the day you were born."), faqPageSchema(FAQS), toolBreadcrumb('Moon Phase Today', '/tools/moon-phase')]}
      />


      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-gradient-to-br from-[#2b2440] to-[#4a3f6b] rounded-3xl p-8 text-center text-white shadow-xl mb-8">
          <p className="text-7xl mb-4">{now.emoji}</p>
          <h2 className="text-3xl font-serif font-bold mb-1">{now.name}</h2>
          <p className="text-white/70 text-sm mb-5">
            {today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <div className="flex justify-center gap-6 sm:gap-10 text-center mb-6">
            <div>
              <p className="text-2xl font-bold">{Math.round(now.illumination * 100)}%</p>
              <p className="text-xs text-white/60">Illuminated</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{now.age.toFixed(1)}</p>
              <p className="text-xs text-white/60">Days old</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{daysUntilFull(now.age)}d</p>
              <p className="text-xs text-white/60">To full moon</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{daysUntilNew(now.age)}d</p>
              <p className="text-xs text-white/60">To new moon</p>
            </div>
          </div>
          <p className="text-white/85 max-w-lg mx-auto leading-relaxed">{PHASE_GUIDANCE[now.name]}</p>
          <div className="grid sm:grid-cols-3 gap-3 max-w-2xl mx-auto mt-7 text-left">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-xs font-semibold tracking-widest uppercase text-goldlight mb-1.5">Best for</p>
              <p className="text-sm text-white/80 leading-relaxed">{PHASE_DETAILS[now.name].bestFor}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-xs font-semibold tracking-widest uppercase text-goldlight mb-1.5">Go gently</p>
              <p className="text-sm text-white/80 leading-relaxed">{PHASE_DETAILS[now.name].avoid}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-xs font-semibold tracking-widest uppercase text-goldlight mb-1.5">Reflection</p>
              <p className="text-sm text-white/80 leading-relaxed italic">{PHASE_DETAILS[now.name].reflection}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow border border-purple/20 text-text-primary">
          <div className="flex items-center gap-2 mb-3">
            <Moon className="w-5 h-5 text-purple" />
            <h3 className="font-serif font-semibold text-lg">The moon on your birth day</h3>
          </div>
          <input
            type="date"
            value={customDate}
            onChange={(e) => handleDate(e.target.value)}
            className="w-full px-4 py-3 bg-white/80 border border-purple/30 rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold transition-all"
          />
          {birthPhase && (
            <div className="mt-5 text-center animate-fadeIn">
              <p className="text-5xl mb-2">{birthPhase.emoji}</p>
              <p className="font-serif font-semibold text-xl">{birthPhase.name}</p>
              <p className="text-sm text-text-primary/60 mt-1">
                {Math.round(birthPhase.illumination * 100)}% illuminated · born under a {birthSign} sun
              </p>
              <p className="text-sm text-text-primary/70 mt-3 max-w-md mx-auto">{PHASE_GUIDANCE[birthPhase.name]}</p>
              <p className="text-sm text-text-primary/70 mt-2 max-w-md mx-auto">
                <strong className="text-text-primary">Born under this moon, you tend to thrive on:</strong> {PHASE_DETAILS[birthPhase.name].bestFor}
              </p>
            </div>
          )}
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-cream mb-3 text-center">How a moon phase is worked out</h2>
          <p className="text-lav/75 leading-relaxed max-w-2xl mx-auto text-center mb-6">
            Imagine a moon that is exactly <strong className="text-cream">10 days old</strong> — ten days since the last new moon.
            The working is the same one this page uses for tonight:
          </p>
          <div className="bg-white/[0.04] rounded-2xl border border-white/10 p-6 max-w-2xl mx-auto">
            <ul className="space-y-2.5 text-lav/85 leading-relaxed">
              <li><strong className="text-cream">Age:</strong> 10 days into a cycle of 29.53 days — a little over a third of the way round.</li>
              <li><strong className="text-cream">Illumination:</strong> the lit fraction follows a cosine curve — (1 − cos(2π × 10 ÷ 29.53)) ÷ 2 ≈ <strong className="text-cream">76% lit</strong>.</li>
              <li><strong className="text-cream">Phase:</strong> dividing the cycle into eighths, day 10 falls in the fourth eighth — a <strong className="text-cream">Waxing Gibbous</strong> moon, swelling toward full.</li>
              <li>So a 10-day-old moon reads: mostly lit, still growing — the refinement phase, a few days before everything comes into the open.</li>
            </ul>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-cream mb-3 text-center">All eight moon phases, explained</h2>
          <p className="text-lav/70 text-center max-w-2xl mx-auto mb-8">
            One full journey from darkness to full light and back — each phase with its own weather.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {Object.keys(PHASE_GUIDANCE).map((name) => (
              <div key={name} className="bg-white/[0.04] rounded-2xl border border-white/10 p-5">
                <h3 className="font-serif font-semibold text-cream mb-2">{name}</h3>
                <p className="text-sm text-lav/85 leading-relaxed mb-3">{PHASE_GUIDANCE[name]}</p>
                <p className="text-sm text-lav/75 leading-relaxed mb-1.5"><span className="text-goldlight font-medium">Best for:</span> {PHASE_DETAILS[name].bestFor}</p>
                <p className="text-sm text-lav/75 leading-relaxed mb-1.5"><span className="text-goldlight font-medium">Go gently:</span> {PHASE_DETAILS[name].avoid}</p>
                <p className="text-sm text-lav/75 leading-relaxed italic"><span className="text-goldlight font-medium not-italic">Reflection:</span> {PHASE_DETAILS[name].reflection}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-cream mb-6 text-center">Moon phase questions</h2>
          <div className="space-y-4">
            {FAQS.map((f) => (
              <div key={f.q} className="bg-white/[0.04] rounded-2xl border border-white/10 p-6">
                <h3 className="font-serif font-semibold text-lg text-cream mb-2">{f.q}</h3>
                <p className="text-lav/80 leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-serif font-bold text-cream mb-6 text-center">Keep exploring</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link to="/tools/daily-arcana" className="bg-white/[0.04] rounded-2xl border border-white/10 p-5 hover:border-goldlight/50 transition-all block">
              <h3 className="font-serif font-semibold text-cream mb-1">Daily Tarot Card</h3>
              <p className="text-sm text-lav/70">Today's arcana, drawn from the date itself.</p>
            </Link>
            <Link to="/tools/personal-year" className="bg-white/[0.04] rounded-2xl border border-white/10 p-5 hover:border-goldlight/50 transition-all block">
              <h3 className="font-serif font-semibold text-cream mb-1">Personal Year</h3>
              <p className="text-sm text-lav/70">Your longer cycle — the year, month and day you are in.</p>
            </Link>
            <Link to="/tools/angel-numbers" className="bg-white/[0.04] rounded-2xl border border-white/10 p-5 hover:border-goldlight/50 transition-all block">
              <h3 className="font-serif font-semibold text-cream mb-1">Angel Numbers</h3>
              <p className="text-sm text-lav/70">Find the repeating number your birth date hides.</p>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
