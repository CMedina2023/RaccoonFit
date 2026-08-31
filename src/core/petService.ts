/**
 * petService.ts — Single Responsibility Principle (SRP)
 *
 * ÚNICA responsabilidad: calcular el nuevo estado de la mascota virtual
 * en función de eventos del dominio (pesaje, hidratación, etc.).
 *
 * Este servicio NO sabe nada de AsyncStorage, Zustand ni React.
 * Solo recibe el estado actual + datos del evento y retorna el nuevo estado.
 */
import { VirtualPetState, PetShape } from '../types';

// ─────────────────────────────────────────────
// Constantes de XP por acción
// ─────────────────────────────────────────────
export const XP_PER_WEIGH_IN = 100;
export const XP_PER_WATER_GLASS = 10;

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

/** Determina la shape de la mascota según kg perdidos. */
function computeShape(diffKg: number, currentShape: PetShape): PetShape {
  if (diffKg >= 5) return 'athletic';
  if (diffKg >= 3) return 'fit';
  if (diffKg >= 1) return 'balanced';
  return currentShape;
}

/** Mensaje motivacional según kg perdidos. */
function computeWeighInMessage(diffKg: number, currentMessage: string): string {
  if (diffKg >= 5)
    return `¡INCREÍBLE! Hemos bajado ${diffKg.toFixed(1)} kg. ¡Somos campeones!`;
  if (diffKg >= 3)
    return `¡Qué progreso! ${diffKg.toFixed(1)} kg menos. ¡Rocky está orgulloso de ti!`;
  if (diffKg >= 1)
    return `¡Avanzamos! ${diffKg.toFixed(1)} kg perdidos. ¡El hábito hace la magia!`;
  return currentMessage !== ''
    ? 'Pesaje registrado. La constancia semanal es lo que construye el cambio real.'
    : currentMessage;
}

// ─────────────────────────────────────────────
// API pública del servicio
// ─────────────────────────────────────────────

/**
 * Calcula el nuevo estado de mascota tras un pesaje semanal.
 *
 * @param pet         Estado actual de la mascota
 * @param startWeight Peso inicial del usuario (kg)
 * @param newWeight   Nuevo peso registrado (kg)
 */
export function computePetAfterWeighIn(
  pet: VirtualPetState,
  startWeight: number,
  newWeight: number
): VirtualPetState {
  const diffKg = startWeight - newWeight;
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
    shape: computeShape(diffKg, pet.shape),
    mood: 'celebrating',
    dialogMessage: computeWeighInMessage(diffKg, pet.dialogMessage),
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
