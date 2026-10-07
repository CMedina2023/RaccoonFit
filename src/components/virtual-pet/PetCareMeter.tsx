import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { PetCareNeed } from '../../types';
import { PET_CARE_NEED_PRESENTATION } from './petCarePresentation';

interface PetCareMeterProps {
  need: PetCareNeed;
  value: number;
}

export function PetCareMeter({ need, value }: PetCareMeterProps) {
  const presentation = PET_CARE_NEED_PRESENTATION[need];
  const normalizedValue = Math.max(0, Math.min(100, value));

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={`${presentation.label} de Rocky`}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(normalizedValue) }}
      style={styles.container}
    >
      <View style={styles.labelRow}>
        <Text style={styles.icon}>{presentation.icon}</Text>
        <Text style={styles.label}>{presentation.label}</Text>
        <Text style={styles.value}>{Math.round(normalizedValue)}%</Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { backgroundColor: presentation.color, width: `${normalizedValue}%` },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexBasis: '45%',
    minWidth: 132,
    backgroundColor: '#09090B',
    borderColor: '#3F3320',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  labelRow: { flexDirection: 'row', alignItems: 'center' },
  icon: { color: '#FBBF24', fontSize: 13, width: 18 },
  label: { color: '#E4D3A8', fontSize: 12, fontWeight: '700', flex: 1 },
  value: { color: '#F8FAFC', fontSize: 12, fontVariant: ['tabular-nums'], fontWeight: '800' },
  track: { height: 7, marginTop: 7, backgroundColor: '#29251D', overflow: 'hidden' },
  fill: { height: '100%' },
});
