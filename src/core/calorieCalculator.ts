/**
 * Motor de Cálculo Calórico Científico (Mifflin-St Jeor)
 * Validador clínico de Tasa Metabólica Basal (TMB), Gasto Energético Total (TDEE)
 * y requerimiento calórico objetivo según meta y sexo biológico.
 */

import { FitnessGoal } from '../types';

export interface CalorieAnalysis {
  bmr: number; // Tasa Metabólica Basal
  tdee: number; // Mantenimiento diario
  targetCalories: number; // Calorías meta recomendadas
  deficitOrSurplus: number; // Diferencia respecto a mantenimiento
  deficitLabel: string;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  explanation: string;
}

export function calculateCalorieNeeds(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female',
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' = 'sedentary',
  goal: FitnessGoal = 'fat_loss'
): CalorieAnalysis {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) {
    throw new Error('Peso, estatura y edad deben ser números positivos.');
  }

  // Fórmula Clínica de Mifflin-St Jeor
  // Hombres: (10 * peso) + (6.25 * altura) - (5 * edad) + 5
  // Mujeres: (10 * peso) + (6.25 * altura) - (5 * edad) - 161
  const bmrBase = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const bmr = Math.round(gender === 'male' ? bmrBase + 5 : bmrBase - 161);

  // Multiplicador de Actividad
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  };
  const multiplier = activityMultipliers[activityLevel] || 1.2;
  const tdee = Math.round(bmr * multiplier);

  let targetCalories = tdee;
  let deficitOrSurplus = 0;
  let deficitLabel = 'Mantenimiento';
  let explanation = 'Calorías equilibradas para sostener tu peso actual y energizar tus entrenamientos.';

  if (goal === 'fat_loss') {
    // Déficit controlado del 18-20% sin comprometer salud hormonal
    const deficitAmount = Math.round(tdee * 0.2);
    targetCalories = Math.max(bmr, tdee - deficitAmount);
    deficitOrSurplus = -(tdee - targetCalories);
    deficitLabel = 'Déficit Saludable (-20%)';
    explanation = `Tu cuerpo consumirá grasa como energía con un déficit seguro de ${Math.abs(deficitOrSurplus)} kcal diarias sin pasar hambre.`;
  } else if (goal === 'muscle_gain') {
    const surplusAmount = Math.round(tdee * 0.12);
    targetCalories = tdee + surplusAmount;
    deficitOrSurplus = surplusAmount;
    deficitLabel = 'Superávit Magro (+12%)';
    explanation = `Aporte extra de ${surplusAmount} kcal para sintetizar masa muscular junto a tus ejercicios de mancuernas y ligas.`;
  } else if (goal === 'stress_relief') {
    targetCalories = tdee;
    deficitOrSurplus = 0;
    deficitLabel = 'Equilibrio Energético';
    explanation = 'Energía estable para reducir cortisol, mejorar la calidad del sueño y mantener vitalidad.';
  }

  // Distribución de Macronutrientes Sostenible y Económica
  // Proteína: 1.8g - 2.0g por kg de peso
  const proteinGrams = Math.round(weightKg * (goal === 'muscle_gain' ? 2.0 : 1.8));
  // Grasas: 25% del total calórico (1g grasa = 9 kcal)
  const fatsGrams = Math.round((targetCalories * 0.25) / 9);
  // Carbohidratos: el resto (1g carbo / proteína = 4 kcal)
  const remainingCalories = targetCalories - proteinGrams * 4 - fatsGrams * 9;
  const carbsGrams = Math.max(40, Math.round(remainingCalories / 4));

  return {
    bmr,
    tdee,
    targetCalories,
    deficitOrSurplus,
    deficitLabel,
    proteinGrams,
    carbsGrams,
    fatsGrams,
    explanation,
  };
}
