import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
  completed: boolean;
  onToggle: () => void;
}

/** Acción visual aislada para confirmar o deshacer la sesión programada de hoy. */
export const WorkoutCompletionAction: React.FC<Props> = ({ completed, onToggle }) => (
  <TouchableOpacity
    accessibilityRole="button"
    accessibilityLabel={completed ? 'Deshacer rutina completada' : 'Marcar rutina como completada'}
    style={[styles.button, completed && styles.completedButton]}
    onPress={onToggle}
  >
    <Text style={styles.text}>{completed ? '✓ Rutina completada · Deshacer' : '✓ Marcar rutina como completada'}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: { minHeight: 48, backgroundColor: '#059669', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 14, paddingHorizontal: 16 },
  completedButton: { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#10B981' },
  text: { color: '#F8FAFC', fontSize: 14, fontWeight: '700', textAlign: 'center' },
});
