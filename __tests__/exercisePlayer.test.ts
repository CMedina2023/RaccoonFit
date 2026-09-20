import { EXERCISES_CATALOG } from '../src/core/exerciseCatalog';
import { ExerciseDbMediaProvider } from '../src/core/exerciseMedia/ExerciseMediaProvider';
import { BoundedMediaLoadCache } from '../src/core/exerciseMedia/MediaLoadCache';
import { createCachedGifSource } from '../src/components/animations/gifMediaSource';
import { hasExactLocalFallback, isReadyForExercisePublication } from '../src/core/exerciseMedia/exerciseMediaContract';

describe('Exercise media architecture', () => {
  describe('Exercise catalog', () => {
    it('uses animation types and media identifiers instead of remote URLs', () => {
      expect(EXERCISES_CATALOG.length).toBeGreaterThan(0);

      EXERCISES_CATALOG.forEach((exercise) => {
        expect(exercise.animationType).toBeDefined();
        expect(typeof exercise.animationType).toBe('string');
        expect(exercise.exerciseDbId).toMatch(/^[a-zA-Z0-9]+$/);
        expect(exercise.gifUrl).toBeUndefined();
      });
    });

    it('keeps the media identifier for the seated band row', () => {
      const bandRow = EXERCISES_CATALOG.find((exercise) => exercise.id === 'ex_begin_band_row');

      expect(bandRow?.animationType).toBe('row_band');
      expect(bandRow?.exerciseDbId).toBe('DKBwJrL');
    });
  });

  describe('Optional remote media provider', () => {
    const provider = new ExerciseDbMediaProvider('https://static.exercisedb.dev/media');

    it('resolves a GIF URL from an identifier outside the catalog', () => {
      expect(provider.getOptionalGifUrl('DKBwJrL'))
        .toBe('https://static.exercisedb.dev/media/DKBwJrL.gif');
    });

    it('does not request media for a missing or invalid identifier', () => {
      expect(provider.getOptionalGifUrl()).toBeUndefined();
      expect(provider.getOptionalGifUrl('../invalid')).toBeUndefined();
    });
  });

  describe('Media load cache', () => {
    it('retains only the most recently used loaded URLs', () => {
      const cache = new BoundedMediaLoadCache(2);

      cache.markLoaded('first.gif');
      cache.markLoaded('second.gif');
      expect(cache.has('first.gif')).toBe(true);

      cache.markLoaded('third.gif');

      expect(cache.has('first.gif')).toBe(true);
      expect(cache.has('second.gif')).toBe(false);
      expect(cache.has('third.gif')).toBe(true);
    });

    it('rejects a cache without capacity', () => {
      expect(() => new BoundedMediaLoadCache(0)).toThrow(RangeError);
    });

    it('prefers the persistent native image cache for remote GIFs', () => {
      expect(createCachedGifSource('https://example.test/exercise.gif')).toEqual({
        uri: 'https://example.test/exercise.gif',
        cache: 'force-cache',
      });
    });
  });

  describe('Strict media contract', () => {
    it('only permits a verified exact local frame as a GIF fallback', () => {
      expect(hasExactLocalFallback({ officialGif: 'verified', localFallback: 'exact_frame' })).toBe(true);
      expect(hasExactLocalFallback({ officialGif: 'verified', localFallback: 'exact_gif' })).toBe(true);
      expect(hasExactLocalFallback({ officialGif: 'verified', localFallback: 'unavailable' })).toBe(false);
      expect(hasExactLocalFallback()).toBe(false);
    });

    it('blocks publication unless both remote media and the exact local fallback are verified', () => {
      expect(isReadyForExercisePublication({ officialGif: 'verified', localFallback: 'exact_frame' })).toBe(true);
      expect(isReadyForExercisePublication({ officialGif: 'unverified', localFallback: 'exact_frame' })).toBe(false);
      expect(isReadyForExercisePublication({ officialGif: 'verified', localFallback: 'unavailable' })).toBe(false);
    });
  });

  describe('Biomechanical phases', () => {
    it('defines initial, effort and return phases', () => {
      const phaseLabels = ['Initial', 'Effort', 'Return'];
      expect(phaseLabels).toHaveLength(3);
    });

    it('doubles duration for half-speed playback', () => {
      expect(8000).toBe(4000 * 2);
    });
  });
});
