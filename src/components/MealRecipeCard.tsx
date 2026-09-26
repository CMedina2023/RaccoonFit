import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RecipeItem } from '../types';

export interface MealRecipeCardProps {
  recipe: RecipeItem;
  isSelected: boolean;
  onSelect?: () => void;
  onShuffle?: () => void;
  onRemove?: () => void;
}

export const MealRecipeCard: React.FC<MealRecipeCardProps> = ({
  recipe,
  isSelected,
  onSelect,
  onShuffle,
  onRemove,
}) => {
  return (
    <View style={[styles.itemCard, isSelected && styles.itemCardSelected]}>
      <View style={styles.itemTopRow}>
        <View style={styles.itemInfo}>
          <View style={styles.titleBadgeRow}>
            <Text style={styles.itemName}>{recipe.title}</Text>
            {isSelected && (
              <View style={styles.selectedBadge}>
                <Text style={styles.selectedBadgeText}>ELEGIDO</Text>
              </View>
            )}
          </View>
          <Text style={styles.itemBadgeCategory}>
            ⏱️ {recipe.prepTimeMinutes} min • ~{recipe.approxCalories} kcal • {recipe.approxProteinGrams}g proteína
          </Text>
        </View>
        <View style={styles.cardActionsRow}>
          {onSelect && (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={isSelected ? `Deseleccionar ${recipe.title}` : `Elegir ${recipe.title}`}
              onPress={onSelect}
              style={[styles.selectMealBtn, isSelected && styles.selectMealBtnActive]}
              activeOpacity={0.8}
            >
              <Text style={[styles.selectMealBtnText, isSelected && styles.selectMealBtnTextActive]}>
                {isSelected ? '✅ Seleccionado' : '⚪ Elegir'}
              </Text>
            </TouchableOpacity>
          )}
          {onShuffle && (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={`Cambiar ${recipe.title} por otra opción`}
              onPress={onShuffle}
              style={styles.shuffleBtn}
              activeOpacity={0.8}
            >
              <Text style={styles.shuffleBtnText}>🔄 Cambiar</Text>
            </TouchableOpacity>
          )}
          {onRemove && (
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={`Eliminar ${recipe.title}`}
              onPress={onRemove}
              style={styles.removeBtn}
            >
              <Text style={styles.removeBtnText}>✕</Text>
            </TouchableOpacity>
          )}
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
};

const styles = StyleSheet.create({
  itemCard: {
    backgroundColor: '#121216',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#26262B',
  },
  itemCardSelected: {
    borderColor: '#10B981',
    borderWidth: 2,
    backgroundColor: '#0F291E',
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
  titleBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  itemName: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
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
  itemBadgeCategory: {
    color: '#10B981',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  cardActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectMealBtn: {
    backgroundColor: '#1C1C22',
    borderWidth: 1,
    borderColor: '#2E2E35',
    borderRadius: 8,
    paddingHorizontal: 10,
    minHeight: 40,
    justifyContent: 'center',
    marginRight: 6,
  },
  selectMealBtnActive: {
    backgroundColor: '#065F46',
    borderColor: '#10B981',
  },
  selectMealBtnText: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '700',
  },
  selectMealBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  shuffleBtn: {
    backgroundColor: '#1C1C22',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 8,
    paddingHorizontal: 8,
    minHeight: 40,
    justifyContent: 'center',
    marginRight: 6,
  },
  shuffleBtnText: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '700',
  },
  removeBtn: {
    backgroundColor: '#27272A',
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeBtnText: {
    color: '#A1A1AA',
    fontSize: 12,
    fontWeight: '700',
  },
  ingredientsTitle: {
    color: '#D4D4D8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 8,
  },
  ingredientText: {
    color: '#A1A1AA',
    fontSize: 11,
    marginLeft: 4,
    marginTop: 2,
    lineHeight: 15,
  },
});
