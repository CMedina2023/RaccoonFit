import { RecipeItem, DietaryPreference, DailyMealsLog } from '../types';
import { filterRecipesByDiet } from './catalogs';
import { RecipeProvider, defaultCatalogProvider } from './planEngine';
import { getWeeklyRotationSeed, getLocalDateString } from './weeklyRotation';

export type DayName = 'Lun' | 'Mar' | 'Mié' | 'Jue' | 'Vie' | 'Sáb' | 'Dom';

export const DAY_NAMES: readonly DayName[] = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export interface WeeklyMealDay {
  day: DayName;
  date: string; // YYYY-MM-DD local
  dayIndex: number; // 0 (Lun) .. 6 (Dom)
  isToday: boolean;
  hasSelectedMeals: boolean;
  selectedMealsCount: number;
}

export interface DayMealPlan {
  breakfast: RecipeItem[];
  lunch: RecipeItem[];
  dinner: RecipeItem[];
  snack: RecipeItem[];
}

export { getLocalDateString };

/**
 * Obtiene las fechas correspondientes a los 7 días de la semana (Lunes a Domingo)
 * en base a una fecha de referencia, respetando la zona horaria local.
 */
export function getWeekDaysForDate(
  referenceDate: Date = new Date(),
  mealsHistory?: Record<string, DailyMealsLog>
): WeeklyMealDay[] {
  const local = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const mondayOffset = (local.getDay() + 6) % 7;
  const monday = new Date(local);
  monday.setDate(local.getDate() - mondayOffset);

  const todayStr = getLocalDateString(referenceDate);

  return DAY_NAMES.map((day, index) => {
    const dayDate = new Date(monday);
    dayDate.setDate(monday.getDate() + index);
    const dateStr = getLocalDateString(dayDate);
    const dayLog = mealsHistory?.[dateStr];

    let selectedCount = 0;
    if (dayLog?.breakfast) selectedCount++;
    if (dayLog?.lunch) selectedCount++;
    if (dayLog?.dinner) selectedCount++;
    if (dayLog?.snack) selectedCount++;

    return {
      day,
      date: dateStr,
      dayIndex: index,
      isToday: dateStr === todayStr,
      hasSelectedMeals: selectedCount > 0,
      selectedMealsCount: selectedCount,
    };
  });
}

/**
 * Selecciona N recetas del catálogo para un tipo de comida específico,
 * usando una rotación determinista basada en la fecha y el día de la semana.
 * Esto asegura que cada semana diferente muestre recetas diferentes sin repetir inmediatamente.
 */
function getRotatedOptionsForType(
  mealType: RecipeItem['mealType'],
  date: Date,
  dayIndex: number,
  preference?: DietaryPreference,
  recipeProvider: RecipeProvider = defaultCatalogProvider,
  count: number = 3
): RecipeItem[] {
  const allForType = recipeProvider.getByMealType(mealType);
  const filtered = filterRecipesByDiet(allForType, preference);
  const pool = filtered.length > 0 ? filtered : allForType;

  if (pool.length === 0) return [];
  if (pool.length <= count) return [...pool];

  // Generar semilla determinista por semana y día
  const seed = getWeeklyRotationSeed(date, dayIndex);
  const startIndex = Math.abs(seed) % pool.length;

  const result: RecipeItem[] = [];
  const pickedIds = new Set<string>();

  for (let i = 0; i < pool.length && result.length < count; i++) {
    const candidate = pool[(startIndex + i) % pool.length];
    if (!pickedIds.has(candidate.id)) {
      pickedIds.add(candidate.id);
      result.push(candidate);
    }
  }

  return result;
}

/**
 * Obtiene el menú planificado sugerido para un día y fecha específicos,
 * con rotación determinista semana a semana.
 */
export function getRotatedMealsForDay(
  date: Date,
  dayIndex: number,
  preference?: DietaryPreference,
  recipeProvider: RecipeProvider = defaultCatalogProvider,
  countPerMeal: number = 3
): DayMealPlan {
  return {
    breakfast: getRotatedOptionsForType('breakfast', date, dayIndex, preference, recipeProvider, countPerMeal),
    lunch: getRotatedOptionsForType('lunch', date, dayIndex, preference, recipeProvider, countPerMeal),
    dinner: getRotatedOptionsForType('dinner', date, dayIndex, preference, recipeProvider, countPerMeal),
    snack: getRotatedOptionsForType('snack', date, dayIndex, preference, recipeProvider, countPerMeal),
  };
}
