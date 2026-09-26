import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { GeneratedPlan, RecipeItem, DailyMealsLog, DietaryPreference } from '../types';
import { getWeekDaysForDate, getRotatedMealsForDay, DayMealPlan } from '../core/weeklyMealPlanner';
import { getRandomMealExcluding, getRecentMealIds, generateDailyMealSuggestion } from '../core/mealService';
import { MealDaySelector } from '../components/MealDaySelector';
import { MealRecipeCard } from '../components/MealRecipeCard';

export interface PlanScreenProps {
  plan: GeneratedPlan | null;
  onActivatePlan: (plan: GeneratedPlan) => void;
  onRemoveRecipe: (id: string, mealType: keyof GeneratedPlan['selectedMeals']) => void;
  onShuffleMeal?: (mealType: keyof GeneratedPlan['selectedMeals'], currentRecipeId: string) => void;
  onShuffleAllMeals?: () => void;
  onRequestNewPlan: () => void;
  selectedMealsHistory?: Record<string, DailyMealsLog>;
  onSelectMealForDay?: (date: string, mealType: keyof GeneratedPlan['selectedMeals'], recipe: RecipeItem) => void;
  dietaryPreference?: DietaryPreference;
}

export const PlanScreen: React.FC<PlanScreenProps> = ({
  plan,
  onRemoveRecipe,
  onShuffleMeal,
  onShuffleAllMeals,
  onRequestNewPlan,
  selectedMealsHistory = {},
  onSelectMealForDay,
  dietaryPreference,
}) => {
  const [selectedMealTab, setSelectedMealTab] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>(
    'breakfast'
  );

  // Semanario: cálculo de los 7 días (Lunes a Domingo)
  const today = useMemo(() => new Date(), []);
  const weekDays = useMemo(() => getWeekDaysForDate(today, selectedMealsHistory), [today, selectedMealsHistory]);

  const defaultDayIndex = useMemo(() => {
    const idx = weekDays.findIndex((d) => d.isToday);
    return idx >= 0 ? idx : 0;
  }, [weekDays]);

  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(defaultDayIndex);
  const activeDay = weekDays[selectedDayIndex] || weekDays[0];

  // Estado local para permitir personalización / barajado específico por día
  const [dayCustomPlans, setDayCustomPlans] = useState<Record<string, DayMealPlan>>({});

  // Menú determinista rotado semanalmente para el día activo
  const baseRotatedPlan = useMemo(() => {
    const dayDate = new Date(`${activeDay.date}T12:00:00`);
    return getRotatedMealsForDay(dayDate, activeDay.dayIndex, dietaryPreference);
  }, [activeDay.date, activeDay.dayIndex, dietaryPreference]);

  // Si hay sobreescritura manual para este día, usarla; si no, usar el rotado determinista
  const currentDayPlan = dayCustomPlans[activeDay.date] || baseRotatedPlan;
  const currentMealList = currentDayPlan[selectedMealTab] || [];

  // Platillo registrado para el día activo
  const activeDayLog = selectedMealsHistory[activeDay.date];
  const selectedRecipeForActiveDay = activeDayLog?.[selectedMealTab];

  // Barajar platillo individual para el día activo
  const handleShuffleSingle = useCallback(
    (recipeId: string) => {
      const recentExcluded = getRecentMealIds(selectedMealsHistory, activeDay.date);
      const otherIds = currentMealList.filter((r) => r.id !== recipeId).map((r) => r.id);
      const totalExcluded = [...recentExcluded, ...otherIds];

      const newRecipe = getRandomMealExcluding(
        recipeId,
        selectedMealTab,
        dietaryPreference,
        totalExcluded
      );

      const updatedList = currentMealList.map((r) => (r.id === recipeId ? newRecipe : r));

      setDayCustomPlans((prev) => ({
        ...prev,
        [activeDay.date]: {
          ...currentDayPlan,
          [selectedMealTab]: updatedList,
        },
      }));

      // Si el usuario está en hoy y existe el handler global, también notificar
      if (activeDay.isToday && onShuffleMeal) {
        onShuffleMeal(selectedMealTab, recipeId);
      }
    },
    [
      activeDay.date,
      activeDay.isToday,
      currentDayPlan,
      currentMealList,
      dietaryPreference,
      onShuffleMeal,
      selectedMealTab,
      selectedMealsHistory,
    ]
  );

  // Barajar todo el menú del día activo
  const handleShuffleDay = useCallback(() => {
    const recentExcluded = getRecentMealIds(selectedMealsHistory, activeDay.date);
    const newSuggestions = generateDailyMealSuggestion(dietaryPreference, recentExcluded, undefined, 3);

    setDayCustomPlans((prev) => ({
      ...prev,
      [activeDay.date]: newSuggestions,
    }));

    if (activeDay.isToday && onShuffleAllMeals) {
      onShuffleAllMeals();
    }
  }, [activeDay.date, activeDay.isToday, dietaryPreference, onShuffleAllMeals, selectedMealsHistory]);

  if (!plan) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyTitle}>No tienes un plan activo</Text>
        <Text style={styles.emptyDesc}>
          Configura tus preferencias en tu perfil para que el sistema genere tu menú.
        </Text>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Generar Plan Automático"
          style={styles.primaryBtn}
          onPress={onRequestNewPlan}
        >
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
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Generar Nuevo Plan Adaptado"
            style={styles.renewBtn}
            onPress={onRequestNewPlan}
          >
            <Text style={styles.renewBtnText}>Generar Nuevo Plan Adaptado</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* SEMANARIO INTERACTIVO DE DIETA */}
      <MealDaySelector
        days={weekDays}
        selectedDayIndex={selectedDayIndex}
        onSelectDay={setSelectedDayIndex}
        title="Tu semana de comidas"
      />

      {/* SECCIÓN: DIETA (4 TIEMPOS) */}
      <View style={styles.sectionHeaderRow}>
        <View style={styles.sectionHeaderCol}>
          <Text style={styles.sectionTitle}>
            Menú para {activeDay.day} ({activeDay.date})
          </Text>
          <Text style={styles.sectionHelper}>
            {activeDay.isToday ? 'Día actual • ' : ''}Ingredientes económicos y accesibles de mercado
          </Text>
        </View>
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel={`Barajar opciones de comidas para ${activeDay.day}`}
          style={styles.shuffleAllBtn}
          onPress={handleShuffleDay}
          activeOpacity={0.8}
        >
          <Text style={styles.shuffleAllBtnText}>🎲 Barajar Día</Text>
        </TouchableOpacity>
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
          const isTabActive = selectedMealTab === type;
          const isSelectedForTab = activeDayLog?.[type] !== undefined;

          return (
            <TouchableOpacity
              key={type}
              accessibilityRole="button"
              accessibilityLabel={`${labels[type]}${isSelectedForTab ? ', platillo elegido' : ''}`}
              style={[styles.mealTab, isTabActive && styles.mealTabActive]}
              onPress={() => setSelectedMealTab(type)}
            >
              <Text
                style={[styles.mealTabText, isTabActive && styles.mealTabTextActive]}
              >
                {labels[type]}{isSelectedForTab ? ' ✓' : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Recetas del momento seleccionado para el día activo */}
      {currentMealList.length === 0 ? (
        <View style={styles.emptyMealCard}>
          <Text style={styles.emptyMealText}>No hay opciones seleccionadas para este momento.</Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Sugerir nuevo platillo"
            style={styles.shuffleEmptyBtn}
            onPress={() => handleShuffleSingle('')}
          >
            <Text style={styles.shuffleEmptyBtnText}>✨ Sugerir Nuevo Platillo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        currentMealList.map((recipe) => {
          const isSelectedForDay = selectedRecipeForActiveDay?.id === recipe.id;

          return (
            <MealRecipeCard
              key={recipe.id}
              recipe={recipe}
              isSelected={isSelectedForDay}
              onSelect={
                onSelectMealForDay
                  ? () => onSelectMealForDay(activeDay.date, selectedMealTab, recipe)
                  : undefined
              }
              onShuffle={() => handleShuffleSingle(recipe.id)}
              onRemove={() => onRemoveRecipe(recipe.id, selectedMealTab)}
            />
          );
        })
      )}

      {/* Botón para recalcular / regenerar plan */}
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Reajustar Parámetros del Perfil"
        style={styles.secondaryBtn}
        onPress={onRequestNewPlan}
      >
        <Text style={styles.secondaryBtnText}>⚙️ Reajustar Parámetros del Perfil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
    backgroundColor: '#000000',
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
    color: '#A1A1AA',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  statusBanner: {
    backgroundColor: '#121216',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#26262B',
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
    color: '#71717A',
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
    backgroundColor: '#121216',
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
    color: '#D4D4D8',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 6,
  },
  evalStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#000000',
    borderRadius: 8,
    padding: 8,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  evalStat: {
    color: '#A1A1AA',
    fontSize: 11,
  },
  renewBtn: {
    backgroundColor: '#F59E0B',
    borderRadius: 10,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  renewBtnText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 13,
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
    fontSize: 15,
    fontWeight: '700',
  },
  sectionHelper: {
    color: '#A1A1AA',
    fontSize: 11,
    marginTop: 2,
  },
  shuffleAllBtn: {
    backgroundColor: '#1C1C22',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 10,
    paddingHorizontal: 12,
    minHeight: 38,
    justifyContent: 'center',
  },
  shuffleAllBtnText: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyMealCard: {
    backgroundColor: '#121216',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#26262B',
    marginBottom: 12,
  },
  emptyMealText: {
    color: '#A1A1AA',
    fontSize: 13,
    marginBottom: 12,
    textAlign: 'center',
  },
  shuffleEmptyBtn: {
    backgroundColor: '#F59E0B',
    borderRadius: 10,
    paddingHorizontal: 16,
    minHeight: 44,
    justifyContent: 'center',
  },
  shuffleEmptyBtnText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 13,
  },
  mealTabsRow: {
    flexDirection: 'row',
    backgroundColor: '#121216',
    borderRadius: 10,
    padding: 4,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#26262B',
  },
  mealTab: {
    flex: 1,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  mealTabActive: {
    backgroundColor: '#F59E0B',
  },
  mealTabText: {
    color: '#71717A',
    fontSize: 10,
    fontWeight: '600',
  },
  mealTabTextActive: {
    color: '#000000',
    fontWeight: '800',
  },
  primaryBtn: {
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  primaryBtnText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 14,
  },
  secondaryBtn: {
    backgroundColor: '#121216',
    borderRadius: 12,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#27272A',
    marginTop: 16,
  },
  secondaryBtnText: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '600',
  },
});
