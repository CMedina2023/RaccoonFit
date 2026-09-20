import React, { useEffect, useState } from 'react';
import { ImageSourcePropType, View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { resolveAnimationFrame } from './animations/animationRegistry';
import { useExercisePhase } from '../hooks/useExercisePhase';
import { PlayerControls } from './animations/PlayerControls';
import { GifCanvasPlayer } from './animations/GifCanvasPlayer';
import { UnavailableExercisePreview } from './animations/UnavailableExercisePreview';
import { ExerciseAnimationType } from '../types';
import { MediaLoadCache } from '../core/exerciseMedia/MediaLoadCache';

/**
 * ExerciseAnimationType — Tipos de animación vectorial registrados.
 */
export type { ExerciseAnimationType } from '../types';

export interface ExercisePlayerProps {
  type?: ExerciseAnimationType;
  gifUrl?: string;
  mediaLoadCache: MediaLoadCache;
  muscleName: string;
  exerciseName?: string;
  hasExactLocalFallback?: boolean;
  localGifSource?: ImageSourcePropType;
  color?: string;
}

/**
 * ExerciseAnimationPlayer — Orquestador SRP + OCP
 *
 * SRP: Orquesta exclusivamente la composición del reproductor:
 *   - Lógica de fases biomecánicas delegada a `useExercisePhase`.
 *   - Renderizado del medio visual delegado a `GifCanvasPlayer` (congelamiento de frames en Canvas).
 *   - Controles de usuario delegados a `PlayerControls`.
 *
 * OCP: Cerrado para modificación. Soporta GIFs dinámicos y conmuta de forma automática
 *      al frame vectorial correspondiente de `ANIMATION_REGISTRY` si no existe GIF o hay error.
 */
export const ExerciseAnimationPlayer: React.FC<ExercisePlayerProps> = ({
  type = 'curl_biceps',
  gifUrl,
  mediaLoadCache,
  muscleName,
  exerciseName,
  hasExactLocalFallback = false,
  localGifSource,
  color = '#10B981',
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState<1 | 0.5>(1);
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    setHasImageError(false);
  }, [gifUrl]);

  // Hook SRP para gestión de ciclo biomecánico y tempo
  const { phase, phaseLabel, phaseColor, phaseBgColor } = useExercisePhase({
    isPaused,
    speed,
    color,
  });

  const canUseGif = (!!gifUrl && !hasImageError) || (!!localGifSource && hasImageError);
  const canUseExactLocalFallback = !canUseGif && hasExactLocalFallback;
  const hasPlayablePreview = canUseGif || canUseExactLocalFallback;
  const AnimationFrame = resolveAnimationFrame(type);

  return (
    <View style={styles.container}>
      {/* Contenedor visual del ejercicio (GIF con Canvas o Frame SVG) */}
      <View style={styles.visualWrapper}>
        {canUseGif ? (
          <GifCanvasPlayer
            gifUrl={gifUrl ?? ''}
            localSource={hasImageError ? localGifSource : undefined}
            mediaLoadCache={mediaLoadCache}
            isPaused={isPaused}
            speed={speed}
            color={color}
            onError={() => setHasImageError(true)}
          />
        ) : canUseExactLocalFallback ? (
          <Svg width={200} height={200} viewBox="0 0 200 200">
            <AnimationFrame phase={phase} color={color} />
            <Circle
              cx="188"
              cy="18"
              r="8"
              fill={phase === 0 ? '#94A3B8' : phase === 1 ? color : '#06B6D4'}
            />
          </Svg>
        ) : (
          <UnavailableExercisePreview exerciseName={exerciseName} />
        )}
      </View>

      {/* Indicador de tempo y respiración biomecánica */}
      {hasPlayablePreview && <View style={[styles.phaseLabel, { backgroundColor: phaseBgColor }]}>
        <Text style={[styles.phaseLabelText, { color: phaseColor }]}>{phaseLabel}</Text>
      </View>}

      {/* Músculo activo */}
      <Text style={styles.muscleTarget}>🎯 Músculo activo: {muscleName}</Text>

      {/* Controles de reproducción y velocidad técnica (ISP + SRP) */}
      {hasPlayablePreview && <PlayerControls
        isPaused={isPaused}
        speed={speed}
        onTogglePause={() => setIsPaused((p) => !p)}
        onToggleSpeed={() => setSpeed((s) => (s === 1 ? 0.5 : 1))}
      />}

      {canUseGif && (
        <Text style={styles.attribution}>Animación 3D por ExerciseDB · AscendAPI</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 8,
  },
  visualWrapper: {
    width: 220,
    height: 220,
    backgroundColor: '#0F172A',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseLabel: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
  },
  phaseLabelText: {
    fontSize: 12,
    fontWeight: '700',
  },
  muscleTarget: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 6,
  },
  attribution: {
    color: '#64748B',
    fontSize: 9,
    marginTop: 6,
    fontStyle: 'italic',
  },
});
