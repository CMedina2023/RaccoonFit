import { PlannedExerciseItem, WorkoutPresentationRecord, WorkoutSessionPlan } from '../types';
import { EXERCISES_CATALOG } from './exerciseCatalog';
import { classifyExercise, MovementPattern } from './exerciseTaxonomy';
import { buildWorkoutSession } from './workoutSessionBuilder';
import { WorkoutFocus, WorkoutLevel } from './weeklyWorkoutPlanner';
import { belongsToWorkoutFocus, MuscleFocusedWorkout } from './workoutGroupPolicy';

const EXERCISE_COUNT_BY_DURATION = { 20: 4, 30: 5, 60: 8 } as const;

/**
 * Mantiene estable la sesión del día: los ejercicios registrados durante la
 * visualización actual solo deben influir en fechas posteriores.
 */
export function getWorkoutPresentationHistoryBeforeDate(
  presentationHistory: readonly WorkoutPresentationRecord[],
  date: string
): WorkoutPresentationRecord[] {
  return presentationHistory.filter((record) => record.date < date);
}

function takeUnique(exercises: PlannedExerciseItem[], candidate: PlannedExerciseItem | undefined): void {
  if (candidate && !exercises.some((exercise) => exercise.id === candidate.id)) exercises.push(candidate);
}

function selectFullBodyExercises(pool: PlannedExerciseItem[], count: number): PlannedExerciseItem[] {
  const selected: PlannedExerciseItem[] = [];
  const patterns: MovementPattern[] = ['squat', 'push', 'pull', 'core'];
  const equipmentFirst = selectWithEquipmentVariety(pool, count);
  patterns.forEach((pattern) => takeUnique(selected, equipmentFirst.find((exercise) => classifyExercise(exercise).movementPattern === pattern) ?? pool.find((exercise) => classifyExercise(exercise).movementPattern === pattern)));
  pool.forEach((exercise) => takeUnique(selected, exercise));
  return selected.slice(0, count);
}

function rotate<T>(items: T[], seed: number): T[] {
  if (items.length === 0) return items;
  const offset = seed % items.length;
  return [...items.slice(offset), ...items.slice(0, offset)];
}

/** El calentamiento puede usar una variante de menor nivel: es activación segura, no volumen principal. */
function selectRotatedWarmup(
  catalog: readonly PlannedExerciseItem[],
  level: WorkoutLevel,
  rotationSeed: number
): PlannedExerciseItem | undefined {
  const eligible = catalog.filter((exercise) => {
    const classification = classifyExercise(exercise);
    return exercise.levelNumeric <= level
      && classification.allowedPhases.includes('warmup')
      && classification.impact !== 'high';
  });
  return rotate(eligible, rotationSeed)[0];
}

/** Prioriza variedad de implementos antes de repetir categoría. */
function selectWithEquipmentVariety(pool: PlannedExerciseItem[], count: number): PlannedExerciseItem[] {
  const selected: PlannedExerciseItem[] = [];
  const categories: PlannedExerciseItem['category'][] = ['mancuernas', 'ligas', 'bandas_pierna', 'peso_corporal', 'cardio'];
  categories.forEach((category) => takeUnique(selected, pool.find((exercise) => exercise.category === category)));
  pool.forEach((exercise) => takeUnique(selected, exercise));
  return selected.slice(0, count);
}

/**
 * Selecciona una sesión diaria desde el catálogo local. La dependencia de catálogo es inyectable
 * para conservar la función determinista y facilitar futuras rotaciones o proveedores offline.
 */
export function buildWeeklyWorkoutSession(
  duration: 20 | 30 | 60,
  level: WorkoutLevel,
  focus: Exclude<WorkoutFocus, 'rest'>,
  catalog: readonly PlannedExerciseItem[] = EXERCISES_CATALOG,
  rotationSeed: number = 0,
  presentationHistory: readonly WorkoutPresentationRecord[] = []
): WorkoutSessionPlan {
  const levelPool = catalog.filter((exercise) => exercise.levelNumeric === level);
  const warmup = selectRotatedWarmup(catalog, level, rotationSeed);
  const recentIds = new Set(presentationHistory.filter((record) => record.focus === focus).slice(-28).map((record) => record.exerciseId));
  const mainPool = levelPool.filter((exercise) => exercise.id !== warmup?.id).sort((left, right) => Number(recentIds.has(left.id)) - Number(recentIds.has(right.id)));
  const count = EXERCISE_COUNT_BY_DURATION[duration];
  const mainCount = Math.max(count - (warmup ? 1 : 0), 1);
  const rotatedPool = rotate(mainPool, rotationSeed).sort((left, right) => Number(recentIds.has(left.id)) - Number(recentIds.has(right.id)));
  const focusedExercises = focus === 'full_body'
    ? selectFullBodyExercises(rotatedPool, mainCount)
    : selectWithEquipmentVariety(rotate(mainPool.filter((exercise) => belongsToWorkoutFocus(exercise, focus as MuscleFocusedWorkout)), rotationSeed), mainCount);
  const selected = warmup ? [warmup, ...focusedExercises] : focusedExercises;

  return buildWorkoutSession(duration, selected, rotationSeed);
}
