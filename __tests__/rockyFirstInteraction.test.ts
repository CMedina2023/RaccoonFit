import { readFileSync } from 'fs';
import { join } from 'path';

function readProjectFile(path: string): string {
  return readFileSync(join(process.cwd(), path), 'utf8');
}

describe('Primera interacción de Rocky en Android', () => {
  const playerSource = readProjectFile('src/components/virtual-pet/RockySpritePlayer.tsx');
  const habitatSource = readProjectFile('src/components/virtual-pet/RockyHabitat.tsx');
  const preloaderSource = readProjectFile('src/components/virtual-pet/rockyAssetPreloader.ts');

  it('desactiva el fundido nativo que competiría con la duración de cada frame', () => {
    expect(playerSource).toContain('fadeDuration={0}');
  });

  it('inicia la precarga una sola vez al montar el hábitat', () => {
    expect(habitatSource).toContain("import { preloadRockyInteractionFrames } from './rockyAssetPreloader';");
    expect(habitatSource).toMatch(
      /React\.useEffect\(\(\) => \{\s*void preloadRockyInteractionFrames\(\);\s*\}, \[\]\);/
    );
  });

  it('deriva los recursos finitos desde el registro extensible', () => {
    expect(preloaderSource).toContain('Object.values(ROCKY_ANIMATION_REGISTRY)');
    expect(preloaderSource).toContain('.filter((definition) => !definition.loop)');
    expect(preloaderSource).toContain('Image.resolveAssetSource(frame)?.uri');
  });

  it('reutiliza una sola promesa y tolera fallos individuales sin bloquear la animación', () => {
    expect(preloaderSource).toContain('let interactionFramesPreload: Promise<void> | null = null;');
    expect(preloaderSource).toContain('Image.prefetch(uri).catch(() => false)');
  });

  it('espera a que terminen las interacciones y evita precargas simultáneas', () => {
    expect(preloaderSource).toContain('InteractionManager.runAfterInteractions');
    expect(preloaderSource).toContain('for (const uri of frameUris)');
    expect(preloaderSource).not.toContain('Promise.all(');
  });
});
