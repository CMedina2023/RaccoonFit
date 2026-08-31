export interface UserProfile {
  name: string;
  gender: 'male' | 'female';
  age: number;
  heightCm: number;
  startingWeightKg: number;
  targetWeightKg: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active';
  preferredRoutineMinutes: 20 | 30 | 60;
  weighInDayOfWeek: number; // 0 = Domingo, 5 = Viernes, etc.
  createdAt: string;
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
  routineDurationMinutes: 20 | 30 | 60;
  status: 'draft' | 'active' | 'completed' | 'expired';
  targetLossKg: number;
  selectedExercises: ExerciseItem[];
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
