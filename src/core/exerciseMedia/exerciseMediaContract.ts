import { ExerciseMediaContract } from '../../types';

/** A local movement can only replace remote media when it depicts this exact exercise. */
export function hasExactLocalFallback(media?: ExerciseMediaContract): boolean {
  return media?.localFallback === 'exact_frame' || media?.localFallback === 'exact_gif';
}

/** Gate for publishing new catalog entries with a fully verified visual contract. */
export function isReadyForExercisePublication(media?: ExerciseMediaContract): boolean {
  return media?.officialGif === 'verified' && hasExactLocalFallback(media);
}
