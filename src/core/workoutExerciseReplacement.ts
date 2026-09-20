import { PlannedExerciseItem, WorkoutMainOverride, WorkoutPresentationRecord, WorkoutSessionPlan } from '../types';
import { classifyExercise } from './exerciseTaxonomy';
import { EXERCISES_CATALOG } from './exerciseCatalog';
import { getExecutionVariant } from './exerciseExecutionVariants';
import { belongsToWorkoutFocus, MuscleFocusedWorkout } from './workoutGroupPolicy';
import { WorkoutFocus, WorkoutLevel } from './weeklyWorkoutPlanner';

export function createWorkoutSessionKey(date: string, day: string, focus: Exclude<WorkoutFocus, 'rest'>, weekSeed: number): string {
  return `${date}:${day}:${focus}:${weekSeed}`;
}

function isEligibleForReplacement(
  candidate: PlannedExerciseItem,
  target: PlannedExerciseItem,
  level: WorkoutLevel,
  focus: Exclude<WorkoutFocus, 'rest'>
): boolean {
  const candidateClassification = classifyExercise(candidate);
  const targetClassification = classifyExercise(target);
  const hasMatchingFocus = focus === 'full_body'
    || belongsToWorkoutFocus(candidate, focus as MuscleFocusedWorkout);

  return candidate.levelNumeric === level
    && candidate.id !== target.id
    && candidateClassification.allowedPhases.includes('main')
    && candidateClassification.impact !== 'high'
    && hasMatchingFocus
    && candidateClassification.primaryMuscles[0] === targetClassification.primaryMuscles[0]
    && candidateClassification.movementPattern === targetClassification.movementPattern;
}

/**
 * Encuentra una alternativa segura del mismo patrón y músculo principal.
 * El catálogo entra por parámetro para mantener el servicio testeable e inyectable.
 */
export function findWorkoutExerciseReplacement(
  target: PlannedExerciseItem,
  currentMainExercises: readonly PlannedExerciseItem[],
  level: WorkoutLevel,
  focus: Exclude<WorkoutFocus, 'rest'>,
  recentPresentations: readonly WorkoutPresentationRecord[],
  rotationSeed: number,
  catalog: readonly PlannedExerciseItem[] = EXERCISES_CATALOG
): PlannedExerciseItem | null {
  const excludedIds = new Set([...currentMainExercises.map((exercise) => exercise.id), target.id]);
  const recentIds = new Set(recentPresentations.filter((record) => record.focus === focus).slice(-28).map((record) => record.exerciseId));
  const candidates = catalog.filter((candidate) => isEligibleForReplacement(candidate, target, level, focus) && !excludedIds.has(candidate.id));
  if (candidates.length === 0) return null;

  const fresh = candidates.filter((candidate) => !recentIds.has(candidate.id));
  const pool = fresh.length > 0 ? fresh : candidates;
  return pool[rotationSeed % pool.length];
}

export function replaceWorkoutMainExercise(
  currentMainExercises: readonly PlannedExerciseItem[],
  targetId: string,
  level: WorkoutLevel,
  focus: Exclude<WorkoutFocus, 'rest'>,
  recentPresentations: readonly WorkoutPresentationRecord[],
  rotationSeed: number,
  catalog: readonly PlannedExerciseItem[] = EXERCISES_CATALOG
): PlannedExerciseItem[] {
  const target = currentMainExercises.find((exercise) => exercise.id === targetId);
  if (!target) return [...currentMainExercises];
  const replacement = findWorkoutExerciseReplacement(target, currentMainExercises, level, focus, recentPresentations, rotationSeed, catalog);
  if (!replacement) return [...currentMainExercises];
  return currentMainExercises.map((exercise, index) => exercise.id === targetId
    ? { ...replacement, executionVariant: getExecutionVariant(replacement, rotationSeed + index) }
    : exercise);
}

export function replaceAllWorkoutMainExercises(
  currentMainExercises: readonly PlannedExerciseItem[],
  level: WorkoutLevel,
  focus: Exclude<WorkoutFocus, 'rest'>,
  recentPresentations: readonly WorkoutPresentationRecord[],
  rotationSeed: number,
  catalog: readonly PlannedExerciseItem[] = EXERCISES_CATALOG
): PlannedExerciseItem[] {
  return currentMainExercises.reduce<PlannedExerciseItem[]>(
    (replaced, exercise, index) => replaceWorkoutMainExercise(replaced, exercise.id, level, focus, recentPresentations, rotationSeed + index + 1, catalog),
    [...currentMainExercises]
  );
}

export function applyWorkoutMainOverride(session: WorkoutSessionPlan, override: WorkoutMainOverride | undefined): WorkoutSessionPlan {
  if (!override) return session;
  return {
    ...session,
    phases: session.phases.map((phase) => phase.id === 'main' ? { ...phase, exercises: override.exercises.map((exercise) => ({ ...exercise })) } : phase) as WorkoutSessionPlan['phases'],
  };
}
