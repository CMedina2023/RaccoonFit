import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import {
  computeNextSpriteFrame,
  resolveSpriteFrameDurationMs,
} from '../src/components/virtual-pet/spritePlayback';

describe('Reproductor de sprites de Rocky', () => {
  const animations = ['idle', 'walk', 'eat', 'drink', 'play', 'sleep', 'clean', 'celebrate', 'tired', 'sad'] as const;

  it('registra cuatro PNG RGBA de 256 px y evita dependencia de sprites heredados', () => {
    const registryPath = join(
      process.cwd(),
      'src',
      'components',
      'virtual-pet',
      'rockyAnimationRegistry.ts'
    );
    const registrySource = readFileSync(registryPath, 'utf8');

    animations.forEach((animation) => {
      expect(registrySource).toContain(`${animation}: {`);
      for (let frame = 1; frame <= 4; frame += 1) {
        const filename = String(frame).padStart(2, '0') + '.png';
        const assetPath = join(process.cwd(), 'assets', 'rocky', 'pixel', 'sprites', animation, filename);
        expect(existsSync(assetPath)).toBe(true);
        expect(registrySource).toContain(`pixel/sprites/${animation}/${filename}`);
        const bytes = readFileSync(assetPath);
        expect(bytes.subarray(1, 4).toString()).toBe('PNG');
        expect(bytes.readUInt32BE(16)).toBe(256);
        expect(bytes.readUInt32BE(20)).toBe(256);
        expect(bytes[24]).toBe(8);
        expect(bytes[25]).toBe(6);
      }
    });
    expect(existsSync(join(process.cwd(), 'assets', 'rocky', 'sprites'))).toBe(false);
    expect(existsSync(join(process.cwd(), 'assets', 'rocky_master.png'))).toBe(false);
    expect(existsSync(join(process.cwd(), 'assets', 'rocky_raccoon_gold.png'))).toBe(false);
    expect(registrySource).not.toContain('assets/rocky/sprites/');
  });

  it('conserva en el registro las duraciones nominales aprobadas para cada acción', () => {
    const registryPath = join(
      process.cwd(),
      'src',
      'components',
      'virtual-pet',
      'rockyAnimationRegistry.ts'
    );
    const registrySource = readFileSync(registryPath, 'utf8');
    const expectedTiming: Record<string, {
      frameDurationMs: number;
      cycleCount: number;
      durationMs: number;
      finalFrameHoldMs?: number;
    }> = {
      eat: { frameDurationMs: 180, cycleCount: 3, durationMs: 2160 },
      drink: { frameDurationMs: 180, cycleCount: 2, durationMs: 1440 },
      play: { frameDurationMs: 160, cycleCount: 5, durationMs: 3200 },
      sleep: { frameDurationMs: 320, cycleCount: 1, finalFrameHoldMs: 4160, durationMs: 5120 },
      clean: { frameDurationMs: 180, cycleCount: 3, durationMs: 2160 },
      celebrate: { frameDurationMs: 150, cycleCount: 4, durationMs: 2400 },
    };

    Object.entries(expectedTiming).forEach(([animation, timing]) => {
      const definition = registrySource.match(
        new RegExp(
          `${animation}: \\{[\\s\\S]*?frameDurationMs: (\\d+),\\s*loop: false,\\s*cycleCount: (\\d+),`
        )
      );

      expect(definition).not.toBeNull();
      if (!definition) throw new Error(`No se encontró la configuración finita de ${animation}`);

      const frameDurationMs = Number(definition[1]);
      const cycleCount = Number(definition[2]);
      expect(frameDurationMs).toBe(timing.frameDurationMs);
      expect(cycleCount).toBe(timing.cycleCount);
      if (timing.finalFrameHoldMs !== undefined) {
        expect(registrySource).toMatch(
          new RegExp(`${animation}: \\{[\\s\\S]*?finalFrameHoldMs: ${timing.finalFrameHoldMs},`)
        );
      }
      const finalFrameDurationMs = timing.finalFrameHoldMs ?? frameDurationMs;
      const durationMs = (4 * frameDurationMs * cycleCount) - frameDurationMs + finalFrameDurationMs;
      expect(durationMs).toBe(timing.durationMs);
    });
  });

  it('mantiene el cuadro con Z de dormir durante 4.16 segundos sin repetir el despertar', () => {
    expect(resolveSpriteFrameDurationMs({
      currentFrame: 3,
      frameCount: 4,
      frameDurationMs: 320,
      loop: false,
      completedCycles: 0,
      cycleCount: 1,
      finalFrameHoldMs: 4160,
    })).toBe(4160);

    expect(computeNextSpriteFrame(3, 4, false, 0, 1)).toEqual({
      frameIndex: 3,
      completedCycle: true,
      completedCycles: 1,
      stopped: true,
    });
  });

  it('no aplica la pausa final a cuadros previos, ciclos intermedios o animaciones infinitas', () => {
    const baseOptions = {
      frameCount: 4,
      frameDurationMs: 320,
      cycleCount: 2,
      finalFrameHoldMs: 4160,
    } as const;

    expect(resolveSpriteFrameDurationMs({
      ...baseOptions,
      currentFrame: 2,
      loop: false,
      completedCycles: 1,
    })).toBe(320);
    expect(resolveSpriteFrameDurationMs({
      ...baseOptions,
      currentFrame: 3,
      loop: false,
      completedCycles: 0,
    })).toBe(320);
    expect(resolveSpriteFrameDurationMs({
      ...baseOptions,
      currentFrame: 3,
      loop: true,
      completedCycles: 1,
    })).toBe(320);
  });

  it('reinicia una secuencia cíclica al terminar', () => {
    expect(computeNextSpriteFrame(3, 4, true)).toEqual({
      frameIndex: 0,
      completedCycle: true,
      completedCycles: 0,
      stopped: false,
    });
  });

  it('conserva el último cuadro de una secuencia no cíclica', () => {
    expect(computeNextSpriteFrame(3, 4, false)).toEqual({
      frameIndex: 3,
      completedCycle: true,
      completedCycles: 1,
      stopped: true,
    });
  });

  it('avanza un cuadro sin completar el ciclo', () => {
    expect(computeNextSpriteFrame(1, 4, false)).toEqual({
      frameIndex: 2,
      completedCycle: false,
      completedCycles: 0,
      stopped: false,
    });
  });

  it('repite una secuencia finita hasta completar los ciclos configurados', () => {
    const firstCycle = computeNextSpriteFrame(3, 4, false, 0, 3);
    const secondCycle = computeNextSpriteFrame(3, 4, false, firstCycle.completedCycles, 3);
    const finalCycle = computeNextSpriteFrame(3, 4, false, secondCycle.completedCycles, 3);

    expect(firstCycle).toEqual({
      frameIndex: 0,
      completedCycle: true,
      completedCycles: 1,
      stopped: false,
    });
    expect(secondCycle).toEqual({
      frameIndex: 0,
      completedCycle: true,
      completedCycles: 2,
      stopped: false,
    });
    expect(finalCycle).toEqual({
      frameIndex: 3,
      completedCycle: true,
      completedCycles: 3,
      stopped: true,
    });
  });
});
