import {
  getRandomMealExcluding,
  generateDailyMealSuggestion,
  getRecentMealIds,
  getSuggestedOptionsForMeal,
} from '../src/core/mealService';
import { RecipeItem, DailyMealsLog } from '../src/types';

describe('mealService', () => {
  const mockProvider = {
    getByMealType: (type: RecipeItem['mealType']): RecipeItem[] => {
      if (type === 'breakfast') {
        return [
          {
            id: 'rec_b1',
            title: 'Huevo con Jamón',
            mealType: 'breakfast',
            prepTimeMinutes: 10,
            isBudgetFriendly: true,
            ingredients: ['huevo', 'jamón de pavo'],
            instructions: ['cocinar'],
            approxCalories: 300,
            approxProteinGrams: 15,
          },
          {
            id: 'rec_b2',
            title: 'Avena con Manzana',
            mealType: 'breakfast',
            prepTimeMinutes: 5,
            isBudgetFriendly: true,
            ingredients: ['avena', 'manzana', 'canela'],
            instructions: ['hervir'],
            approxCalories: 280,
            approxProteinGrams: 10,
          },
          {
            id: 'rec_b3',
            title: 'Tostadas de Frijol con Aguacate',
            mealType: 'breakfast',
            prepTimeMinutes: 5,
            isBudgetFriendly: true,
            ingredients: ['tostadas', 'frijol', 'aguacate'],
            instructions: ['untar'],
            approxCalories: 260,
            approxProteinGrams: 10,
          },
          {
            id: 'rec_b4',
            title: 'Omelette de Espinacas',
            mealType: 'breakfast',
            prepTimeMinutes: 8,
            isBudgetFriendly: true,
            ingredients: ['huevo', 'espinacas', 'panela'],
            instructions: ['cocinar'],
            approxCalories: 270,
            approxProteinGrams: 14,
          },
        ];
      }
      return [1, 2, 3, 4].map((n) => ({
        id: `rec_${type}_${n}`,
        title: `Platillo ${type} ${n}`,
        mealType: type,
        prepTimeMinutes: 15,
        isBudgetFriendly: true,
        ingredients: ['ingrediente base'],
        instructions: ['cocinar'],
        approxCalories: 350,
        approxProteinGrams: 20,
      }));
    },
  };

  test('getRandomMealExcluding nunca devuelve la misma receta ni exclusiones adicionales', () => {
    for (let i = 0; i < 20; i++) {
      const selected = getRandomMealExcluding('rec_b1', 'breakfast', 'balanced', ['rec_b2'], mockProvider);
      expect(selected.id).not.toBe('rec_b1');
      expect(selected.id).not.toBe('rec_b2');
      expect(['rec_b3', 'rec_b4']).toContain(selected.id);
    }
  });

  test('getRandomMealExcluding respeta la preferencia vegetariana', () => {
    for (let i = 0; i < 10; i++) {
      const selected = getRandomMealExcluding('rec_b2', 'breakfast', 'vegetarian', [], mockProvider);
      // 'rec_b1' tiene jamón, para vegetariano solo puede ser rec_b3 o rec_b4
      expect(['rec_b3', 'rec_b4']).toContain(selected.id);
    }
  });

  test('generateDailyMealSuggestion genera 3 opciones por cada tiempo de comida', () => {
    const daily = generateDailyMealSuggestion('balanced', [], mockProvider, 3);
    expect(daily.breakfast).toHaveLength(3);
    expect(daily.lunch).toHaveLength(3);
    expect(daily.dinner).toHaveLength(3);
    expect(daily.snack).toHaveLength(3);

    // Garantizar que en cada tiempo todos los platillos pertenecen a su categoría
    daily.breakfast.forEach((r) => expect(r.mealType).toBe('breakfast'));
    daily.lunch.forEach((r) => expect(r.mealType).toBe('lunch'));
    daily.dinner.forEach((r) => expect(r.mealType).toBe('dinner'));
    daily.snack.forEach((r) => expect(r.mealType).toBe('snack'));
  });

  test('getRecentMealIds calcula los IDs de los últimos 2 días para el cooldown', () => {
    const mockHistory: Record<string, DailyMealsLog> = {
      '2026-09-08': {
        date: '2026-09-08',
        breakfast: { id: 'rec_b1' } as any,
        lunch: { id: 'rec_lunch_1' } as any,
      },
      '2026-09-09': {
        date: '2026-09-09',
        breakfast: { id: 'rec_b2' } as any,
        dinner: { id: 'rec_dinner_1' } as any,
      },
      '2026-09-05': {
        date: '2026-09-05',
        breakfast: { id: 'rec_b3' } as any, // Hace más de 2 días, NO debe entrar en cooldown
      },
    };

    const recent = getRecentMealIds(mockHistory, '2026-09-10', 2);
    expect(recent).toContain('rec_b1');
    expect(recent).toContain('rec_b2');
    expect(recent).toContain('rec_lunch_1');
    expect(recent).toContain('rec_dinner_1');
    expect(recent).not.toContain('rec_b3');
  });

  test('getSuggestedOptionsForMeal excluye recetas en cooldown', () => {
    // Si excluimos rec_b1, rec_b2, rec_b3, y pedimos 1 opción, debe ser rec_b4
    const options = getSuggestedOptionsForMeal('breakfast', 1, ['rec_b1', 'rec_b2', 'rec_b3'], 'balanced', mockProvider);
    expect(options[0].id).toBe('rec_b4');
  });
});

