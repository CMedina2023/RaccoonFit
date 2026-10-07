export interface SpritePlaybackStep {
  frameIndex: number;
  completedCycle: boolean;
  completedCycles: number;
  stopped: boolean;
}

interface SpriteFrameDurationOptions {
  currentFrame: number;
  frameCount: number;
  frameDurationMs: number;
  loop: boolean;
  completedCycles: number;
  cycleCount: number;
  finalFrameHoldMs?: number;
}

/**
 * Aplica una pausa especial solo al último cuadro del último ciclo finito.
 * Las animaciones cíclicas y los ciclos intermedios conservan el ritmo base.
 */
export function resolveSpriteFrameDurationMs({
  currentFrame,
  frameCount,
  frameDurationMs,
  loop,
  completedCycles,
  cycleCount,
  finalFrameHoldMs,
}: SpriteFrameDurationOptions): number {
  const safeFrameDurationMs = Math.max(0, frameDurationMs);
  const safeCurrentFrame = Math.min(Math.max(currentFrame, 0), Math.max(0, frameCount - 1));
  const safeCompletedCycles = Math.max(0, Math.floor(completedCycles));
  const safeCycleCount = Math.max(1, Math.floor(cycleCount));
  const isLastFrame = frameCount > 0 && safeCurrentFrame === frameCount - 1;
  const isFinalCycle = safeCompletedCycles + 1 >= safeCycleCount;

  if (!loop && isLastFrame && isFinalCycle && finalFrameHoldMs !== undefined) {
    return Math.max(0, finalFrameHoldMs);
  }

  return safeFrameDurationMs;
}

export function computeNextSpriteFrame(
  currentFrame: number,
  frameCount: number,
  loop: boolean,
  completedCycles = 0,
  cycleCount = 1
): SpritePlaybackStep {
  const safeCompletedCycles = Math.max(0, Math.floor(completedCycles));

  if (frameCount <= 0) {
    return {
      frameIndex: 0,
      completedCycle: false,
      completedCycles: safeCompletedCycles,
      stopped: true,
    };
  }

  const safeCurrentFrame = Math.min(Math.max(currentFrame, 0), frameCount - 1);
  const isLastFrame = safeCurrentFrame === frameCount - 1;

  if (!isLastFrame) {
    return {
      frameIndex: safeCurrentFrame + 1,
      completedCycle: false,
      completedCycles: safeCompletedCycles,
      stopped: false,
    };
  }

  if (loop) {
    return {
      frameIndex: 0,
      completedCycle: true,
      completedCycles: safeCompletedCycles,
      stopped: false,
    };
  }

  const nextCompletedCycles = safeCompletedCycles + 1;
  const safeCycleCount = Math.max(1, Math.floor(cycleCount));
  const stopped = nextCompletedCycles >= safeCycleCount;

  return {
    frameIndex: stopped ? safeCurrentFrame : 0,
    completedCycle: true,
    completedCycles: nextCompletedCycles,
    stopped,
  };
}
