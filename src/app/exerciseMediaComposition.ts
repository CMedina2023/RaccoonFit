import {
  ExerciseDbMediaProvider,
  ExerciseMediaProvider,
} from '../core/exerciseMedia/ExerciseMediaProvider';
import { BoundedMediaLoadCache, MediaLoadCache } from '../core/exerciseMedia/MediaLoadCache';

/** Composition root: remote infrastructure does not leak into the catalog. */
const EXERCISE_DB_MEDIA_BASE_URL = 'https://static.exercisedb.dev/media';

export const exerciseMediaProvider: ExerciseMediaProvider = new ExerciseDbMediaProvider(
  EXERCISE_DB_MEDIA_BASE_URL
);

/** Caché de estado para la sesión; los SVG registrados siguen siendo el fallback offline. */
export const exerciseMediaCache: MediaLoadCache = new BoundedMediaLoadCache(32);
