import {
  DEFAULT_PET_CARE_CONFIG,
  PetCareConfig,
  advancePetCare,
  applyPetCareAction,
  createInitialPetCare,
  findLowestCareNeed,
  resolvePetCareStatus,
} from '../src/core/petCareEngine';
import type { PetCareState } from '../src/types';

const HOUR_MS = 60 * 60 * 1000;

describe('Motor de cuidados de Rocky', () => {
  it('crea los cuatro medidores con un valor inicial seguro', () => {
    expect(createInitialPetCare(1_000)).toEqual({
      hunger: 80,
      happiness: 80,
      energy: 80,
      cleanliness: 80,
      lastUpdatedAtMs: 1_000,
    });
  });

  it('reduce cada necesidad según el tiempo transcurrido', () => {
    const initial = createInitialPetCare(0);
    const updated = advancePetCare(initial, 4 * HOUR_MS);

    expect(updated).toEqual({
      hunger: 68,
      happiness: 76,
      energy: 72,
      cleanliness: 76,
      lastUpdatedAtMs: 4 * HOUR_MS,
    });
    expect(initial.hunger).toBe(80);
  });

  it('limita el deterioro de ausencias largas y conserva un piso recuperable', () => {
    const lowState: PetCareState = {
      hunger: 45,
      happiness: 35,
      energy: 30,
      cleanliness: 40,
      lastUpdatedAtMs: 0,
    };

    expect(advancePetCare(lowState, 7 * 24 * HOUR_MS)).toEqual({
      hunger: 20,
      happiness: 20,
      energy: 20,
      cleanliness: 20,
      lastUpdatedAtMs: 7 * 24 * HOUR_MS,
    });
  });

  it('ignora relojes inválidos o anteriores al último cálculo', () => {
    const state = createInitialPetCare(5_000);

    expect(advancePetCare(state, 4_000)).toEqual(state);
    expect(advancePetCare(state, Number.NaN)).toEqual(state);
  });

  it('nunca convierte el paso del tiempo en recuperación automática', () => {
    const state: PetCareState = {
      hunger: 10,
      happiness: 12,
      energy: 5,
      cleanliness: 8,
      lastUpdatedAtMs: 0,
    };

    expect(advancePetCare(state, 4 * HOUR_MS)).toEqual({
      ...state,
      lastUpdatedAtMs: 4 * HOUR_MS,
    });
  });

  it('aplica primero el tiempo transcurrido y después los efectos de alimentar', () => {
    const state = createInitialPetCare(0);
    const updated = applyPetCareAction(state, 'feed', 2 * HOUR_MS);

    expect(updated.hunger).toBe(100);
    expect(updated.happiness).toBe(83);
    expect(updated.energy).toBe(76);
    expect(updated.cleanliness).toBe(78);
  });

  it('modela efectos cruzados de jugar sin salir del rango permitido', () => {
    const state: PetCareState = {
      hunger: 60,
      happiness: 90,
      energy: 5,
      cleanliness: 3,
      lastUpdatedAtMs: 0,
    };
    const updated = applyPetCareAction(state, 'play', 0);

    expect(updated).toMatchObject({
      hunger: 60,
      happiness: 100,
      energy: 0,
      cleanliness: 0,
    });
  });

  it('prioriza la necesidad más baja y clasifica el nivel de atención', () => {
    const state: PetCareState = {
      hunger: 65,
      happiness: 24,
      energy: 70,
      cleanliness: 55,
      lastUpdatedAtMs: 0,
    };

    expect(findLowestCareNeed(state)).toBe('happiness');
    expect(resolvePetCareStatus(state)).toBe('urgent');
    expect(resolvePetCareStatus({ ...state, happiness: 45 })).toBe('needs_attention');
    expect(resolvePetCareStatus({ ...state, happiness: 75 })).toBe('content');
  });

  it('permite inyectar reglas diferentes sin modificar el motor', () => {
    const config: PetCareConfig = {
      ...DEFAULT_PET_CARE_CONFIG,
      maximumDecayHours: 2,
      decayPerHour: {
        hunger: 1,
        happiness: 1,
        energy: 1,
        cleanliness: 1,
      },
    };
    const updated = advancePetCare(createInitialPetCare(0, config), 10 * HOUR_MS, config);

    expect(updated.hunger).toBe(78);
    expect(updated.energy).toBe(78);
  });
});
