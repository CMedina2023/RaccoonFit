import React, { useRef, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { resolveAnimationFrame } from './animations/animationRegistry';

/**
 * ExerciseAnimationType — Tipos de animación disponibles.
 * Para agregar uno nuevo: crea el Frame y regístralo en animationRegistry.ts.
 */
export type ExerciseAnimationType =
  | 'curl_biceps'
  | 'squat_goblet'
  | 'bridge_glute'
  | 'row_band'
  | 'lateral_raise'
  | 'step_jack'
  | 'pushup_incline'
  | 'monster_walk'
  | 'shoulder_press'
  | 'clamshell'
  | 'row_dumbbell'
  | 'kickback_glute'
  | 'deadlift_rdl'
  | 'mountain_climber'
  | 'shadow_box';

interface Props {
  type: ExerciseAnimationType;
  muscleName: string;
  color?: string;
}

/**
 * ExerciseAnimationPlayer — SRP + OCP refactorizado
 *
 * SRP: Este componente solo gestiona el ciclo de animación (pausa, velocidad,
 *      fase) y renderiza el frame. No contiene ninguna animación SVG inline.
 *
 * OCP: Las animaciones concretas viven en animationRegistry.ts.
 *      Agregar un ejercicio nuevo NUNCA requiere modificar este archivo.
 *
 * Ciclo de 4 segundos en 3 fases:
 *   Fase 0 (0-33%): Posición inicial
 *   Fase 1 (33-66%): Esfuerzo / Contracción (músculo activo resaltado)
 *   Fase 2 (66-100%): Retorno controlado
 */
export const ExerciseAnimationPlayer: React.FC<Props> = ({
  type,
  muscleName,
  color = '#10B981',
}) => {
  const phaseAnim = useRef(new Animated.Value(0)).current;
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState<1 | 0.5>(1);

  useEffect(() => {
    let animLoop: Animated.CompositeAnimation;
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
      if (!isPaused) animLoop.start();
    };

    const listener = phaseAnim.addListener(({ value }) => {
      const p = (Math.floor(value) % 3) as 0 | 1 | 2;
      setPhase(p);
    });

    runLoop();
    return () => {
      phaseAnim.removeListener(listener);
      if (animLoop) animLoop.stop();
    };
  }, [isPaused, speed]);

  const phaseLabels = ['Posición Inicial', 'Esfuerzo · Exhalación', 'Retorno · Inhalación'];
  const phaseColors = ['#94A3B8', color, '#06B6D4'];

  // OCP: resolveAnimationFrame consulta el registry sin if/else
  const AnimationFrame = resolveAnimationFrame(type);

  return (
    <View style={styles.container}>
      {/* Canvas de animación SVG */}
      <View style={styles.svgWrapper}>
        <Svg width={200} height={200} viewBox="0 0 200 200">
          {/* OCP: el frame concreto se resuelve del registry */}
          <AnimationFrame phase={phase} color={color} />

          {/* Indicador de fase en el canvas */}
          <Circle
            cx="188"
            cy="18"
            r="8"
            fill={phase === 0 ? '#94A3B8' : phase === 1 ? color : '#06B6D4'}
          />
        </Svg>
      </View>

      {/* Indicador de fase */}
      <View
        style={[
          styles.phaseLabel,
          { backgroundColor: phase === 0 ? '#334155' : phase === 1 ? '#064E3B' : '#0C4A6E' },
        ]}
      >
        <Text style={[styles.phaseLabelText, { color: phaseColors[phase] }]}>
          {phaseLabels[phase]}
        </Text>
      </View>

      {/* Músculo objetivo */}
      <Text style={styles.muscleTarget}>🎯 Músculo activo: {muscleName}</Text>

      {/* Controles del player */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlBtn} onPress={() => setIsPaused((p) => !p)}>
          <Text style={styles.controlBtnText}>{isPaused ? '▶ Reanudar' : '⏸ Pausar'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlBtn, speed === 0.5 && styles.controlBtnActive]}
          onPress={() => setSpeed((s) => (s === 1 ? 0.5 : 1))}
        >
          <Text style={styles.controlBtnText}>{speed === 1 ? '🔍 Cámara Lenta' : '⚡ Normal'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 8 },
  svgWrapper: {
    width: 200, height: 200, backgroundColor: '#0F172A',
    borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#334155',
  },
  phaseLabel: {
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginTop: 10,
  },
  phaseLabelText: { fontSize: 12, fontWeight: '700' },
  muscleTarget: { color: '#94A3B8', fontSize: 11, marginTop: 6 },
  controls: { flexDirection: 'row', marginTop: 8 },
  controlBtn: {
    paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#1E293B',
    borderRadius: 10, marginHorizontal: 4, borderWidth: 1, borderColor: '#334155',
  },
  controlBtnActive: { borderColor: '#10B981' },
  controlBtnText: { color: '#94A3B8', fontSize: 11, fontWeight: '600' },
});
