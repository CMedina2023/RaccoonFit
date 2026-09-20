import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { GeneratedPlan, RecipeItem, DailyMealsLog } from '../types';

interface Props {
  plan: GeneratedPlan | null;
  onActivatePlan: (plan: GeneratedPlan) => void;
  onRemoveRecipe: (id: string, mealType: keyof GeneratedPlan['selectedMeals']) => void;
  onShuffleMeal?: (mealType: keyof GeneratedPlan['selectedMeals'], currentRecipeId: string) => void;
  onShuffleAllMeals?: () => void;
  onRequestNewPlan: () => void;
  selectedMealsHistory?: Record<string, DailyMealsLog>;
  onSelectMealForDay?: (mealType: keyof GeneratedPlan['selectedMeals'], recipe: RecipeItem) => void;
}

export const PlanScreen: React.FC<Props> = ({
  plan,
  onActivatePlan,
  onRemoveRecipe,
  onShuffleMeal,
  onShuffleAllMeals,
  onRequestNewPlan,
  selectedMealsHistory,
  onSelectMealForDay,
}) => {
  const [selectedMealTab, setSelectedMealTab] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>(
    'breakfast'
  );

  const todayStr = new Date().toISOString().split('T')[0];
  const todayMeals = selectedMealsHistory?.[todayStr];

  if (!plan) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyTitle}>No tienes un plan activo</Text>
        <Text style={styles.emptyDesc}>
          Configura tus preferencias en tu perfil para que el sistema genere tu menú.
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
            Duración: {plan.durationWeeks} semanas • Meta: -{plan.targetLossKg} kg
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

      {/* SECCIÓN: DIETA (4 TIEMPOS) */}
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionHeaderCol}>
          <Text style={styles.sectionTitle}>Menú Diario Recomendado</Text>
          <Text style={styles.sectionHelper}>Ingredientes económicos y accesibles de mercado</Text>
        </View>
        {onShuffleAllMeals && (
          <TouchableOpacity
            style={styles.shuffleAllBtn}
            onPress={onShuffleAllMeals}
            activeOpacity={0.8}
          >
            <Text style={styles.shuffleAllBtnText}>🎲 Barajar Todo</Text>
          </TouchableOpacity>
        )}
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
      {plan.selectedMeals[selectedMealTab]?.length === 0 ? (
        <View style={styles.emptyMealCard}>
          <Text style={styles.emptyMealText}>No hay platillo seleccionado para este momento.</Text>
          {onShuffleMeal && (
            <TouchableOpacity
              style={styles.shuffleEmptyBtn}
              onPress={() => onShuffleMeal(selectedMealTab, '')}
            >
              <Text style={styles.shuffleEmptyBtnText}>✨ Sugerir Nuevo Platillo</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        plan.selectedMeals[selectedMealTab].map((recipe) => {
          const isSelectedForToday = todayMeals?.[selectedMealTab]?.id === recipe.id;

          return (
            <View
              key={recipe.id}
              style={[styles.itemCard, isSelectedForToday && styles.itemCardSelected]}
            >
              <View style={styles.itemTopRow}>
                <View style={styles.itemInfo}>
                  <View style={styles.titleBadgeRow}>
                    <Text style={styles.itemName}>{recipe.title}</Text>
                    {isSelectedForToday && (
                      <View style={styles.selectedBadge}>
                        <Text style={styles.selectedBadgeText}>ELEGIDO HOY</Text>
                      </View>
                    )}
                  </View>
                  <Text style={styles.itemBadgeCategory}>
                    ⏱️ {recipe.prepTimeMinutes} min • ~{recipe.approxCalories} kcal • {recipe.approxProteinGrams}g proteína
                  </Text>
                </View>
                <View style={styles.cardActionsRow}>
                  {onSelectMealForDay && (
                    <TouchableOpacity
                      onPress={() => onSelectMealForDay(selectedMealTab, recipe)}
                      style={[
                        styles.selectMealBtn,
                        isSelectedForToday && styles.selectMealBtnActive,
                      ]}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.selectMealBtnText,
                          isSelectedForToday && styles.selectMealBtnTextActive,
                        ]}
                      >
                        {isSelectedForToday ? '✅ Seleccionado' : '⚪ Elegir para Hoy'}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {onShuffleMeal && (
                    <TouchableOpacity
                      onPress={() => onShuffleMeal(selectedMealTab, recipe.id)}
                      style={styles.shuffleBtn}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.shuffleBtnText}>🔄 Cambiar</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => onRemoveRecipe(recipe.id, selectedMealTab)}
                    style={styles.removeBtn}
                  >
                    <Text style={styles.removeBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>

            <Text style={styles.ingredientsTitle}>Ingredientes accesibles:</Text>
            {recipe.ingredients.map((ing, i) => (
              <Text key={i} style={styles.ingredientText}>
                • {ing}
              </Text>
            ))}

            <Text style={[styles.ingredientsTitle, { marginTop: 10 }]}>Preparación sencilla:</Text>
            {recipe.instructions.map((step, s) => (
              <Text key={s} style={styles.ingredientText}>
                {s + 1}. {step}
              </Text>
            ))}
          </View>
        );
      })
      )}

      {/* Botón para recalcular / regenerar plan */}
      <TouchableOpacity style={styles.secondaryBtn} onPress={onRequestNewPlan}>
        <Text style={styles.secondaryBtnText}>⚙️ Reajustar Parámetros del Perfil</Text>
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
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionHeaderCol: {
    flex: 1,
    marginRight: 10,
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
  shuffleAllBtn: {
    backgroundColor: '#065F46',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  shuffleAllBtnText: {
    color: '#34D399',
    fontSize: 12,
    fontWeight: '700',
  },
  itemCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  itemCardSelected: {
    borderColor: '#10B981',
    borderWidth: 2,
    backgroundColor: '#132A2A',
  },
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  selectedBadge: {
    backgroundColor: '#065F46',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  selectedBadgeText: {
    color: '#34D399',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  selectMealBtn: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 6,
  },
  selectMealBtnActive: {
    backgroundColor: '#065F46',
    borderColor: '#10B981',
  },
  selectMealBtnText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  selectMealBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shuffleBtn: {
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginRight: 6,
  },
  shuffleBtnText: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyMealCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
  },
  emptyMealText: {
    color: '#94A3B8',
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  shuffleEmptyBtn: {
    backgroundColor: '#10B981',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  shuffleEmptyBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
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
