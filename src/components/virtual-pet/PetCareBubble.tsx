import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { PetCareAction, PetCareNeed } from '../../types';
import { PET_CARE_NEED_PRESENTATION } from './petCarePresentation';

interface PetCareBubbleProps {
  need: PetCareNeed;
  value: number;
  onPress: (action: PetCareAction) => void;
}

export function PetCareBubble({ need, value, onPress }: PetCareBubbleProps) {
  const presentation = PET_CARE_NEED_PRESENTATION[need];
  const normalizedValue = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${presentation.label}, ${normalizedValue} por ciento, ${presentation.actionLabel}`}
      accessibilityHint="Activa este cuidado en un toque"
      onPress={() => onPress(presentation.action)}
      style={({ pressed }) => [styles.wrapper, pressed && styles.wrapperPressed]}
    >
      {({ pressed }) => (
        <>
          <View
            style={[
              styles.bubble,
              { borderColor: presentation.color },
              pressed && { backgroundColor: presentation.pressedColor },
            ]}
          >
            <Text style={[styles.icon, { color: presentation.color }]}>{presentation.icon}</Text>
            <Text style={styles.value}>{normalizedValue}%</Text>
          </View>
          <Text style={styles.label}>{presentation.label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    minWidth: 64,
    minHeight: 86,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  wrapperPressed: {
    transform: [{ scale: 0.96 }],
  },
  bubble: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    backgroundColor: '#171A22',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 4,
  },
  icon: {
    fontSize: 14,
    lineHeight: 16,
    fontWeight: '900',
  },
  value: {
    color: '#F8FAFC',
    fontSize: 14,
    lineHeight: 18,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  label: {
    color: '#D8DEE9',
    fontSize: 11,
    lineHeight: 15,
    fontWeight: '700',
    marginTop: 4,
  },
});
