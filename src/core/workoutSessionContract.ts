/**
 * Contrato único de duración para las sesiones de entrenamiento.
 * El generador y la UI deben consumir estos presupuestos, nunca inferir minutos
 * a partir del número de ejercicios.
 */
export type WorkoutSessionDuration = 20 | 30 | 60;
export type WorkoutSessionPhase = 'warmup' | 'main' | 'cooldown';

export interface WorkoutSessionContract {
  totalMinutes: WorkoutSessionDuration;
  label: 'Express' | 'Estándar' | 'Extendida';
  phases: Readonly<Record<WorkoutSessionPhase, number>>;
  /** Una sesión extendida separa el trabajo principal para no prescribir 50 min continuos. */
  mainBlocks: readonly number[];
  healthNote: string;
}

const SESSION_CONTRACTS: Readonly<Record<WorkoutSessionDuration, WorkoutSessionContract>> = {
  20: {
    totalMinutes: 20,
    label: 'Express',
    phases: { warmup: 3, main: 14, cooldown: 3 },
    mainBlocks: [14],
    healthNote: 'Sesión express: usa un ritmo cómodo y detente ante dolor agudo.',
  },
  30: {
    totalMinutes: 30,
    label: 'Estándar',
    phases: { warmup: 4, main: 22, cooldown: 4 },
    mainBlocks: [22],
    healthNote: 'Sesión estándar con descansos guiados de 45 a 60 segundos.',
  },
  60: {
    totalMinutes: 60,
    label: 'Extendida',
    phases: { warmup: 5, main: 50, cooldown: 5 },
    mainBlocks: [25, 25],
    healthNote: 'Sesión extendida: incluye una pausa de hidratación entre bloques principales.',
  },
};

export function getWorkoutSessionContract(duration: WorkoutSessionDuration): WorkoutSessionContract {
  return SESSION_CONTRACTS[duration];
}

export function isValidWorkoutSessionContract(contract: WorkoutSessionContract): boolean {
  const phaseTotal = contract.phases.warmup + contract.phases.main + contract.phases.cooldown;
  const blockTotal = contract.mainBlocks.reduce((total, minutes) => total + minutes, 0);
  return phaseTotal === contract.totalMinutes
    && blockTotal === contract.phases.main
    && contract.phases.warmup >= 3
    && contract.phases.cooldown >= 3;
}
