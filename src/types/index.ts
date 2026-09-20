export type FitnessGoal = 'fat_loss' | 'muscle_gain' | 'maintain_weight' | 'stress_relief';
export type TargetZone = 'arms' | 'abs' | 'glutes' | 'legs' | 'full_body';
export type ApproachType = 'nutrition_plan' | 'calorie_tracking';
export type ObstacleType =
  | 'cravings'
  | 'inconsistency'
  | 'lack_of_time'
  | 'anxiety_eating'
  | 'social_events'
  | 'dont_know_what_to_eat';

export type DietaryPreference = 'balanced' | 'pescatarian' | 'vegetarian' | 'vegan';
export type TrainingLevel = 'beginner' | 'intermediate' | 'advanced';
export type ExerciseAnimationType =
  | 'curl_biceps'
  | 'squat_goblet'
  | 'bridge_glute'
  | 'row_band'
  | 'lateral_raise'
  | 'step_jack'
  | 'pushup_incline'
  | 'monster_walk'
  | 'shoulder_press'
  | 'clamshell'
  | 'row_dumbbell'
  | 'kickback_glute'
  | 'deadlift_rdl'
  | 'mountain_climber'
  | 'shadow_box'
  | 'band_chest_press'
  | 'dumbbell_shrug'
  | 'band_vup';

/**
 * Evidencia visual por ejercicio. Un frame genérico de una familia no es una
 * sustitución válida: solo `exact_frame` puede mostrarse cuando falla el GIF.
 */
export interface ExerciseMediaContract {
  officialGif: 'verified' | 'unverified' | 'unavailable';
  localFallback: 'exact_gif' | 'exact_frame' | 'unavailable';
}

export interface UserProfile {
  name: string;
  gender: 'male' | 'female';
  age: number;
  heightCm: number;
  startingWeightKg: number;
  targetWeightKg: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
  /** Nivel elegido para la rutina; los perfiles anteriores conservan activityLevel como respaldo. */
  trainingLevel?: TrainingLevel;
  preferredRoutineMinutes: 20 | 30 | 60;
  weighInDayOfWeek: number; // 0 = Domingo, 5 = Viernes, etc.
  createdAt: string;
  fitnessGoal?: FitnessGoal;
  focusZones?: TargetZone[];
  approachType?: ApproachType;
  obstacles?: ObstacleType[];
  dietaryPreference?: DietaryPreference;
  remindersEnabled?: boolean;
}

export interface WeeklyWeighIn {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  calculatedBmi: number;
  notes?: string;
}

export interface DailyHydration {
  date: string; // YYYY-MM-DD
  glasses: number; // cada vaso = 250ml
  targetGlasses: number; // meta diaria (ej. 8 vasos = 2L)
}

export interface ExerciseItem {
  id: string;
  name: string;
  category: 'mancuernas' | 'ligas' | 'bandas_pierna' | 'cardio' | 'peso_corporal';
  targetMuscle: string;
  suggestedSets: number;
  suggestedRepsOrSeconds: string;
  restSeconds: number;
  description: string;
  tips: string[];
  requiresEquipment: string;
  difficulty: 'principiante' | 'intermedio' | 'avanzado';
  gifUrl?: string;
  exerciseDbId?: string;
}

export type WorkoutCompletionFocus = 'full_body' | 'chest_back' | 'biceps_triceps' | 'shoulders_traps' | 'abs_obliques' | 'legs_glutes' | 'core_cardio';

/** Registro local de una sesión programada que el usuario confirmó haber terminado. */
export interface WorkoutCompletion {
  date: string; // YYYY-MM-DD local
  day: string;
  focus: WorkoutCompletionFocus;
  durationMinutes: 20 | 30 | 60;
  completedAt: string;
}
export interface WorkoutPresentationRecord { date: string; focus: WorkoutCompletionFocus; exerciseId: string; variantLabel: string; weekSeed: number; }

/** Personalización local y persistente de los ejercicios de la fase principal. */
export interface WorkoutMainOverride {
  sessionKey: string;
  exercises: PlannedExerciseItem[];
  updatedAt: string;
}

/** Exercise contract required by a generated plan and its animation player. */
export interface PlannedExerciseItem extends ExerciseItem {
  animationType: ExerciseAnimationType;
  levelNumeric: 1 | 2 | 3;
  exerciseDbId: string;
  media?: ExerciseMediaContract;
}

export interface ExerciseExecutionVariant { label: string; instruction: string; }

export type WorkoutSessionPhaseId = 'warmup' | 'main' | 'cooldown';

export interface WorkoutPhaseGuidance {
  id: string;
  title: string;
  instruction: string;
}

export interface WorkoutSessionPhasePlan {
  id: WorkoutSessionPhaseId;
  title: string;
  minutes: number;
  exercises: Array<PlannedExerciseItem & { executionVariant?: ExerciseExecutionVariant }>;
  guidance: WorkoutPhaseGuidance[];
}

export interface WorkoutSessionPlan {
  totalMinutes: 20 | 30 | 60;
  label: 'Express' | 'Estándar' | 'Extendida';
  mainBlocks: number[];
  healthNote: string;
  phases: [WorkoutSessionPhasePlan, WorkoutSessionPhasePlan, WorkoutSessionPhasePlan];
}

export interface RecipeItem {
  id: string;
  title: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  prepTimeMinutes: number;
  isBudgetFriendly: boolean;
  ingredients: string[];
  instructions: string[];
  approxCalories: number;
  approxProteinGrams: number;
}

export interface GeneratedPlan {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  durationWeeks: number;
  endDate: string; // YYYY-MM-DD
  /** Campos heredados: no se generan ni persisten en nuevos planes de Dieta. */
  routineDurationMinutes?: 20 | 30 | 60;
  status: 'draft' | 'active' | 'completed' | 'expired';
  targetLossKg: number;
  selectedExercises?: PlannedExerciseItem[];
  workoutSession?: WorkoutSessionPlan;
  selectedMeals: {
    breakfast: RecipeItem[];
    lunch: RecipeItem[];
    dinner: RecipeItem[];
    snack: RecipeItem[];
  };
  evaluationResult?: {
    startWeightKg: number;
    finalWeightKg: number;
    lostKg: number;
    achievedGoal: boolean;
    recommendation: string;
  };
}

export type PetShape = 'chubby' | 'balanced' | 'fit' | 'athletic';
export type PetMood = 'happy' | 'thirsty' | 'sleepy' | 'celebrating' | 'motivating';

export interface VirtualPetState {
  name: string;
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  shape: PetShape;
  mood: PetMood;
  unlockedAccessories: string[];
  dialogMessage: string;
}

export interface DailyMealsLog {
  date: string; // YYYY-MM-DD
  breakfast?: RecipeItem;
  lunch?: RecipeItem;
  dinner?: RecipeItem;
  snack?: RecipeItem;
}
