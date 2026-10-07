import { useEffect, useRef, useState } from 'react';
import {
  computeNextSpriteFrame,
  resolveSpriteFrameDurationMs,
} from '../components/virtual-pet/spritePlayback';

interface UseSpritePlaybackOptions {
  animationKey: string;
  frameCount: number;
  frameDurationMs: number;
  loop: boolean;
  cycleCount: number;
  finalFrameHoldMs?: number;
  playing: boolean;
  reduceMotion: boolean;
  onCycleComplete?: () => void;
}

export function useSpritePlayback({
  animationKey,
  frameCount,
  frameDurationMs,
  loop,
  cycleCount,
  finalFrameHoldMs,
  playing,
  reduceMotion,
  onCycleComplete,
}: UseSpritePlaybackOptions): number {
  const [frameIndex, setFrameIndex] = useState(0);
  const completedCycles = useRef(0);
  const completionReported = useRef(false);
  const onCycleCompleteRef = useRef(onCycleComplete);

  useEffect(() => {
    onCycleCompleteRef.current = onCycleComplete;
  }, [onCycleComplete]);

  useEffect(() => {
    setFrameIndex(0);
    completedCycles.current = 0;
    completionReported.current = false;
  }, [animationKey, cycleCount]);

  useEffect(() => {
    if (!playing || !reduceMotion || loop || completionReported.current) return;

    completionReported.current = true;
    onCycleCompleteRef.current?.();
  }, [animationKey, loop, playing, reduceMotion]);

  useEffect(() => {
    if (!playing || reduceMotion || frameCount <= 1 || completionReported.current) return;

    const currentFrameDurationMs = resolveSpriteFrameDurationMs({
      currentFrame: frameIndex,
      frameCount,
      frameDurationMs,
      loop,
      completedCycles: completedCycles.current,
      cycleCount,
      finalFrameHoldMs,
    });

    const timer = setTimeout(() => {
      const step = computeNextSpriteFrame(
        frameIndex,
        frameCount,
        loop,
        completedCycles.current,
        cycleCount
      );
      completedCycles.current = step.completedCycles;
      setFrameIndex(step.frameIndex);

      if (step.stopped) {
        onCycleCompleteRef.current?.();
        completionReported.current = true;
      }
    }, currentFrameDurationMs);

    return () => clearTimeout(timer);
  }, [cycleCount, finalFrameHoldMs, frameCount, frameDurationMs, frameIndex, loop, playing, reduceMotion]);

  return Math.min(frameIndex, Math.max(0, frameCount - 1));
}
