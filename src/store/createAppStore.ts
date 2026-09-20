/**
 * createAppStore.ts — Store inyectable y desacoplado
 *
 * SRP: El store es solo orquestador. La lógica de dominio está en los servicios.
 * DIP: Recibe StorageAdapter (abstracción), no conoce AsyncStorage.
 * ISP: Los componentes consumen via selectors.ts, no este store completo.
 */
import { create } from 'zustand';
import {
  UserProfile, WeeklyWeighIn, DailyHydration, GeneratedPlan, VirtualPetState, RecipeItem, DailyMealsLog, WorkoutCompletion, WorkoutPresentationRecord, WorkoutMainOverride,
} from '../types';
import { calculateBmi } from '../core/bmiCalculator';
import { generateAutomatedPlan, checkPlanExpiration } from '../core/planEngine';
import {
  computePetAfterWeighIn,
  computePetAfterWaterGlass,
  createInitialPet,
} from '../core/petService';
import {
  isHydrationLimitReached,
  getHydrationLimitMessage,
  getTodayGlasses,
  WATER_GOAL_GLASSES,
  MAX_WATER_GLASSES,
} from '../core/hydrationService';
import { getRandomMealExcluding, generateDailyMealSuggestion, getRecentMealIds } from '../core/mealService';
import { StorageAdapter } from '../core/storage/StorageAdapter';
import { toggleWorkoutCompletion as toggleWorkoutCompletionInHistory } from '../core/workoutProgressService';
import { createWeeklyRoutine, hasWeeklyRoutineStructure, isValidWeeklyRoutine, WeeklyRoutine } from '../core/weeklyWorkoutPlanner';
import { getWorkoutLevel } from '../core/trainingLevel';

// Re-exportamos las constantes para compatibilidad con imports existentes
export { MAX_WATER_GLASSES, WATER_GOAL_GLASSES };

const STORAGE_KEY = '@dieta_fitness_state_v2';
let activeToastTimeout: (ReturnType<typeof setTimeout> & { unref?: () => void }) | null = null;

interface AppState {
  isInitialized: boolean;
  userProfile: UserProfile | null;
  weighInHistory: WeeklyWeighIn[];
  hydrationHistory: Record<string, number>; // date "YYYY-MM-DD" -> glasses
  mealsHistory: Record<string, DailyMealsLog>; // date "YYYY-MM-DD" -> platillos elegidos
  workoutHistory: Record<string, WorkoutCompletion>; // date "YYYY-MM-DD" local -> sesión completada
  workoutPresentationHistory: WorkoutPresentationRecord[];
  workoutMainOverrides: Record<string, WorkoutMainOverride>;
  weeklyRoutine: WeeklyRoutine | null;
  currentPlan: GeneratedPlan | null;
  petState: VirtualPetState;

  // Feedback visual (sustituye Alert.alert)
  toastMessage: string | null;
  toastType: 'success' | 'error' | 'info' | null;

  initialize: () => Promise<void>;
  saveUserProfile: (profile: UserProfile) => Promise<void>;
  addWeeklyWeighIn: (weightKg: number, notes?: string) => Promise<void>;
  addWaterGlass: () => Promise<void>;
  removeWaterGlass: () => Promise<void>;
  activatePlan: (plan: GeneratedPlan) => Promise<void>;
  removeRecipeFromPlan: (recipeId: string, mealType: keyof GeneratedPlan['selectedMeals']) => void;
  shuffleSingleMeal: (mealType: keyof GeneratedPlan['selectedMeals'], currentRecipeId: string) => void;
  shuffleAllMeals: () => void;
  selectMealForDay: (date: string, mealType: keyof GeneratedPlan['selectedMeals'], recipe: RecipeItem) => Promise<void>;
  toggleWorkoutCompletion: (completion: WorkoutCompletion) => Promise<void>;
  saveWeeklyRoutine: (routine: WeeklyRoutine) => Promise<boolean>;
  recordWorkoutPresentation: (records: WorkoutPresentationRecord[]) => Promise<void>;
  saveWorkoutMainOverride: (override: WorkoutMainOverride) => Promise<void>;
  evaluatePlanExpiration: () => void;
  resetAll: () => Promise<void>;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  clearToast: () => void;
}

const DEFAULT_PET: VirtualPetState = {
  name: 'Rocky',
  level: 1,
  currentXp: 0,
  xpToNextLevel: 100,
  shape: 'chubby',
  mood: 'motivating',
  unlockedAccessories: ['bandana_basica'],
  dialogMessage: '¡Hola! Soy Rocky. Juntos vamos a ponernos en forma paso a pasito. 🦝',
};

// ─────────────────────────────────────────────
// Función de persistencia — DIP: recibe adapter como parámetro
// ─────────────────────────────────────────────
async function persistState(
  state: AppState,
  storage: StorageAdapter
): Promise<void> {
  try {
    const payload = {
      userProfile: state.userProfile,
      weighInHistory: state.weighInHistory,
      hydrationHistory: state.hydrationHistory,
      mealsHistory: state.mealsHistory,
      workoutHistory: state.workoutHistory,
      workoutPresentationHistory: state.workoutPresentationHistory,
      workoutMainOverrides: state.workoutMainOverrides,
      weeklyRoutine: state.weeklyRoutine,
      currentPlan: state.currentPlan,
      petState: state.petState,
    };
    await storage.set(STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.error('Error persisting state', e);
  }
}

// ─────────────────────────────────────────────
// Store — solo orquesta: llama servicios, actualiza estado, persiste
// ─────────────────────────────────────────────
export function createAppStore(storage: StorageAdapter) {
  return create<AppState>((set, get) => ({
  isInitialized: false,
  userProfile: null,
  weighInHistory: [],
  hydrationHistory: {},
  mealsHistory: {},
  workoutHistory: {},
  workoutPresentationHistory: [],
  workoutMainOverrides: {},
  weeklyRoutine: null,
  currentPlan: null,
  petState: DEFAULT_PET,
  toastMessage: null,
  toastType: null,

  showToast: (message, type = 'info') => {
    if (activeToastTimeout) {
      clearTimeout(activeToastTimeout);
    }
    set({ toastMessage: message, toastType: type });
    activeToastTimeout = setTimeout(() => {
      set({ toastMessage: null, toastType: null });
      activeToastTimeout = null;
    }, 3000);
    activeToastTimeout.unref?.();
  },

  clearToast: () => set({ toastMessage: null, toastType: null }),

  initialize: async () => {
    try {
      const stored = await storage.get(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        let plan: GeneratedPlan | null = parsed.currentPlan || null;

        // Si el plan guardado viene del formato anterior con comidas cruzadas o listas completas,
        // garantizamos que cada tiempo contenga 3 opciones válidas de su propia categoría
        if (plan && plan.selectedMeals) {
          const pref = parsed.userProfile?.dietaryPreference;
          const sanitizedMeals = {
            breakfast: plan.selectedMeals.breakfast?.filter(r => r.mealType === 'breakfast').slice(0, 3) || [],
            lunch: plan.selectedMeals.lunch?.filter(r => r.mealType === 'lunch').slice(0, 3) || [],
            dinner: plan.selectedMeals.dinner?.filter(r => r.mealType === 'dinner').slice(0, 3) || [],
            snack: plan.selectedMeals.snack?.filter(r => r.mealType === 'snack').slice(0, 3) || [],
          };
          // Si alguno quedó con menos de 3 opciones, regenerar opciones limpias
          if (sanitizedMeals.breakfast.length < 3 || sanitizedMeals.lunch.length < 3 ||
              sanitizedMeals.dinner.length < 3 || sanitizedMeals.snack.length < 3) {
            plan = {
              ...plan,
              selectedMeals: generateDailyMealSuggestion(pref, [], undefined, 3),
            };
          } else {
            plan = { ...plan, selectedMeals: sanitizedMeals };
          }
        }

        // Migración no destructiva: Dieta conserva sus comidas y metadatos; la rutina vive
        // en perfil, calendario semanal y catálogo local. El resto del estado no se modifica.
        if (plan) {
          const { selectedExercises: _selectedExercises, workoutSession: _workoutSession, routineDurationMinutes: _routineDurationMinutes, ...nutritionPlan } = plan;
          plan = nutritionPlan as GeneratedPlan;
        }

        set({
          isInitialized: true,
          userProfile: parsed.userProfile || null,
          weighInHistory: parsed.weighInHistory || [],
          hydrationHistory: parsed.hydrationHistory || {},
          mealsHistory: parsed.mealsHistory || {},
          workoutHistory: parsed.workoutHistory || {},
          workoutPresentationHistory: Array.isArray(parsed.workoutPresentationHistory) ? parsed.workoutPresentationHistory : [],
          workoutMainOverrides: parsed.workoutMainOverrides && typeof parsed.workoutMainOverrides === 'object' ? parsed.workoutMainOverrides : {},
          weeklyRoutine: parsed.weeklyRoutine && hasWeeklyRoutineStructure({ days: parsed.weeklyRoutine.days.map((day: { focus: string; label: string }) => ({ ...day, focus: day.focus === 'push' ? 'chest_back' : day.focus === 'pull' ? 'biceps_triceps' : day.focus, label: day.label === 'Empuje y core' ? 'Pecho y espalda' : day.label === 'Tracción y core' ? 'Bíceps y tríceps' : day.label })) } as WeeklyRoutine) ? { days: parsed.weeklyRoutine.days.map((day: { focus: string; label: string }) => ({ ...day, focus: day.focus === 'push' ? 'chest_back' : day.focus === 'pull' ? 'biceps_triceps' : day.focus, label: day.label === 'Empuje y core' ? 'Pecho y espalda' : day.label === 'Tracción y core' ? 'Bíceps y tríceps' : day.label })) } as WeeklyRoutine : createWeeklyRoutine(parsed.userProfile ? getWorkoutLevel(parsed.userProfile) : 1),
          currentPlan: plan,
          petState: parsed.petState || DEFAULT_PET,
        });
        get().evaluatePlanExpiration();
        return;
      }
    } catch (e) {
      console.warn('Error loading storage', e);
    }
    set({ isInitialized: true });
  },

  saveUserProfile: async (profile: UserProfile) => {
    const { showToast } = get();
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const bmiResult = calculateBmi(profile.startingWeightKg, profile.heightCm, profile.gender);
      const initialWeighIn: WeeklyWeighIn = {
        id: `w_${Date.now()}`,
        date: todayStr,
        weightKg: profile.startingWeightKg,
        calculatedBmi: bmiResult.bmi,
        notes: 'Registro inicial',
      };

      const autoPlan = generateAutomatedPlan(profile);

      // SRP: createInitialPet vive en petService, no aquí
      const newPet = createInitialPet(DEFAULT_PET, profile.name);

      set({
        userProfile: profile,
        weighInHistory: [initialWeighIn],
        currentPlan: autoPlan,
        petState: newPet,
      });

      await persistState(get(), storage);
      showToast(`✅ Perfil guardado. Tu plan "${autoPlan.title}" está listo para revisar.`, 'success');
    } catch (e) {
      showToast('❌ Error al guardar el perfil. Intenta de nuevo.', 'error');
    }
  },

  addWeeklyWeighIn: async (weightKg: number, notes?: string) => {
    const { userProfile, weighInHistory, petState, showToast } = get();
    if (!userProfile) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const bmiResult = calculateBmi(weightKg, userProfile.heightCm, userProfile.gender);
    const newWeighIn: WeeklyWeighIn = {
      id: `w_${Date.now()}`, date: todayStr, weightKg, calculatedBmi: bmiResult.bmi, notes,
    };

    const updatedHistory = [newWeighIn, ...weighInHistory.filter((w) => w.date !== todayStr)];

    // SRP: lógica de mascota delegada a petService
    const updatedPet = computePetAfterWeighIn(petState, userProfile.startingWeightKg, weightKg);

    set({ weighInHistory: updatedHistory, petState: updatedPet });
    await persistState(get(), storage);
    showToast('⚖️ Pesaje semanal registrado correctamente', 'success');
  },

  addWaterGlass: async () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const { petState, showToast, hydrationHistory } = get();

    // SRP: validación delegada a hydrationService
    const current = getTodayGlasses(hydrationHistory, todayStr);
    if (isHydrationLimitReached(current)) {
      showToast(getHydrationLimitMessage(), 'info');
      return;
    }

    const updatedGlasses = current + 1;

    // SRP: lógica de mascota delegada a petService
    const updatedPet = computePetAfterWaterGlass(petState, updatedGlasses, WATER_GOAL_GLASSES);

    set({
      hydrationHistory: { ...hydrationHistory, [todayStr]: updatedGlasses },
      petState: updatedPet,
    });
    await persistState(get(), storage);
  },

  removeWaterGlass: async () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const current = getTodayGlasses(get().hydrationHistory, todayStr);
    if (current <= 0) return;
    set({ hydrationHistory: { ...get().hydrationHistory, [todayStr]: current - 1 } });
    await persistState(get(), storage);
  },

  activatePlan: async (plan: GeneratedPlan) => {
    const { showToast } = get();
    set({ currentPlan: { ...plan, status: 'active' } });
    await persistState(get(), storage);
    showToast('✅ Plan activado. ¡A darle con todo!', 'success');
  },

  removeRecipeFromPlan: (recipeId: string, mealType: keyof GeneratedPlan['selectedMeals']) => {
    const { currentPlan } = get();
    if (!currentPlan) return;
    set({
      currentPlan: {
        ...currentPlan,
        selectedMeals: { ...currentPlan.selectedMeals, [mealType]: currentPlan.selectedMeals[mealType].filter((r) => r.id !== recipeId) },
      },
    });
    persistState(get(), storage);
  },

  shuffleSingleMeal: (mealType: keyof GeneratedPlan['selectedMeals'], currentRecipeId: string) => {
    const { currentPlan, userProfile, mealsHistory, showToast } = get();
    if (!currentPlan) return;

    const recentExcludedIds = getRecentMealIds(mealsHistory);
    const currentList = currentPlan.selectedMeals[mealType] || [];
    // Excluir los IDs de las otras opciones visibles en este momento para no duplicar en la misma vista
    const otherCurrentIds = currentList.filter((r) => r.id !== currentRecipeId).map((r) => r.id);
    const totalExcluded = [...recentExcludedIds, ...otherCurrentIds];

    const newRecipe = getRandomMealExcluding(
      currentRecipeId,
      mealType,
      userProfile?.dietaryPreference,
      totalExcluded
    );

    const index = currentList.findIndex((r) => r.id === currentRecipeId);
    let updatedList: typeof currentList;

    if (index >= 0) {
      updatedList = [...currentList];
      updatedList[index] = newRecipe;
    } else {
      updatedList = [...currentList, newRecipe].slice(-3);
    }

    set({
      currentPlan: {
        ...currentPlan,
        selectedMeals: {
          ...currentPlan.selectedMeals,
          [mealType]: updatedList,
        },
      },
    });
    persistState(get(), storage);
    showToast(`✨ Opción cambiada: ${newRecipe.title}`, 'info');
  },

  shuffleAllMeals: () => {
    const { currentPlan, userProfile, mealsHistory, showToast } = get();
    if (!currentPlan) return;

    const recentExcludedIds = getRecentMealIds(mealsHistory);
    const newMeals = generateDailyMealSuggestion(userProfile?.dietaryPreference, recentExcludedIds, undefined, 3);
    set({
      currentPlan: {
        ...currentPlan,
        selectedMeals: newMeals,
      },
    });
    persistState(get(), storage);
    showToast('🎲 Menú del día renovado con 3 nuevas opciones por tiempo', 'success');
  },

  selectMealForDay: async (date: string, mealType: keyof GeneratedPlan['selectedMeals'], recipe: RecipeItem) => {
    const { mealsHistory, showToast } = get();
    const currentDayLog = mealsHistory[date] || { date };
    const isAlreadySelected = currentDayLog[mealType]?.id === recipe.id;

    let updatedDayLog: DailyMealsLog;
    if (isAlreadySelected) {
      const copy = { ...currentDayLog };
      delete copy[mealType];
      updatedDayLog = copy;
      showToast(`Platillo desmarcado de ${mealType}`, 'info');
    } else {
      updatedDayLog = {
        ...currentDayLog,
        [mealType]: recipe,
      };
      showToast(`✅ ¡Elegiste "${recipe.title}" para hoy!`, 'success');
    }

    const updatedHistory = {
      ...mealsHistory,
      [date]: updatedDayLog,
    };

    set({ mealsHistory: updatedHistory });
    await persistState(get(), storage);
  },

  toggleWorkoutCompletion: async (completion: WorkoutCompletion) => {
    const { workoutHistory, showToast } = get();
    const wasCompleted = Boolean(workoutHistory[completion.date]);
    set({ workoutHistory: toggleWorkoutCompletionInHistory(workoutHistory, completion) });
    await persistState(get(), storage);
    showToast(wasCompleted ? 'Rutina marcada como pendiente' : '¡Rutina completada! Buen trabajo.', wasCompleted ? 'info' : 'success');
  },

  saveWeeklyRoutine: async (routine: WeeklyRoutine) => {
    if (!isValidWeeklyRoutine(routine)) {
      get().showToast('Elige al menos 2 días de descanso para guardar tu semana.', 'info');
      return false;
    }
    set({ weeklyRoutine: { days: routine.days.map((day) => ({ ...day })) } });
    await persistState(get(), storage);
    return true;
  },

  recordWorkoutPresentation: async (records: WorkoutPresentationRecord[]) => {
    const existing = get().workoutPresentationHistory;
    const keys = new Set(existing.map((record) => `${record.date}:${record.exerciseId}:${record.variantLabel}`));
    const additions = records.filter((record) => !keys.has(`${record.date}:${record.exerciseId}:${record.variantLabel}`));
    if (additions.length === 0) return;
    set({ workoutPresentationHistory: [...existing, ...additions].slice(-200) });
    await persistState(get(), storage);
  },

  saveWorkoutMainOverride: async (override: WorkoutMainOverride) => {
    set({ workoutMainOverrides: { ...get().workoutMainOverrides, [override.sessionKey]: override } });
    await persistState(get(), storage);
  },

  evaluatePlanExpiration: () => {
    const { currentPlan, weighInHistory, userProfile } = get();
    if (!currentPlan || !userProfile || weighInHistory.length === 0 || currentPlan.status !== 'active') return;
    const latestWeight = weighInHistory[0].weightKg;
    const result = checkPlanExpiration(currentPlan, latestWeight, userProfile.startingWeightKg);
    if (result.isExpired) {
      set({ currentPlan: { ...currentPlan, status: 'expired', evaluationResult: result.evaluation } });
      persistState(get(), storage);
    }
  },

  resetAll: async () => {
      await storage.remove(STORAGE_KEY);
    set({
      userProfile: null, weighInHistory: [], hydrationHistory: {}, mealsHistory: {}, workoutHistory: {}, workoutPresentationHistory: [], workoutMainOverrides: {}, weeklyRoutine: null,
      currentPlan: null, petState: DEFAULT_PET, toastMessage: null, toastType: null,
    });
    get().showToast('🔄 Datos restablecidos correctamente', 'info');
  },
  }));
}

