import {
  computePatrolLegDuration,
  computePatrolTravelDistance,
} from '../src/components/virtual-pet/patrolMath';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Recorrido de Rocky dentro del hábitat', () => {
  it('mantiene al sprite dentro de los límites horizontales', () => {
    expect(computePatrolTravelDistance(360, 170, 8)).toBe(174);
  });

  it('evita distancias negativas en pantallas estrechas', () => {
    expect(computePatrolTravelDistance(140, 152, 8)).toBe(0);
  });

  it('conserva una velocidad constante según la distancia pendiente', () => {
    expect(computePatrolLegDuration(0, 104)).toBe(2000);
    expect(computePatrolLegDuration(52, 104)).toBe(1000);
  });

  it('aplica una duración mínima a recorridos muy cortos', () => {
    expect(computePatrolLegDuration(0, 5)).toBe(700);
  });

  it('no bloquea interacciones ni trabajo diferido durante el patrullaje continuo', () => {
    const patrolHook = readFileSync(join(process.cwd(), 'src', 'hooks', 'useRockyPatrol.ts'), 'utf8');
    expect(patrolHook).toContain('isInteraction: false');
  });
});
