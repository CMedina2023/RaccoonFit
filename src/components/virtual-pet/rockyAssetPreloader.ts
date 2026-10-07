import { Image, InteractionManager } from 'react-native';
import { ROCKY_ANIMATION_REGISTRY } from './rockyAnimationRegistry';

let interactionFramesPreload: Promise<void> | null = null;

/**
 * En React Native Web, `Image.resolveAssetSource` no existe como función.
 * El guard `?.` garantiza que en Web se retorne un array vacío (el preload
 * no es necesario en Web: los assets se sirven directamente por URL desde
 * el bundle de Metro). En plataformas nativas el comportamiento es idéntico
 * al original.
 */
export function resolveRockyInteractionFrameUris(): readonly string[] {
  // Guard de compatibilidad: resolveAssetSource solo existe en native
  if (typeof Image.resolveAssetSource !== 'function') return [];

  const frameUris = Object.values(ROCKY_ANIMATION_REGISTRY)
    .filter((definition) => !definition.loop)
    .flatMap((definition) => definition.frames)
    .map((frame) => Image.resolveAssetSource(frame)?.uri)
    .filter((uri): uri is string => Boolean(uri));

  return frameUris.filter((uri, index) => frameUris.indexOf(uri) === index);
}

export function preloadRockyInteractionFrames(): Promise<void> {
  if (!interactionFramesPreload) {
    const frameUris = resolveRockyInteractionFrameUris();
    interactionFramesPreload = new Promise((resolve) => {
      InteractionManager.runAfterInteractions(async () => {
        for (const uri of frameUris) {
          await Image.prefetch(uri).catch(() => false);
        }
        resolve();
      });
    });
  }

  return interactionFramesPreload;
}
