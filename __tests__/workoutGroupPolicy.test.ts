import { EXERCISES_CATALOG } from '../src/core/exerciseCatalog';
import { classifyExercise } from '../src/core/exerciseTaxonomy';
import { PRIMARY_MUSCLES_BY_FOCUS } from '../src/core/workoutGroupPolicy';

describe('Matriz de cobertura por grupo muscular', () => {
  it('mantiene inventariado el número de ejercicios cuyo músculo principal corresponde a cada grupo y nivel', () => {
    const coverage = Object.fromEntries(Object.entries(PRIMARY_MUSCLES_BY_FOCUS).map(([focus, muscles]) => [
      focus,
      ([1, 2, 3] as const).map((level) => EXERCISES_CATALOG.filter((exercise) =>
        exercise.levelNumeric === level && muscles.includes(classifyExercise(exercise).primaryMuscles[0])
      ).length),
    ]));

    expect(coverage).toEqual({
      chest_back: [7, 8, 11],
      biceps_triceps: [6, 7, 7],
      shoulders_traps: [7, 10, 9],
      abs_obliques: [7, 7, 6],
      legs_glutes: [14, 7, 9],
      core_cardio: [9, 9, 7],
    });
  });
});
