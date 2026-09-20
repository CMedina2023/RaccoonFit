import { WorkoutFocus } from './weeklyWorkoutPlanner';
import { WorkoutMuscleGroup } from './exerciseTaxonomy';
import { PlannedExerciseItem } from '../types';
import { classifyExercise } from './exerciseTaxonomy';

/**
 * Contrato clínico de selección por día: el músculo principal determina
 * la pertenencia. Los músculos secundarios nunca cambian el grupo del día.
 */
export type MuscleFocusedWorkout = Exclude<WorkoutFocus, 'full_body' | 'rest'>;

export const PRIMARY_MUSCLES_BY_FOCUS: Readonly<Record<MuscleFocusedWorkout, readonly WorkoutMuscleGroup[]>> = {
  chest_back: ['chest', 'back'],
  biceps_triceps: ['biceps', 'triceps'],
  shoulders_traps: ['shoulders'],
  abs_obliques: ['core', 'obliques'],
  legs_glutes: ['quadriceps', 'hamstrings', 'glutes', 'calves', 'hip_abductors', 'hip_adductors'],
  core_cardio: ['core', 'obliques', 'cardio'],
};

export function belongsToWorkoutFocus(
  exercise: PlannedExerciseItem,
  focus: MuscleFocusedWorkout
): boolean {
  const primaryMuscle = classifyExercise(exercise).primaryMuscles[0];
  return primaryMuscle !== undefined && PRIMARY_MUSCLES_BY_FOCUS[focus].includes(primaryMuscle);
}
