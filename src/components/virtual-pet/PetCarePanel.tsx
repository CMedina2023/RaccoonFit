import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { PetCareAction, PetCareState, PetCareStatus } from '../../types';
import { PetCareActionButton } from './PetCareActionButton';
import { PetCareMeter } from './PetCareMeter';

interface PetCarePanelProps {
  careState: PetCareState;
  status: PetCareStatus;
  expanded: boolean;
  onToggle: () => void;
  onAction: (action: PetCareAction) => void;
}

const CARE_NEEDS = ['hunger', 'happiness', 'energy', 'cleanliness'] as const;
const CARE_ACTIONS = ['feed', 'play', 'sleep', 'clean'] as const;
const STATUS_COPY: Record<PetCareStatus, string> = {
  content: 'Rocky está a gusto. ¡Pueden seguir juntos!',
  needs_attention: 'Rocky pide un poco de cuidado. Elige qué hacer.',
  urgent: 'Rocky necesita atención. Cuidarlo ahora le ayudará a sentirse mejor.',
};

export function PetCarePanel({ careState, status, expanded, onToggle, onAction }: PetCarePanelProps) {
  return (
    <View style={styles.panel}>
      <View style={styles.titleRow}>
        <View style={styles.titleColumn}>
          <Text style={styles.title}>CUIDADOS</Text>
          <Text style={styles.status}>{STATUS_COPY[status]}</Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={expanded ? 'Cerrar acciones de cuidado' : 'Mostrar acciones de cuidado'}
          accessibilityState={{ expanded }}
          onPress={onToggle}
          style={({ pressed }) => [styles.toggle, pressed && styles.pressed]}
        >
          <Text style={styles.toggleText}>{expanded ? 'Cerrar' : 'Cuidar'}</Text>
        </Pressable>
      </View>

      <View style={styles.meterGrid}>
        {CARE_NEEDS.map((need) => (
          <PetCareMeter key={need} need={need} value={careState[need]} />
        ))}
      </View>

      {expanded && (
        <View style={styles.actionGrid}>
          {CARE_ACTIONS.map((action) => (
            <PetCareActionButton key={action} action={action} onPress={onAction} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    width: '100%',
    backgroundColor: '#12100C',
    borderColor: '#4B3B1C',
    borderWidth: 1,
    padding: 12,
    marginTop: 7,
  },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  titleColumn: { flex: 1, paddingRight: 8 },
  title: { color: '#FBBF24', fontSize: 11, fontWeight: '900', letterSpacing: 1.1 },
  status: { color: '#C9C4B5', fontSize: 12, lineHeight: 16, marginTop: 3 },
  toggle: { minWidth: 66, minHeight: 48, alignItems: 'center', justifyContent: 'center', backgroundColor: '#36260D', borderColor: '#B7791F', borderWidth: 1, paddingHorizontal: 10 },
  toggleText: { color: '#FCD34D', fontSize: 12, fontWeight: '900' },
  pressed: { opacity: 0.8 },
  meterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 7 },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 9 },
});
