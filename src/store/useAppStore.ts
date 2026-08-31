/**
 * useAppStore.ts — Refactorizado SOLID
 *
 * SRP: El store es solo orquestador. La lógica de dominio está en los servicios.
 * DIP: Depende de StorageAdapter (abstracción), no de AsyncStorage directamente.
 * ISP: Los componentes consumen via selectors.ts, no este store completo.
 */
import { create } from 'zustand';
import {
  UserProfile, WeeklyWeighIn, DailyHydration, GeneratedPlan, VirtualPetState,
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
import { StorageAdapter } from '../core/storage/StorageAdapter';
import { defaultStorageAdapter } from '../core/storage/AsyncStorageAdapter';

// Re-exportamos las constantes para compatibilidad con imports existentes
export { MAX_WATER_GLASSES, WATER_GOAL_GLASSES };

const STORAGE_KEY = '@dieta_fitness_state_v2';

interface AppState {
  isInitialized: boolean;
  userProfile: UserProfile | null;
  weighInHistory: WeeklyWeighIn[];
  hydrationHistory: Record<string, number>; // date "YYYY-MM-DD" -> glasses
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
  removeExerciseFromPlan: (exerciseId: string) => void;
  removeRecipeFromPlan: (recipeId: string, mealType: keyof GeneratedPlan['selectedMeals']) => void;
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
  storage: StorageAdapter = defaultStorageAdapter
): Promise<void> {
  try {
    const payload = {
      userProfile: state.userProfile,
      weighInHistory: state.weighInHistory,
      hydrationHistory: state.hydrationHistory,
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
export const useAppStore = create<AppState>((set, get) => ({
  isInitialized: false,
  userProfile: null,
  weighInHistory: [],
  hydrationHistory: {},
  currentPlan: null,
  petState: DEFAULT_PET,
  toastMessage: null,
  toastType: null,

  showToast: (message, type = 'info') => {
    set({ toastMessage: message, toastType: type });
    setTimeout(() => set({ toastMessage: null, toastType: null }), 3000);
  },

  clearToast: () => set({ toastMessage: null, toastType: null }),

  initialize: async () => {
    try {
      const stored = await defaultStorageAdapter.get(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        set({
          isInitialized: true,
          userProfile: parsed.userProfile || null,
          weighInHistory: parsed.weighInHistory || [],
          hydrationHistory: parsed.hydrationHistory || {},
          currentPlan: parsed.currentPlan || null,
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

      await persistState(get());
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
    await persistState(get());
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
    await persistState(get());
  },

  removeWaterGlass: async () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const current = getTodayGlasses(get().hydrationHistory, todayStr);
    if (current <= 0) return;
    set({ hydrationHistory: { ...get().hydrationHistory, [todayStr]: current - 1 } });
    await persistState(get());
  },

  activatePlan: async (plan: GeneratedPlan) => {
    const { showToast } = get();
    set({ currentPlan: { ...plan, status: 'active' } });
    await persistState(get());
    showToast('✅ Plan activado. ¡A darle con todo!', 'success');
  },

  removeExerciseFromPlan: (exerciseId: string) => {
    const { currentPlan } = get();
    if (!currentPlan) return;
    set({ currentPlan: { ...currentPlan, selectedExercises: currentPlan.selectedExercises.filter((e) => e.id !== exerciseId) } });
    persistState(get());
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
    persistState(get());
  },

  evaluatePlanExpiration: () => {
    const { currentPlan, weighInHistory, userProfile } = get();
    if (!currentPlan || !userProfile || weighInHistory.length === 0 || currentPlan.status !== 'active') return;
    const latestWeight = weighInHistory[0].weightKg;
    const result = checkPlanExpiration(currentPlan, latestWeight, userProfile.startingWeightKg);
    if (result.isExpired) {
      set({ currentPlan: { ...currentPlan, status: 'expired', evaluationResult: result.evaluation } });
      persistState(get());
    }
  },

  resetAll: async () => {
    await defaultStorageAdapter.remove(STORAGE_KEY);
    set({
      userProfile: null, weighInHistory: [], hydrationHistory: {},
      currentPlan: null, petState: DEFAULT_PET, toastMessage: null, toastType: null,
    });
    get().showToast('🔄 Datos restablecidos correctamente', 'info');
  },
}));
