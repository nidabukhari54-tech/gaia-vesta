// Numerology + astrology calculation engines for the Gaia Vesta tools suite.
// All functions are pure and client-side.

/** Reduce to 1–9, preserving master numbers 11, 22, 33. */
export function reduceNumber(n: number, keepMaster = true): number {
  let x = Math.abs(Math.floor(n));
  while (x > 9) {
    if (keepMaster && (x === 11 || x === 22 || x === 33)) break;
    x = String(x)
      .split('')
      .reduce((a, d) => a + Number(d), 0);
    if (keepMaster && (x === 11 || x === 22 || x === 33)) break;
  }
  return x;
}

/** Reduce to a 1–22 arcana (0 becomes 22, The Fool). */
export function reduceTo22(n: number): number {
  let x = Math.abs(Math.floor(n));
  if (x === 0) return 22;
  while (x > 22) {
    x = String(x)
      .split('')
      .reduce((a, d) => a + Number(d), 0);
    if (x === 0) return 22;
  }
  return x;
}

function digitSum(n: number): number {
  return String(Math.abs(Math.floor(n)))
    .split('')
    .reduce((a, d) => a + Number(d), 0);
}

// ---------- Life Path ----------

export function lifePathNumber(birthDate: Date): number {
  const y = birthDate.getFullYear();
  const m = birthDate.getMonth() + 1;
  const d = birthDate.getDate();
  const total =
    digitSum(y) + digitSum(m) + digitSum(d);
  return reduceNumber(total, true);
}

// ---------- Personal Year / Month / Day ----------

export function personalYearNumber(birthDate: Date, year: number): number {
  const m = birthDate.getMonth() + 1;
  const d = birthDate.getDate();
  return reduceNumber(digitSum(m) + digitSum(d) + digitSum(year), false);
}

export function personalMonthNumber(birthDate: Date, year: number, month: number): number {
  return reduceNumber(personalYearNumber(birthDate, year) + month, false);
}

export function personalDayNumber(birthDate: Date, date: Date): number {
  const pm = personalMonthNumber(birthDate, date.getFullYear(), date.getMonth() + 1);
  return reduceNumber(pm + date.getDate(), false);
}

// ---------- Name numerology (Pythagorean) ----------

const LETTER_VALUES: Record<string, number> = {};
'abcdefghijklmnopqrstuvwxyz'.split('').forEach((ch, i) => {
  LETTER_VALUES[ch] = (i % 9) + 1;
});

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

export type NameNumbers = {
  expression: number;
  soulUrge: number;
  personality: number;
};

export function nameNumbers(fullName: string): NameNumbers | null {
  const letters = fullName.toLowerCase().replace(/[^a-z]/g, '');
  if (letters.length < 2) return null;

  let all = 0;
  let vowelSum = 0;
  let consonantSum = 0;
  for (const ch of letters) {
    const v = LETTER_VALUES[ch];
    all += v;
    if (VOWELS.has(ch)) vowelSum += v;
    else consonantSum += v;
  }
  if (vowelSum === 0 || consonantSum === 0) return null;

  return {
    expression: reduceNumber(all, true),
    soulUrge: reduceNumber(vowelSum, true),
    personality: reduceNumber(consonantSum, true),
  };
}

// ---------- Pythagorean Square (Psychomatrix) ----------

export type PythagoreanResult = {
  /** counts of digits 1..9 present in the birth date */
  counts: Record<number, number>;
  /** digits 1..9 with zero count */
  missing: number[];
  destinyNumber: number;
};

export function pythagoreanSquare(birthDate: Date): PythagoreanResult {
  const dd = String(birthDate.getDate()).padStart(2, '0');
  const mm = String(birthDate.getMonth() + 1).padStart(2, '0');
  const yyyy = String(birthDate.getFullYear());
  const all = `${dd}${mm}${yyyy}`.split('').map(Number);

  const counts: Record<number, number> = {};
  for (let d = 1; d <= 9; d++) counts[d] = 0;
  for (const d of all) if (d >= 1 && d <= 9) counts[d]++;

  const missing: number[] = [];
  for (let d = 1; d <= 9; d++) if (counts[d] === 0) missing.push(d);

  return { counts, missing, destinyNumber: lifePathNumber(birthDate) };
}

// ---------- Moon phase ----------

export type MoonPhase = {
  age: number; // days since new moon, 0..29.53
  illumination: number; // 0..1
  name: string;
  emoji: string;
};

const SYNODIC = 29.530588853;
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14) / 86400000; // in days

const PHASES: { name: string; emoji: string }[] = [
  { name: 'New Moon', emoji: '🌑' },
  { name: 'Waxing Crescent', emoji: '🌒' },
  { name: 'First Quarter', emoji: '🌓' },
  { name: 'Waxing Gibbous', emoji: '🌔' },
  { name: 'Full Moon', emoji: '🌕' },
  { name: 'Waning Gibbous', emoji: '🌖' },
  { name: 'Last Quarter', emoji: '🌗' },
  { name: 'Waning Crescent', emoji: '🌘' },
];

export function moonPhase(date: Date): MoonPhase {
  const days = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000;
  let age = (days - KNOWN_NEW_MOON) % SYNODIC;
  if (age < 0) age += SYNODIC;
  const illumination = (1 - Math.cos((2 * Math.PI * age) / SYNODIC)) / 2;
  const idx = Math.floor(((age / SYNODIC) * 8 + 0.5)) % 8;
  return { age, illumination, name: PHASES[idx].name, emoji: PHASES[idx].emoji };
}

// ---------- Daily arcana ----------

export function dailyArcana(date: Date): number {
  const total = digitSum(date.getDate()) + digitSum(date.getMonth() + 1) + digitSum(date.getFullYear());
  return reduceTo22(total);
}

// ---------- Angel number (personal) ----------

export function personalAngelNumber(birthDate: Date): string {
  const d = reduceNumber(
    digitSum(birthDate.getDate()) + digitSum(birthDate.getMonth() + 1) + digitSum(birthDate.getFullYear()),
    false
  );
  return `${d}${d}${d}`;
}

// ---------- Zodiac ----------

export type ZodiacSign = {
  name: string;
  symbol: string;
  dates: string;
  element: 'Fire' | 'Earth' | 'Air' | 'Water';
  ruler: string;
  traits: string[];
  start: [number, number]; // [month, day]
  end: [number, number];
};

export const ZODIAC_SIGNS: ZodiacSign[] = [
  { name: 'Aries', symbol: '♈', dates: 'Mar 21 – Apr 19', element: 'Fire', ruler: 'Mars', traits: ['Bold', 'Driven', 'Pioneering'], start: [3, 21], end: [4, 19] },
  { name: 'Taurus', symbol: '♉', dates: 'Apr 20 – May 20', element: 'Earth', ruler: 'Venus', traits: ['Steady', 'Sensual', 'Loyal'], start: [4, 20], end: [5, 20] },
  { name: 'Gemini', symbol: '♊', dates: 'May 21 – Jun 20', element: 'Air', ruler: 'Mercury', traits: ['Curious', 'Quick', 'Versatile'], start: [5, 21], end: [6, 20] },
  { name: 'Cancer', symbol: '♋', dates: 'Jun 21 – Jul 22', element: 'Water', ruler: 'Moon', traits: ['Protective', 'Intuitive', 'Deep-feeling'], start: [6, 21], end: [7, 22] },
  { name: 'Leo', symbol: '♌', dates: 'Jul 23 – Aug 22', element: 'Fire', ruler: 'Sun', traits: ['Radiant', 'Proud', 'Generous'], start: [7, 23], end: [8, 22] },
  { name: 'Virgo', symbol: '♍', dates: 'Aug 23 – Sep 22', element: 'Earth', ruler: 'Mercury', traits: ['Precise', 'Devoted', 'Analytical'], start: [8, 23], end: [9, 22] },
  { name: 'Libra', symbol: '♎', dates: 'Sep 23 – Oct 22', element: 'Air', ruler: 'Venus', traits: ['Graceful', 'Fair', 'Romantic'], start: [9, 23], end: [10, 22] },
  { name: 'Scorpio', symbol: '♏', dates: 'Oct 23 – Nov 21', element: 'Water', ruler: 'Pluto', traits: ['Intense', 'Magnetic', 'Private'], start: [10, 23], end: [11, 21] },
  { name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 – Dec 21', element: 'Fire', ruler: 'Jupiter', traits: ['Adventurous', 'Honest', 'Philosophical'], start: [11, 22], end: [12, 21] },
  { name: 'Capricorn', symbol: '♑', dates: 'Dec 22 – Jan 19', element: 'Earth', ruler: 'Saturn', traits: ['Ambitious', 'Patient', 'Masterful'], start: [12, 22], end: [1, 19] },
  { name: 'Aquarius', symbol: '♒', dates: 'Jan 20 – Feb 18', element: 'Air', ruler: 'Uranus', traits: ['Original', 'Humanitarian', 'Independent'], start: [1, 20], end: [2, 18] },
  { name: 'Pisces', symbol: '♓', dates: 'Feb 19 – Mar 20', element: 'Water', ruler: 'Neptune', traits: ['Empathic', 'Dreamy', 'Artistic'], start: [2, 19], end: [3, 20] },
];

export function zodiacSign(month: number, day: number): ZodiacSign {
  for (const sign of ZODIAC_SIGNS) {
    const [sm, sd] = sign.start;
    const [em, ed] = sign.end;
    if (sm <= em) {
      if ((month === sm && day >= sd) || (month === em && day <= ed)) return sign;
    } else {
      // wraps the year (Capricorn)
    if ((month === sm && day >= sd) || (month === em && day <= ed)) return sign;
    }
  }
  return ZODIAC_SIGNS[9]; // Capricorn fallback
}

const ELEMENT_SCORES: Record<string, number> = {
  'Fire|Fire': 90, 'Fire|Air': 85, 'Fire|Earth': 55, 'Fire|Water': 45,
  'Earth|Earth': 88, 'Earth|Water': 85, 'Earth|Air': 55,
  'Air|Air': 88, 'Air|Water': 60,
  'Water|Water': 90,
};

function elementScore(a: string, b: string): number {
  const key = [a, b].sort().join('|');
  // sort puts Air first etc.; rebuild using canonical pair lookup
  const pairs: Record<string, number> = {};
  for (const [k, v] of Object.entries(ELEMENT_SCORES)) {
    const [x, y] = k.split('|');
    pairs[[x, y].sort().join('|')] = v;
  }
  return pairs[key] ?? 60;
}

export type ZodiacMatch = {
  score: number;
  verdict: string;
  summary: string;
};

export function zodiacCompatibility(a: ZodiacSign, b: ZodiacSign): ZodiacMatch {
  let score = elementScore(a.element, b.element);
  if (a.name === b.name) score = Math.max(score, 82);
  // deterministic variety per pair
  const ai = ZODIAC_SIGNS.indexOf(a);
  const bi = ZODIAC_SIGNS.indexOf(b);
  score += ((ai * 7 + bi * 13) % 11) - 5;
  score = Math.max(25, Math.min(99, score));

  const verdict =
    score >= 85 ? 'Cosmic match' :
    score >= 70 ? 'Strong harmony' :
    score >= 55 ? 'Workable spark' :
    'Growth pairing';

  const elementNote =
    a.element === b.element
      ? `Two ${a.element} signs speak the same emotional language — the bond feels natural from day one.`
      : `${a.element} meets ${b.element}: different elements, so this pairing teaches each partner something they lack.`;

  const summary = `${a.name} and ${b.name}. ${elementNote} ${a.name} brings ${a.traits.join(', ').toLowerCase()} energy; ${b.name} answers with ${b.traits.join(', ').toLowerCase()} energy. Ruled by ${a.ruler} and ${b.ruler}, this couple grows fastest when they honour each other's pace instead of trying to change it.`;

  return { score, verdict, summary };
}
