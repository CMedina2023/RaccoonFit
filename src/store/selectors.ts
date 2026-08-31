/**
 * selectors.ts — Interface Segregation Principle (ISP)
 *
 * Cada hook de dominio expone ÚNICAMENTE lo que ese contexto necesita.
 * Los componentes deben importar estos hooks en lugar de consumir
 * `useAppStore` directamente con todo su estado.
 */

import { useAppStore } from './useAppStore';

// ─────────────────────────────────────────────
// Hidratación
// ─────────────────────────────────────────────
export const useHydration = () =>
  useAppStore((s) => ({
    hydrationHistory: s.hydrationHistory,
    addWaterGlass: s.addWaterGlass,
    removeWaterGlass: s.removeWaterGlass,
  }));

// ─────────────────────────────────────────────
// Mascota virtual
// ─────────────────────────────────────────────
export const usePetState = () =>
  useAppStore((s) => ({
    petState: s.petState,
  }));

// ─────────────────────────────────────────────
// Plan activo y acciones de plan
// ─────────────────────────────────────────────
export const usePlanActions = () =>
  useAppStore((s) => ({
    currentPlan: s.currentPlan,
    activatePlan: s.activatePlan,
    removeExerciseFromPlan: s.removeExerciseFromPlan,
    removeRecipeFromPlan: s.removeRecipeFromPlan,
    evaluatePlanExpiration: s.evaluatePlanExpiration,
  }));

// ─────────────────────────────────────────────
// Pesaje / historial de peso
// ─────────────────────────────────────────────
export const useWeighIn = () =>
  useAppStore((s) => ({
    weighInHistory: s.weighInHistory,
    addWeeklyWeighIn: s.addWeeklyWeighIn,
  }));

// ─────────────────────────────────────────────
// Perfil de usuario
// ─────────────────────────────────────────────
export const useUserProfile = () =>
  useAppStore((s) => ({
    userProfile: s.userProfile,
    saveUserProfile: s.saveUserProfile,
  }));

// ─────────────────────────────────────────────
// Inicialización y ciclo de vida de la app
// ─────────────────────────────────────────────
export const useAppLifecycle = () =>
  useAppStore((s) => ({
    isInitialized: s.isInitialized,
    initialize: s.initialize,
    resetAll: s.resetAll,
  }));

// ─────────────────────────────────────────────
// Feedback visual (toast)
// ─────────────────────────────────────────────
export const useToast = () =>
  useAppStore((s) => ({
    toastMessage: s.toastMessage,
    toastType: s.toastType,
    showToast: s.showToast,
    clearToast: s.clearToast,
  }));
