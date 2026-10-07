import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import type { ExtendedExerciseItem } from '../core/exerciseCatalog';
import type { ExerciseMediaProvider } from '../core/exerciseMedia/ExerciseMediaProvider';
import type { MediaLoadCache } from '../core/exerciseMedia/MediaLoadCache';
import { hasExactLocalFallback } from '../core/exerciseMedia/exerciseMediaContract';
import { getLocalExerciseGif } from '../core/exerciseMedia/localExerciseMedia';
import { ExerciseAnimationPlayer } from './ExerciseAnimationPlayer';

interface ExerciseDetailModalProps {
  exercise: ExtendedExerciseItem;
  mediaProvider: ExerciseMediaProvider;
  mediaLoadCache: MediaLoadCache;
  onClose: () => void;
}

const DIFFICULTY_COLORS: Record<ExtendedExerciseItem['difficulty'], string> = {
  principiante: '#10B981',
  intermedio: '#F59E0B',
  avanzado: '#EF4444',
};

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  mediaProvider,
  mediaLoadCache,
  onClose,
}) => {
  const difficultyColor = DIFFICULTY_COLORS[exercise.difficulty];

  return (
    <Modal visible transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Text style={styles.closeText}>✕ Cerrar</Text>
          </TouchableOpacity>
          <ScrollView>
            <Text style={styles.modalTitle}>{exercise.name}</Text>
            <Text style={[styles.level, { color: difficultyColor }]}>Nivel: {exercise.difficulty}</Text>
            <ExerciseAnimationPlayer
              type={exercise.animationType}
              gifUrl={mediaProvider.getOptionalGifUrl(exercise.exerciseDbId)}
              localGifSource={getLocalExerciseGif(exercise.exerciseDbId)}
              mediaLoadCache={mediaLoadCache}
              muscleName={exercise.targetMuscle}
              exerciseName={exercise.name}
              hasExactLocalFallback={hasExactLocalFallback(exercise.media)}
              color={difficultyColor}
            />
            <Info title="Descripción" value={exercise.description} />
            <Info
              title="Series y descanso"
              value={`${exercise.suggestedSets} series · ${exercise.suggestedRepsOrSeconds} · ${exercise.restSeconds}s descanso`}
            />
            <Info title="Consejos" value={exercise.tips.join('\n• ')} />
            <Info title="Equipo" value={exercise.requiresEquipment || 'Ninguno'} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const Info = ({ title, value }: { title: string; value: string }) => (
  <View style={styles.info}>
    <Text style={styles.infoTitle}>{title}</Text>
    <Text style={styles.infoText}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#000000', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '92%', borderTopWidth: 1, borderColor: '#26262B' },
  close: { alignSelf: 'flex-end', minHeight: 48, justifyContent: 'center', paddingHorizontal: 12 },
  closeText: { color: '#A1A1AA', fontSize: 12 },
  modalTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: '700' },
  level: { fontSize: 12, fontWeight: '700', marginTop: 6, marginBottom: 8, textTransform: 'capitalize' },
  info: { backgroundColor: '#121216', borderRadius: 12, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#26262B' },
  infoTitle: { color: '#F59E0B', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 5 },
  infoText: { color: '#D4D4D8', fontSize: 13, lineHeight: 19 },
});
