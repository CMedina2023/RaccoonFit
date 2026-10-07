import React, { memo } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useSpritePlayback } from '../../hooks/useSpritePlayback';
import {
  ROCKY_ANIMATION_REGISTRY,
  RockyAnimationName,
} from './rockyAnimationRegistry';

export type RockyFacingDirection = 'left' | 'right';

interface RockySpritePlayerProps {
  animation: RockyAnimationName;
  size: number;
  direction?: RockyFacingDirection;
  playing?: boolean;
  accessible?: boolean;
  accessibilityLabel?: string;
  playbackKey?: string | number;
  onAnimationComplete?: () => void;
}

export const RockySpritePlayer = memo(function RockySpritePlayer({
  animation,
  size,
  direction = 'right',
  playing = true,
  accessible = true,
  accessibilityLabel = 'Rocky, mascota virtual',
  playbackKey,
  onAnimationComplete,
}: RockySpritePlayerProps) {
  const definition = ROCKY_ANIMATION_REGISTRY[animation];
  const reduceMotion = useReducedMotion();
  const frameIndex = useSpritePlayback({
    animationKey: `${animation}:${playbackKey ?? ''}`,
    frameCount: definition.frames.length,
    frameDurationMs: definition.frameDurationMs,
    loop: definition.loop,
    cycleCount: definition.loop ? 1 : definition.cycleCount,
    finalFrameHoldMs: definition.loop ? undefined : definition.finalFrameHoldMs,
    playing,
    reduceMotion,
    onCycleComplete: onAnimationComplete,
  });

  return (
    <View
      accessible={accessible}
      accessibilityRole="image"
      accessibilityLabel={accessible ? accessibilityLabel : undefined}
      style={[styles.container, { width: size, height: size }]}
    >
      <Image
        source={definition.frames[frameIndex]}
        resizeMode="contain"
        fadeDuration={0}
        style={[
          styles.sprite,
          { width: size, height: size, transform: [{ scaleX: direction === 'left' ? -1 : 1 }] },
        ]}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  sprite: {
    backgroundColor: 'transparent',
  },
});
