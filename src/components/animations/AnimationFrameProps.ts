/**
 * AnimationFrameProps — contrato común de todos los frames de animación.
 *
 * Liskov Substitution Principle (LSP): cualquier frame concreto debe poder
 * usarse donde se espere este tipo sin alterar el comportamiento del player.
 */
export interface AnimationFrameProps {
  /** Fase actual: 0=inicial · 1=esfuerzo · 2=retorno */
  phase: 0 | 1 | 2;
  /** Color de acento para resaltar el músculo activo */
  color: string;
}
