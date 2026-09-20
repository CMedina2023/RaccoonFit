import { createWorkoutCompletion, getLocalDateKey, toggleWorkoutCompletion } from '../src/core/workoutProgressService';
import { getWeeklyWorkoutSchedule } from '../src/core/weeklyWorkoutPlanner';

describe('Progreso de entrenamiento local', () => {
  const date = new Date(2026, 8, 14, 12);

  it('crea un registro fechado localmente para un día entrenable y permite deshacerlo', () => {
    const scheduledDay = getWeeklyWorkoutSchedule(2)[0];
    const completion = createWorkoutCompletion(scheduledDay, 30, date);
    const completed = toggleWorkoutCompletion({}, completion);

    expect(completion.date).toBe('2026-09-14');
    expect(getLocalDateKey(date)).toBe('2026-09-14');
    expect(completed[completion.date].focus).toBe('chest_back');
    expect(toggleWorkoutCompletion(completed, completion)).toEqual({});
  });

  it('rechaza registrar ejercicio en un día de descanso', () => {
    const restDay = getWeeklyWorkoutSchedule(2)[2];
    expect(() => createWorkoutCompletion(restDay, 30, date)).toThrow('día de descanso');
  });
});
