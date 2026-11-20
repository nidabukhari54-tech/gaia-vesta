import {
  calculateDestinyMatrix,
  reduceToArcana,
  type DestinyMatrixResult,
} from './matrix-calculator';

export type CompatibilityResult = {
  combined: DestinyMatrixResult;
  harmonyScore: number;
  loveScore: number;
  moneyScore: number;
  purposeScore: number;
};

/** Arcana traditionally read as harmonious in combined charts. */
const HARMONIOUS = new Set([2, 3, 6, 9, 10, 14, 17, 19, 20, 21]);
/** Arcana that bring productive tension — not bad, but they need work. */
const TENSE = new Set([13, 15, 16, 22]);

function zoneScore(values: number[]): number {
  let score = 55;
  for (const v of values) {
    if (HARMONIOUS.has(v)) score += 11;
    else if (TENSE.has(v)) score -= 6;
    else score += 4;
  }
  return Math.max(30, Math.min(98, score));
}

function combine(a: number, b: number): number {
  return reduceToArcana(a + b);
}

/**
 * Build a couple's combined Destiny Matrix: every position is the
 * arcana-reduced sum of both partners' positions.
 */
export function calculateCompatibility(dateA: Date, dateB: Date): CompatibilityResult {
  const r1 = calculateDestinyMatrix(dateA);
  const r2 = calculateDestinyMatrix(dateB);

  const combined: DestinyMatrixResult = {
    A: combine(r1.A, r2.A),
    B: combine(r1.B, r2.B),
    C: combine(r1.C, r2.C),
    D: combine(r1.D, r2.D),
    E: combine(r1.E, r2.E),
    F: combine(r1.F, r2.F),
    G: combine(r1.G, r2.G),
    H: combine(r1.H, r2.H),
    X: combine(r1.X, r2.X),
    J: combine(r1.J, r2.J),
    K: combine(r1.K, r2.K),
    L: combine(r1.L, r2.L),
    M: combine(r1.M, r2.M),
    N: combine(r1.N, r2.N),
    O: combine(r1.O, r2.O),
    P: combine(r1.P, r2.P),
    soulPurpose: combine(r1.X, r2.X),
    loveLine: {
      left: combine(r1.loveLine.left, r2.loveLine.left),
      center: combine(r1.loveLine.center, r2.loveLine.center),
      right: combine(r1.loveLine.right, r2.loveLine.right),
    },
    moneyLine: {
      left: combine(r1.moneyLine.left, r2.moneyLine.left),
      center: combine(r1.moneyLine.center, r2.moneyLine.center),
      right: combine(r1.moneyLine.right, r2.moneyLine.right),
    },
    lifePath: {
      left: combine(r1.lifePath.left, r2.lifePath.left),
      center: combine(r1.lifePath.center, r2.lifePath.center),
      right: combine(r1.lifePath.right, r2.lifePath.right),
    },
  };

  const loveScore = zoneScore([combined.loveLine.left, combined.loveLine.center, combined.loveLine.right]);
  const moneyScore = zoneScore([combined.moneyLine.left, combined.moneyLine.center, combined.moneyLine.right]);
  const purposeScore = zoneScore([combined.X, combined.N, combined.lifePath.center]);
  const harmonyScore = Math.round((loveScore + moneyScore + purposeScore) / 3);

  return { combined, harmonyScore, loveScore, moneyScore, purposeScore };
}
