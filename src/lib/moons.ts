// Generalized moon-phase calendar — Gaia Vesta's own astronomy.
// Everything here is *calculated* from the same moonPhase() engine that
// powers the Moon Phase tool: we walk the calendar day by day and note the
// day each quarter point of the lunar cycle falls on. No feeds, no copied
// almanacs — the dates are computed, so they can be produced for any month
// of any year. (Like all simplified synodic models, a date can sit one day
// either side of an observatory almanac; it is the same astronomy the rest
// of the site already shows.)

import { moonPhase } from './numerology';

const SYNODIC = 29.530588853;

export type MoonPhaseKind = 'new' | 'first' | 'full' | 'last';

export type MonthMoonsFull = {
  /** day-of-month numbers of the new moon(s) falling in this month */
  newMoons: number[];
  /** day-of-month numbers of the first quarter(s) */
  firstQuarters: number[];
  /** day-of-month numbers of the full moon(s) */
  fullMoons: number[];
  /** day-of-month numbers of the last quarter(s) */
  lastQuarters: number[];
};

type MoonEvent = { year: number; month: number; day: number; kind: MoonPhaseKind };

// The four quarter points of the cycle, as ages in days.
const QUARTERS: { kind: MoonPhaseKind; at: number }[] = [
  { kind: 'new', at: 0 },
  { kind: 'first', at: SYNODIC / 4 },
  { kind: 'full', at: SYNODIC / 2 },
  { kind: 'last', at: (3 * SYNODIC) / 4 },
];

/**
 * Scan every day from (startYear, startMonth, startDay) up to and including
 * (endYear, endMonth, endDay) and return each moon-quarter event, assigned
 * to whichever of the two neighbouring days the event sits closer to — the
 * same convention the 2027 calendar was built with.
 */
function scanMoonEvents(
  startYear: number,
  startMonth: number,
  startDay: number,
  endYear: number,
  endMonth: number,
  endDay: number,
): MoonEvent[] {
  const events: MoonEvent[] = [];
  let prev = new Date(startYear, startMonth, startDay, 12);
  let prevAge = moonPhase(prev).age;
  const end = new Date(endYear, endMonth, endDay, 12);

  const cursor = new Date(prev);
  while (cursor < end) {
    cursor.setDate(cursor.getDate() + 1);
    const age = moonPhase(cursor).age;
    const step = (age - prevAge + SYNODIC) % SYNODIC; // ≈ 1 day of cycle travel

    for (const q of QUARTERS) {
      const dist = (q.at - prevAge + SYNODIC) % SYNODIC; // distance from prevAge to the quarter point
      if (dist > 0 && dist < step) {
        // the quarter point fell between yesterday and today
        const target = dist < step - dist ? prev : cursor;
        events.push({
          year: target.getFullYear(),
          month: target.getMonth(),
          day: target.getDate(),
          kind: q.kind,
        });
      }
    }

    prev = new Date(cursor);
    prevAge = age;
  }
  return events;
}

function emptyMonth(): MonthMoonsFull {
  return { newMoons: [], firstQuarters: [], fullMoons: [], lastQuarters: [] };
}

function bucket(events: MoonEvent[], year: number, month: number): MonthMoonsFull {
  const out = emptyMonth();
  for (const e of events) {
    if (e.year !== year || e.month !== month) continue;
    if (e.kind === 'new') out.newMoons.push(e.day);
    else if (e.kind === 'first') out.firstQuarters.push(e.day);
    else if (e.kind === 'full') out.fullMoons.push(e.day);
    else out.lastQuarters.push(e.day);
  }
  return out;
}

/** All four moon-quarter dates for one month (month is 0-based). */
export function moonsInMonth(year: number, month: number): MonthMoonsFull {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthLastDay = new Date(year, month, 0);
  // Start the scan on the last day of the previous month so an event in the
  // small hours of the 1st is still caught and assigned to the nearer day.
  const events = scanMoonEvents(
    prevMonthLastDay.getFullYear(),
    prevMonthLastDay.getMonth(),
    prevMonthLastDay.getDate(),
    year,
    month,
    daysInMonth,
  );
  return bucket(events, year, month);
}

/** All four moon-quarter dates for all twelve months of a year. */
export function moonsInYear(year: number): MonthMoonsFull[] {
  const events = scanMoonEvents(year - 1, 11, 31, year, 11, 31);
  return Array.from({ length: 12 }, (_, m) => bucket(events, year, m));
}
