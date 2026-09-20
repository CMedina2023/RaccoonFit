/** Optional remote media for an exercise; the SVG frame remains the offline fallback. */
export interface ExerciseMediaProvider {
  getOptionalGifUrl(exerciseDbId?: string): string | undefined;
}

/** Interchangeable adapter for the ExerciseDB CDN. */
export class ExerciseDbMediaProvider implements ExerciseMediaProvider {
  constructor(private readonly mediaBaseUrl: string) {}

  getOptionalGifUrl(exerciseDbId?: string): string | undefined {
    if (!exerciseDbId || !/^[a-zA-Z0-9]+$/.test(exerciseDbId)) {
      return undefined;
    }

    return `${this.mediaBaseUrl}/${encodeURIComponent(exerciseDbId)}.gif`;
  }
}
