import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal,
} from 'react-native';
import { useAppStore } from '../store/useAppStore';
import { ExerciseAnimationPlayer } from '../components/ExerciseAnimationPlayer';
import { ExtendedExerciseItem } from '../core/exerciseCatalog';

const LEVEL_COLORS: Record<string, string> = {
  principiante: '#10B981',
  intermedio: '#F59E0B',
  avanzado: '#EF4444',
};

const CATEGORY_ICONS: Record<string, string> = {
  peso_corporal: '🏃',
  mancuernas: '🏋️',
  ligas: '🪢',
  bandas_pierna: '🦵',
  cardio: '💓',
};

export const ExercisesScreen: React.FC = () => {
  const { currentPlan, userProfile } = useAppStore();
  const [selectedExercise, setSelectedExercise] = useState<ExtendedExerciseItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  // Si no existe plan, mostrar pantalla de bienvenida instructiva
  if (!currentPlan || !userProfile) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>🏋️</Text>
        <Text style={styles.emptyTitle}>Aún no tienes un plan</Text>
        <Text style={styles.emptySubtitle}>
          Ve a la pestaña <Text style={styles.highlight}>Perfil y Metas</Text> para completar tus datos y generar tu plan personalizado.
          {'\n\n'}Los ejercicios se seleccionarán según tu nivel de actividad y tiempo disponible, sin mezclar niveles.
        </Text>
      </View>
    );
  }

  const exercises = (currentPlan.selectedExercises || []) as ExtendedExerciseItem[];

  const categories = Array.from(new Set(exercises.map((e) => e.category)));

  const filtered = filterCategory
    ? exercises.filter((e) => e.category === filterCategory)
    : exercises;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mi Rutina</Text>
        <Text style={styles.planInfo}>
          {currentPlan.title} · {exercises.length} ejercicios
        </Text>
      </View>

      {/* Filtro por categoría */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
        <TouchableOpacity
          style={[styles.filterChip, !filterCategory && styles.filterChipActive]}
          onPress={() => setFilterCategory(null)}
        >
          <Text style={[styles.filterChipText, !filterCategory && styles.filterChipTextActive]}>Todos</Text>
        </TouchableOpacity>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.filterChip, filterCategory === cat && styles.filterChipActive]}
            onPress={() => setFilterCategory(cat)}
          >
            <Text style={[styles.filterChipText, filterCategory === cat && styles.filterChipTextActive]}>
              {CATEGORY_ICONS[cat] || '⚡'} {cat.replace('_', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Lista de ejercicios */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {filtered.map((exercise, index) => (
          <TouchableOpacity
            key={exercise.id}
            style={styles.card}
            onPress={() => setSelectedExercise(exercise)}
            activeOpacity={0.85}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardOrder}>
                <Text style={styles.cardOrderText}>{index + 1}</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{exercise.name}</Text>
                <View style={styles.cardMeta}>
                  <Text style={styles.categoryTag}>{CATEGORY_ICONS[exercise.category]} {exercise.category.replace('_', ' ')}</Text>
                  <View style={[styles.levelBadge, { backgroundColor: LEVEL_COLORS[exercise.difficulty] + '25', borderColor: LEVEL_COLORS[exercise.difficulty] + '60' }]}>
                    <Text style={[styles.levelBadgeText, { color: LEVEL_COLORS[exercise.difficulty] }]}>
                      {exercise.difficulty}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={styles.chevron}>▶</Text>
            </View>

            <View style={styles.cardStats}>
              <StatPill icon="🔁" label={exercise.suggestedSets + ' series'} />
              <StatPill icon="⚡" label={exercise.suggestedRepsOrSeconds} />
              <StatPill icon="⏱️" label={exercise.restSeconds + 's descanso'} />
            </View>

            <Text style={styles.muscleTarget}>🎯 {exercise.targetMuscle}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal de Detalle + Animación */}
      <Modal visible={selectedExercise !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedExercise(null)}>
              <Text style={styles.closeBtnText}>✕ Cerrar</Text>
            </TouchableOpacity>

            {selectedExercise && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.modalTitle}>{selectedExercise.name}</Text>

                <View style={[styles.modalLevelBadge, { backgroundColor: LEVEL_COLORS[selectedExercise.difficulty] + '20' }]}>
                  <Text style={[styles.modalLevelText, { color: LEVEL_COLORS[selectedExercise.difficulty] }]}>
                    Nivel: {selectedExercise.difficulty} · {CATEGORY_ICONS[selectedExercise.category]} {selectedExercise.category.replace('_', ' ')}
                  </Text>
                </View>

                {/* Animación del ejercicio */}
                <ExerciseAnimationPlayer
                  type={selectedExercise.animationType}
                  muscleName={selectedExercise.targetMuscle}
                  color={LEVEL_COLORS[selectedExercise.difficulty]}
                />

                {/* Detalles del ejercicio */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>📋 Descripción</Text>
                  <Text style={styles.detailText}>{selectedExercise.description}</Text>
                </View>

                <View style={styles.statRow}>
                  <StatCard label="Series" value={String(selectedExercise.suggestedSets)} />
                  <StatCard label="Reps / Tiempo" value={selectedExercise.suggestedRepsOrSeconds} />
                  <StatCard label="Descanso" value={selectedExercise.restSeconds + 's'} />
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>💡 Consejos</Text>
                  {(selectedExercise.tips || []).map((tip, i) => (
                    <Text key={i} style={styles.tipText}>• {tip}</Text>
                  ))}
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>🛠️ Equipo</Text>
                  <Text style={styles.detailText}>{selectedExercise.requiresEquipment || 'Ninguno'}</Text>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const StatPill = ({ icon, label }: { icon: string; label: string }) => (
  <View style={pillStyles.pill}>
    <Text style={pillStyles.icon}>{icon}</Text>
    <Text style={pillStyles.label}>{label}</Text>
  </View>
);

const StatCard = ({ label, value }: { label: string; value: string }) => (
  <View style={statCardStyles.card}>
    <Text style={statCardStyles.value}>{value}</Text>
    <Text style={statCardStyles.label}>{label}</Text>
  </View>
);

const pillStyles = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1E293B', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, marginRight: 6 },
  icon: { fontSize: 11, marginRight: 3 },
  label: { color: '#94A3B8', fontSize: 10, fontWeight: '600' },
});

const statCardStyles = StyleSheet.create({
  card: { flex: 1, backgroundColor: '#1E293B', borderRadius: 10, padding: 10, alignItems: 'center', marginRight: 8, borderWidth: 1, borderColor: '#334155' },
  value: { color: '#10B981', fontSize: 14, fontWeight: '700' },
  label: { color: '#64748B', fontSize: 10, marginTop: 2 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  title: { fontSize: 24, fontWeight: '700', color: '#F8FAFC' },
  planInfo: { fontSize: 12, color: '#64748B', marginTop: 2 },
  filterBar: { paddingHorizontal: 12, marginBottom: 8, flexGrow: 0 },
  filterChip: { backgroundColor: '#1E293B', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginRight: 8, borderWidth: 1, borderColor: '#334155' },
  filterChipActive: { backgroundColor: '#10B981', borderColor: '#10B981' },
  filterChipText: { color: '#64748B', fontSize: 12, fontWeight: '600' },
  filterChipTextActive: { color: '#FFFFFF', fontWeight: '700' },
  list: { flex: 1, paddingHorizontal: 12 },
  card: { backgroundColor: '#1E293B', borderRadius: 16, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  cardOrder: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
  cardOrderText: { color: '#FFFFFF', fontWeight: '700', fontSize: 13 },
  cardInfo: { flex: 1 },
  cardName: { color: '#F8FAFC', fontSize: 14, fontWeight: '700' },
  cardMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  categoryTag: { color: '#64748B', fontSize: 10, marginRight: 6 },
  levelBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, borderWidth: 1 },
  levelBadgeText: { fontSize: 9, fontWeight: '700', textTransform: 'uppercase' },
  chevron: { color: '#475569', fontSize: 12 },
  cardStats: { flexDirection: 'row', marginBottom: 6 },
  muscleTarget: { color: '#64748B', fontSize: 10 },
  emptyContainer: { flex: 1, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { color: '#F8FAFC', fontSize: 22, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  emptySubtitle: { color: '#64748B', fontSize: 13, textAlign: 'center', lineHeight: 20 },
  highlight: { color: '#10B981', fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'flex-end' },
  modalCard: { backgroundColor: '#0F172A', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '92%', borderTopWidth: 1, borderColor: '#334155' },
  closeBtn: { alignSelf: 'flex-end', backgroundColor: '#1E293B', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginBottom: 12 },
  closeBtnText: { color: '#94A3B8', fontSize: 12 },
  modalTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: '700', marginBottom: 8 },
  modalLevelBadge: { borderRadius: 8, padding: 8, marginBottom: 14 },
  modalLevelText: { fontSize: 12, fontWeight: '600' },
  detailSection: { backgroundColor: '#1E293B', borderRadius: 12, padding: 12, marginBottom: 10 },
  detailSectionTitle: { color: '#94A3B8', fontSize: 11, fontWeight: '700', marginBottom: 6, textTransform: 'uppercase' },
  detailText: { color: '#CBD5E1', fontSize: 13, lineHeight: 19 },
  tipText: { color: '#94A3B8', fontSize: 12, lineHeight: 18 },
  statRow: { flexDirection: 'row', marginBottom: 10 },
});
