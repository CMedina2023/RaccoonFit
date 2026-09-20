import { EXERCISES_CATALOG } from '../src/core/exerciseCatalog';
import { buildWorkoutSession } from '../src/core/workoutSessionBuilder';

describe('Constructor de sesión por fases', () => {
  it('separa calentamiento, trabajo principal y vuelta a la calma', () => {
    const exercises = [
      EXERCISES_CATALOG.find((exercise) => exercise.id === 'ex_begin_step_jack')!,
      EXERCISES_CATALOG.find((exercise) => exercise.id === 'ex_begin_wall_squat')!,
    ];
    const session = buildWorkoutSession(20, exercises);

    expect(session.phases.map((phase) => phase.id)).toEqual(['warmup', 'main', 'cooldown']);
    expect(session.phases.map((phase) => phase.minutes)).toEqual([3, 14, 3]);
    expect(session.phases[0].exercises.map((exercise) => exercise.id)).toEqual(['ex_begin_step_jack']);
    expect(session.phases[1].exercises.map((exercise) => exercise.id)).toEqual(['ex_begin_wall_squat']);
    expect(session.phases[2].guidance).toHaveLength(2);
  });

  it('conserva todos los ejercicios como trabajo principal si no hay cardio apto para calentar', () => {
    const exercises = [EXERCISES_CATALOG.find((exercise) => exercise.id === 'ex_int_goblet_squat')!];
    const session = buildWorkoutSession(30, exercises);

    expect(session.phases[0].exercises).toEqual([]);
    expect(session.phases[1].exercises.map((exercise) => exercise.id)).toEqual(exercises.map((exercise) => exercise.id));
    expect(session.phases[1].exercises[0].executionVariant).toBeDefined();
    expect(session.phases[1].exercises[0].executionVariant?.label).not.toBe('Carga progresiva');
  });
});
