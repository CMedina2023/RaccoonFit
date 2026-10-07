import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { PetCareAction, PetCareState, PetCareStatus } from '../types';
import { RockyHabitat } from './virtual-pet/RockyHabitat';
import type { RockyAnimationRequest } from './virtual-pet/RockyHabitat';
import { PetCareBubbles } from './virtual-pet/PetCareBubbles';
import { PET_CARE_ACTION_PRESENTATION, selectPetMoodAnimation } from './virtual-pet/petCarePresentation';

interface VirtualPetViewProps {
  name: string;
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  dialogMessage: string;
  careState: PetCareState;
  careStatus: PetCareStatus;
  lastCareAction: PetCareAction | null;
  animationRequest: RockyAnimationRequest | null;
  onCareAction: (action: PetCareAction) => void;
  onPress?: () => void;
}

export const VirtualPetView: React.FC<VirtualPetViewProps> = ({
  name,
  level,
  currentXp,
  xpToNextLevel,
  dialogMessage,
  careState,
  careStatus,
  lastCareAction,
  animationRequest,
  onCareAction,
  onPress,
}) => {
  const xpPercent = Math.min(100, Math.max(0, xpToNextLevel > 0 ? (currentXp / xpToNextLevel) * 100 : 0));
  const currentDialog = lastCareAction
    ? PET_CARE_ACTION_PRESENTATION[lastCareAction].feedback
    : dialogMessage;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelText}>Nv. {level}</Text>
        </View>
        <View style={styles.xpTrackWrapper}>
          <View style={styles.xpTrack}>
            <View style={[styles.xpFill, { width: `${xpPercent}%` }]} />
          </View>
        </View>
        <Text style={styles.xpText}>XP: {currentXp}/{xpToNextLevel}</Text>
      </View>

      <RockyHabitat
        name={name}
        onInteract={onPress}
        animationRequest={animationRequest}
        moodAnimation={selectPetMoodAnimation(careState)}
      />

      <View style={styles.speechBubble}>
        <Text style={styles.dialogText}>“{currentDialog}”</Text>
        <Text style={styles.hintText}>Toca una burbuja para cuidar a {name} ✨</Text>
      </View>

      <PetCareBubbles
        careState={careState}
        status={careStatus}
        onAction={onCareAction}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginHorizontal: 16, marginVertical: 8, alignItems: 'center' },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 10,
    backgroundColor: '#121216',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#26262B',
  },
  levelBadge: { backgroundColor: '#27272A', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: '#F59E0B55' },
  levelText: { color: '#F59E0B', fontWeight: '800', fontSize: 13 },
  xpTrackWrapper: { flex: 1 },
  xpTrack: { height: 6, backgroundColor: '#27272A', borderRadius: 3, overflow: 'hidden' },
  xpFill: { height: '100%', backgroundColor: '#F59E0B', borderRadius: 3 },
  xpText: { color: '#A1A1AA', fontSize: 12, fontWeight: '700' },
  speechBubble: { backgroundColor: '#121216', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 12, width: '100%', borderWidth: 1, borderColor: '#26262B', marginTop: 4 },
  dialogText: { color: '#F4F4F5', fontSize: 15, lineHeight: 22, fontWeight: '500' },
  hintText: { color: '#F59E0B', fontSize: 12, fontWeight: '600', marginTop: 6, textAlign: 'right' },
});
