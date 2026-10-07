import type {
  PetCareAction,
  PetCareMeters,
  PetCareNeed,
  PetCareState,
  PetCareStatus,
} from '../types';

export const PET_CARE_NEEDS: readonly PetCareNeed[] = [
  'hunger',
  'energy',
  'cleanliness',
  'happiness',
];

export interface PetCareConfig {
  readonly initialValue: number;
  readonly maximumValue: number;
  readonly absenceFloor: number;
  readonly maximumDecayHours: number;
  readonly decayPerHour: Readonly<Record<PetCareNeed, number>>;
  readonly actionEffects: Readonly<
    Record<PetCareAction, Readonly<Partial<Record<PetCareNeed, number>>>>
  >;
  readonly attentionThreshold: number;
  readonly urgentThreshold: number;
}

export const DEFAULT_PET_CARE_CONFIG: PetCareConfig = {
  initialValue: 80,
  maximumValue: 100,
  absenceFloor: 20,
  maximumDecayHours: 24,
  decayPerHour: {
    hunger: 3,
    happiness: 1,
    energy: 2,
    cleanliness: 1,
  },
  actionEffects: {
    feed: { hunger: 35, happiness: 5 },
    play: { happiness: 35, energy: -8, cleanliness: -4 },
    sleep: { energy: 45, hunger: -6 },
    clean: { cleanliness: 45, happiness: 4 },
  },
  attentionThreshold: 50,
  urgentThreshold: 25,
};

const HOUR_MS = 60 * 60 * 1000;

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function roundMeter(value: number): number {
  return Math.round(value * 100) / 100;
}

function mapMeters(
  state: PetCareState,
  transform: (need: PetCareNeed, value: number) => number
): PetCareMeters {
  return PET_CARE_NEEDS.reduce<PetCareMeters>(
    (meters, need) => ({
      ...meters,
      [need]: transform(need, state[need]),
    }),
    {
      hunger: state.hunger,
      happiness: state.happiness,
      energy: state.energy,
      cleanliness: state.cleanliness,
    }
  );
}

export function createInitialPetCare(
  nowMs: number,
  config: PetCareConfig = DEFAULT_PET_CARE_CONFIG
): PetCareState {
  const initialValue = clamp(config.initialValue, 0, config.maximumValue);

  return {
    hunger: initialValue,
    happiness: initialValue,
    energy: initialValue,
    cleanliness: initialValue,
    lastUpdatedAtMs: nowMs,
  };
}

export function advancePetCare(
  state: PetCareState,
  nowMs: number,
  config: PetCareConfig = DEFAULT_PET_CARE_CONFIG
): PetCareState {
  if (!Number.isFinite(nowMs) || nowMs <= state.lastUpdatedAtMs) {
    return { ...state };
  }

  const elapsedHours = Math.min(
    (nowMs - state.lastUpdatedAtMs) / HOUR_MS,
    config.maximumDecayHours
  );
  const meters = mapMeters(state, (need, value) => {
    const decayFloor = Math.min(value, config.absenceFloor);
    return roundMeter(
      clamp(
        value - config.decayPerHour[need] * elapsedHours,
        decayFloor,
        config.maximumValue
      )
    );
  });

  return {
    ...meters,
    lastUpdatedAtMs: nowMs,
  };
}

export function applyPetCareAction(
  state: PetCareState,
  action: PetCareAction,
  performedAtMs: number,
  config: PetCareConfig = DEFAULT_PET_CARE_CONFIG
): PetCareState {
  const current = advancePetCare(state, performedAtMs, config);
  const effects = config.actionEffects[action];
  const meters = mapMeters(current, (need, value) =>
    roundMeter(clamp(value + (effects[need] ?? 0), 0, config.maximumValue))
  );

  return {
    ...meters,
    lastUpdatedAtMs: current.lastUpdatedAtMs,
  };
}

export function findLowestCareNeed(state: PetCareState): PetCareNeed {
  return PET_CARE_NEEDS.reduce((lowest, need) =>
    state[need] < state[lowest] ? need : lowest
  );
}

export function resolvePetCareStatus(
  state: PetCareState,
  config: PetCareConfig = DEFAULT_PET_CARE_CONFIG
): PetCareStatus {
  const lowestValue = state[findLowestCareNeed(state)];

  if (lowestValue <= config.urgentThreshold) return 'urgent';
  if (lowestValue <= config.attentionThreshold) return 'needs_attention';
  return 'content';
}
