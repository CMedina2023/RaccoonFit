import { getTrainingLevelLabel, getWorkoutLevel } from '../src/core/trainingLevel';
import { UserProfile } from '../src/types';

const profile: UserProfile = {
  name: 'Ana', gender: 'female', age: 30, heightCm: 165, startingWeightKg: 72,
  targetWeightKg: 66, activityLevel: 'sedentary', preferredRoutineMinutes: 30,
  weighInDayOfWeek: 5, createdAt: '2026-09-18',
};

describe('Nivel de entrenamiento', () => {
  it.each([
    ['beginner', 1, 'Principiante'],
    ['intermediate', 2, 'Intermedio'],
    ['advanced', 3, 'Avanzado'],
  ] as const)('prioriza el nivel %s elegido por la persona', (trainingLevel, expectedLevel, expectedLabel) => {
    const selected = { ...profile, trainingLevel };
    expect(getWorkoutLevel(selected)).toBe(expectedLevel);
    expect(getTrainingLevelLabel(selected)).toBe(expectedLabel);
  });

  it('conserva el mapeo de perfiles creados antes de añadir niveles', () => {
    expect(getWorkoutLevel({ ...profile, activityLevel: 'active' })).toBe(3);
  });
});
