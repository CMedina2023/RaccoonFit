import { createAppStore } from '../src/store/createAppStore';
import { StorageAdapter } from '../src/core/storage/StorageAdapter';
import { createWorkoutCompletion } from '../src/core/workoutProgressService';
import { getWeeklyWorkoutSchedule } from '../src/core/weeklyWorkoutPlanner';
import { EXERCISES_CATALOG } from '../src/core/exerciseCatalog';

describe('Store persistence dependency inversion', () => {
  test('uses the injected adapter to initialize and reset state', async () => {
    const storage: jest.Mocked<StorageAdapter> = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn().mockResolvedValue(undefined),
    };
    const store = createAppStore(storage);

    await store.getState().initialize();
    await store.getState().resetAll();

    expect(storage.get).toHaveBeenCalledWith('@dieta_fitness_state_v2');
    expect(storage.remove).toHaveBeenCalledWith('@dieta_fitness_state_v2');
  });

  test('persists a completed workout using the injected adapter', async () => {
    const storage: jest.Mocked<StorageAdapter> = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn().mockResolvedValue(undefined),
    };
    const store = createAppStore(storage);
    const completion = createWorkoutCompletion(getWeeklyWorkoutSchedule(1)[0], 20, new Date(2026, 8, 14, 12));

    await store.getState().toggleWorkoutCompletion(completion);

    expect(store.getState().workoutHistory[completion.date]).toEqual(completion);
    const persistedPayload = JSON.parse(storage.set.mock.calls[0][1]);
    expect(persistedPayload.workoutHistory[completion.date]).toEqual(completion);
  });

  test('persists presentation history separately from completed workouts', async () => {
    const storage: jest.Mocked<StorageAdapter> = { get: jest.fn().mockResolvedValue(null), set: jest.fn().mockResolvedValue(undefined), remove: jest.fn().mockResolvedValue(undefined) };
    const store = createAppStore(storage);
    const record = { date: '2026-09-17', focus: 'chest_back' as const, exerciseId: 'ex_begin_wall_pushup', variantLabel: 'Rango cómodo', weekSeed: 12 };
    await store.getState().recordWorkoutPresentation([record]);
    expect(store.getState().workoutPresentationHistory).toEqual([record]);
    expect(store.getState().workoutHistory).toEqual({});
    expect(JSON.parse(storage.set.mock.calls[0][1]).workoutPresentationHistory).toEqual([record]);
  });

  test('persists a personalized main workout session using the injected adapter', async () => {
    const storage: jest.Mocked<StorageAdapter> = { get: jest.fn().mockResolvedValue(null), set: jest.fn().mockResolvedValue(undefined), remove: jest.fn().mockResolvedValue(undefined) };
    const store = createAppStore(storage);
    const exercise = EXERCISES_CATALOG[0];
    const override = { sessionKey: '2026-09-18:Vie:full_body:12', exercises: [exercise], updatedAt: '2026-09-18T12:00:00.000Z' };

    await store.getState().saveWorkoutMainOverride(override);

    expect(store.getState().workoutMainOverrides[override.sessionKey]).toEqual(override);
    expect(JSON.parse(storage.set.mock.calls[0][1]).workoutMainOverrides[override.sessionKey]).toEqual(override);
  });

  test('migrates a legacy plan without losing meals or histories', async () => {
    const legacy = {
      currentPlan: { id: 'p1', title: 'Plan', startDate: '2026-09-01', endDate: '2026-10-01', durationWeeks: 4, routineDurationMinutes: 20, status: 'active', targetLossKg: 2, selectedExercises: [], selectedMeals: { breakfast: [], lunch: [], dinner: [], snack: [] } },
      mealsHistory: { '2026-09-14': { date: '2026-09-14' } }, hydrationHistory: { '2026-09-14': 4 }, weighInHistory: [], workoutHistory: {},
    };
    const storage: jest.Mocked<StorageAdapter> = { get: jest.fn().mockResolvedValue(JSON.stringify(legacy)), set: jest.fn(), remove: jest.fn() };
    const store = createAppStore(storage);
    await store.getState().initialize();
    expect(store.getState().currentPlan?.selectedMeals.breakfast.length).toBeGreaterThan(0);
    expect(store.getState().mealsHistory).toEqual(legacy.mealsHistory);
    expect(store.getState().hydrationHistory).toEqual(legacy.hydrationHistory);
    expect((store.getState().currentPlan as unknown as { selectedExercises?: unknown }).selectedExercises).toBeUndefined();
  });

  test('preserves a previously saved weekly routine while the user adds its second rest day', async () => {
    const oneRestRoutine = {
      days: getWeeklyWorkoutSchedule(2).map((day, index) => index === 6
        ? { ...day, focus: 'full_body' as const, status: 'training' as const, label: 'Cuerpo completo' }
        : day),
    };
    const storage: jest.Mocked<StorageAdapter> = {
      get: jest.fn().mockResolvedValue(JSON.stringify({ weeklyRoutine: oneRestRoutine })),
      set: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn().mockResolvedValue(undefined),
    };
    const store = createAppStore(storage);

    await store.getState().initialize();

    expect(store.getState().weeklyRoutine).toEqual(oneRestRoutine);
    expect(await store.getState().saveWeeklyRoutine(oneRestRoutine)).toBe(false);
    expect(storage.set).toHaveBeenCalledTimes(1); // Migración aditiva de cuidados, conserva la rutina existente.
    expect(JSON.parse(storage.set.mock.calls[0][1]).weeklyRoutine).toEqual(oneRestRoutine);
  });
});
