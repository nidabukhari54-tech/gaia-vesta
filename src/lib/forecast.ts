import { calculateDestinyMatrix, type DestinyMatrixResult } from './matrix-calculator';
import { personalYearNumber } from './numerology';

/**
 * Year Forecast: the Destiny Matrix recalculated with the target year in
 * place of the birth year. Day and month stay the person's own; the year
 * points (C, D and everything derived from them) show the energies the
 * target year activates for them.
 */
export function calculateYearMatrix(birthDate: Date, targetYear: number): DestinyMatrixResult {
  const shifted = new Date(targetYear, birthDate.getMonth(), birthDate.getDate());
  return calculateDestinyMatrix(shifted);
}

export function yearForecast(birthDate: Date, targetYear: number) {
  return {
    matrix: calculateYearMatrix(birthDate, targetYear),
    personalYear: personalYearNumber(birthDate, targetYear),
    turningAge: targetYear - birthDate.getFullYear(),
  };
}
