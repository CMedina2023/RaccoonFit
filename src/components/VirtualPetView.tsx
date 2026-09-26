import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { VirtualPetState } from '../types';

interface Props {
  pet: VirtualPetState;
  onPress?: () => void;
}

const ROCKY_IMAGE = require('../../assets/rocky_raccoon_gold.png');

export const VirtualPetView: React.FC<Props> = ({ pet, onPress }) => {
  const xpPercent = Math.min(100, Math.max(0, (pet.currentXp / pet.xpToNextLevel) * 100));

  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={`Mascota virtual ${pet.name}, Nivel ${pet.level}. Toca para interactuar.`}
      activeOpacity={0.88}
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.petCard}>
        {/* Nivel y barra superior de XP minimalista */}
        <View style={styles.headerRow}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Nv. {pet.level}</Text>
          </View>
          <View style={styles.xpTrackWrapper}>
            <View style={styles.xpTrack}>
              <View style={[styles.xpFill, { width: `${xpPercent}%` }]} />
            </View>
          </View>
          <Text style={styles.xpText}>
            XP: {pet.currentXp}/{pet.xpToNextLevel}
          </Text>
        </View>

        {/* Avatar fotorrealista 3D con Aura Dorada Brillante */}
        <View style={styles.avatarContainer}>
          <Image
            source={ROCKY_IMAGE}
            style={styles.avatarImage}
            resizeMode="contain"
            accessibilityLabel={`Avatar de ${pet.name} saludando con aura dorada`}
          />
        </View>

        {/* Burbuja de diálogo empático de Rocky */}
        <View style={styles.speechBubble}>
          <Text style={styles.dialogText}>"{pet.dialogMessage}"</Text>
          <Text style={styles.hintText}>Toca a {pet.name} para interactuar ✨</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  petCard: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    width: '100%',
  },
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
  levelBadge: {
    backgroundColor: '#27272A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F59E0B55',
  },
  levelText: {
    color: '#F59E0B',
    fontWeight: '800',
    fontSize: 13,
  },
  xpTrackWrapper: {
    flex: 1,
  },
  xpTrack: {
    height: 6,
    backgroundColor: '#27272A',
    borderRadius: 3,
    overflow: 'hidden',
  },
  xpFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 3,
  },
  xpText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '700',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 220,
    marginVertical: 4,
  },
  avatarImage: {
    width: 220,
    height: 220,
  },
  speechBubble: {
    backgroundColor: '#121216',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: '#26262B',
    marginTop: 4,
  },
  dialogText: {
    color: '#F4F4F5',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  hintText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'right',
  },
});
