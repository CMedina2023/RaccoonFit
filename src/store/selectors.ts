/**
 * selectors.ts — Interface Segregation Principle (ISP)
 *
 * Cada hook de dominio expone ÚNICAMENTE lo que ese contexto necesita.
 * Los componentes deben importar estos hooks en lugar de consumir
 * `useAppStore` directamente con todo su estado.
 */

import { useAppStore } from './useAppStore';
import { useShallow } from 'zustand/shallow';

// ─────────────────────────────────────────────
// Hidratación
// ─────────────────────────────────────────────
export const useHydration = () =>
  useAppStore(useShallow((s) => ({
    hydrationHistory: s.hydrationHistory,
    addWaterGlass: s.addWaterGlass,
    removeWaterGlass: s.removeWaterGlass,
  })));

// ─────────────────────────────────────────────
// Mascota virtual
// ─────────────────────────────────────────────
export const usePetState = () =>
  useAppStore(useShallow((s) => ({
    petState: s.petState,
  })));

export const usePetCare = () =>
  useAppStore(useShallow((s) => ({
    petCareState: s.petCareState,
    petAnimationRequest: s.petAnimationRequest,
    performPetCareAction: s.performPetCareAction,
    refreshPetCare: s.refreshPetCare,
    clearPetAnimationRequest: s.clearPetAnimationRequest,
  })));

// ─────────────────────────────────────────────
// Plan activo y acciones de plan
// ─────────────────────────────────────────────
export const usePlanActions = () =>
  useAppStore(useShallow((s) => ({
    currentPlan: s.currentPlan,
    activatePlan: s.activatePlan,
    removeRecipeFromPlan: s.removeRecipeFromPlan,
    shuffleSingleMeal: s.shuffleSingleMeal,
    shuffleAllMeals: s.shuffleAllMeals,
    selectMealForDay: s.selectMealForDay,
    mealsHistory: s.mealsHistory,
    evaluatePlanExpiration: s.evaluatePlanExpiration,
  })));

export const useWorkoutProgress = () =>
  useAppStore(useShallow((s) => ({
    workoutHistory: s.workoutHistory,
    toggleWorkoutCompletion: s.toggleWorkoutCompletion,
  })));

export const useWorkoutPresentation = () =>
  useAppStore(useShallow((s) => ({ workoutPresentationHistory: s.workoutPresentationHistory, recordWorkoutPresentation: s.recordWorkoutPresentation })));

export const useWorkoutMainOverrides = () =>
  useAppStore(useShallow((s) => ({ workoutMainOverrides: s.workoutMainOverrides, saveWorkoutMainOverride: s.saveWorkoutMainOverride })));

export const useWeeklyRoutine = () =>
  useAppStore(useShallow((s) => ({
    weeklyRoutine: s.weeklyRoutine,
    saveWeeklyRoutine: s.saveWeeklyRoutine,
  })));

// ─────────────────────────────────────────────
// Pesaje / historial de peso
// ─────────────────────────────────────────────
export const useWeighIn = () =>
  useAppStore(useShallow((s) => ({
    weighInHistory: s.weighInHistory,
    addWeeklyWeighIn: s.addWeeklyWeighIn,
  })));

// ─────────────────────────────────────────────
// Perfil de usuario
// ─────────────────────────────────────────────
export const useUserProfile = () =>
  useAppStore(useShallow((s) => ({
    userProfile: s.userProfile,
    saveUserProfile: s.saveUserProfile,
  })));

// ─────────────────────────────────────────────
// Inicialización y ciclo de vida de la app
// ─────────────────────────────────────────────
export const useAppLifecycle = () =>
  useAppStore(useShallow((s) => ({
    isInitialized: s.isInitialized,
    initialize: s.initialize,
    resetAll: s.resetAll,
  })));

// ─────────────────────────────────────────────
// Feedback visual (toast)
// ─────────────────────────────────────────────
export const useToast = () =>
  useAppStore(useShallow((s) => ({
    toastMessage: s.toastMessage,
    toastType: s.toastType,
    showToast: s.showToast,
    clearToast: s.clearToast,
  })));
