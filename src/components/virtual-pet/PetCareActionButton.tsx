import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import type { PetCareAction } from '../../types';
import { PET_CARE_ACTION_PRESENTATION } from './petCarePresentation';

interface PetCareActionButtonProps {
  action: PetCareAction;
  onPress: (action: PetCareAction) => void;
}

export function PetCareActionButton({ action, onPress }: PetCareActionButtonProps) {
  const presentation = PET_CARE_ACTION_PRESENTATION[action];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${presentation.label} a Rocky`}
      onPress={() => onPress(action)}
      style={({ pressed }) => [
        styles.button,
        { borderColor: `${presentation.color}88` },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.icon, { color: presentation.color }]}>{presentation.icon}</Text>
      <Text style={styles.label}>{presentation.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 50,
    flexGrow: 1,
    flexBasis: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A0907',
    borderWidth: 1,
    paddingHorizontal: 9,
  },
  pressed: { backgroundColor: '#211B10', opacity: 0.86 },
  icon: { fontSize: 16, fontWeight: '900', marginRight: 7 },
  label: { color: '#F4E8C6', fontSize: 13, fontWeight: '800' },
});
