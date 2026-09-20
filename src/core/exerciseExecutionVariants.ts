import { ExerciseExecutionVariant, PlannedExerciseItem } from '../types';
const VARIANTS: readonly ExerciseExecutionVariant[] = [
  { label: 'Tempo controlado', instruction: 'Baja en 3 segundos, pausa 1 y sube con control.' },
  { label: 'Rango cómodo', instruction: 'Usa solo un rango sin dolor y conserva la alineación.' },
  { label: 'Apoyo estable', instruction: 'Usa pared, silla firme o rodillas como apoyo si lo necesitas.' },
  { label: 'Carga progresiva', instruction: 'Solo si la técnica es estable, usa la siguiente carga ligera disponible.' },
];
export function getExecutionVariant(exercise: PlannedExerciseItem, seed: number): ExerciseExecutionVariant {
  const safe = exercise.levelNumeric === 1 ? VARIANTS.slice(0, 3) : VARIANTS;
  return safe[seed % safe.length];
}
