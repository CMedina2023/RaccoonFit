import { EXERCISES_CATALOG } from '../src/core/exerciseCatalog';
import { classifyExercise } from '../src/core/exerciseTaxonomy';
import {
  applyWorkoutMainOverride,
  createWorkoutSessionKey,
  findWorkoutExerciseReplacement,
  replaceAllWorkoutMainExercises,
  replaceWorkoutMainExercise,
} from '../src/core/workoutExerciseReplacement';
import { buildWeeklyWorkoutSession } from '../src/core/weeklyWorkoutSession';

describe('Reemplazos seguros de ejercicios principales', () => {
  const session = buildWeeklyWorkoutSession(30, 2, 'chest_back', EXERCISES_CATALOG, 2);
  const main = session.phases[1].exercises;
  const target = main.find((exercise) => findWorkoutExerciseReplacement(exercise, main, 2, 'chest_back', [], 3, EXERCISES_CATALOG) !== null)!;

  it('conserva nivel, músculo principal, patrón y fase al reemplazar uno', () => {
    const replacement = findWorkoutExerciseReplacement(target, main, 2, 'chest_back', [], 3, EXERCISES_CATALOG)!;

    expect(replacement.id).not.toBe(target.id);
    expect(replacement.levelNumeric).toBe(2);
    expect(classifyExercise(replacement).primaryMuscles).toEqual(classifyExercise(target).primaryMuscles);
    expect(classifyExercise(replacement).movementPattern).toBe(classifyExercise(target).movementPattern);
    expect(classifyExercise(replacement).allowedPhases).toContain('main');
    expect(classifyExercise(replacement).impact).not.toBe('high');
  });

  it('no repite la lista actual y mantiene la cantidad al reemplazar uno', () => {
    const replaced = replaceWorkoutMainExercise(main, target.id, 2, 'chest_back', [], 4, EXERCISES_CATALOG);
    expect(replaced).toHaveLength(main.length);
    expect(replaced.some((exercise) => exercise.id === target.id)).toBe(false);
  });

  it('renueva únicamente los ejercicios principales y deja intactas las otras fases', () => {
    const replaced = replaceAllWorkoutMainExercises(main, 2, 'chest_back', [], 5, EXERCISES_CATALOG);
    const customized = applyWorkoutMainOverride(session, { sessionKey: 'key', exercises: replaced, updatedAt: '2026-09-18T12:00:00.000Z' });

    expect(customized.totalMinutes).toBe(session.totalMinutes);
    expect(customized.phases[0]).toEqual(session.phases[0]);
    expect(customized.phases[2]).toEqual(session.phases[2]);
    expect(customized.phases[1].exercises).toEqual(replaced);
  });

  it('identifica de manera estable una sesión personalizada por fecha, día, enfoque y semana', () => {
    expect(createWorkoutSessionKey('2026-09-18', 'Vie', 'chest_back', 12)).toBe('2026-09-18:Vie:chest_back:12');
  });
});
