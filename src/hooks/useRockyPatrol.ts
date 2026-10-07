import { useEffect, useRef, useState } from 'react';
import { Animated, Easing } from 'react-native';
import { computePatrolLegDuration } from '../components/virtual-pet/patrolMath';
import type { RockyFacingDirection } from '../components/virtual-pet/RockySpritePlayer';

type PatrolTarget = 'start' | 'end';

interface UseRockyPatrolOptions {
  travelDistance: number;
  enabled: boolean;
  pauseDurationMs?: number;
}

interface RockyPatrolController {
  translateX: Animated.Value;
  direction: RockyFacingDirection;
}

export function useRockyPatrol({
  travelDistance,
  enabled,
  pauseDurationMs = 650,
}: UseRockyPatrolOptions): RockyPatrolController {
  const translateX = useRef(new Animated.Value(0)).current;
  const currentPosition = useRef(0);
  const [target, setTarget] = useState<PatrolTarget>('end');
  const direction: RockyFacingDirection = target === 'end' ? 'right' : 'left';

  useEffect(() => {
    const listenerId = translateX.addListener(({ value }) => {
      currentPosition.current = value;
    });
    return () => translateX.removeListener(listenerId);
  }, [translateX]);

  useEffect(() => {
    if (travelDistance <= 0) {
      translateX.stopAnimation();
      translateX.setValue(0);
      currentPosition.current = 0;
      return;
    }

    if (currentPosition.current > travelDistance) {
      translateX.setValue(travelDistance);
      currentPosition.current = travelDistance;
      setTarget('start');
    }
  }, [travelDistance, translateX]);

  useEffect(() => {
    if (!enabled || travelDistance <= 0) {
      translateX.stopAnimation();
      return;
    }

    const destination = target === 'end' ? travelDistance : 0;
    const duration = computePatrolLegDuration(currentPosition.current, destination);
    const animation = Animated.sequence([
      Animated.delay(pauseDurationMs),
      Animated.timing(translateX, {
        toValue: destination,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
        isInteraction: false,
      }),
    ]);

    animation.start(({ finished }) => {
      if (finished) setTarget((current) => (current === 'end' ? 'start' : 'end'));
    });

    return () => animation.stop();
  }, [enabled, pauseDurationMs, target, translateX, travelDistance]);

  return { translateX, direction };
}
