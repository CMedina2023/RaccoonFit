import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle, Path, Ellipse, Rect } from 'react-native-svg';
import { VirtualPetState } from '../types';

interface Props {
  pet: VirtualPetState;
  onPress?: () => void;
}

export const VirtualPetView: React.FC<Props> = ({ pet, onPress }) => {
  // Ajuste dinámico de silueta según forma física
  const bodyRadiusX = pet.shape === 'chubby' ? 56 : pet.shape === 'balanced' ? 46 : 38;
  const bodyRadiusY = pet.shape === 'chubby' ? 52 : pet.shape === 'balanced' ? 44 : 36;
  const bellyWidth = pet.shape === 'chubby' ? 40 : pet.shape === 'balanced' ? 30 : 22;

  return (
    <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={styles.container}>
      <View style={styles.petCard}>
        {/* Nivel y barra de XP */}
        <View style={styles.headerRow}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Nv. {pet.level}</Text>
          </View>
          <View style={styles.xpContainer}>
            <Text style={styles.xpText}>
              XP: {pet.currentXp}/{pet.xpToNextLevel}
            </Text>
            <View style={styles.xpBarTrack}>
              <View
                style={[
                  styles.xpBarFill,
                  { width: `${Math.min(100, (pet.currentXp / pet.xpToNextLevel) * 100)}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Renderizado vectorial SVG del Mapache Fitness */}
        <View style={styles.avatarContainer}>
          <Svg width={180} height={160} viewBox="0 0 200 180">
            {/* Cola rayada del mapache */}
            <Path
              d="M 140 120 C 180 110, 190 70, 160 50 C 145 40, 130 65, 135 90 Z"
              fill="#64748B"
            />
            <Path d="M 155 70 Q 165 75 160 85" stroke="#1E293B" strokeWidth="6" />
            <Path d="M 145 95 Q 155 100 148 110" stroke="#1E293B" strokeWidth="6" />

            {/* Orejas */}
            <Circle cx="70" cy="50" r="16" fill="#475569" />
            <Circle cx="70" cy="50" r="8" fill="#F1F5F9" />
            <Circle cx="130" cy="50" r="16" fill="#475569" />
            <Circle cx="130" cy="50" r="8" fill="#F1F5F9" />

            {/* Patas traseras */}
            <Ellipse cx="70" cy="140" rx="18" ry="12" fill="#334155" />
            <Ellipse cx="130" cy="140" rx="18" ry="12" fill="#334155" />

            {/* Cuerpo adaptable (Gordito / Equilibrado / Fit) */}
            <Ellipse cx="100" cy="115" rx={bodyRadiusX} ry={bodyRadiusY} fill="#64748B" />
            <Ellipse cx="100" cy="120" rx={bellyWidth} ry={bodyRadiusY - 14} fill="#E2E8F0" />

            {/* Cabeza */}
            <Circle cx="100" cy="75" r="42" fill="#64748B" />

            {/* Antifaz característico de mapache */}
            <Ellipse cx="80" cy="73" rx="16" ry="11" fill="#1E293B" />
            <Ellipse cx="120" cy="73" rx="16" ry="11" fill="#1E293B" />

            {/* Ojos y brillos */}
            <Circle cx="80" cy="73" r="5" fill="#FFFFFF" />
            <Circle cx="81" cy="72" r="2.5" fill="#0F172A" />
            <Circle cx="120" cy="73" r="5" fill="#FFFFFF" />
            <Circle cx="121" cy="72" r="2.5" fill="#0F172A" />

            {/* Hocico y nariz */}
            <Ellipse cx="100" cy="85" rx="12" ry="8" fill="#F8FAFC" />
            <Ellipse cx="100" cy="82" rx="4.5" ry="3" fill="#0F172A" />
            {/* Sonrisa */}
            <Path d="M 96 87 Q 100 91 104 87" stroke="#0F172A" strokeWidth="2" fill="none" />

            {/* Cinta deportiva en la frente (Accesorio desbloqueado) */}
            <Rect x="65" y="45" width="70" height="10" rx="5" fill="#10B981" />
            <Circle cx="100" cy="50" r="4" fill="#F59E0B" />

            {/* Brazos / Patas delanteras */}
            <Ellipse cx="65" cy="105" rx="10" ry="14" fill="#475569" />
            <Ellipse cx="135" cy="105" rx="10" ry="14" fill="#475569" />
          </Svg>
        </View>

        {/* Diálogo empático del Mapache */}
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
    marginVertical: 12,
  },
  petCard: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  levelBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  xpContainer: {
    flex: 1,
    marginLeft: 16,
  },
  xpText: {
    color: '#94A3B8',
    fontSize: 11,
    textAlign: 'right',
    marginBottom: 4,
  },
  xpBarTrack: {
    height: 8,
    backgroundColor: '#334155',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 4,
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  speechBubble: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    marginTop: 8,
  },
  dialogText: {
    color: '#F8FAFC',
    fontSize: 13,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  hintText: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
});
