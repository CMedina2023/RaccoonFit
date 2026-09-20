import {
  GeneratedPlan,
  PlannedExerciseItem,
  WorkoutPhaseGuidance,
  WorkoutSessionPhasePlan,
  WorkoutSessionPlan,
} from '../types';
import { classifyExercise } from './exerciseTaxonomy';
import { getWorkoutSessionContract, WorkoutSessionDuration } from './workoutSessionContract';
import { getExecutionVariant } from './exerciseExecutionVariants';

const WARMUP_GUIDANCE: WorkoutPhaseGuidance[] = [
  { id: 'neck-shoulders', title: 'Cuello y hombros', instruction: 'Haz rotaciones suaves, sin forzar el rango.' },
  { id: 'hips-ankles', title: 'Caderas y tobillos', instruction: 'Moviliza caderas y tobillos con apoyo estable si lo necesitas.' },
  { id: 'thoracic-rotation', title: 'Rotación torácica', instruction: 'Gira suavemente desde la parte alta de la espalda, sin forzar la zona lumbar.' },
  { id: 'hip-hinge', title: 'Bisagra de cadera', instruction: 'Lleva la cadera atrás con rodillas suaves y la espalda larga, sin usar carga.' },
];

const COOLDOWN_GUIDANCE: WorkoutPhaseGuidance[] = [
  { id: 'breathing', title: 'Respiración', instruction: 'Inhala lento por la nariz y exhala más largo para normalizar el ritmo.' },
  { id: 'gentle-stretch', title: 'Estiramiento suave', instruction: 'Estira pecho, espalda, glúteos e isquiotibiales sin rebotes ni dolor.' },
];

function createPhase(
  id: WorkoutSessionPhasePlan['id'],
  title: string,
  minutes: number,
  exercises: PlannedExerciseItem[],
  guidance: WorkoutPhaseGuidance[]
): WorkoutSessionPhasePlan {
  return { id, title, minutes, exercises, guidance };
}

function selectRotatedGuidance(guidance: WorkoutPhaseGuidance[], rotationSeed: number): WorkoutPhaseGuidance[] {
  const offset = rotationSeed % guidance.length;
  return [...guidance.slice(offset), ...guidance.slice(0, offset)].slice(0, 2);
}

/** Construye las tres fases obligatorias a partir de ejercicios ya seleccionados por nivel. */
export function buildWorkoutSession(
  duration: WorkoutSessionDuration,
  selectedExercises: PlannedExerciseItem[],
  rotationSeed: number = 0
): WorkoutSessionPlan {
  const contract = getWorkoutSessionContract(duration);
  const warmupExercise = selectedExercises.find((exercise) =>
    classifyExercise(exercise).allowedPhases.includes('warmup')
  );
  const mainExercises = warmupExercise
    ? selectedExercises.filter((exercise) => exercise.id !== warmupExercise.id)
    : selectedExercises;

  return {
    totalMinutes: contract.totalMinutes,
    label: contract.label,
    mainBlocks: [...contract.mainBlocks],
    healthNote: contract.healthNote,
    phases: [
      createPhase(
        'warmup',
        'Calentamiento y movilidad',
        contract.phases.warmup,
        warmupExercise ? [warmupExercise] : [],
        selectRotatedGuidance(WARMUP_GUIDANCE, rotationSeed)
      ),
      createPhase(
        'main',
        'Entrenamiento principal',
        contract.phases.main,
        mainExercises.map((exercise, index) => ({ ...exercise, executionVariant: getExecutionVariant(exercise, rotationSeed + index) })),
        [{ id: 'rest', title: 'Descanso guiado', instruction: 'Descansa 45 a 60 segundos entre series.' }]
      ),
      createPhase(
        'cooldown',
        'Vuelta a la calma',
        contract.phases.cooldown,
        [],
        COOLDOWN_GUIDANCE
      ),
    ],
  };
}

export function getWorkoutSessionForPlan(
  plan: Pick<GeneratedPlan, 'routineDurationMinutes' | 'selectedExercises' | 'workoutSession'>
): WorkoutSessionPlan {
  return plan.workoutSession ?? buildWorkoutSession(plan.routineDurationMinutes ?? 20, plan.selectedExercises ?? []);
}
