import { useMemo } from 'react';
import { calculateBmi } from '../core/bmiCalculator';
import { UserProfile } from '../types';

/** Prepara el análisis de IMC para la vista sin mezclar la fórmula con la UI. */
export function useBmiAnalysis(
  weightKg?: number,
  heightCm?: number,
  gender?: UserProfile['gender']
) {
  return useMemo(
    () =>
      weightKg && heightCm && gender
        ? calculateBmi(weightKg, heightCm, gender)
        : null,
    [weightKg, heightCm, gender]
  );
}
