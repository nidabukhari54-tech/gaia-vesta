import { useEffect } from 'react';

/**
 * Per-page title + meta description machinery.
 *
 * Every routed page sets a UNIQUE meta description (target 140–154 chars,
 * hard cap 155) through one of these paths:
 *  - ToolHero / PublicLayout accept a `description` prop,
 *  - bespoke pages call useMetaDescription / usePageMeta directly.
 * The same description is mirrored into og:description and
 * twitter:description so social shares match the search snippet.
 */

function upsertMeta(selector: string, attrs: Record<string, string>, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function applyMetaDescription(description: string) {
  upsertMeta('meta[name="description"]', { name: 'description' }, description);
  upsertMeta('meta[property="og:description"]', { property: 'og:description' }, description);
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description' }, description);
}

export function useMetaDescription(description?: string) {
  useEffect(() => {
    if (description) applyMetaDescription(description);
  }, [description]);
}

/** For pages that set their own document.title (Landing, app pages). */
export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    document.title = title;
    if (description) applyMetaDescription(description);
  }, [title, description]);
}

/**
 * Grow a core description into the 140–154 band by appending honest extra
 * clauses, in order, while the total stays ≤155. If the core already lands
 * in band it is returned untouched.
 */
export function fitDesc(core: string, extras: string[] = []): string {
  let out = core;
  for (const extra of extras) {
    if (out.length >= 140) break;
    if (out.length + extra.length <= 155) out += extra;
  }
  return out;
}

const SUFFIX = ' | Gaia Vesta';

/** Pick the first candidate whose full length (incl. suffix) is ≤60 chars. */
function pickTitle(candidates: string[]): string {
  for (const c of candidates) {
    if ((c + SUFFIX).length <= 60) return c + SUFFIX;
  }
  return candidates[candidates.length - 1] + SUFFIX;
}

// ---------- Title builders (shared by pages + the title/meta audit) ----------

export function arcanaPageTitle(name: string): string {
  return pickTitle([
    `${name} Tarot Meaning — In the Destiny Matrix`,
    `${name} Tarot Meaning`,
  ]);
}

export function angelPageTitle(number: string, title: string): string {
  return pickTitle([
    `${number} Angel Number Meaning — ${title}`,
    `${number} Angel Number Meaning`,
  ]);
}

export function pairPageTitle(a: string, b: string): string {
  return pickTitle([
    `${a} and ${b} Compatibility — Love Match, Score & Meaning`,
    `${a} and ${b} Compatibility — Love Match & Score`,
    `${a} and ${b} Compatibility`,
  ]);
}

/** Pre-suffix pageTitle overrides for ToolHero sign pages (date-free, ≤60 with suffix). */
export const dailySignPageTitle = (name: string) => `${name} Horoscope Today`;
export const weeklySignPageTitle = (name: string) => `${name} Weekly Horoscope`;
export const sign2027PageTitle = (name: string) => `${name} Horoscope 2027 — Love & Money`;

// ---------- Static per-page descriptions ----------

export const DESC = {
  landing:
    'Calculate your Destiny Matrix from your birth date: soul purpose, love and money lines, karmic tail and 22 arcana, read in full. Free, no account needed.',
  pricing:
    'Gaia Vesta pricing: stay on Starseed Free with unlimited charts, 5 AI readings a month, or go Cosmic at $9/month for unlimited readings. Start free today.',
  tools:
    'Every Gaia Vesta calculator in one place: Destiny Matrix chart, compatibility, karmic tail, year forecast, numerology, horoscopes and moon tools, all free.',
  compatibility:
    'Destiny Matrix compatibility calculator: enter two birth dates to merge charts into one: love, money, communication and shared purpose in 9 zones. Free.',
  yearForecast:
    'Destiny Matrix year forecast: recalculate your birth matrix with any year to see the energies, lessons and opportunities it activates for you. Free.',
  childMatrix:
    "Children's Destiny Matrix calculator for parents: your child's innate talents, emotional needs and learning style, translated from their birth date. Free.",
  lifePath:
    'Life Path Number calculator: find the most important number in numerology from your birth date — master numbers 11, 22 and 33 honoured, never reduced.',
  nameNumerology:
    'Name Numerology calculator: your name hides three numbers — Expression, Soul Urge and Personality — worked out with the Pythagorean system. Free, instant.',
  personalYear:
    'Personal Year calculator: find which year of your 9-year cycle you are in now, plus this month\u2019s theme and today\u2019s energy — all from your birth date. Free.',
  angelNumbers:
    'Angel number meanings for 111, 222, 333 and more — why you see them, what each one asks of you, plus your personal angel number from your birth date.',
  moonPhase:
    'Moon phase today: tonight\u2019s exact phase, illumination and moon age, calculated live — plus the moon and your sun sign on the day you were born. Free.',
  pythagoreanSquare:
    'Pythagoras Square (Psychomatrix) calculator: place every digit of your birth date in the 3×3 grid, revealing amplified traits and lessons in empty cells.',
  zodiacCompatibility:
    'Zodiac compatibility checker: pick any two signs — all 144 pairings — for an honest harmony score based on elements, rulers and temperament. Free, instant.',
  dailyArcana:
    'Your daily tarot card, drawn from today\u2019s date itself: one of the 22 Major Arcana with its theme, what to lean into and what to watch. New every day.',
  arcanaIndex:
    'All 22 Major Arcana explained: personality, love, money, karmic lessons, strengths and shadows for every card — in tarot and in your Destiny Matrix chart.',
  howToRead:
    'Learn how to read your Destiny Matrix chart point by point: centre, love line, money line, karmic tail and purpose — in the order a practitioner would use.',
  karmicTail:
    'Karmic Tail calculator: find the three-number code at the root of your repeating patterns in love, money and life — calculated free from your birth date.',
  familyLines:
    'Family and Talent Lines calculator: read your father\u2019s line, your mother\u2019s line and the parent–child pattern in your Destiny Matrix, plus your talent line.',
  dailyHoroscope:
    'Daily horoscope for all twelve signs, written fresh each day: today\u2019s theme, love, money and mood, paired with tonight\u2019s real moon phase. Free to read.',
  weeklyHoroscope:
    'Weekly horoscope for all twelve signs: the week\u2019s theme, love, money, mood, your best day and the moon\u2019s arc from Monday to Sunday. Free, updated weekly.',
  monthlyHoroscope:
    'Monthly horoscope for all twelve signs: the month\u2019s theme, love, money, growth, lucky days and the month\u2019s real new and full moons. Free to read.',
  horoscope2027:
    '2027 horoscope for every sign: the year\u2019s theme, love, money, growth and best months, plus all twelve months one by one — and the full 2027 moon calendar.',
  moonCalendar2027:
    'Moon Calendar 2027: every new moon, full moon and quarter of 2027, calculated day by day — thirteen new moons and twelve full moons with traditional names.',
  chineseZodiac:
    'Chinese zodiac finder: enter your birth date to find your animal exactly — placed by the real Chinese New Year — with your element, traits and matches.',
  chineseZodiac2027:
    '2027 is the Year of the Fire Goat, from Chinese New Year on 6 February: what the Goat year holds for every animal — love, career, and wellbeing. Free.',
  auth:
    'Sign in to Gaia Vesta to save your Destiny Matrix charts, revisit your readings and pick up your cosmic blueprint where you left it. Free account, no card.',
  dashboard:
    'Your Gaia Vesta dashboard: saved Destiny Matrix charts, recent readings and quick paths back into your compatibility, forecasts and tools. Sign in first.',
  chart:
    'Your Destiny Matrix chart: all 22 arcana positions calculated from your birth date — centre, love line, money line, karmic tail and purpose, zone by zone.',
  myCharts:
    'My Charts: every Destiny Matrix chart you have saved on Gaia Vesta, ready to reopen, compare and share — your readings kept in one private place.',
  settings:
    'Gaia Vesta settings: manage your account, your plan — Starseed Free or Cosmic — and how your charts and readings are kept. Sign in is required.',
  sharedChart:
    'A Destiny Matrix chart shared with you on Gaia Vesta: the 22 arcana of a birth date — purpose, love, money and karmic lessons. Free, no account needed.',
} as const;

// ---------- Generated-family description builders ----------

type ArcanaLike = { name: string; description: string };
export function arcanaDesc(a: ArcanaLike): string {
  return fitDesc(
    `${a.name} tarot meaning: ${a.description}. Personality, love, money and karmic lessons in the Destiny Matrix.`,
    [' Full card guide, free to read.', ' Full guide, free.', ' Free guide.'],
  );
}

type AngelLike = { number: string; title: string; meaning: string };
export function angelDesc(m: AngelLike): string {
  const first = m.meaning.split('.')[0].replace(/:$/, '');
  return fitDesc(
    `${m.number} angel number meaning — ${m.title}: ${first.charAt(0).toLowerCase()}${first.slice(1)}.`,
    [
      ' What it means for love, money and your next step.',
      ' Love, money and spiritual meaning, explained.',
      ' Why you keep seeing it, and what to do.',
      ' Why you keep seeing it.',
      ' Why you see it.',
    ],
  );
}

export function pairDesc(a: string, b: string, score: number): string {
  return fitDesc(
    `${a} and ${b} compatibility: their honest harmony score is ${score}% — how this match works in love, trust and everyday life, and where it rubs.`,
    [' Free, no account needed.', ' Free.'],
  );
}

export function dailySignDesc(name: string): string {
  return fitDesc(
    `${name} daily horoscope: today's theme, love, money and mood, plus tonight's real moon phase and one thing to lean into. Free, written fresh every day.`,
    [' No account needed.'],
  );
}

export function weeklySignDesc(name: string): string {
  return fitDesc(
    `${name} weekly horoscope: this week's theme, love, money and mood, your best day, and the moon's arc from Monday to Sunday. Free, refreshed weekly.`,
    [' No account needed.'],
  );
}

export function monthlySignDesc(name: string, monthName: string): string {
  return fitDesc(
    `${name} horoscope for ${monthName}: the month's theme, love, money and growth, your lucky days, and the month's real new and full moons.`,
    [' Free monthly reading.', ' Free.'],
  );
}

export function sign2027Desc(name: string, powerWord: string): string {
  return fitDesc(
    `${name} horoscope 2027: your year theme, love, money and growth, best months and all twelve months one by one. Power word: ${powerWord}.`,
    [' Free year-ahead reading.', ' Free reading.', ' Free.'],
  );
}

export function moonMonthDesc(
  monthName: string,
  fullMoonName: string,
  newMoonDay: number,
  fullMoonDay: number,
): string {
  return fitDesc(
    `${monthName} 2027 moon calendar: the ${fullMoonName} full moon on ${fullMoonDay} ${monthName}, a new moon on ${newMoonDay} ${monthName}, both quarters and every day's phase.`,
    [' Calculated day by day, free.', ' Calculated daily.', ' Free.'],
  );
}

type AnimalLike = { name: string; branchElement: string };
export function chineseAnimalDesc(a: AnimalLike): string {
  return fitDesc(
    `Year of the ${a.name} — the ${a.branchElement} animal of the Chinese zodiac: birth years, elements, traits, best matches and lucky colours in one full profile.`,
    [' Free.'],
  );
}

export function chinese2027Desc(a: AnimalLike): string {
  return fitDesc(
    `The ${a.name} in 2027, the Fire Goat year: love, career and wellbeing outlook for the ${a.name} — the year's theme and how to work with it. Free reading.`,
    [' No account needed.', ' No account.'],
  );
}
