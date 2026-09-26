import { getWeekDaysForDate, getRotatedMealsForDay } from '../src/core/weeklyMealPlanner';
import { DailyMealsLog, RecipeItem } from '../src/types';

describe('Semanario de Dieta - Flujo de Semanas y Días', () => {
  const sampleRecipe: RecipeItem = {
    id: 'rec_des_1',
    title: 'Huevos a la Mexicana',
    mealType: 'breakfast',
    prepTimeMinutes: 10,
    isBudgetFriendly: true,
    ingredients: ['Huevos', 'Tomate'],
    instructions: ['Cocinar'],
    approxCalories: 300,
    approxProteinGrams: 16,
  };

  it('permite registrar platillos para días diferentes de la semana', () => {
    const monday = '2026-09-21';
    const tuesday = '2026-09-22';

    const history: Record<string, DailyMealsLog> = {
      [monday]: { date: monday, breakfast: sampleRecipe },
      [tuesday]: { date: tuesday, lunch: { ...sampleRecipe, id: 'rec_com_1', mealType: 'lunch' } },
    };

    const weekDays = getWeekDaysForDate(new Date(2026, 8, 23), history);

    const monDay = weekDays.find((d) => d.date === monday);
    const tueDay = weekDays.find((d) => d.date === tuesday);
    const wedDay = weekDays.find((d) => d.date === '2026-09-23');

    expect(monDay?.hasSelectedMeals).toBe(true);
    expect(monDay?.selectedMealsCount).toBe(1);

    expect(tueDay?.hasSelectedMeals).toBe(true);
    expect(tueDay?.selectedMealsCount).toBe(1);

    expect(wedDay?.hasSelectedMeals).toBe(false);
    expect(wedDay?.selectedMealsCount).toBe(0);
  });

  it('asegura que semana 1, semana 2 y semana 3 provean rotaciones con diversidad de recetas', () => {
    const mondayW1 = new Date(2026, 8, 7);
    const mondayW2 = new Date(2026, 8, 14);
    const mondayW3 = new Date(2026, 8, 21);

    const planW1 = getRotatedMealsForDay(mondayW1, 0, 'balanced');
    const planW2 = getRotatedMealsForDay(mondayW2, 0, 'balanced');
    const planW3 = getRotatedMealsForDay(mondayW3, 0, 'balanced');

    const idsW1 = planW1.dinner.map((r) => r.id);
    const idsW2 = planW2.dinner.map((r) => r.id);
    const idsW3 = planW3.dinner.map((r) => r.id);

    expect(idsW1).not.toEqual(idsW2);
    expect(idsW2).not.toEqual(idsW3);
  });
});
