import { useAppStore } from '../src/store/useAppStore';
import { RecipeItem } from '../src/types';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('useAppStore - Selección diaria e histórico de comidas', () => {
  beforeEach(async () => {
    await useAppStore.getState().resetAll();
  });

  test('selectMealForDay registra y desmarca platillos correctamente en el histórico', async () => {
    const today = '2026-09-10';
    const mockRecipe: RecipeItem = {
      id: 'rec_des_3',
      title: 'Omelette Esponjoso de Espinacas y Queso Panela',
      mealType: 'breakfast',
      prepTimeMinutes: 10,
      isBudgetFriendly: true,
      ingredients: ['2 huevos', 'espinacas'],
      instructions: ['cocinar'],
      approxCalories: 310,
      approxProteinGrams: 18,
    };

    // 1. Seleccionar platillo para hoy
    await useAppStore.getState().selectMealForDay(today, 'breakfast', mockRecipe);
    let history = useAppStore.getState().mealsHistory;
    expect(history[today]).toBeDefined();
    expect(history[today].breakfast?.id).toBe('rec_des_3');

    // 2. Toggle: volver a presionar debe desmarcarlo
    await useAppStore.getState().selectMealForDay(today, 'breakfast', mockRecipe);
    history = useAppStore.getState().mealsHistory;
    expect(history[today].breakfast).toBeUndefined();
  });

  test('shuffleSingleMeal mantiene 3 opciones y pertenece al mismo mealType', async () => {
    // Guardar perfil para tener plan activo
    await useAppStore.getState().saveUserProfile({
      name: 'Tester',
      gender: 'male',
      age: 28,
      heightCm: 175,
      startingWeightKg: 80,
      targetWeightKg: 75,
      weighInDayOfWeek: 5,
      activityLevel: 'moderate',
      preferredRoutineMinutes: 20,
      dietaryPreference: 'balanced',
      fitnessGoal: 'fat_loss',
      createdAt: '2026-09-10',
      remindersEnabled: true,
    });

    const plan = useAppStore.getState().currentPlan;
    expect(plan).not.toBeNull();
    if (!plan) return;

    // Verificar que inicialmente hay 3 opciones por tiempo
    expect(plan.selectedMeals.breakfast).toHaveLength(3);
    expect(plan.selectedMeals.lunch).toHaveLength(3);
    expect(plan.selectedMeals.dinner).toHaveLength(3);
    expect(plan.selectedMeals.snack).toHaveLength(3);

    // Cambiar una opción de comida (lunch)
    const initialLunchId = plan.selectedMeals.lunch[0].id;
    useAppStore.getState().shuffleSingleMeal('lunch', initialLunchId);

    const updatedPlan = useAppStore.getState().currentPlan!;
    expect(updatedPlan.selectedMeals.lunch).toHaveLength(3);
    expect(updatedPlan.selectedMeals.lunch.every((r) => r.mealType === 'lunch')).toBe(true);
  });
});
