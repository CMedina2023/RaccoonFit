import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  exerciseName?: string;
}

/**
 * Safe visual state: never implies that a different movement is the selected exercise.
 */
export const UnavailableExercisePreview: React.FC<Props> = ({ exerciseName }) => (
  <View accessibilityRole="image" accessibilityLabel="Vista previa exacta no disponible" style={styles.container}>
    <Text style={styles.icon}>◎</Text>
    <Text style={styles.title}>Vista previa exacta no disponible</Text>
    <Text style={styles.copy}>
      {exerciseName ? `No mostraremos otro movimiento en lugar de ${exerciseName}.` : 'No mostraremos otro movimiento en su lugar.'}
    </Text>
    <Text style={styles.hint}>Revisa la descripción y los consejos antes de comenzar.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: 18 },
  icon: { color: '#FBBF24', fontSize: 38, lineHeight: 42 },
  title: { color: '#F8FAFC', fontSize: 14, fontWeight: '700', marginTop: 8, textAlign: 'center' },
  copy: { color: '#CBD5E1', fontSize: 12, lineHeight: 17, marginTop: 7, textAlign: 'center' },
  hint: { color: '#94A3B8', fontSize: 11, lineHeight: 16, marginTop: 9, textAlign: 'center' },
});
