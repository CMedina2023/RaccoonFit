import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path, Line, Circle, Rect, Text as SvgText } from 'react-native-svg';
import { WeeklyWeighIn } from '../types';
import { MonthSummary, compareTwoMonths } from '../core/historyAnalytics';

interface Props {
  weighIns: WeeklyWeighIn[];
  hydrationHistory: Record<string, number>;
  onOpenWeighInModal: () => void;
}

export const HistoryScreen: React.FC<Props> = ({
  weighIns,
  hydrationHistory,
  onOpenWeighInModal,
}) => {
  const [selectedTab, setSelectedTab] = useState<'semanal' | 'mensual' | 'comparador'>('semanal');

  // Datos mock / derivados para la vista comparativa
  const sampleMonthA: MonthSummary = {
    monthKey: '2026-07',
    monthName: 'Julio 2026',
    startWeightKg: 82.5,
    endWeightKg: 81.2,
    weightDeltaKg: -1.3,
    totalWaterLiters: 42,
    avgDailyWaterLiters: 1.4,
    weighInCount: 4,
    dailyWaterSamples: [
      { day: 5, liters: 1.25 },
      { day: 12, liters: 1.5 },
      { day: 19, liters: 1.25 },
      { day: 26, liters: 1.75 },
    ],
    weeklyWeightPoints: [
      { weekIndex: 1, weightKg: 82.5 },
      { weekIndex: 2, weightKg: 82.1 },
      { weekIndex: 3, weightKg: 81.7 },
      { weekIndex: 4, weightKg: 81.2 },
    ],
  };

  const sampleMonthB: MonthSummary = {
    monthKey: '2026-08',
    monthName: 'Agosto 2026',
    startWeightKg: 81.2,
    endWeightKg: 79.1,
    weightDeltaKg: -2.1,
    totalWaterLiters: 64,
    avgDailyWaterLiters: 2.1,
    weighInCount: 4,
    dailyWaterSamples: [
      { day: 5, liters: 2.0 },
      { day: 12, liters: 2.25 },
      { day: 19, liters: 2.0 },
      { day: 26, liters: 2.25 },
    ],
    weeklyWeightPoints: [
      { weekIndex: 1, weightKg: 81.2 },
      { weekIndex: 2, weightKg: 80.4 },
      { weekIndex: 3, weightKg: 79.8 },
      { weekIndex: 4, weightKg: 79.1 },
    ],
  };

  const comparison = compareTwoMonths(sampleMonthA, sampleMonthB);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>Báscula e Histórico</Text>
        <Text style={styles.subtitle}>Evolución semanal y correlación con hidratación</Text>
      </View>

      {/* Botón de acción principal: Pesaje Semanal */}
      <TouchableOpacity
        style={styles.weighInButton}
        activeOpacity={0.8}
        onPress={onOpenWeighInModal}
      >
        <Text style={styles.weighInButtonIcon}>⚖️</Text>
        <View style={styles.weighInButtonContent}>
          <Text style={styles.weighInButtonTitle}>Registrar Pesaje Semanal</Text>
          <Text style={styles.weighInButtonSubtitle}>
            Recuerda pesarte el mismo día de la semana en ayunas
          </Text>
        </View>
      </TouchableOpacity>

      {/* Selector de Pestañas: Semanal | Mensual | Comparador */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, selectedTab === 'semanal' && styles.tabItemActive]}
          onPress={() => setSelectedTab('semanal')}
        >
          <Text style={[styles.tabText, selectedTab === 'semanal' && styles.tabTextActive]}>
            Semanal
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, selectedTab === 'mensual' && styles.tabItemActive]}
          onPress={() => setSelectedTab('mensual')}
        >
          <Text style={[styles.tabText, selectedTab === 'mensual' && styles.tabTextActive]}>
            Mensual
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, selectedTab === 'comparador' && styles.tabItemActive]}
          onPress={() => setSelectedTab('comparador')}
        >
          <Text style={[styles.tabText, selectedTab === 'comparador' && styles.tabTextActive]}>
            Comparar Meses
          </Text>
        </TouchableOpacity>
      </View>

      {/* CONTENIDO 1: VISTA SEMANAL */}
      {selectedTab === 'semanal' && (
        <View style={styles.sectionCard}>
          <Text style={styles.cardTitle}>Curva de Pesaje Semanal Oficial</Text>
          <Text style={styles.cardDesc}>Tendencia de peso real sin variaciones por retención de líquidos</Text>

          {weighIns.length === 0 ? (
            <Text style={styles.emptyText}>Aún no hay registros de peso. ¡Haz tu primer pesaje semanal arriba!</Text>
          ) : (
            <View style={styles.chartWrapper}>
              <Svg width={300} height={140} viewBox="0 0 300 140">
                <Line x1="20" y1="120" x2="280" y2="120" stroke="#334155" strokeWidth="1" />
                <Line x1="20" y1="70" x2="280" y2="70" stroke="#1E293B" strokeWidth="1" strokeDasharray="4" />
                <Line x1="20" y1="20" x2="280" y2="20" stroke="#1E293B" strokeWidth="1" strokeDasharray="4" />

                {/* Línea simulada de progreso */}
                <Path
                  d="M 40 35 L 100 50 L 170 70 L 250 95"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                />
                <Circle cx="40" cy="35" r="5" fill="#10B981" />
                <Circle cx="100" cy="50" r="5" fill="#10B981" />
                <Circle cx="170" cy="70" r="5" fill="#10B981" />
                <Circle cx="250" cy="95" r="6" fill="#F59E0B" />

                <SvgText x="40" y="25" fill="#94A3B8" fontSize="10" textAnchor="middle">
                  S1
                </SvgText>
                <SvgText x="100" y="40" fill="#94A3B8" fontSize="10" textAnchor="middle">
                  S2
                </SvgText>
                <SvgText x="170" y="60" fill="#94A3B8" fontSize="10" textAnchor="middle">
                  S3
                </SvgText>
                <SvgText x="250" y="85" fill="#10B981" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Hoy
                </SvgText>
              </Svg>
            </View>
          )}

          {/* Lista de Registros */}
          <View style={styles.historyList}>
            {weighIns.map((w, index) => (
              <View key={w.id} style={styles.historyRow}>
                <View>
                  <Text style={styles.historyDate}>{w.date}</Text>
                  <Text style={styles.historyBmi}>IMC: {w.calculatedBmi} {w.notes ? `• ${w.notes}` : ''}</Text>
                </View>
                <Text style={styles.historyWeight}>{w.weightKg} kg</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* CONTENIDO 2: VISTA MENSUAL */}
      {selectedTab === 'mensual' && (
        <View>
          <View style={styles.sectionCard}>
            <Text style={styles.cardTitle}>Balance del Mes Actual</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Pérdida en el Mes</Text>
                <Text style={[styles.metricValue, { color: '#10B981' }]}>-2.1 kg</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Promedio Agua/Día</Text>
                <Text style={[styles.metricValue, { color: '#06B6D4' }]}>2.1 L</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Pesajes Realizados</Text>
                <Text style={[styles.metricValue, { color: '#F8FAFC' }]}>4 de 4</Text>
              </View>
              <View style={styles.metricBox}>
                <Text style={styles.metricLabel}>Adherencia al Plan</Text>
                <Text style={[styles.metricValue, { color: '#F59E0B' }]}>88%</Text>
              </View>
            </View>
          </View>
        </View>
      )}

      {/* CONTENIDO 3: COMPARADOR INTER-MENSUAL */}
      {selectedTab === 'comparador' && (
        <View>
          <View style={styles.sectionCard}>
            <Text style={styles.cardTitle}>Comparador Inter-Mensual</Text>
            <Text style={styles.cardDesc}>
              Analiza el impacto de tu hidratación y hábitos entre dos meses
            </Text>

            <View style={styles.compareSelectorRow}>
              <View style={[styles.monthTag, { borderColor: '#38BDF8' }]}>
                <Text style={[styles.monthTagText, { color: '#38BDF8' }]}>Mes A: {sampleMonthA.monthName}</Text>
              </View>
              <Text style={styles.vsText}>VS</Text>
              <View style={[styles.monthTag, { borderColor: '#10B981' }]}>
                <Text style={[styles.monthTagText, { color: '#10B981' }]}>Mes B: {sampleMonthB.monthName}</Text>
              </View>
            </View>

            {/* Gráfica Superpuesta Mes A vs Mes B */}
            <View style={styles.chartWrapper}>
              <Svg width={300} height={150} viewBox="0 0 300 150">
                <Line x1="30" y1="130" x2="280" y2="130" stroke="#334155" strokeWidth="1" />
                <Line x1="30" y1="80" x2="280" y2="80" stroke="#1E293B" strokeWidth="1" strokeDasharray="3" />
                <Line x1="30" y1="30" x2="280" y2="30" stroke="#1E293B" strokeWidth="1" strokeDasharray="3" />

                {/* Mes A (Azul - Julio) */}
                <Path
                  d="M 40 40 L 110 50 L 190 58 L 260 70"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2.5"
                />
                <Circle cx="40" cy="40" r="4" fill="#38BDF8" />
                <Circle cx="110" cy="50" r="4" fill="#38BDF8" />
                <Circle cx="190" cy="58" r="4" fill="#38BDF8" />
                <Circle cx="260" cy="70" r="4" fill="#38BDF8" />

                {/* Mes B (Verde - Agosto con mayor pendiente) */}
                <Path
                  d="M 40 45 L 110 65 L 190 85 L 260 115"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                />
                <Circle cx="40" cy="45" r="4" fill="#10B981" />
                <Circle cx="110" cy="65" r="4" fill="#10B981" />
                <Circle cx="190" cy="85" r="4" fill="#10B981" />
                <Circle cx="260" cy="115" r="5" fill="#10B981" />

                <SvgText x="40" y="142" fill="#64748B" fontSize="9" textAnchor="middle">Sem 1</SvgText>
                <SvgText x="110" y="142" fill="#64748B" fontSize="9" textAnchor="middle">Sem 2</SvgText>
                <SvgText x="190" y="142" fill="#64748B" fontSize="9" textAnchor="middle">Sem 3</SvgText>
                <SvgText x="260" y="142" fill="#64748B" fontSize="9" textAnchor="middle">Sem 4</SvgText>
              </Svg>
            </View>

            {/* Comparativa Detallada */}
            <View style={styles.compareRow}>
              <View style={styles.compareCol}>
                <Text style={styles.compareSub}>Pérdida de Peso</Text>
                <Text style={[styles.compareVal, { color: '#38BDF8' }]}>Julio: -1.3 kg</Text>
                <Text style={[styles.compareVal, { color: '#10B981' }]}>Agosto: -2.1 kg</Text>
              </View>
              <View style={styles.compareCol}>
                <Text style={styles.compareSub}>Ingesta de Agua</Text>
                <Text style={[styles.compareVal, { color: '#38BDF8' }]}>Julio: 1.4 L/día</Text>
                <Text style={[styles.compareVal, { color: '#10B981' }]}>Agosto: 2.1 L/día</Text>
              </View>
            </View>

            {/* Insight Inteligente de la Mascota */}
            <View style={styles.insightBox}>
              <Text style={styles.insightIcon}>🦝</Text>
              <Text style={styles.insightText}>
                {comparison.insightPetText}
              </Text>
            </View>
          </View>
        </View>
      )}
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
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  weighInButton: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#10B981',
    marginBottom: 16,
  },
  weighInButtonIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  weighInButtonContent: {
    flex: 1,
  },
  weighInButtonTitle: {
    color: '#10B981',
    fontWeight: '700',
    fontSize: 15,
  },
  weighInButtonSubtitle: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tabItem: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabItemActive: {
    backgroundColor: '#10B981',
  },
  tabText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  sectionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  cardDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
    marginBottom: 12,
  },
  chartWrapper: {
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingVertical: 10,
  },
  emptyText: {
    color: '#64748B',
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 13,
  },
  historyList: {
    marginTop: 12,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  historyDate: {
    color: '#F8FAFC',
    fontWeight: '600',
    fontSize: 13,
  },
  historyBmi: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  historyWeight: {
    color: '#10B981',
    fontWeight: '700',
    fontSize: 15,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  metricBox: {
    width: '48%',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  metricLabel: {
    color: '#94A3B8',
    fontSize: 11,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  compareSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  monthTag: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#0F172A',
  },
  monthTagText: {
    fontSize: 11,
    fontWeight: '600',
  },
  vsText: {
    color: '#64748B',
    marginHorizontal: 8,
    fontWeight: '700',
    fontSize: 12,
  },
  compareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
  },
  compareCol: {
    flex: 1,
  },
  compareSub: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  compareVal: {
    fontSize: 12,
    fontWeight: '700',
    marginVertical: 1,
  },
  insightBox: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  insightIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  insightText: {
    flex: 1,
    color: '#E2E8F0',
    fontSize: 12,
    lineHeight: 17,
  },
});
