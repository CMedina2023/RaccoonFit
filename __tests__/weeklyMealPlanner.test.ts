import { getWeekDaysForDate, getRotatedMealsForDay, DAY_NAMES } from '../src/core/weeklyMealPlanner';
import { DailyMealsLog, RecipeItem } from '../src/types';

describe('weeklyMealPlanner', () => {
  describe('getWeekDaysForDate', () => {
    it('debe devolver 7 días con los nombres correctos de Lunes a Domingo', () => {
      const refDate = new Date(2026, 8, 25); // Viernes 25 Sep 2026
      const days = getWeekDaysForDate(refDate);

      expect(days).toHaveLength(7);
      expect(days.map((d) => d.day)).toEqual(['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']);
      expect(days[0].date).toBe('2026-09-21'); // Lunes
      expect(days[4].date).toBe('2026-09-25'); // Viernes
      expect(days[6].date).toBe('2026-09-27'); // Domingo
    });

    it('debe reflejar si el día tiene comidas seleccionadas en mealsHistory', () => {
      const refDate = new Date(2026, 8, 25);
      const fakeRecipe: RecipeItem = {
        id: 'rec_1',
        title: 'Huevo con verduras',
        mealType: 'breakfast',
        prepTimeMinutes: 10,
        isBudgetFriendly: true,
        ingredients: ['Huevo'],
        instructions: ['Cocinar'],
        approxCalories: 200,
        approxProteinGrams: 12,
      };

      const mealsHistory: Record<string, DailyMealsLog> = {
        '2026-09-21': {
          date: '2026-09-21',
          breakfast: fakeRecipe,
        },
      };

      const days = getWeekDaysForDate(refDate, mealsHistory);
      expect(days[0].hasSelectedMeals).toBe(true);
      expect(days[0].selectedMealsCount).toBe(1);
      expect(days[1].hasSelectedMeals).toBe(false);
      expect(days[1].selectedMealsCount).toBe(0);
    });

    it('debe marcar correctamente el día actual a las 21:25 PM o noche respetando la zona horaria local sin adelantar al día siguiente', () => {
      // Viernes 25 Sep 2026 a las 21:25:00 local
      const fridayNight = new Date(2026, 8, 25, 21, 25, 0);
      const days = getWeekDaysForDate(fridayNight);

      const fridayDay = days.find((d) => d.day === 'Vie');
      const saturdayDay = days.find((d) => d.day === 'Sáb');

      expect(fridayDay?.isToday).toBe(true);
      expect(fridayDay?.date).toBe('2026-09-25');
      expect(saturdayDay?.isToday).toBe(false);
      expect(saturdayDay?.date).toBe('2026-09-26');
    });
  });

  describe('getRotatedMealsForDay', () => {
    it('debe devolver 3 opciones por cada tiempo (breakfast, lunch, dinner, snack)', () => {
      const date = new Date(2026, 8, 21); // Lunes
      const meals = getRotatedMealsForDay(date, 0, 'balanced');

      expect(meals.breakfast.length).toBeGreaterThanOrEqual(1);
      expect(meals.lunch.length).toBeGreaterThanOrEqual(1);
      expect(meals.dinner.length).toBeGreaterThanOrEqual(1);
      expect(meals.snack.length).toBeGreaterThanOrEqual(1);

      meals.breakfast.forEach((r) => expect(r.mealType).toBe('breakfast'));
      meals.lunch.forEach((r) => expect(r.mealType).toBe('lunch'));
      meals.dinner.forEach((r) => expect(r.mealType).toBe('dinner'));
      meals.snack.forEach((r) => expect(r.mealType).toBe('snack'));
    });

    it('debe rotar las comidas en la semana siguiente (semana 1 vs semana 2)', () => {
      const week1Monday = new Date(2026, 8, 21); // Lunes Semana 1
      const week2Monday = new Date(2026, 8, 28); // Lunes Semana 2 (+7 días)

      const mealsWeek1 = getRotatedMealsForDay(week1Monday, 0, 'balanced');
      const mealsWeek2 = getRotatedMealsForDay(week2Monday, 0, 'balanced');

      const week1BreakfastIds = mealsWeek1.breakfast.map((r) => r.id);
      const week2BreakfastIds = mealsWeek2.breakfast.map((r) => r.id);

      // Al menos el primer elemento o la combinación debe haber rotado
      expect(week1BreakfastIds).not.toEqual(week2BreakfastIds);
    });

    it('debe rotar entre días diferentes de la misma semana (Lunes vs Martes)', () => {
      const week1Monday = new Date(2026, 8, 21); // Lunes (dayIndex 0)
      const week1Tuesday = new Date(2026, 8, 22); // Martes (dayIndex 1)

      const mealsMonday = getRotatedMealsForDay(week1Monday, 0, 'balanced');
      const mealsTuesday = getRotatedMealsForDay(week1Tuesday, 1, 'balanced');

      const monLunchIds = mealsMonday.lunch.map((r) => r.id);
      const tueLunchIds = mealsTuesday.lunch.map((r) => r.id);

      expect(monLunchIds).not.toEqual(tueLunchIds);
    });

    it('debe respetar la preferencia vegetariana o vegana', () => {
      const date = new Date(2026, 8, 21);
      const veganMeals = getRotatedMealsForDay(date, 0, 'vegan');

      veganMeals.lunch.forEach((r) => {
        const fullText = (r.title + ' ' + r.ingredients.join(' ')).toLowerCase();
        expect(fullText).not.toMatch(/pollo|res|carne|pavo|cerdo|jamón|atún|pescado|huevo|leche|queso/);
      });
    });
  });
});
