import { useRef, useEffect, useState } from 'react';
import { Animated } from 'react-native';

export interface UseExercisePhaseOptions {
  isPaused: boolean;
  speed: 1 | 0.5;
  color?: string;
}

export interface UseExercisePhaseReturn {
  phase: 0 | 1 | 2;
  phaseLabel: string;
  phaseColor: string;
  phaseBgColor: string;
  phaseAnim: Animated.Value;
}

const PHASE_LABELS = ['Posición Inicial', 'Esfuerzo · Exhalación', 'Retorno · Inhalación'] as const;

/**
 * useExercisePhase — SRP: Gestión del ciclo biomecánico y respiratorio
 *
 * Controla el ciclo de 3 fases (Posición inicial, Esfuerzo concéntrico y Retorno excéntrico)
 * ajustando la duración según la velocidad técnica seleccionada (4s normal, 8s cámara lenta).
 */
export function useExercisePhase({
  isPaused,
  speed,
  color = '#10B981',
}: UseExercisePhaseOptions): UseExercisePhaseReturn {
  const phaseAnim = useRef(new Animated.Value(0)).current;
  const [phase, setPhase] = useState<0 | 1 | 2>(0);

  const phaseColors = ['#94A3B8', color, '#06B6D4'];
  const phaseBgColors = ['#334155', '#064E3B', '#0C4A6E'];

  useEffect(() => {
    let animLoop: Animated.CompositeAnimation | null = null;
    const durationPerCycle = speed === 1 ? 4000 : 8000;

    const runLoop = () => {
      phaseAnim.setValue(0);
      animLoop = Animated.loop(
        Animated.timing(phaseAnim, {
          toValue: 3,
          duration: durationPerCycle,
          useNativeDriver: false,
        })
      );

      if (!isPaused) {
        animLoop.start();
      }
    };

    const listener = phaseAnim.addListener(({ value }) => {
      const p = (Math.floor(value) % 3) as 0 | 1 | 2;
      setPhase((prev) => (prev !== p ? p : prev));
    });

    runLoop();

    return () => {
      phaseAnim.removeListener(listener);
      if (animLoop) {
        animLoop.stop();
      }
    };
  }, [isPaused, speed]);

  return {
    phase,
    phaseLabel: PHASE_LABELS[phase],
    phaseColor: phaseColors[phase],
    phaseBgColor: phaseBgColors[phase],
    phaseAnim,
  };
}
