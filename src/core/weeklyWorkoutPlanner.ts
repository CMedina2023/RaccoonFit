export type WorkoutDayStatus = 'training' | 'rest' | 'active_recovery';
export type WorkoutFocus = 'full_body' | 'chest_back' | 'biceps_triceps' | 'shoulders_traps' | 'abs_obliques' | 'legs_glutes' | 'core_cardio' | 'rest';

export interface WeeklyWorkoutDay {
  day: 'Lun' | 'Mar' | 'Mié' | 'Jue' | 'Vie' | 'Sáb' | 'Dom';
  status: WorkoutDayStatus;
  focus: WorkoutFocus;
  label: string;
}

export type WorkoutLevel = 1 | 2 | 3;
export interface WeeklyRoutine { days: WeeklyWorkoutDay[]; }

const SCHEDULES: Record<WorkoutLevel, WeeklyWorkoutDay[]> = {
  1: [
    { day: 'Lun', status: 'training', focus: 'full_body', label: 'Cuerpo completo' },
    { day: 'Mar', status: 'rest', focus: 'rest', label: 'Descanso muscular' },
    { day: 'Mié', status: 'training', focus: 'full_body', label: 'Cuerpo completo' },
    { day: 'Jue', status: 'rest', focus: 'rest', label: 'Descanso muscular' },
    { day: 'Vie', status: 'training', focus: 'full_body', label: 'Cuerpo completo' },
    { day: 'Sáb', status: 'active_recovery', focus: 'core_cardio', label: 'Movilidad o caminata suave' },
    { day: 'Dom', status: 'rest', focus: 'rest', label: 'Descanso muscular' },
  ],
  2: [
    { day: 'Lun', status: 'training', focus: 'chest_back', label: 'Pecho y espalda' },
    { day: 'Mar', status: 'training', focus: 'legs_glutes', label: 'Piernas y glúteos' },
    { day: 'Mié', status: 'rest', focus: 'rest', label: 'Descanso muscular' },
    { day: 'Jue', status: 'training', focus: 'biceps_triceps', label: 'Bíceps y tríceps' },
    { day: 'Vie', status: 'active_recovery', focus: 'core_cardio', label: 'Core y cardio suave' },
    { day: 'Sáb', status: 'training', focus: 'shoulders_traps', label: 'Hombro y trapecio' },
    { day: 'Dom', status: 'rest', focus: 'rest', label: 'Descanso muscular' },
  ],
  3: [
    { day: 'Lun', status: 'training', focus: 'chest_back', label: 'Pecho y espalda' },
    { day: 'Mar', status: 'training', focus: 'biceps_triceps', label: 'Bíceps y tríceps' },
    { day: 'Mié', status: 'training', focus: 'legs_glutes', label: 'Piernas y glúteos' },
    { day: 'Jue', status: 'rest', focus: 'rest', label: 'Descanso muscular' },
    { day: 'Vie', status: 'training', focus: 'shoulders_traps', label: 'Hombro y trapecio' },
    { day: 'Sáb', status: 'training', focus: 'abs_obliques', label: 'Abdomen y oblicuos' },
    { day: 'Dom', status: 'rest', focus: 'rest', label: 'Descanso muscular' },
  ],
};

export function getWeeklyWorkoutSchedule(level: WorkoutLevel): WeeklyWorkoutDay[] {
  return SCHEDULES[level].map((day) => ({ ...day }));
}

export function createWeeklyRoutine(level: WorkoutLevel): WeeklyRoutine { return { days: getWeeklyWorkoutSchedule(level) }; }

/** El usuario elige los días; dos descansos semanales son el mínimo de recuperación. */
export function countRestDays(routine: WeeklyRoutine): number {
  return routine.days.filter((day) => day.focus === 'rest' && day.status === 'rest').length;
}

/** Acepta semanas guardadas previamente para que el editor pueda llevarlas al nuevo mínimo sin borrar elecciones. */
export function hasWeeklyRoutineStructure(routine: WeeklyRoutine): boolean {
  return routine.days.length === 7;
}

export function isValidWeeklyRoutine(routine: WeeklyRoutine): boolean {
  return hasWeeklyRoutineStructure(routine) && countRestDays(routine) >= 2;
}

/** Devuelve el día programado para una fecha local; `Date#getDay` usa domingo como 0. */
export function getWeeklyWorkoutDayForDate(
  schedule: readonly WeeklyWorkoutDay[],
  date: Date = new Date()
): WeeklyWorkoutDay {
  const indexFromMonday = (date.getDay() + 6) % 7;
  return schedule[indexFromMonday];
}
