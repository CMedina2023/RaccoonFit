import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export interface PlayerControlsProps {
  isPaused: boolean;
  speed: 1 | 0.5;
  onTogglePause: () => void;
  onToggleSpeed: () => void;
}

/**
 * PlayerControls — SRP + ISP
 *
 * Controles de reproducción para la animación del ejercicio:
 * - Alternancia de Pausa / Reanudar
 * - Alternancia de Velocidad Normal / Cámara Lenta (0.5x)
 */
export const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPaused,
  speed,
  onTogglePause,
  onToggleSpeed,
}) => {
  return (
    <View style={styles.controlsContainer}>
      <TouchableOpacity
        style={[styles.controlBtn, isPaused && styles.controlBtnPaused]}
        onPress={onTogglePause}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={isPaused ? 'Reanudar animación' : 'Pausar animación'}
      >
        <Text style={[styles.controlBtnText, isPaused && styles.controlBtnTextHighlight]}>
          {isPaused ? '▶ Reanudar' : '⏸ Pausar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.controlBtn, speed === 0.5 && styles.controlBtnActive]}
        onPress={onToggleSpeed}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={speed === 1 ? 'Activar cámara lenta' : 'Activar velocidad normal'}
      >
        <Text style={[styles.controlBtnText, speed === 0.5 && styles.controlBtnTextActive]}>
          {speed === 1 ? '🔍 Cámara Lenta' : '⚡ Normal'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  controlsContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  controlBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: '#1E293B',
    borderRadius: 10,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  controlBtnPaused: {
    borderColor: '#F59E0B',
    backgroundColor: '#451A03',
  },
  controlBtnActive: {
    borderColor: '#10B981',
    backgroundColor: '#064E3B',
  },
  controlBtnText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  controlBtnTextHighlight: {
    color: '#FBBF24',
  },
  controlBtnTextActive: {
    color: '#10B981',
  },
});
