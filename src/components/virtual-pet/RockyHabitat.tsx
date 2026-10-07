import React, { useCallback, useMemo, useState } from 'react';
import {
  Animated,
  ImageBackground,
  LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { useRockyPatrol } from '../../hooks/useRockyPatrol';
import { computePatrolTravelDistance } from './patrolMath';
import { RockySpritePlayer } from './RockySpritePlayer';
import type { RockyAnimationName } from './rockyAnimationRegistry';
import type { RockyAnimationRequest } from '../../types';
import { PET_HABITAT_LAYOUT } from './petHabitatTheme';
import { preloadRockyInteractionFrames } from './rockyAssetPreloader';

const ROCKY_ROOM_BACKGROUND = require('../../../assets/rocky/pixel/habitat/rocky-room-v2.png');

export type { RockyAnimationRequest } from '../../types';

const {
  height: HABITAT_HEIGHT,
  horizontalInset: HORIZONTAL_INSET,
  minSpriteSize: MIN_SPRITE_SIZE,
  maxSpriteSize: MAX_SPRITE_SIZE,
} = PET_HABITAT_LAYOUT;

interface RockyHabitatProps {
  name: string;
  onInteract?: () => void;
  animationRequest?: RockyAnimationRequest | null;
  moodAnimation?: 'idle' | 'tired' | 'sad';
}

export function RockyHabitat({
  name,
  onInteract,
  animationRequest = null,
  moodAnimation = 'idle',
}: RockyHabitatProps) {
  const [habitatWidth, setHabitatWidth] = useState(0);
  const [actionAnimation, setActionAnimation] = useState<RockyAnimationRequest | null>(null);
  const reduceMotion = useReducedMotion();
  const spriteSize = Math.min(
    MAX_SPRITE_SIZE,
    Math.max(MIN_SPRITE_SIZE, habitatWidth * 0.48)
  );
  const travelDistance = computePatrolTravelDistance(
    habitatWidth,
    spriteSize,
    HORIZONTAL_INSET
  );
  const patrol = useRockyPatrol({
    travelDistance,
    enabled: !reduceMotion && !actionAnimation && moodAnimation === 'idle',
  });

  React.useEffect(() => {
    void preloadRockyInteractionFrames();
  }, []);

  React.useEffect(() => {
    if (animationRequest) setActionAnimation(animationRequest);
  }, [animationRequest]);

  const animation = actionAnimation?.animation ?? (moodAnimation === 'idle' && !reduceMotion ? 'walk' : moodAnimation);
  const animatedStyle = useMemo(
    () => ({ transform: [{ translateX: patrol.translateX }] }),
    [patrol.translateX]
  );

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setHabitatWidth(event.nativeEvent.layout.width);
  }, []);

  const handlePress = useCallback(() => {
    onInteract?.();
  }, [onInteract]);

  const handleInteractionComplete = useCallback(() => {
    setActionAnimation(null);
  }, []);

  return (
    <ImageBackground
      source={ROCKY_ROOM_BACKGROUND}
      resizeMode="stretch"
      style={styles.habitat}
      imageStyle={styles.backgroundImage}
      onLayout={handleLayout}
      accessible={false}
    >
      <Animated.View
        style={[
          styles.rockyPosition,
          { left: HORIZONTAL_INSET, width: spriteSize, height: spriteSize },
          animatedStyle,
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Toca a ${name} para abrir sus cuidados`}
          onPress={handlePress}
          style={({ pressed }) => [styles.touchTarget, pressed && styles.touchTargetPressed]}
        >
          <RockySpritePlayer
            animation={animation}
            playbackKey={actionAnimation?.id}
            direction={patrol.direction}
            size={spriteSize}
            accessible={false}
            onAnimationComplete={actionAnimation ? handleInteractionComplete : undefined}
          />
        </Pressable>
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  habitat: {
    width: '100%',
    height: HABITAT_HEIGHT,
    backgroundColor: '#2A231F',
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#493522',
  },
  backgroundImage: {
    borderRadius: 15,
  },
  rockyPosition: {
    position: 'absolute',
    bottom: 13,
  },
  touchTarget: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderRadius: 28,
  },
  touchTargetPressed: {
    opacity: 0.82,
  },
});
