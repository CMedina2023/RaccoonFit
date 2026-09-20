import { WorkoutCompletion } from '../src/types';
import { getCompletedWorkoutStreak, getWorkoutProgressionRecommendation } from '../src/core/workoutProgressionService';
import { getWeeklyWorkoutSchedule } from '../src/core/weeklyWorkoutPlanner';

const completed = (date: string): WorkoutCompletion => ({ date, day: 'Lun', focus: 'full_body', durationMinutes: 20, completedAt: `${date}T12:00:00.000Z` });

describe('Progresión semanal segura', () => {
  it('sugiere técnica cuando se omitió la sesión programada anterior', () => {
    const streak = getCompletedWorkoutStreak({}, getWeeklyWorkoutSchedule(1), new Date(2026, 8, 16, 12));
    expect(streak).toBe(0);
    expect(getWorkoutProgressionRecommendation(streak).kind).toBe('maintain');
  });
  it('avanza repeticiones solo tras tres sesiones programadas consecutivas', () => {
    const history = { '2026-09-11': completed('2026-09-11'), '2026-09-09': completed('2026-09-09'), '2026-09-07': completed('2026-09-07') };
    const streak = getCompletedWorkoutStreak(history, getWeeklyWorkoutSchedule(1), new Date(2026, 8, 12, 12));
    expect(streak).toBe(3);
    expect(getWorkoutProgressionRecommendation(streak).kind).toBe('repetitions');
  });
});
