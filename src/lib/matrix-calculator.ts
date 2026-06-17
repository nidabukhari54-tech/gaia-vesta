export type DestinyMatrixResult = {
  A: number;
  B: number;
  C: number;
  D: number;
  E: number;
  F: number;
  G: number;
  H: number;
  X: number;
  J: number;
  K: number;
  L: number;
  M: number;
  N: number;
  O: number;
  P: number;
  soulPurpose: number;
  loveLine: { left: number; center: number; right: number };
  moneyLine: { left: number; center: number; right: number };
  lifePath: { left: number; center: number; right: number };
};

export function calculateDestinyMatrix(birthDate: Date): DestinyMatrixResult {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();

  const reduceToArcana = (n: number): number => {
    if (n === 0) return 22;
    while (n > 22) {
      n = Math.floor(n / 10) + (n % 10);
    }
    return n;
  };

  const A = reduceToArcana(day);
  const B = reduceToArcana(month);
  const C = reduceToArcana(year % 100);
  const D = reduceToArcana(Math.floor(year / 100));

  const E = reduceToArcana(A + B);
  const F = reduceToArcana(B + C);
  const G = reduceToArcana(C + D);
  const H = reduceToArcana(A + D);

  const X = reduceToArcana(A + B + C + D);

  const J = reduceToArcana(A + E + X);
  const K = reduceToArcana(B + E + X);
  const L = reduceToArcana(C + F + X);
  const M = reduceToArcana(D + G + X);

  const N = reduceToArcana(E + F + G + H);

  const O = reduceToArcana(A + B + X);
  const P = reduceToArcana(C + D + X);

  return {
    A, B, C, D, E, F, G, H, X, J, K, L, M, N, O, P,
    soulPurpose: X,
    loveLine: { left: A, center: X, right: C },
    moneyLine: { left: B, center: X, right: D },
    lifePath: { left: H, center: X, right: F },
  };
}

export type ChartPosition = {
  id: string;
  x: number;
  y: number;
  arcana: number;
};

export function getChartPositions(result: DestinyMatrixResult): ChartPosition[] {
  const centerX = 200;
  const centerY = 200;
  const outerRadius = 160;
  const innerRadius = 100;
  const midRadius = 135;

  const positions: ChartPosition[] = [
    { id: 'A', x: centerX, y: centerY - outerRadius, arcana: result.A },
    { id: 'B', x: centerX + outerRadius, y: centerY, arcana: result.B },
    { id: 'C', x: centerX, y: centerY + outerRadius, arcana: result.C },
    { id: 'D', x: centerX - outerRadius, y: centerY, arcana: result.D },
    { id: 'E', x: centerX + innerRadius * 0.85, y: centerY - innerRadius * 0.85, arcana: result.E },
    { id: 'F', x: centerX + innerRadius * 0.85, y: centerY + innerRadius * 0.85, arcana: result.F },
    { id: 'G', x: centerX - innerRadius * 0.85, y: centerY + innerRadius * 0.85, arcana: result.G },
    { id: 'H', x: centerX - innerRadius * 0.85, y: centerY - innerRadius * 0.85, arcana: result.H },
    { id: 'X', x: centerX, y: centerY, arcana: result.X },
    { id: 'J', x: centerX + midRadius * 0.7, y: centerY - innerRadius * 0.5, arcana: result.J },
    { id: 'K', x: centerX + innerRadius * 0.5, y: centerY - midRadius * 0.7, arcana: result.K },
    { id: 'L', x: centerX + innerRadius * 0.5, y: centerY + midRadius * 0.7, arcana: result.L },
    { id: 'M', x: centerX - midRadius * 0.7, y: centerY + innerRadius * 0.5, arcana: result.M },
    { id: 'N', x: centerX - innerRadius * 0.5, y: centerY + midRadius * 0.7, arcana: result.N },
    { id: 'O', x: centerX - innerRadius * 0.5, y: centerY - midRadius * 0.7, arcana: result.O },
    { id: 'P', x: centerX - midRadius * 0.7, y: centerY - innerRadius * 0.5, arcana: result.P },
  ];

  return positions;
}
