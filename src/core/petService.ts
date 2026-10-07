/**
 * petService.ts — Single Responsibility Principle (SRP)
 *
 * ÚNICA responsabilidad: calcular el nuevo estado de la mascota virtual
 * en función de eventos del dominio (pesaje, hidratación, etc.).
 *
 * Este servicio NO sabe nada de AsyncStorage, Zustand ni React.
 * Solo recibe el estado actual + datos del evento y retorna el nuevo estado.
 */
import { VirtualPetState } from '../types';
import type { PetCareHealthEventType } from '../types';
import { PET_CARE_HEALTH_EVENT_XP } from './petCareIntegration';

// ─────────────────────────────────────────────
// Constantes de XP por acción
// ─────────────────────────────────────────────
export const XP_PER_WEIGH_IN = 100;
export const XP_PER_WATER_GLASS = 10;

export function computePetAfterHealthEvent(
  pet: VirtualPetState,
  event: PetCareHealthEventType
): VirtualPetState {
  const { newLevel, newXp } = computeLevelUp(
    pet.currentXp,
    pet.xpToNextLevel,
    pet.level,
    PET_CARE_HEALTH_EVENT_XP[event]
  );
  const messages: Record<PetCareHealthEventType, string> = {
    water_glass: pet.dialogMessage,
    meals_complete: '¡Qué rico y qué bien! Completamos nuestras comidas de hoy.',
    workout_complete: '¡Rutina completada! Rocky celebra contigo.',
    weigh_in: pet.dialogMessage,
  };

  return {
    ...pet,
    level: newLevel,
    currentXp: newXp,
    mood: event === 'workout_complete' ? 'celebrating' : 'happy',
    dialogMessage: messages[event],
  };
}

// ─────────────────────────────────────────────
// Helpers internos
// ─────────────────────────────────────────────

/** Calcula el nuevo nivel y XP residual tras ganar XP. */
function computeLevelUp(
  currentXp: number,
  xpToNextLevel: number,
  currentLevel: number,
  xpGained: number
): { newLevel: number; newXp: number } {
  let newXp = currentXp + xpGained;
  let newLevel = currentLevel;
  if (newXp >= xpToNextLevel) {
    newLevel += 1;
    newXp -= xpToNextLevel;
  }
  return { newLevel, newXp };
}

// ─────────────────────────────────────────────
// API pública del servicio
// ─────────────────────────────────────────────

/**
 * Celebra el hábito del pesaje sin vincular el avatar ni el mensaje
 * al valor, tendencia o meta corporal registrada.
 */
export function computePetAfterWeighIn(pet: VirtualPetState): VirtualPetState {
  const { newLevel, newXp } = computeLevelUp(
    pet.currentXp,
    pet.xpToNextLevel,
    pet.level,
    XP_PER_WEIGH_IN
  );
  return {
    ...pet,
    level: newLevel,
    currentXp: newXp,
    mood: 'celebrating',
    dialogMessage: '¡Registro semanal guardado! Cuidarte también es parte del camino, paso a paso.',
  };
}

/**
 * Calcula el nuevo estado de mascota tras agregar un vaso de agua.
 *
 * @param pet           Estado actual de la mascota
 * @param updatedGlasses Número de vasos tras agregar el nuevo
 * @param goalGlasses   Meta de vasos del día
 */
export function computePetAfterWaterGlass(
  pet: VirtualPetState,
  updatedGlasses: number,
  goalGlasses: number
): VirtualPetState {
  const { newLevel, newXp } = computeLevelUp(
    pet.currentXp,
    pet.xpToNextLevel,
    pet.level,
    XP_PER_WATER_GLASS
  );

  let mood: VirtualPetState['mood'] = 'happy';
  let dialogMessage = `¡Glup glup! ${updatedGlasses} de ${goalGlasses} vasos. ¡Seguimos!`;

  if (updatedGlasses === goalGlasses) {
    mood = 'celebrating';
    dialogMessage = '🎉 ¡Meta de agua alcanzada! 2 litros hidratando nuestro cuerpo hoy.';
  } else if (updatedGlasses > goalGlasses) {
    dialogMessage = `💧 ${updatedGlasses} vasos. Buena hidratación extra, aunque con cuidado de no excederte.`;
  }

  return {
    ...pet,
    level: newLevel,
    currentXp: newXp,
    mood,
    dialogMessage,
  };
}

/**
 * Genera el estado inicial de mascota personalizado con el nombre del usuario.
 */
export function createInitialPet(
  defaultPet: VirtualPetState,
  userName: string
): VirtualPetState {
  return {
    ...defaultPet,
    dialogMessage: `¡Mucho gusto, ${userName}! Estoy listo para empezar contigo. 🦝`,
  };
}
