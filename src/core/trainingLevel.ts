import { TrainingLevel, UserProfile } from '../types';
import { WorkoutLevel } from './weeklyWorkoutPlanner';

export interface TrainingLevelDefinition {
  id: TrainingLevel;
  numericLevel: WorkoutLevel;
  label: string;
  description: string;
}

export const TRAINING_LEVELS: Record<TrainingLevel, TrainingLevelDefinition> = {
  beginner: { id: 'beginner', numericLevel: 1, label: 'Principiante', description: 'Para empezar con movimientos guiados y de bajo impacto.' },
  intermediate: { id: 'intermediate', numericLevel: 2, label: 'Intermedio', description: 'Para quien ya entrena con constancia y técnica básica.' },
  advanced: { id: 'advanced', numericLevel: 3, label: 'Avanzado', description: 'Para quien domina la técnica y busca mayor reto.' },
};

const LEGACY_ACTIVITY_LEVEL: Record<UserProfile['activityLevel'], WorkoutLevel> = {
  sedentary: 1,
  light: 1,
  moderate: 2,
  active: 3,
};

export function getWorkoutLevel(profile: UserProfile): WorkoutLevel {
  return profile.trainingLevel
    ? TRAINING_LEVELS[profile.trainingLevel].numericLevel
    : LEGACY_ACTIVITY_LEVEL[profile.activityLevel];
}

export function getTrainingLevelLabel(profile: UserProfile): string {
  const level = getWorkoutLevel(profile);
  return ([null, 'Principiante', 'Intermedio', 'Avanzado'] as const)[level];
}
