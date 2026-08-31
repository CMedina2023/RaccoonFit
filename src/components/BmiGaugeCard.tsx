import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Rect, Line, Circle } from 'react-native-svg';
import { BmiAnalysis } from '../core/bmiCalculator';

interface Props {
  bmiData: BmiAnalysis;
  currentWeightKg: number;
}

export const BmiGaugeCard: React.FC<Props> = ({ bmiData, currentWeightKg }) => {
  // Mapear IMC (15 a 40) a un porcentaje visual de 0% a 100%
  const minBmi = 15;
  const maxBmi = 40;
  const clampedBmi = Math.max(minBmi, Math.min(maxBmi, bmiData.bmi));
  const pointerPercent = ((clampedBmi - minBmi) / (maxBmi - minBmi)) * 100;
  const svgWidth = 280;
  const pointerX = (pointerPercent / 100) * svgWidth;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Índice de Masa Corporal (IMC)</Text>
          <Text style={styles.subtitle}>Clasificación clínica según la OMS</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: bmiData.colorHex }]}>
          <Text style={styles.badgeText}>{bmiData.categoryLabel}</Text>
        </View>
      </View>

      <View style={styles.metricRow}>
        <Text style={styles.bmiValue}>{bmiData.bmi}</Text>
        <Text style={styles.bmiUnit}>kg/m²</Text>
        <Text style={styles.weightSnapshot}>({currentWeightKg} kg actuales)</Text>
      </View>

      {/* Barra de colores de rangos con aguja indicadora */}
      <View style={styles.barContainer}>
        <Svg width={svgWidth} height={36} viewBox={`0 0 ${svgWidth} 36`}>
          {/* Bajo Peso (< 18.5) ~ 14% */}
          <Rect x={0} y={16} width={svgWidth * 0.14} height={12} fill="#38BDF8" rx={3} />
          {/* Normal (18.5 - 24.9) ~ 25.6% */}
          <Rect x={svgWidth * 0.14} y={16} width={svgWidth * 0.256} height={12} fill="#10B981" />
          {/* Sobrepeso (25 - 29.9) ~ 20% */}
          <Rect x={svgWidth * 0.396} y={16} width={svgWidth * 0.2} height={12} fill="#F59E0B" />
          {/* Obesidad I (30 - 34.9) ~ 20% */}
          <Rect x={svgWidth * 0.596} y={16} width={svgWidth * 0.2} height={12} fill="#F97316" />
          {/* Obesidad II/III (>= 35) ~ 20.4% */}
          <Rect x={svgWidth * 0.796} y={16} width={svgWidth * 0.204} height={12} fill="#EF4444" rx={3} />

          {/* Aguja / Indicador animado */}
          <Line x1={pointerX} y1={2} x2={pointerX} y2={32} stroke="#FFFFFF" strokeWidth={3} />
          <Circle cx={pointerX} cy={4} r={4} fill="#FFFFFF" />
        </Svg>

        <View style={styles.labelsRow}>
          <Text style={styles.rangeLabel}>Bajo</Text>
          <Text style={styles.rangeLabel}>Saludable</Text>
          <Text style={styles.rangeLabel}>Sobrepeso</Text>
          <Text style={styles.rangeLabel}>Obesidad</Text>
        </View>
      </View>

      {/* Rango de peso saludable objetivo */}
      <View style={styles.targetWeightBox}>
        <Text style={styles.targetLabel}>Rango de peso saludable para tu estatura:</Text>
        <Text style={styles.targetValue}>
          {bmiData.healthyWeightMinKg} kg - {bmiData.healthyWeightMaxKg} kg
        </Text>
      </View>

      <Text style={styles.adviceText}>{bmiData.healthAdvice}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginHorizontal: 16,
    marginVertical: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 11,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: 8,
  },
  bmiValue: {
    color: '#F8FAFC',
    fontSize: 34,
    fontWeight: '800',
  },
  bmiUnit: {
    color: '#94A3B8',
    fontSize: 14,
    marginLeft: 6,
  },
  weightSnapshot: {
    color: '#64748B',
    fontSize: 13,
    marginLeft: 10,
  },
  barContainer: {
    alignItems: 'center',
    marginVertical: 6,
  },
  labelsRow: {
    width: 280,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  rangeLabel: {
    color: '#64748B',
    fontSize: 9,
    fontWeight: '600',
  },
  targetWeightBox: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  targetLabel: {
    color: '#94A3B8',
    fontSize: 11,
    flex: 1,
  },
  targetValue: {
    color: '#10B981',
    fontWeight: '700',
    fontSize: 13,
  },
  adviceText: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 17,
    marginTop: 10,
    fontStyle: 'italic',
  },
});
