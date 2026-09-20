import { PlannedExerciseItem } from '../types';
import { selectExercisesForPlan } from './exerciseCatalog';

/**
 * Abstracción de ejercicios para el generador de planes.
 * Permite sustituir el catálogo local por otra fuente sin cambiar planEngine.
 */
export interface ExerciseProvider {
  getForPlan(
    preferredMinutes: 20 | 30 | 60,
    levelNumeric: 1 | 2 | 3
  ): PlannedExerciseItem[];
}

/** Implementación local por defecto, aislada del motor de planes. */
export const defaultExerciseProvider: ExerciseProvider = {
  getForPlan: selectExercisesForPlan,
};
