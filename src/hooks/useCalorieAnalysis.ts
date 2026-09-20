import { useMemo } from 'react';
import { calculateCalorieNeeds } from '../core/calorieCalculator';
import { FitnessGoal, UserProfile } from '../types';

interface UseCalorieAnalysisInput {
  weightInput: string;
  heightInput: string;
  ageInput: string;
  gender: UserProfile['gender'] | null;
  goal: FitnessGoal | null;
}

/** Convierte el estado del formulario en un análisis calórico listo para renderizar. */
export function useCalorieAnalysis({
  weightInput,
  heightInput,
  ageInput,
  gender,
  goal,
}: UseCalorieAnalysisInput) {
  const weightKg = Number.parseFloat(weightInput) || 75;
  const heightCm = Number.parseFloat(heightInput) || 170;
  const age = Number.parseInt(ageInput, 10) || 30;

  return useMemo(
    () => calculateCalorieNeeds(weightKg, heightCm, age, gender || 'male', 'sedentary', goal || 'fat_loss'),
    [weightKg, heightCm, age, gender, goal]
  );
}
