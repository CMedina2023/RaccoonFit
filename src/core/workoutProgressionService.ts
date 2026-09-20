import { WorkoutCompletion } from '../types';
import { getLocalDateKey } from './workoutProgressService';
import { getWeeklyWorkoutDayForDate, WeeklyWorkoutDay } from './weeklyWorkoutPlanner';

export type ProgressionKind = 'maintain' | 'repetitions' | 'tempo' | 'rest';

export interface WorkoutProgressionRecommendation {
  kind: ProgressionKind;
  title: string;
  instruction: string;
}

function previousLocalDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, 12);
}

/** Cuenta sesiones programadas consecutivas completadas antes de la fecha de referencia. */
export function getCompletedWorkoutStreak(
  history: Record<string, WorkoutCompletion>,
  schedule: readonly WeeklyWorkoutDay[],
  referenceDate: Date = new Date()
): number {
  let streak = 0;
  let cursor = previousLocalDate(referenceDate);
  for (let checkedDays = 0; checkedDays < 70; checkedDays += 1) {
    const scheduledDay = getWeeklyWorkoutDayForDate(schedule, cursor);
    if (scheduledDay.status !== 'rest') {
      if (!history[getLocalDateKey(cursor)]) return streak;
      streak += 1;
    }
    cursor = previousLocalDate(cursor);
  }
  return streak;
}

export function getWorkoutProgressionRecommendation(streak: number): WorkoutProgressionRecommendation {
  if (streak < 3) return { kind: 'maintain', title: 'Prioriza técnica', instruction: 'Mantén las repeticiones y el descanso actuales. Avanza solo si no hay dolor ni compensaciones.' };
  if (streak < 6) return { kind: 'repetitions', title: 'Progresión suave', instruction: 'Si terminaste todas las series con buena técnica, añade 1 repetición por serie.' };
  if (streak < 9) return { kind: 'tempo', title: 'Controla el tempo', instruction: 'Mantén la carga y baja en 3 segundos; no aumentes repeticiones y tempo a la vez.' };
  return { kind: 'rest', title: 'Ajusta el descanso', instruction: 'Si sigues sin dolor, reduce solo 5 segundos de descanso, siempre dentro de 45 a 60 segundos.' };
}
