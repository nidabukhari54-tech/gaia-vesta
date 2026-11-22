import { reduceToArcana, type DestinyMatrixResult } from './matrix-calculator';
import { getArcana, type Arcana } from './arcana-meanings';

export type LinePoint = {
  key: string;
  role: string;
  arcana: Arcana;
};

export type ChartLine = {
  id: string;
  title: string;
  intro: string;
  points: LinePoint[];
  supporting: { key: string; arcana: Arcana }[];
};

/**
 * The two diagonals of the diamond are the generation lines.
 * Father's line (the male generation line) runs from the upper-left point
 * (H) through the centre (X) to the lower-right point (F).
 * Mother's line (the female generation line) runs from the upper-right
 * point (E) through the centre to the lower-left point (G).
 */
export function getFatherLine(result: DestinyMatrixResult): ChartLine {
  return {
    id: 'father',
    title: "Father's Line — the Male Generation Line",
    intro:
      'The diagonal from the upper-left of your chart to the lower-right carries your paternal inheritance: the traits, duties and unfinished business that travel down the male line of your family.',
    points: [
      { key: 'H', role: 'The Inheritance', arcana: getArcana(result.H) },
      { key: 'X', role: 'The Meeting Point', arcana: getArcana(result.X) },
      { key: 'F', role: 'The Landing', arcana: getArcana(result.F) },
    ],
    supporting: [
      { key: 'O', arcana: getArcana(result.O) },
      { key: 'P', arcana: getArcana(result.P) },
      { key: 'L', arcana: getArcana(result.L) },
    ],
  };
}

export function getMotherLine(result: DestinyMatrixResult): ChartLine {
  return {
    id: 'mother',
    title: "Mother's Line — the Female Generation Line",
    intro:
      'The diagonal from the upper-right of your chart to the lower-left carries your maternal inheritance: the emotional patterns, instincts and gifts that travel down the female line of your family.',
    points: [
      { key: 'E', role: 'The Inheritance', arcana: getArcana(result.E) },
      { key: 'X', role: 'The Meeting Point', arcana: getArcana(result.X) },
      { key: 'G', role: 'The Landing', arcana: getArcana(result.G) },
    ],
    supporting: [
      { key: 'J', arcana: getArcana(result.J) },
      { key: 'K', arcana: getArcana(result.K) },
      { key: 'N', arcana: getArcana(result.N) },
    ],
  };
}

/**
 * The parent–child pattern is where the two generation lines meet: in you.
 * It reads the father's imprint (H) and the mother's imprint (E) as they
 * cross at your centre (X), and what you hand on at the bottom point (C).
 */
export function getParentChildLine(result: DestinyMatrixResult): ChartLine {
  return {
    id: 'parent-child',
    title: 'Parent–Child Line — Where the Two Lines Meet',
    intro:
      'You are the crossing point of both family lines. This reading shows what each parent imprinted on you, what you made of it at your centre, and what flows from you to the next generation.',
    points: [
      { key: 'H', role: "Father's Imprint", arcana: getArcana(result.H) },
      { key: 'E', role: "Mother's Imprint", arcana: getArcana(result.E) },
      { key: 'X', role: 'You, at the Crossing', arcana: getArcana(result.X) },
      { key: 'C', role: 'What You Pass On', arcana: getArcana(result.C) },
    ],
    supporting: [],
  };
}

/**
 * The talent line reads the gift cluster at the top of the chart: the point
 * you show the world (A), the talent point itself (E — the same point the
 * Children's Matrix reads as innate talent), and your centre (X).
 */
export function getTalentLine(result: DestinyMatrixResult): ChartLine {
  return {
    id: 'talent',
    title: 'Talent Line — Your Gifts',
    intro:
      'Every chart carries a gift cluster near its top. Read in order: the gift the world sees first, the talent underneath it, and how that talent serves your soul purpose.',
    points: [
      { key: 'A', role: 'The Visible Gift', arcana: getArcana(result.A) },
      { key: 'E', role: 'The Talent Point', arcana: getArcana(result.E) },
      { key: 'X', role: 'Talent in Service of Purpose', arcana: getArcana(result.X) },
    ],
    supporting: [
      { key: 'O', arcana: getArcana(result.O) },
      { key: 'J', arcana: getArcana(result.J) },
      { key: 'K', arcana: getArcana(result.K) },
    ],
  };
}

export function purposeByStage(result: DestinyMatrixResult) {
  const p2040 = reduceToArcana(result.A + result.C);
  const p4060 = reduceToArcana(result.B + result.D);
  const p60 = reduceToArcana(p2040 + p4060);
  return [
    { stage: 'Ages 20–40', label: 'Personal purpose', arcana: getArcana(p2040) },
    { stage: 'Ages 40–60', label: 'Social purpose', arcana: getArcana(p4060) },
    { stage: 'Ages 60+', label: 'Spiritual purpose', arcana: getArcana(p60) },
  ];
}

const POSITION_LABELS: Record<string, string> = {
  A: 'Top point',
  B: 'Right point',
  C: 'Bottom point',
  D: 'Left point',
  E: 'Talent point',
  F: 'Lower-right point',
  G: 'Lower-left point',
  H: 'Upper-left point',
  X: 'Centre',
  J: 'Mid point J',
  K: 'Mid point K',
  L: 'Mid point L',
  M: 'Mid point M',
  N: 'Mid point N',
  O: 'Mid point O',
  P: 'Mid point P',
};

export type RepeatedArcana = {
  arcana: Arcana;
  count: number;
  positions: string[];
};

export type NumbersAnalysis = {
  repeated: RepeatedArcana[];
  missing: Arcana[];
  presentCount: number;
};

/**
 * Repeated arcana are the loudest energies in a chart — the same lesson or
 * gift placed at several positions. Missing arcana are the energies the
 * chart does not carry natively: lessons met through other people and
 * deliberate practice rather than instinct.
 */
export function analyzeNumbers(result: DestinyMatrixResult): NumbersAnalysis {
  const keys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'X', 'J', 'K', 'L', 'M', 'N', 'O', 'P'] as const;
  const byArcana = new Map<number, string[]>();
  for (const k of keys) {
    const v = result[k];
    const list = byArcana.get(v) ?? [];
    list.push(POSITION_LABELS[k]);
    byArcana.set(v, list);
  }
  const repeated: RepeatedArcana[] = [...byArcana.entries()]
    .filter(([, positions]) => positions.length >= 2)
    .map(([id, positions]) => ({ arcana: getArcana(id), count: positions.length, positions }))
    .sort((a, b) => b.count - a.count || a.arcana.id - b.arcana.id);

  const missing: Arcana[] = [];
  for (let id = 1; id <= 22; id++) {
    if (!byArcana.has(id)) missing.push(getArcana(id));
  }
  return { repeated, missing, presentCount: byArcana.size };
}
