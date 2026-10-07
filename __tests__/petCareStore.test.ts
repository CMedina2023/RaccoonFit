import { createAppStore } from '../src/store/createAppStore';
import type { StorageAdapter } from '../src/core/storage/StorageAdapter';
import type { RecipeItem, UserProfile, WorkoutCompletion } from '../src/types';
import { createInitialPetCare } from '../src/core/petCareEngine';
import { getLocalDateString } from '../src/core/weeklyRotation';

function createMemoryStorage(initialValue: string | null = null) {
  let value = initialValue;
  const storage: jest.Mocked<StorageAdapter> = {
    get: jest.fn(async (_key: string) => value),
    set: jest.fn(async (_key, next) => { value = next; }),
    remove: jest.fn(async (_key: string) => { value = null; }),
  };
  return storage;
}

const profile: UserProfile = {
  name: 'Rocky friend',
  gender: 'female',
  age: 30,
  heightCm: 165,
  startingWeightKg: 70,
  targetWeightKg: 65,
  activityLevel: 'light',
  preferredRoutineMinutes: 20,
  weighInDayOfWeek: 0,
  createdAt: '2026-01-01',
};

function recipe(mealType: RecipeItem['mealType']): RecipeItem {
  return {
    id: `recipe-${mealType}`,
    title: `Meal ${mealType}`,
    mealType,
    prepTimeMinutes: 10,
    isBudgetFriendly: true,
    ingredients: ['huevo'],
    instructions: ['cocinar'],
    approxCalories: 200,
    approxProteinGrams: 10,
  };
}

describe('persistencia e integración de cuidados de Rocky', () => {
  afterEach(() => jest.useRealTimers());

  it('migra datos previos sin cuidados y persiste una sesión R5 con versión', async () => {
    const today = getLocalDateString();
    const legacy = { userProfile: profile, hydrationHistory: { [today]: 2 }, petState: { name: 'Rocky' } };
    const storage = createMemoryStorage(JSON.stringify(legacy));
    const store = createAppStore(storage);

    await store.getState().initialize();

    expect(store.getState().hydrationHistory).toEqual(legacy.hydrationHistory);
    expect(store.getState().petCareState.hunger).toBe(80);
    expect(store.getState().petCareEventIds).toContain(`water_glass:${today}:2`);
    expect(JSON.parse(storage.set.mock.calls[0][1]).petCareVersion).toBe(1);

    await store.getState().performPetCareAction('feed');
    const persisted = JSON.parse(storage.set.mock.calls.at(-1)![1]);
    expect(persisted.petCareState.hunger).toBe(100);
    expect(persisted.petCareState.lastUpdatedAtMs).toBeGreaterThan(0);
    expect(store.getState().petAnimationRequest?.animation).toBe('eat');
  });

  it('recupera el estado guardado y aplica el deterioro máximo por ausencia', async () => {
    const now = new Date(2026, 8, 29, 12).getTime();
    jest.useFakeTimers().setSystemTime(now);
    const priorCare = createInitialPetCare(now - 48 * 60 * 60 * 1000);
    const storage = createMemoryStorage(JSON.stringify({ petCareVersion: 1, petCareState: priorCare, petCareEventIds: [] }));
    const store = createAppStore(storage);

    await store.getState().initialize();

    expect(store.getState().petCareState.hunger).toBe(20);
    expect(store.getState().petCareState.lastUpdatedAtMs).toBe(now);
  });

  it('premia agua una vez por vaso y no duplica XP al deshacer y volver a registrar', async () => {
    const store = createAppStore(createMemoryStorage());
    const initial = store.getState().petCareState.energy;
    const date = getLocalDateString();

    await store.getState().addWaterGlass();
    expect(store.getState().petState.currentXp).toBe(10);
    expect(store.getState().petAnimationRequest?.animation).toBe('drink');
    expect(store.getState().petCareState.energy).toBe(initial + 4);
    await store.getState().removeWaterGlass();
    await store.getState().addWaterGlass();

    expect(store.getState().petState.currentXp).toBe(10);
    expect(store.getState().petCareEventIds).toContain(`water_glass:${date}:1`);
  });

  it('otorga el bono de comidas al completar las cuatro categorías una vez al día', async () => {
    const store = createAppStore(createMemoryStorage());
    const date = getLocalDateString();
    for (const type of ['breakfast', 'lunch', 'dinner', 'snack'] as const) {
      await store.getState().selectMealForDay(date, type, recipe(type));
    }
    expect(store.getState().petState.currentXp).toBe(30);
    expect(store.getState().petAnimationRequest?.animation).toBe('celebrate');
    await store.getState().selectMealForDay(date, 'breakfast', recipe('breakfast'));
    await store.getState().selectMealForDay(date, 'breakfast', recipe('breakfast'));
    expect(store.getState().petState.currentXp).toBe(30);
  });

  it('premia una rutina una vez por fecha y mantiene XP tras deshacerla', async () => {
    const store = createAppStore(createMemoryStorage());
    const completion: WorkoutCompletion = {
      date: getLocalDateString(), day: 'lunes', focus: 'full_body', durationMinutes: 20, completedAt: new Date().toISOString(),
    };
    await store.getState().toggleWorkoutCompletion(completion);
    expect(store.getState().petState.currentXp).toBe(50);
    expect(store.getState().petAnimationRequest?.animation).toBe('celebrate');
    await store.getState().toggleWorkoutCompletion(completion);
    await store.getState().toggleWorkoutCompletion(completion);
    expect(store.getState().petState.currentXp).toBe(50);
  });

  it('premia el primer pesaje diario sin contar el peso inicial del perfil', async () => {
    const store = createAppStore(createMemoryStorage());
    await store.getState().saveUserProfile(profile);
    expect(store.getState().petState.currentXp).toBe(0);
    await store.getState().addWeeklyWeighIn(69);
    expect(store.getState().petState.currentXp).toBe(0); // nivel inicial recibe 100 XP y avanza
    expect(store.getState().petState.level).toBe(2);
    expect(store.getState().petState.shape).toBe('chubby');
    expect(store.getState().petState.dialogMessage).not.toContain('kg');
    expect(store.getState().petState.dialogMessage).toContain('Registro semanal guardado');
    const xpAfterFirstWeighIn = store.getState().petState.currentXp;
    await store.getState().addWeeklyWeighIn(68.5);
    expect(store.getState().petState.currentXp).toBe(xpAfterFirstWeighIn);
    expect(store.getState().petCareEventIds).toContain(`weigh_in:${getLocalDateString()}`);
    expect(store.getState().petAnimationRequest?.animation).toBe('celebrate');
  });
});
