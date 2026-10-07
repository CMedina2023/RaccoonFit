import type { PetCareState } from '../src/types';
import {
  applyPetCareHealthEvent,
  PET_CARE_ACTION_ANIMATIONS,
  PET_CARE_EVENT_ANIMATIONS,
} from '../src/core/petCareIntegration';
import { createInitialPetCare } from '../src/core/petCareEngine';

const HOUR_MS = 60 * 60 * 1000;

describe('integración de cuidados con eventos saludables', () => {
  const baseTime = 1_000_000;

  it('registra animaciones locales para todas las acciones y eventos saludables', () => {
    expect(PET_CARE_ACTION_ANIMATIONS).toEqual({
      feed: 'eat', play: 'play', sleep: 'sleep', clean: 'clean',
    });
    expect(PET_CARE_EVENT_ANIMATIONS).toEqual({
      water_glass: 'drink', meals_complete: 'celebrate',
      workout_complete: 'celebrate', weigh_in: 'celebrate',
    });
  });

  it.each([
    ['water_glass', 'energy', 4],
    ['meals_complete', 'hunger', 15],
    ['workout_complete', 'happiness', 8],
    ['weigh_in', 'happiness', 5],
  ] as const)('%s aplica el efecto %s', (event, need, amount) => {
    const initial = createInitialPetCare(baseTime);
    const result = applyPetCareHealthEvent(initial, event, baseTime);
    expect(result[need]).toBe(initial[need] + amount);
  });

  it('avanza primero el deterioro y mantiene los medidores dentro de 0–100', () => {
    const initial: PetCareState = {
      ...createInitialPetCare(baseTime),
      hunger: 98,
      energy: 1,
    };
    const result = applyPetCareHealthEvent(initial, 'meals_complete', baseTime + HOUR_MS);
    expect(result.hunger).toBe(100);
    expect(result.energy).toBe(1); // El piso de ausencia conserva valores bajos preexistentes.
    expect(result.lastUpdatedAtMs).toBe(baseTime + HOUR_MS);
  });
});
