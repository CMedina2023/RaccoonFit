import { RecipeItem, DietaryPreference, DailyMealsLog } from '../types';
import { filterRecipesByDiet } from './catalogs';
import { RecipeProvider, defaultCatalogProvider } from './planEngine';

/**
 * Obtiene los IDs de las recetas seleccionadas en los últimos `days` días anteriores a `targetDate`.
 * Esto implementa la regla de no repetición (cooldown mínimo de 2 días).
 *
 * @param history     Historial de comidas registrado
 * @param targetDate  Fecha de referencia (por defecto hoy 'YYYY-MM-DD')
 * @param days        Días hacia atrás para el cooldown (por defecto 2)
 */
export function getRecentMealIds(
  history: Record<string, DailyMealsLog>,
  targetDate: string = new Date().toISOString().split('T')[0],
  days: number = 2
): string[] {
  const target = new Date(targetDate);
  const excludedIds = new Set<string>();

  for (let i = 1; i <= days; i++) {
    const pastDate = new Date(target);
    pastDate.setDate(target.getDate() - i);
    const dateStr = pastDate.toISOString().split('T')[0];

    const log = history[dateStr];
    if (log) {
      if (log.breakfast?.id) excludedIds.add(log.breakfast.id);
      if (log.lunch?.id) excludedIds.add(log.lunch.id);
      if (log.dinner?.id) excludedIds.add(log.dinner.id);
      if (log.snack?.id) excludedIds.add(log.snack.id);
    }
  }

  // También incluimos lo ya consumido en la fecha actual para no repetir en el mismo día
  const todayLog = history[targetDate];
  if (todayLog) {
    if (todayLog.breakfast?.id) excludedIds.add(todayLog.breakfast.id);
    if (todayLog.lunch?.id) excludedIds.add(todayLog.lunch.id);
    if (todayLog.dinner?.id) excludedIds.add(todayLog.dinner.id);
    if (todayLog.snack?.id) excludedIds.add(todayLog.snack.id);
  }

  return Array.from(excludedIds);
}

/**
 * Obtiene N opciones aleatorias de recetas pertenecientes EXCLUSIVAMENTE al mealType dado,
 * excluyendo recetas en cooldown o ya seleccionadas.
 */
export function getSuggestedOptionsForMeal(
  mealType: RecipeItem['mealType'],
  count: number = 3,
  excludeIds: string[] = [],
  preference?: DietaryPreference,
  recipeProvider: RecipeProvider = defaultCatalogProvider
): RecipeItem[] {
  const allForType = recipeProvider.getByMealType(mealType);
  const filtered = filterRecipesByDiet(allForType, preference);
  const pool = filtered.length > 0 ? filtered : allForType;

  // Filtrar exclusiones (cooldown de 2 días y/o recetas actuales)
  const excludeSet = new Set(excludeIds);
  let candidates = pool.filter((r) => !excludeSet.has(r.id));

  // Fallback seguro: si tras excluir quedan menos que count, usar el pool general de este tipo
  if (candidates.length < count) {
    candidates = pool;
  }

  // Mezclar aleatoriamente (Fisher-Yates shuffle)
  const shuffled = [...candidates];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Obtiene una receta aleatoria del catálogo del mismo tipo de comida,
 * respetando la preferencia dietética, garantizando que sea diferente a la actual
 * y que no esté en la lista de exclusiones (las otras opciones mostradas o cooldown).
 */
export function getRandomMealExcluding(
  currentId: string,
  mealType: RecipeItem['mealType'],
  preference?: DietaryPreference,
  additionalExcludeIds: string[] = [],
  recipeProvider: RecipeProvider = defaultCatalogProvider
): RecipeItem {
  const allForType = recipeProvider.getByMealType(mealType);
  const filtered = filterRecipesByDiet(allForType, preference);
  const pool = filtered.length > 0 ? filtered : allForType;

  const totalExclude = new Set([currentId, ...additionalExcludeIds]);
  let candidates = pool.filter((r) => !totalExclude.has(r.id));

  // Si no hay candidatos con todas las exclusiones, solo excluir el ID actual
  if (candidates.length === 0) {
    candidates = pool.filter((r) => r.id !== currentId);
  }
  const selectionPool = candidates.length > 0 ? candidates : pool;

  const randomIndex = Math.floor(Math.random() * selectionPool.length);
  return selectionPool[randomIndex];
}

/**
 * Genera un conjunto diario sugerido (Desayuno, Comida, Cena y Snack)
 * seleccionando 3 opciones diferentes por cada tiempo de comida,
 * respetando el cooldown de 2 días.
 */
export function generateDailyMealSuggestion(
  preference?: DietaryPreference,
  recentExcludedIds: string[] = [],
  recipeProvider: RecipeProvider = defaultCatalogProvider,
  countPerMeal: number = 3
): {
  breakfast: RecipeItem[];
  lunch: RecipeItem[];
  dinner: RecipeItem[];
  snack: RecipeItem[];
} {
  return {
    breakfast: getSuggestedOptionsForMeal('breakfast', countPerMeal, recentExcludedIds, preference, recipeProvider),
    lunch: getSuggestedOptionsForMeal('lunch', countPerMeal, recentExcludedIds, preference, recipeProvider),
    dinner: getSuggestedOptionsForMeal('dinner', countPerMeal, recentExcludedIds, preference, recipeProvider),
    snack: getSuggestedOptionsForMeal('snack', countPerMeal, recentExcludedIds, preference, recipeProvider),
  };
}
