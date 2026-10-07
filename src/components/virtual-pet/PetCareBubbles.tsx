import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { PetCareAction, PetCareNeed, PetCareState, PetCareStatus } from '../../types';
import { PetCareBubble } from './PetCareBubble';

interface PetCareBubblesProps {
  careState: PetCareState;
  status: PetCareStatus;
  onAction: (action: PetCareAction) => void;
}

const CARE_NEEDS: readonly PetCareNeed[] = ['hunger', 'happiness', 'energy', 'cleanliness'];

const STATUS_COPY: Record<PetCareStatus, string> = {
  content: 'Rocky está a gusto',
  needs_attention: 'Un cuidado le vendría bien',
  urgent: 'Rocky necesita un poco de atención',
};

export function PetCareBubbles({ careState, status, onAction }: PetCareBubblesProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headingRow}>
        <Text style={styles.heading}>CUIDADOS</Text>
        <Text style={styles.status}>{STATUS_COPY[status]}</Text>
      </View>
      <View style={styles.bubbles}>
        {CARE_NEEDS.map((need) => (
          <PetCareBubble
            key={need}
            need={need}
            value={careState[need]}
            onPress={onAction}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingTop: 9,
    paddingBottom: 7,
    backgroundColor: '#11151D',
    borderWidth: 1,
    borderColor: '#2A3445',
    borderRadius: 16,
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  heading: {
    color: '#FBBF24',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.1,
  },
  status: {
    color: '#AEB8C7',
    fontSize: 11,
    fontWeight: '600',
  },
  bubbles: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'center',
    columnGap: 12,
    rowGap: 4,
  },
});
