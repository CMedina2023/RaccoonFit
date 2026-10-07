import type { PetAnimationName, PetCareAction, PetCareHealthEventType, PetCareMeters, PetCareState } from '../types';
import { advancePetCare } from './petCareEngine';

export const PET_CARE_HEALTH_EVENT_EFFECTS: Record<PetCareHealthEventType, Partial<PetCareMeters>> = {
  water_glass: { energy: 4, happiness: 1 },
  meals_complete: { hunger: 15, happiness: 3 },
  workout_complete: { happiness: 8, energy: 4, cleanliness: -2 },
  weigh_in: { happiness: 5 },
};

export const PET_CARE_HEALTH_EVENT_XP: Record<PetCareHealthEventType, number> = {
  water_glass: 10,
  meals_complete: 30,
  workout_complete: 50,
  weigh_in: 100,
};

export const PET_CARE_ACTION_ANIMATIONS: Record<PetCareAction, PetAnimationName> = {
  feed: 'eat',
  play: 'play',
  sleep: 'sleep',
  clean: 'clean',
};

export const PET_CARE_EVENT_ANIMATIONS: Record<PetCareHealthEventType, PetAnimationName> = {
  water_glass: 'drink',
  meals_complete: 'celebrate',
  workout_complete: 'celebrate',
  weigh_in: 'celebrate',
};

export function applyPetCareHealthEvent(
  state: PetCareState,
  event: PetCareHealthEventType,
  nowMs: number
): PetCareState {
  const advanced = advancePetCare(state, nowMs);
  const effects = PET_CARE_HEALTH_EVENT_EFFECTS[event];
  const meters = (['hunger', 'happiness', 'energy', 'cleanliness'] as const).reduce(
    (next, need) => ({
      ...next,
      [need]: Math.min(100, Math.max(0, advanced[need] + (effects[need] ?? 0))),
    }),
    {
      hunger: advanced.hunger,
      happiness: advanced.happiness,
      energy: advanced.energy,
      cleanliness: advanced.cleanliness,
    }
  );

  return { ...meters, lastUpdatedAtMs: advanced.lastUpdatedAtMs };
}
