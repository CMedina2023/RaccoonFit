import { ExerciseAnimationType, ExerciseItem, ExerciseMediaContract } from '../types';

type ClassifiableExercise = ExerciseItem & {
  animationType?: ExerciseAnimationType;
  media?: ExerciseMediaContract;
};

/** Datos de prescripción normalizados. Nunca usar targetMuscle (texto de UI) para programar una rutina. */
export const WORKOUT_MUSCLE_GROUPS = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'core', 'obliques',
  'quadriceps', 'hamstrings', 'glutes', 'calves', 'hip_abductors', 'hip_adductors', 'cardio',
] as const;

export type WorkoutMuscleGroup = typeof WORKOUT_MUSCLE_GROUPS[number];
export type MovementPattern = 'push' | 'pull' | 'squat' | 'hinge' | 'lunge' | 'carry' | 'core' | 'cardio' | 'mobility';
export type ImpactLevel = 'low' | 'moderate' | 'high';
export type StabilityDemand = 'supported' | 'bilateral' | 'unilateral';
export type WorkoutPhase = 'warmup' | 'main' | 'cooldown';
export type AnimationAuditStatus = 'verified_family' | 'requires_dedicated_frame';

export interface ExerciseClassification {
  primaryMuscles: readonly WorkoutMuscleGroup[];
  secondaryMuscles: readonly WorkoutMuscleGroup[];
  movementPattern: MovementPattern;
  impact: ImpactLevel;
  stability: StabilityDemand;
  allowedPhases: readonly WorkoutPhase[];
  /** Regresión concreta que el programador puede ofrecer sin adivinar por el nombre. */
  regression: string;
  /** No certifica una animación genérica como equivalente a un movimiento distinto. */
  animationAudit: AnimationAuditStatus;
}

const MUSCLE_TOKENS: ReadonlyArray<readonly [string, WorkoutMuscleGroup]> = [
  ['pectoral', 'chest'], ['espalda', 'back'], ['dorsal', 'back'], ['bíceps', 'biceps'],
  ['tríceps', 'triceps'], ['antebrazo', 'forearms'], ['hombro', 'shoulders'],
  ['deltoid', 'shoulders'], ['trapecio', 'shoulders'], ['serrato', 'shoulders'],
  ['core', 'core'], ['abdomen', 'core'], ['oblicuo', 'obliques'], ['cuádriceps', 'quadriceps'],
  ['pierna', 'quadriceps'], ['isquiotibial', 'hamstrings'], ['femoral', 'hamstrings'],
  ['glúteo', 'glutes'], ['pantorrilla', 'calves'], ['abductor', 'hip_abductors'],
  ['aductor', 'hip_adductors'], ['cardio', 'cardio'],
];

const FAMILIES_WITH_MATCHING_LOCAL_FRAME = new Set([
  'curl_biceps', 'squat_goblet', 'bridge_glute', 'row_band', 'lateral_raise',
  'step_jack', 'pushup_incline', 'monster_walk', 'shoulder_press', 'clamshell',
  'row_dumbbell', 'kickback_glute', 'deadlift_rdl', 'mountain_climber', 'shadow_box',
  'band_chest_press', 'dumbbell_shrug', 'band_vup',
]);

function normalized(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
}

let cachedNormalizedTokens: Array<readonly [string, WorkoutMuscleGroup]> | null = null;

function musclesFromTarget(targetMuscle: string): WorkoutMuscleGroup[] {
  if (!cachedNormalizedTokens) {
    cachedNormalizedTokens = MUSCLE_TOKENS.map(([token, muscle]) => [normalized(token), muscle] as const);
  }
  const target = normalized(targetMuscle);
  const matches = cachedNormalizedTokens
    .map(([token, muscle]) => ({ muscle, position: target.indexOf(token) }))
    .filter((match) => match.position >= 0)
    .sort((left, right) => left.position - right.position);
  return [...new Set(matches.map((match) => match.muscle))];
}

function movementPatternFor(exercise: ExerciseItem): MovementPattern {
  const value = normalized(`${exercise.id} ${exercise.name}`);
  if (/(cardio|jack|ski_step|shadow_box|high_knee)/.test(value)) return 'cardio';
  if (/(sentadilla|squat|stepup)/.test(value)) return 'squat';
  if (/(peso_muerto|deadlift|puente|bridge|hip_lift)/.test(value)) return 'hinge';
  if (/(zancada|lunge|split_squat)/.test(value)) return 'lunge';
  if (/(remo|row|jalon|pulldown)/.test(value)) return 'pull';
  if (/(press|flexion|pushup|elevacion|extension_triceps)/.test(value)) return 'push';
  return 'core';
}

function regressionFor(pattern: MovementPattern): string {
  const regressions: Record<MovementPattern, string> = {
    push: 'Reduce el rango y usa una pared o superficie elevada estable.',
    pull: 'Usa una liga ligera, postura sentada estable y menor rango.',
    squat: 'Realiza la variante asistida con pared o silla, sin bajar a dolor.',
    hinge: 'Practica el patrón sin carga y con recorrido corto antes de añadir resistencia.',
    lunge: 'Usa apoyo de pared y una zancada corta, o sustituye por sentadilla asistida.',
    carry: 'Reduce la carga y camina junto a una pared o silla estable.',
    core: 'Apoya rodillas o reduce el recorrido sin perder alineación lumbar.',
    cardio: 'Mantén siempre un pie en el suelo y reduce el ritmo.',
    mobility: 'Usa un rango cómodo, lento y sin dolor.',
  };
  return regressions[pattern];
}

function phasesFor(pattern: MovementPattern, impact: ImpactLevel): readonly WorkoutPhase[] {
  if (pattern === 'cardio' && impact !== 'high') return ['warmup', 'main'];
  return ['main'];
}

const classificationCache = new Map<string, ExerciseClassification>();

/**
 * Adaptador temporal del catálogo histórico: convierte etiquetas legibles en datos seguros y tipados.
 * Es deliberadamente la única frontera que interpreta texto; los futuros generadores usarán este resultado.
 */
export function classifyExercise(exercise: ClassifiableExercise): ExerciseClassification {
  if (classificationCache.has(exercise.id)) {
    return classificationCache.get(exercise.id)!;
  }

  const muscles = musclesFromTarget(exercise.targetMuscle);
  const pattern = movementPatternFor(exercise);
  const name = normalized(`${exercise.id} ${exercise.name}`);
  const impact: ImpactLevel = /(sin salto|no jump|low impact)/.test(name)
    ? 'low'
    : /(jump|salto)/.test(name)
      ? 'high'
      : pattern === 'cardio'
        ? 'moderate'
        : 'low';
  const stability: StabilityDemand = /(unilateral|una mano|una pierna|por lado|zancada|lunge)/.test(name)
    ? 'unilateral'
    : /(pared|silla|asistida|apoyo)/.test(normalized(exercise.requiresEquipment)) ? 'supported'
    : 'bilateral';
  const [primary, ...secondary] = muscles;

  const result: ExerciseClassification = {
    primaryMuscles: primary ? [primary] : pattern === 'cardio' ? ['cardio'] : ['core'],
    secondaryMuscles: secondary,
    movementPattern: pattern,
    impact,
    stability,
    allowedPhases: phasesFor(pattern, impact),
    regression: regressionFor(pattern),
    animationAudit: exercise.media?.localFallback === 'exact_gif'
      || (exercise.media?.localFallback === 'exact_frame'
        && exercise.animationType !== undefined
        && FAMILIES_WITH_MATCHING_LOCAL_FRAME.has(exercise.animationType))
      ? 'verified_family'
      : 'requires_dedicated_frame',
  };

  classificationCache.set(exercise.id, result);
  return result;
}

/** Contrato reutilizable por las pruebas y por la futura generación semanal. */
export function hasValidClassification(exercise: ClassifiableExercise): boolean {
  const classification = classifyExercise(exercise);
  return classification.primaryMuscles.length > 0
    && classification.regression.length > 0
    && classification.movementPattern.length > 0;
}
