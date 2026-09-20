import { EXERCISES_CATALOG } from '../src/core/exerciseCatalog';
import { classifyExercise } from '../src/core/exerciseTaxonomy';
import { buildWeeklyWorkoutSession } from '../src/core/weeklyWorkoutSession';
import { getWeeklyRotationSeed } from '../src/core/weeklyRotation';

const EXPECTED_PRIMARY_MUSCLES = {
  chest_back: ['chest', 'back'],
  biceps_triceps: ['biceps', 'triceps'],
  shoulders_traps: ['shoulders'],
  abs_obliques: ['core', 'obliques'],
  legs_glutes: ['quadriceps', 'hamstrings', 'glutes', 'calves', 'hip_abductors', 'hip_adductors'],
  core_cardio: ['core', 'obliques', 'cardio'],
} as const;

describe('Sesiones semanales por enfoque', () => {
  it('elige únicamente músculo principal de pecho o espalda para ese día', () => {
    const session = buildWeeklyWorkoutSession(30, 2, 'chest_back', EXERCISES_CATALOG);
    const main = session.phases[1].exercises;

    expect(main).toHaveLength(4);
    expect(main.every((exercise) => {
      const classification = classifyExercise(exercise);
      return classification.primaryMuscles.some((muscle) => ['chest', 'back'].includes(muscle));
    })).toBe(true);
  });

  it('mantiene calentamiento, fase principal y enfriamiento al cambiar de enfoque', () => {
    const session = buildWeeklyWorkoutSession(20, 3, 'biceps_triceps', EXERCISES_CATALOG);

    expect(session.phases.map((phase) => phase.id)).toEqual(['warmup', 'main', 'cooldown']);
    expect(session.phases[0].exercises).toHaveLength(1);
    expect(session.phases[1].exercises.length).toBeGreaterThan(0);
    expect(session.phases[2].guidance).toHaveLength(2);
  });

  it('rota variantes equivalentes cuando un enfoque se repite en la semana', () => {
    const first = buildWeeklyWorkoutSession(20, 3, 'legs_glutes', EXERCISES_CATALOG, 0);
    const second = buildWeeklyWorkoutSession(20, 3, 'legs_glutes', EXERCISES_CATALOG, 4);
    expect(first.phases[1].exercises.map((exercise) => exercise.id)).not.toEqual(second.phases[1].exercises.map((exercise) => exercise.id));
  });
  it('prioriza ejercicios no mostrados recientemente para el mismo enfoque', () => {
    const baseline = buildWeeklyWorkoutSession(20, 2, 'biceps_triceps', EXERCISES_CATALOG, 0);
    const recent = baseline.phases[1].exercises.map((exercise) => ({ date: '2026-09-16', focus: 'biceps_triceps' as const, exerciseId: exercise.id, variantLabel: 'Tempo controlado', weekSeed: 0 }));
    const session = buildWeeklyWorkoutSession(20, 2, 'biceps_triceps', EXERCISES_CATALOG, 0, recent);

    expect(session.phases[1].exercises.some((exercise) => !recent.some((record) => record.exerciseId === exercise.id))).toBe(true);
  });
  it('cambia la rotación del mismo día al iniciar una semana nueva', () => {
    const mondayOne = new Date(2026, 8, 14);
    const mondayTwo = new Date(2026, 8, 21);
    const first = buildWeeklyWorkoutSession(30, 2, 'biceps_triceps', EXERCISES_CATALOG, getWeeklyRotationSeed(mondayOne, 1));
    const second = buildWeeklyWorkoutSession(30, 2, 'biceps_triceps', EXERCISES_CATALOG, getWeeklyRotationSeed(mondayTwo, 1));

    expect(getWeeklyRotationSeed(mondayOne, 1)).not.toBe(getWeeklyRotationSeed(mondayTwo, 1));
    expect(first.phases[1].exercises.map((exercise) => exercise.id)).not.toEqual(second.phases[1].exercises.map((exercise) => exercise.id));
  });
  it('rota calentamiento y movilidad en lugar de tomar siempre el primer cardio del catálogo', () => {
    const first = buildWeeklyWorkoutSession(20, 1, 'full_body', EXERCISES_CATALOG, 0);
    const second = buildWeeklyWorkoutSession(20, 1, 'full_body', EXERCISES_CATALOG, 1);
    const firstWarmup = first.phases[0].exercises[0];
    const secondWarmup = second.phases[0].exercises[0];

    expect(firstWarmup.id).not.toEqual(secondWarmup.id);
    expect(classifyExercise(firstWarmup).allowedPhases).toContain('warmup');
    expect(classifyExercise(secondWarmup).allowedPhases).toContain('warmup');
    expect(first.phases[0].guidance.map((item) => item.id)).not.toEqual(second.phases[0].guidance.map((item) => item.id));
  });
  it('solo rota opciones de calentamiento sin impacto alto, incluso en niveles superiores', () => {
    ([1, 2, 3] as const).forEach((level) => {
      const session = buildWeeklyWorkoutSession(30, level, 'full_body', EXERCISES_CATALOG, 3);
      const warmup = session.phases[0].exercises[0];

      expect(warmup.levelNumeric).toBeLessThanOrEqual(level);
      expect(classifyExercise(warmup).impact).not.toBe('high');
    });
  });
  it('prioriza implementos portátiles cuando existen para el grupo seleccionado', () => {
    const session = buildWeeklyWorkoutSession(30, 2, 'biceps_triceps', EXERCISES_CATALOG);
    const main = session.phases[1].exercises;

    expect(session.phases[1].exercises.some((exercise) => ['mancuernas', 'ligas', 'bandas_pierna'].includes(exercise.category))).toBe(true);
    expect(main.every((exercise) => ['biceps', 'triceps'].includes(classifyExercise(exercise).primaryMuscles[0]))).toBe(true);
    expect(main.map((exercise) => exercise.id)).not.toContain('ex_int_band_low_row');
  });

  it('no mezcla músculos secundarios en ninguna sesión enfocada, nivel o grupo', () => {
    ([1, 2, 3] as const).forEach((level) => {
      Object.entries(EXPECTED_PRIMARY_MUSCLES).forEach(([focus, allowedMuscles]) => {
        const session = buildWeeklyWorkoutSession(30, level, focus as keyof typeof EXPECTED_PRIMARY_MUSCLES, EXERCISES_CATALOG);
        const main = session.phases[1].exercises;

        expect(main.every((exercise) => allowedMuscles.includes(classifyExercise(exercise).primaryMuscles[0] as never))).toBe(true);
      });
    });
  });
});
