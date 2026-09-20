import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PlannedExerciseItem, WorkoutSessionPhasePlan } from '../types';

interface Props {
  phase: WorkoutSessionPhasePlan;
  onSelectExercise: (exercise: PlannedExerciseItem) => void;
  onReplaceExercise?: (exerciseId: string) => void;
  onReplaceAll?: () => void;
}
const VARIANTS: Record<WorkoutSessionPhasePlan['id'], { color: string; icon: string }> = {
  warmup: { color: '#F97316', icon: '🔥' }, main: { color: '#10B981', icon: '💪' }, cooldown: { color: '#06B6D4', icon: '🧘' },
};

export const WorkoutPhaseSection: React.FC<Props> = ({ phase, onSelectExercise, onReplaceExercise, onReplaceAll }) => {
  const variant = VARIANTS[phase.id];
  return <View style={[styles.section, { borderColor: variant.color + '55' }]}>
    <View style={styles.header}><Text style={styles.icon}>{variant.icon}</Text><View style={styles.headerText}><Text style={styles.title}>{phase.title}</Text><Text style={[styles.minutes, { color: variant.color }]}>{phase.minutes} min</Text></View>{onReplaceAll && <TouchableOpacity accessibilityRole="button" accessibilityLabel="Cambiar todos los ejercicios principales" style={styles.replaceAll} onPress={onReplaceAll}><Text style={styles.replaceAllText}>🎲 Cambiar ejercicios</Text></TouchableOpacity>}</View>
    {phase.guidance.map((item) => <View key={item.id} style={styles.guidance}><Text style={styles.guidanceTitle}>{item.title}</Text><Text style={styles.guidanceText}>{item.instruction}</Text></View>)}
    {phase.exercises.map((exercise, index) => <View key={exercise.id} style={styles.exercise}><TouchableOpacity accessibilityRole="button" accessibilityLabel={`Ver ${exercise.name}`} style={styles.exerciseDetails} onPress={() => onSelectExercise(exercise)} activeOpacity={0.8}><Text style={[styles.order, { color: variant.color }]}>{index + 1}</Text><View style={styles.exerciseInfo}><Text style={styles.exerciseName}>{exercise.name}</Text><Text style={styles.meta}>{exercise.suggestedSets} series · {exercise.suggestedRepsOrSeconds}</Text>{exercise.executionVariant && <Text style={styles.variant}>{exercise.executionVariant.label}: {exercise.executionVariant.instruction}</Text>}</View><Text style={styles.chevron}>›</Text></TouchableOpacity>{onReplaceExercise && <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Cambiar ${exercise.name}`} style={styles.replaceOne} onPress={() => onReplaceExercise(exercise.id)}><Text style={styles.replaceOneText}>🔄 Cambiar</Text></TouchableOpacity>}</View>)}
  </View>;
};

const styles = StyleSheet.create({
  section: { backgroundColor: '#1E293B', borderRadius: 16, borderWidth: 1, marginBottom: 14, padding: 14 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 }, icon: { fontSize: 22, marginRight: 10 }, headerText: { flex: 1 },
  title: { color: '#F8FAFC', fontSize: 16, fontWeight: '700' }, minutes: { fontSize: 12, fontWeight: '700', marginTop: 2 },
  guidance: { backgroundColor: '#0F172A', borderRadius: 10, padding: 10, marginTop: 6 }, guidanceTitle: { color: '#CBD5E1', fontSize: 12, fontWeight: '700' }, guidanceText: { color: '#94A3B8', fontSize: 12, lineHeight: 17, marginTop: 3 },
  replaceAll: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 8, borderWidth: 1, borderColor: '#10B981', borderRadius: 8, backgroundColor: '#064E3B' }, replaceAllText: { color: '#A7F3D0', fontSize: 10, fontWeight: '700', textAlign: 'center' },
  exercise: { borderTopWidth: 1, borderTopColor: '#334155', marginTop: 8, paddingTop: 8 }, exerciseDetails: { minHeight: 48, flexDirection: 'row', alignItems: 'center' }, order: { width: 26, fontSize: 13, fontWeight: '800' }, exerciseInfo: { flex: 1 }, exerciseName: { color: '#F8FAFC', fontSize: 13, fontWeight: '700' }, meta: { color: '#94A3B8', fontSize: 11, marginTop: 2 }, variant: { color: '#A7F3D0', fontSize: 10, lineHeight: 14, marginTop: 3 }, chevron: { color: '#64748B', fontSize: 24, paddingHorizontal: 5 },
  replaceOne: { minHeight: 44, justifyContent: 'center', alignSelf: 'flex-start', marginLeft: 26, marginTop: 2, paddingHorizontal: 8, borderRadius: 8, borderWidth: 1, borderColor: '#10B981' }, replaceOneText: { color: '#34D399', fontSize: 11, fontWeight: '700' },
});
