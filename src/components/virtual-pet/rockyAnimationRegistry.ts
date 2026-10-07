import type { ImageSourcePropType } from 'react-native';
import type { PetAnimationName } from '../../types';

export type RockyAnimationName = PetAnimationName;

interface RockyAnimationDefinitionBase {
  frames: readonly ImageSourcePropType[];
  frameDurationMs: number;
}

export type RockyAnimationDefinition = RockyAnimationDefinitionBase & (
  | { loop: true }
  | { loop: false; cycleCount: number; finalFrameHoldMs?: number }
);

export const ROCKY_ANIMATION_REGISTRY: Record<RockyAnimationName, RockyAnimationDefinition> = {
  idle: {
    frames: [
      require('../../../assets/rocky/pixel/sprites/idle/01.png'),
      require('../../../assets/rocky/pixel/sprites/idle/02.png'),
      require('../../../assets/rocky/pixel/sprites/idle/03.png'),
      require('../../../assets/rocky/pixel/sprites/idle/04.png'),
    ],
    frameDurationMs: 220,
    loop: true,
  },
  walk: {
    frames: [
      require('../../../assets/rocky/pixel/sprites/walk/01.png'),
      require('../../../assets/rocky/pixel/sprites/walk/02.png'),
      require('../../../assets/rocky/pixel/sprites/walk/03.png'),
      require('../../../assets/rocky/pixel/sprites/walk/04.png'),
    ],
    frameDurationMs: 140,
    loop: true,
  },
  eat: {
    frames: [
      require('../../../assets/rocky/pixel/sprites/eat/01.png'),
      require('../../../assets/rocky/pixel/sprites/eat/02.png'),
      require('../../../assets/rocky/pixel/sprites/eat/03.png'),
      require('../../../assets/rocky/pixel/sprites/eat/04.png'),
    ],
    frameDurationMs: 180,
    loop: false,
    cycleCount: 3,
  },
  drink: {
    frames: [
      require('../../../assets/rocky/pixel/sprites/drink/01.png'),
      require('../../../assets/rocky/pixel/sprites/drink/02.png'),
      require('../../../assets/rocky/pixel/sprites/drink/03.png'),
      require('../../../assets/rocky/pixel/sprites/drink/04.png'),
    ],
    frameDurationMs: 180,
    loop: false,
    cycleCount: 2,
  },
  play: {
    frames: [
      require('../../../assets/rocky/pixel/sprites/play/01.png'),
      require('../../../assets/rocky/pixel/sprites/play/02.png'),
      require('../../../assets/rocky/pixel/sprites/play/03.png'),
      require('../../../assets/rocky/pixel/sprites/play/04.png'),
    ],
    frameDurationMs: 160,
    loop: false,
    cycleCount: 5,
  },
  sleep: {
    frames: [
      require('../../../assets/rocky/pixel/sprites/sleep/01.png'),
      require('../../../assets/rocky/pixel/sprites/sleep/02.png'),
      require('../../../assets/rocky/pixel/sprites/sleep/03.png'),
      require('../../../assets/rocky/pixel/sprites/sleep/04.png'),
    ],
    frameDurationMs: 320,
    loop: false,
    cycleCount: 1,
    finalFrameHoldMs: 4160,
  },
  clean: {
    frames: [
      require('../../../assets/rocky/pixel/sprites/clean/01.png'),
      require('../../../assets/rocky/pixel/sprites/clean/02.png'),
      require('../../../assets/rocky/pixel/sprites/clean/03.png'),
      require('../../../assets/rocky/pixel/sprites/clean/04.png'),
    ],
    frameDurationMs: 180,
    loop: false,
    cycleCount: 3,
  },
  celebrate: {
    frames: [
      require('../../../assets/rocky/pixel/sprites/celebrate/01.png'),
      require('../../../assets/rocky/pixel/sprites/celebrate/02.png'),
      require('../../../assets/rocky/pixel/sprites/celebrate/03.png'),
      require('../../../assets/rocky/pixel/sprites/celebrate/04.png'),
    ],
    frameDurationMs: 150,
    loop: false,
    cycleCount: 4,
  },
  tired: {
    frames: [
      require('../../../assets/rocky/pixel/sprites/tired/01.png'),
      require('../../../assets/rocky/pixel/sprites/tired/02.png'),
      require('../../../assets/rocky/pixel/sprites/tired/03.png'),
      require('../../../assets/rocky/pixel/sprites/tired/04.png'),
    ],
    frameDurationMs: 280,
    loop: true,
  },
  sad: {
    frames: [
      require('../../../assets/rocky/pixel/sprites/sad/01.png'),
      require('../../../assets/rocky/pixel/sprites/sad/02.png'),
      require('../../../assets/rocky/pixel/sprites/sad/03.png'),
      require('../../../assets/rocky/pixel/sprites/sad/04.png'),
    ],
    frameDurationMs: 300,
    loop: true,
  },
};
