import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { GeneratedPlan, ExerciseItem, RecipeItem } from '../types';

interface Props {
  plan: GeneratedPlan | null;
  onActivatePlan: (plan: GeneratedPlan) => void;
  onRemoveExercise: (id: string) => void;
  onRemoveRecipe: (id: string, mealType: keyof GeneratedPlan['selectedMeals']) => void;
  onRequestNewPlan: () => void;
}

export const PlanScreen: React.FC<Props> = ({
  plan,
  onActivatePlan,
  onRemoveExercise,
  onRemoveRecipe,
  onRequestNewPlan,
}) => {
  const [selectedMealTab, setSelectedMealTab] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>(
    'breakfast'
  );

  if (!plan) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyTitle}>No tienes un plan activo</Text>
        <Text style={styles.emptyDesc}>
          Configura tus datos de tiempo y nivel en tu perfil para que el sistema genere tu plan flexible.
        </Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={onRequestNewPlan}>
          <Text style={styles.primaryBtnText}>Generar Plan Automático</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isExpired = plan.status === 'expired';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Banner de Estado del Plan */}
      <View style={[styles.statusBanner, isExpired && styles.statusBannerExpired]}>
        <View style={styles.statusBannerTextCol}>
          <Text style={styles.planTitle}>{plan.title}</Text>
          <Text style={styles.planMeta}>
            Duración: {plan.durationWeeks} semanas • {plan.routineDurationMinutes} min/día • Meta: -{plan.targetLossKg} kg
          </Text>
          <Text style={styles.planDates}>
            Del {plan.startDate} al {plan.endDate}
          </Text>
        </View>
        <View style={[styles.badge, isExpired ? styles.badgeExpired : styles.badgeActive]}>
          <Text style={styles.badgeText}>
            {isExpired ? 'CICLO EXPIRADO' : 'PLAN ACTIVO'}
          </Text>
        </View>
      </View>

      {/* Alerta de Expiración y Evaluación Automática */}
      {isExpired && plan.evaluationResult && (
        <View style={styles.evaluationCard}>
          <Text style={styles.evalTitle}>🏁 Evaluación del Ciclo Completado</Text>
          <Text style={styles.evalDesc}>{plan.evaluationResult.recommendation}</Text>
          <View style={styles.evalStatsRow}>
            <Text style={styles.evalStat}>Inicio: {plan.evaluationResult.startWeightKg} kg</Text>
            <Text style={styles.evalStat}>Fin: {plan.evaluationResult.finalWeightKg} kg</Text>
            <Text style={[styles.evalStat, { color: '#10B981', fontWeight: '700' }]}>
              Diferencia: -{plan.evaluationResult.lostKg} kg
            </Text>
          </View>
          <TouchableOpacity style={styles.renewBtn} onPress={onRequestNewPlan}>
            <Text style={styles.renewBtnText}>Generar Nuevo Plan Adaptado</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* SECCIÓN: RUTINAS DE EJERCICIO (FLEXIBLE) */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Rutina Propuesta ({plan.selectedExercises.length} ejercicios)</Text>
        <Text style={styles.sectionHelper}>Puedes descartar ejercicios que no te gusten</Text>
      </View>

      {plan.selectedExercises.map((exercise) => (
        <View key={exercise.id} style={styles.itemCard}>
          <View style={styles.itemTopRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{exercise.name}</Text>
              <Text style={styles.itemBadgeCategory}>
                {exercise.category.toUpperCase()} • {exercise.suggestedSets} series x {exercise.suggestedRepsOrSeconds}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => onRemoveExercise(exercise.id)}
              style={styles.removeBtn}
            >
              <Text style={styles.removeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.itemDesc}>{exercise.description}</Text>
          <Text style={styles.itemEquip}>Equipamiento: {exercise.requiresEquipment}</Text>
        </View>
      ))}

      {/* SECCIÓN: PLAN DE ALIMENTACIÓN (4 TIEMPOS) */}
      <View style={[styles.sectionHeader, { marginTop: 24 }]}>
        <Text style={styles.sectionTitle}>Menú Diario Recomendado</Text>
        <Text style={styles.sectionHelper}>Ingredientes económicos y accesibles de mercado</Text>
      </View>

      {/* Pestañas de 4 momentos */}
      <View style={styles.mealTabsRow}>
        {(['breakfast', 'lunch', 'dinner', 'snack'] as const).map((type) => {
          const labels = {
            breakfast: '🌅 Desayuno',
            lunch: '☀️ Comida',
            dinner: '🌙 Cena',
            snack: '🍎 Snacks',
          };
          return (
            <TouchableOpacity
              key={type}
              style={[styles.mealTab, selectedMealTab === type && styles.mealTabActive]}
              onPress={() => setSelectedMealTab(type)}
            >
              <Text
                style={[styles.mealTabText, selectedMealTab === type && styles.mealTabTextActive]}
              >
                {labels[type]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Recetas del momento seleccionado */}
      {plan.selectedMeals[selectedMealTab].map((recipe) => (
        <View key={recipe.id} style={styles.itemCard}>
          <View style={styles.itemTopRow}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{recipe.title}</Text>
              <Text style={styles.itemBadgeCategory}>
                ⏱️ {recipe.prepTimeMinutes} min • ~{recipe.approxCalories} kcal • {recipe.approxProteinGrams}g proteína
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => onRemoveRecipe(recipe.id, selectedMealTab)}
              style={styles.removeBtn}
            >
              <Text style={styles.removeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.ingredientsTitle}>Ingredientes accesibles:</Text>
          {recipe.ingredients.map((ing, i) => (
            <Text key={i} style={styles.ingredientText}>
              • {ing}
            </Text>
          ))}
        </View>
      ))}

      {/* Botón para recalcular / regenerar plan */}
      <TouchableOpacity style={styles.secondaryBtn} onPress={onRequestNewPlan}>
        <Text style={styles.secondaryBtnText}>🔄 Reajustar o Cambiar Parámetros del Plan</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#0F172A',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  statusBanner: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  statusBannerExpired: {
    borderColor: '#EF4444',
  },
  statusBannerTextCol: {
    flex: 1,
    marginRight: 10,
  },
  planTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  planMeta: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  planDates: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeActive: {
    backgroundColor: '#065F46',
  },
  badgeExpired: {
    backgroundColor: '#7F1D1D',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  evaluationCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F59E0B',
    marginBottom: 20,
  },
  evalTitle: {
    color: '#F59E0B',
    fontSize: 15,
    fontWeight: '700',
  },
  evalDesc: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 6,
  },
  evalStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
  },
  evalStat: {
    color: '#94A3B8',
    fontSize: 11,
  },
  renewBtn: {
    backgroundColor: '#F59E0B',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
  },
  renewBtnText: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 13,
  },
  sectionHeader: {
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  sectionHelper: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  itemCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemInfo: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  itemBadgeCategory: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  removeBtn: {
    backgroundColor: '#334155',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },
  itemDesc: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 16,
    marginTop: 6,
  },
  itemEquip: {
    color: '#64748B',
    fontSize: 11,
    marginTop: 4,
    fontStyle: 'italic',
  },
  mealTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 10,
    padding: 4,
    marginBottom: 12,
  },
  mealTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  mealTabActive: {
    backgroundColor: '#10B981',
  },
  mealTabText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '600',
  },
  mealTabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  ingredientsTitle: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },
  ingredientText: {
    color: '#94A3B8',
    fontSize: 11,
    marginLeft: 4,
    marginTop: 2,
  },
  primaryBtn: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  secondaryBtn: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#475569',
    marginTop: 16,
  },
  secondaryBtnText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
});
