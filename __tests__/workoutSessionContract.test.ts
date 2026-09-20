import {
  getWorkoutSessionContract,
  isValidWorkoutSessionContract,
} from '../src/core/workoutSessionContract';

describe('Contrato de duración de sesiones', () => {
  it.each([
    [20, { warmup: 3, main: 14, cooldown: 3 }],
    [30, { warmup: 4, main: 22, cooldown: 4 }],
    [60, { warmup: 5, main: 50, cooldown: 5 }],
  ] as const)('distribuye %i min entre las tres fases obligatorias', (minutes, phases) => {
    const contract = getWorkoutSessionContract(minutes);

    expect(contract.phases).toEqual(phases);
    expect(isValidWorkoutSessionContract(contract)).toBe(true);
  });

  it('divide los 60 minutos en dos bloques principales con pausa de hidratación', () => {
    const contract = getWorkoutSessionContract(60);

    expect(contract.label).toBe('Extendida');
    expect(contract.mainBlocks).toEqual([25, 25]);
    expect(contract.healthNote).toContain('hidratación');
  });
});
