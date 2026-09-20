import { EXERCISES_CATALOG, getExercisesByLevel, selectExercisesForPlan } from '../src/core/exerciseCatalog';

const indexedExercises = require('../.agents/skills/workout-coach/resources/exercisedb_home_catalog.json') as Record<string, unknown>;

describe('Integridad del catálogo de ejercicios', () => {
  it('completa la cobertura mínima de la fase 3 por nivel', () => {
    const minimumByLevel: Record<1 | 2 | 3, number> = { 1: 30, 2: 31, 3: 29 };

    ([1, 2, 3] as const).forEach((level) => {
      expect(getExercisesByLevel(level).length).toBeGreaterThanOrEqual(minimumByLevel[level]);
    });
  });

  it('puede completar las rutinas de 20, 30 y 60 minutos sin mezclar niveles', () => {
    ([1, 2, 3] as const).forEach((level) => {
      ([20, 30, 60] as const).forEach((minutes) => {
        const exercises = selectExercisesForPlan(minutes, level);
        const expectedCount = minutes === 20 ? 4 : minutes === 30 ? 5 : 8;

        expect(exercises).toHaveLength(expectedCount);
        expect(exercises.every((exercise) => exercise.levelNumeric === level)).toBe(true);
      });
    });
  });

  it('usa IDs únicos, existentes en la fuente local y sin URL remota', () => {
    const ids = EXERCISES_CATALOG.map((exercise) => exercise.id);

    expect(new Set(ids).size).toBe(ids.length);
    EXERCISES_CATALOG.forEach((exercise) => {
      expect(exercise.exerciseDbId).toMatch(/^[a-zA-Z0-9]+$/);
      expect(indexedExercises[exercise.exerciseDbId]).toBeDefined();
      expect(exercise.gifUrl).toBeUndefined();
      expect(exercise.difficulty).toBe(['principiante', 'intermedio', 'avanzado'][exercise.levelNumeric - 1]);
    });
  });
});
