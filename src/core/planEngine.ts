import { UserProfile, GeneratedPlan, RecipeItem } from '../types';
import { selectExercisesForPlan } from './exerciseCatalog';
import { RECIPES_CATALOG } from './catalogs';

/**
 * RecipeProvider — Dependency Inversion Principle (DIP)
 *
 * Abstracción que provee recetas por tipo de comida.
 * `generateAutomatedPlan` depende de esta interfaz, no del catálogo concreto.
 * Permite inyectar catálogos mock en tests sin modificar este servicio.
 */
export interface RecipeProvider {
  getByMealType(mealType: RecipeItem['mealType']): RecipeItem[];
}

/**
 * Implementación por defecto usando el catálogo estático.
 * Es la única clase que conoce RECIPES_CATALOG.
 */
export const defaultCatalogProvider: RecipeProvider = {
  getByMealType: (mealType) => RECIPES_CATALOG.filter((r) => r.mealType === mealType),
};

/**
 * Genera un plan automatizado para el perfil dado.
 *
 * @param profile         Perfil del usuario
 * @param recipeProvider  Proveedor de recetas (inyectable, default = catálogo estático)
 */
export function generateAutomatedPlan(
  profile: UserProfile,
  recipeProvider: RecipeProvider = defaultCatalogProvider
): GeneratedPlan {
  const durationWeeks = 4;
  const today = new Date();
  const startDate = today.toISOString().split('T')[0];
  const endDateObj = new Date(today);
  endDateObj.setDate(today.getDate() + durationWeeks * 7);
  const endDate = endDateObj.toISOString().split('T')[0];

  // Meta realista: 0.5 a 0.75 kg por semana
  const targetLossKg = Number((0.6 * durationWeeks).toFixed(1));

  // Determinar nivel según nivel de actividad del perfil
  const levelMap: Record<UserProfile['activityLevel'], 1 | 2 | 3> = {
    sedentary: 1,
    light: 1,
    moderate: 2,
    active: 3,
  };
  const levelNumeric = levelMap[profile.activityLevel];

  // Seleccionar ejercicios del nivel correcto (sin mezclar niveles)
  const selectedExercises = selectExercisesForPlan(profile.preferredRoutineMinutes, levelNumeric);

  // DIP: recetas obtenidas a través de la abstracción RecipeProvider
  const breakfast = recipeProvider.getByMealType('breakfast');
  const lunch     = recipeProvider.getByMealType('lunch');
  const dinner    = recipeProvider.getByMealType('dinner');
  const snack     = recipeProvider.getByMealType('snack');

  const levelLabels: Record<1 | 2 | 3, string> = { 1: 'Principiante', 2: 'Intermedio', 3: 'Avanzado' };

  return {
    id: `plan_${Date.now()}`,
    title: `Plan ${levelLabels[levelNumeric]} · ${profile.preferredRoutineMinutes} min/día`,
    startDate,
    durationWeeks,
    endDate,
    routineDurationMinutes: profile.preferredRoutineMinutes,
    status: 'draft',
    targetLossKg,
    selectedExercises,
    selectedMeals: { breakfast, lunch, dinner, snack },
  };
}

export function checkPlanExpiration(
  plan: GeneratedPlan,
  currentWeightKg: number,
  startWeightKg: number
): { isExpired: boolean; evaluation?: GeneratedPlan['evaluationResult'] } {
  const todayStr = new Date().toISOString().split('T')[0];
  const isExpired = todayStr >= plan.endDate;
  if (!isExpired) return { isExpired: false };

  const lostKg = Number((startWeightKg - currentWeightKg).toFixed(1));
  const achievedGoal = lostKg >= plan.targetLossKg;

  const recommendation = achievedGoal
    ? `¡Objetivo logrado! Bajaste ${lostKg} kg en este ciclo. Puedes renovar el plan para continuar consolidando tus hábitos.`
    : `Completaste el periodo del plan con una diferencia de ${lostKg} kg. Te sugerimos ajustar el tiempo de rutina o generar un nuevo plan adaptado a tu peso actual.`;

  return {
    isExpired: true,
    evaluation: { startWeightKg, finalWeightKg: currentWeightKg, lostKg, achievedGoal, recommendation },
  };
}
