/**
 * hydrationService.ts — Single Responsibility Principle (SRP)
 *
 * ÚNICA responsabilidad: lógica de dominio de hidratación diaria.
 *
 * Calcula límites, mensajes y validaciones relacionados con el consumo
 * de agua. NO sabe nada de AsyncStorage, Zustand ni React.
 */

// ─────────────────────────────────────────────
// Constantes de dominio
// ─────────────────────────────────────────────

/** Límite fisiológico seguro: 12 vasos = 3.0 Litros */
export const MAX_WATER_GLASSES = 12;

/** Meta diaria recomendada: 8 vasos = 2.0 Litros */
export const WATER_GOAL_GLASSES = 8;

// ─────────────────────────────────────────────
// API pública del servicio
// ─────────────────────────────────────────────

/**
 * Valida si se puede agregar un vaso más.
 * Retorna `true` si el límite seguro ya fue alcanzado.
 */
export function isHydrationLimitReached(currentGlasses: number): boolean {
  return currentGlasses >= MAX_WATER_GLASSES;
}

/**
 * Mensaje de advertencia cuando se alcanza el límite diario.
 */
export function getHydrationLimitMessage(): string {
  return `💧 Límite seguro alcanzado (${MAX_WATER_GLASSES} vasos = 3L). No excedas para cuidar tus electrolitos.`;
}

/**
 * Retorna el número de vasos del día actual desde el historial.
 * Aísla la lógica de extracción de fecha para no repetirla en el store.
 *
 * @param hydrationHistory Mapa de fecha → vasos
 * @param todayStr         Fecha en formato "YYYY-MM-DD"
 */
export function getTodayGlasses(
  hydrationHistory: Record<string, number>,
  todayStr: string
): number {
  return hydrationHistory[todayStr] ?? 0;
}
