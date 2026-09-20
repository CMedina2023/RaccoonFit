import { WorkoutCompletion, WorkoutCompletionFocus } from '../types';
import { WeeklyWorkoutDay } from './weeklyWorkoutPlanner';

export function getLocalDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function createWorkoutCompletion(
  scheduledDay: WeeklyWorkoutDay,
  durationMinutes: 20 | 30 | 60,
  date: Date = new Date()
): WorkoutCompletion {
  if (scheduledDay.focus === 'rest') throw new Error('No se puede completar una rutina en un día de descanso.');
  return {
    date: getLocalDateKey(date),
    day: scheduledDay.day,
    focus: scheduledDay.focus as WorkoutCompletionFocus,
    durationMinutes,
    completedAt: date.toISOString(),
  };
}

export function toggleWorkoutCompletion(
  history: Record<string, WorkoutCompletion>,
  completion: WorkoutCompletion
): Record<string, WorkoutCompletion> {
  if (history[completion.date]) {
    const { [completion.date]: _removed, ...remaining } = history;
    return remaining;
  }
  return { ...history, [completion.date]: completion };
}
