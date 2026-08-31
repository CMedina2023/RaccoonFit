/**
 * animationRegistry.ts — Open/Closed Principle (OCP)
 *
 * Registro extensible de animaciones de ejercicio.
 *
 * ✅ CORRECTO: Para agregar un nuevo ejercicio, solo se registra aquí.
 *    El player (ExerciseAnimationPlayer) NO necesita ser modificado.
 *
 * ❌ INCORRECTO (patrón anterior): agregar un `if/else` al render del player.
 */
import React from 'react';
import { ExerciseAnimationType } from '../ExerciseAnimationPlayer';
import { AnimationFrameProps } from './AnimationFrameProps';
import { CurlBicepsFrame } from './CurlBicepsFrame';
import { SquatGobletFrame } from './SquatGobletFrame';
import { BridgeGluteFrame } from './BridgeGluteFrame';
import { MonsterWalkFrame } from './MonsterWalkFrame';
import { ShoulderPressFrame } from './ShoulderPressFrame';
import { DefaultFrame } from './DefaultFrame';

/** Tipo del registro: mapea cada tipo de ejercicio a su componente frame. */
type AnimationRegistry = Partial<Record<ExerciseAnimationType, React.FC<AnimationFrameProps>>>;

/**
 * Registro central de animaciones.
 *
 * Para agregar una nueva animación:
 *   1. Crea `src/components/animations/NuevoEjercicioFrame.tsx`
 *   2. Importa y registra aquí: `nuevo_ejercicio: NuevoEjercicioFrame`
 *   ← Ningún otro archivo necesita cambiar.
 */
export const ANIMATION_REGISTRY: AnimationRegistry = {
  curl_biceps: CurlBicepsFrame,
  squat_goblet: SquatGobletFrame,
  bridge_glute: BridgeGluteFrame,
  monster_walk: MonsterWalkFrame,
  shoulder_press: ShoulderPressFrame,
  // ─── Registra aquí nuevos ejercicios ────────────────────────────────────
  // row_band:         RowBandFrame,
  // lateral_raise:    LateralRaiseFrame,
  // step_jack:        StepJackFrame,
  // pushup_incline:   PushupInclineFrame,
  // clamshell:        ClamshellFrame,
  // row_dumbbell:     RowDumbbellFrame,
  // kickback_glute:   KickbackGluteFrame,
  // deadlift_rdl:     DeadliftRdlFrame,
  // mountain_climber: MountainClimberFrame,
  // shadow_box:       ShadowBoxFrame,
};

/**
 * Resuelve el componente frame para el tipo dado.
 * Si no está registrado, retorna el DefaultFrame.
 */
export function resolveAnimationFrame(
  type: ExerciseAnimationType
): React.FC<AnimationFrameProps> {
  return ANIMATION_REGISTRY[type] ?? DefaultFrame;
}
