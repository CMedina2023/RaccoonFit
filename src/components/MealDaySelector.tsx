import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { WeeklyMealDay } from '../core/weeklyMealPlanner';

export interface MealDaySelectorProps {
  days: WeeklyMealDay[];
  selectedDayIndex: number;
  onSelectDay: (index: number) => void;
  title?: string;
}

export const MealDaySelector: React.FC<MealDaySelectorProps> = ({
  days,
  selectedDayIndex,
  onSelectDay,
  title = 'Tu semana de alimentación',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>Rotación continua por día</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {days.map((day, index) => {
          const isSelected = selectedDayIndex === index;
          return (
            <TouchableOpacity
              key={day.date}
              accessibilityRole="button"
              accessibilityLabel={`${day.day}, fecha ${day.date}${day.isToday ? ', Hoy' : ''}${
                day.hasSelectedMeals ? `, ${day.selectedMealsCount} platillos elegidos` : ''
              }`}
              onPress={() => onSelectDay(index)}
              style={[
                styles.dayCard,
                day.hasSelectedMeals && styles.dayCardWithMeals,
                isSelected && styles.dayCardSelected,
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.dayTopRow}>
                <Text style={[styles.dayName, isSelected && styles.dayNameSelected]}>
                  {day.day}
                </Text>
                {day.isToday && (
                  <View style={styles.todayBadge}>
                    <Text style={styles.todayBadgeText}>HOY</Text>
                  </View>
                )}
              </View>
              <Text style={[styles.dayLabel, isSelected && styles.dayLabelSelected]}>
                {day.hasSelectedMeals
                  ? `${day.selectedMealsCount} de 4 listos`
                  : '4 momentos'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '500',
  },
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingVertical: 2,
  },
  dayCard: {
    width: 100,
    minHeight: 76,
    backgroundColor: '#121216',
    borderColor: '#26262B',
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    marginRight: 8,
    justifyContent: 'space-between',
  },
  dayCardWithMeals: {
    backgroundColor: '#0F291E',
    borderColor: '#10B98155',
  },
  dayCardSelected: {
    borderColor: '#F59E0B',
    borderWidth: 2,
    backgroundColor: '#1C1914',
  },
  dayTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
  },
  dayNameSelected: {
    color: '#FBBF24',
  },
  todayBadge: {
    backgroundColor: '#F59E0B',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  todayBadgeText: {
    color: '#000000',
    fontSize: 9,
    fontWeight: '800',
  },
  dayLabel: {
    color: '#71717A',
    fontSize: 10,
    marginTop: 4,
    lineHeight: 13,
  },
  dayLabelSelected: {
    color: '#E4E4E7',
    fontWeight: '600',
  },
});
