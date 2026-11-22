import type { DestinyMatrixResult } from './matrix-calculator';
import { getArcana, type Arcana } from './arcana-meanings';

export type TailPoint = {
  key: 'C' | 'G' | 'M';
  role: string;
  heading: string;
  arcana: Arcana;
};

export type KarmicTail = {
  /** The tail written the way practitioners write it, e.g. "18-9-9". */
  code: string;
  points: TailPoint[];
};

/**
 * The karmic tail is the chain of three points running down the lower-left
 * edge of the diamond: the bottom point (C, derived from the birth year),
 * the inner point derived from it (G), and the next point of the chain (M).
 * Read in order they tell one story: the inherited pattern, how it keeps
 * repeating, and the lesson that resolves it.
 */
export function getKarmicTail(result: DestinyMatrixResult): KarmicTail {
  return {
    code: `${result.C}-${result.G}-${result.M}`,
    points: [
      {
        key: 'C',
        role: 'The Root',
        heading: 'The pattern you carried in',
        arcana: getArcana(result.C),
      },
      {
        key: 'G',
        role: 'The Repetition',
        heading: 'How it keeps coming back',
        arcana: getArcana(result.G),
      },
      {
        key: 'M',
        role: 'The Resolution',
        heading: 'The lesson that breaks the cycle',
        arcana: getArcana(result.M),
      },
    ],
  };
}
