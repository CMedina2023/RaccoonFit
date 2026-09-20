import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { WorkoutProgressionRecommendation } from '../core/workoutProgressionService';

interface Props { recommendation: WorkoutProgressionRecommendation; streak: number; }

export const WorkoutProgressionHint: React.FC<Props> = ({ recommendation, streak }) => (
  <View style={styles.card} accessibilityLabel={`Progresión: ${recommendation.title}`}>
    <Text style={styles.title}>{recommendation.title}</Text>
    <Text style={styles.text}>{recommendation.instruction}</Text>
    <Text style={styles.meta}>Constancia previa: {streak} sesiones programadas.</Text>
  </View>
);

const styles = StyleSheet.create({
  card: { backgroundColor: '#1E3A5F', borderColor: '#2563EB55', borderWidth: 1, borderRadius: 12, padding: 12, marginBottom: 14 },
  title: { color: '#BFDBFE', fontSize: 14, fontWeight: '700' },
  text: { color: '#E2E8F0', fontSize: 13, lineHeight: 19, marginTop: 4 },
  meta: { color: '#93C5FD', fontSize: 11, marginTop: 8 },
});
