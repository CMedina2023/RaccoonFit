import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  StatusBar,
  Animated,
} from 'react-native';
import { useAppStore } from './src/store/useAppStore';
import { calculateBmi } from './src/core/bmiCalculator';
import { VirtualPetView } from './src/components/VirtualPetView';
import { BmiGaugeCard } from './src/components/BmiGaugeCard';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { PlanScreen } from './src/screens/PlanScreen';
import { ExercisesScreen } from './src/screens/ExercisesScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { UserProfile } from './src/types';
import { WATER_GOAL_GLASSES, MAX_WATER_GLASSES } from './src/store/useAppStore';

export default function App() {
  const {
    isInitialized,
    userProfile,
    weighInHistory,
    hydrationHistory,
    currentPlan,
    petState,
    toastMessage,
    toastType,
    initialize,
    saveUserProfile,
    addWeeklyWeighIn,
    addWaterGlass,
    removeWaterGlass,
    activatePlan,
    removeExerciseFromPlan,
    removeRecipeFromPlan,
    resetAll,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'hoy' | 'plan' | 'historico' | 'ejercicios' | 'perfil'>('hoy');
  const [showWeighInModal, setShowWeighInModal] = useState(false);
  const [newWeightInput, setNewWeightInput] = useState('');
  const [weighInNotes, setWeighInNotes] = useState('');
  const [showAuthWizard, setShowAuthWizard] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Toast animation
  const toastOpacity = useState(new Animated.Value(0))[0];

  useEffect(() => {
    initialize();
  }, []);

  // Animate toast when it appears/disappears
  useEffect(() => {
    if (toastMessage) {
      Animated.timing(toastOpacity, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    } else {
      Animated.timing(toastOpacity, { toValue: 0, duration: 250, useNativeDriver: true }).start();
    }
  }, [toastMessage]);

  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingEmoji}>🦝</Text>
        <Text style={styles.loadingText}>Iniciando Dieta & Fitness...</Text>
      </View>
    );
  }

  // Si no hay perfil (primer uso) o el usuario quiere el wizard → mostrar AuthScreen
  if (!userProfile || showAuthWizard) {
    return (
      <AuthScreen
        existingProfile={userProfile}
        onComplete={async (profile: UserProfile) => {
          await saveUserProfile(profile);
          setShowAuthWizard(false);
        }}
      />
    );
  }

  const currentWeight =
    weighInHistory.length > 0 ? weighInHistory[0].weightKg : userProfile.startingWeightKg;
  const bmiAnalysis = calculateBmi(currentWeight, userProfile.heightCm, userProfile.gender);

  const todayStr = new Date().toISOString().split('T')[0];
  const waterGlassesToday = hydrationHistory[todayStr] || 0;
  const waterLiters = (waterGlassesToday * 0.25).toFixed(2);

  const handleSaveWeighIn = () => {
    const val = parseFloat(newWeightInput);
    if (!isNaN(val) && val > 30 && val < 300) {
      addWeeklyWeighIn(val, weighInNotes || undefined);
      setShowWeighInModal(false);
      setNewWeightInput('');
      setWeighInNotes('');
    }
  };

  const toastBgColor = toastType === 'success' ? '#064E3B' : toastType === 'error' ? '#7F1D1D' : '#1E3A5F';
  const toastBorderColor = toastType === 'success' ? '#10B981' : toastType === 'error' ? '#EF4444' : '#3B82F6';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* TOAST GLOBAL (reemplaza Alert.alert) */}
      {toastMessage && (
        <Animated.View
          style={[styles.toast, { backgroundColor: toastBgColor, borderColor: toastBorderColor, opacity: toastOpacity }]}
        >
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}

      {/* VISTAS DE PANTALLA SEGÚN TAB ACTIVA */}
      <View style={styles.mainContent}>
        {/* TAB 1: HOY (DASHBOARD PRINCIPAL) */}
        {activeTab === 'hoy' && (
          <ScrollView contentContainerStyle={styles.scrollPadding}>
            <View style={styles.topHeader}>
              <View>
                <Text style={styles.welcomeText}>¡Hola, {userProfile.name}! 👋</Text>
                <Text style={styles.dateSubtext}>
                  {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </Text>
              </View>
              {/* Botón para abrir wizard de nuevo perfil */}
              <TouchableOpacity style={styles.changeProfileBtn} onPress={() => setShowAuthWizard(true)}>
                <Text style={styles.changeProfileBtnText}>🔄</Text>
              </TouchableOpacity>
            </View>

            {/* Mascota Virtual */}
            <VirtualPetView pet={petState} onPress={() => {}} />

            {/* Widget de Hidratación */}
            <View style={styles.cardWater}>
              <View style={styles.waterHeaderRow}>
                <View>
                  <Text style={styles.waterTitle}>💧 Hidratación del Día</Text>
                  <Text style={styles.waterSubtitle}>
                    {waterGlassesToday} / {MAX_WATER_GLASSES} vasos · {waterLiters} L
                    {waterGlassesToday >= WATER_GOAL_GLASSES && waterGlassesToday < MAX_WATER_GLASSES
                      ? ' ✅ Meta Cumplida'
                      : waterGlassesToday >= MAX_WATER_GLASSES
                      ? ' ⚠️ Límite máximo'
                      : ''}
                  </Text>
                </View>
                <View style={styles.waterButtonsRow}>
                  <TouchableOpacity
                    style={styles.waterBtnMinus}
                    onPress={removeWaterGlass}
                    disabled={waterGlassesToday <= 0}
                  >
                    <Text style={styles.waterBtnMinusText}>-</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.waterBtnPlus} onPress={addWaterGlass}>
                    <Text style={styles.waterBtnPlusText}>+ Vaso</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Indicadores: meta de 8 + extras hasta 12 */}
              <View style={styles.glassesIndicatorRow}>
                {Array.from({ length: MAX_WATER_GLASSES }, (_, i) => i + 1).map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.glassDot,
                      i <= waterGlassesToday && (i <= WATER_GOAL_GLASSES ? styles.glassDotFilled : styles.glassDotBonus),
                      i === WATER_GOAL_GLASSES + 1 && styles.glassDotSeparator,
                    ]}
                  />
                ))}
              </View>
              <View style={styles.waterLegend}>
                <View style={styles.waterLegendItem}>
                  <View style={[styles.waterLegendDot, { backgroundColor: '#06B6D4' }]} />
                  <Text style={styles.waterLegendText}>Meta (2L)</Text>
                </View>
                <View style={styles.waterLegendItem}>
                  <View style={[styles.waterLegendDot, { backgroundColor: '#10B981' }]} />
                  <Text style={styles.waterLegendText}>Extra (hasta 3L)</Text>
                </View>
              </View>
            </View>

            {/* Tarjeta de IMC */}
            <BmiGaugeCard bmiData={bmiAnalysis} currentWeightKg={currentWeight} />

            {/* Banner de pesaje semanal */}
            <TouchableOpacity
              style={styles.weighInBanner}
              activeOpacity={0.85}
              onPress={() => setShowWeighInModal(true)}
            >
              <Text style={styles.weighInBannerIcon}>⚖️</Text>
              <View style={styles.weighInBannerTextCol}>
                <Text style={styles.weighInBannerTitle}>Báscula Semanal</Text>
                <Text style={styles.weighInBannerDesc}>
                  Último registro: {currentWeight} kg · Toca para registrar tu peso de esta semana
                </Text>
              </View>
            </TouchableOpacity>
          </ScrollView>
        )}

        {/* TAB 2: MI PLAN */}
        {activeTab === 'plan' && (
          <PlanScreen
            plan={currentPlan}
            onActivatePlan={activatePlan}
            onRemoveExercise={removeExerciseFromPlan}
            onRemoveRecipe={removeRecipeFromPlan}
            onRequestNewPlan={() => setActiveTab('perfil')}
          />
        )}

        {/* TAB 3: HISTÓRICO */}
        {activeTab === 'historico' && (
          <HistoryScreen
            weighIns={weighInHistory}
            hydrationHistory={hydrationHistory}
            onOpenWeighInModal={() => setShowWeighInModal(true)}
          />
        )}

        {/* TAB 4: EJERCICIOS */}
        {activeTab === 'ejercicios' && <ExercisesScreen />}

        {/* TAB 5: PERFIL */}
        {activeTab === 'perfil' && (
          <ProfileScreen
            profile={userProfile}
            onSaveProfile={saveUserProfile}
            onResetData={resetAll}
            showResetConfirm={showResetConfirm}
            setShowResetConfirm={setShowResetConfirm}
          />
        )}
      </View>

      {/* BARRA DE NAVEGACIÓN */}
      <View style={styles.bottomNav}>
        {([
          { id: 'hoy', icon: '🏠', label: 'Hoy' },
          { id: 'plan', icon: '📋', label: 'Mi Plan' },
          { id: 'historico', icon: '📈', label: 'Histórico' },
          { id: 'ejercicios', icon: '🏋️', label: 'Ejercicios' },
          { id: 'perfil', icon: '👤', label: 'Perfil' },
        ] as const).map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={styles.navItem}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text style={[styles.navIcon, activeTab === tab.id && styles.navIconActive]}>{tab.icon}</Text>
            <Text style={[styles.navLabel, activeTab === tab.id && styles.navLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* MODAL DE PESAJE SEMANAL */}
      <Modal visible={showWeighInModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>⚖️ Pesaje Semanal Oficial</Text>
            <Text style={styles.modalSubtitle}>Para mayor exactitud, pésate sin zapatos y en ayunas.</Text>

            <Text style={styles.modalInputLabel}>Peso Actual (kg):</Text>
            <TextInput
              style={styles.modalInput}
              value={newWeightInput}
              onChangeText={setNewWeightInput}
              keyboardType="numeric"
              placeholder="Ej. 79.5"
              placeholderTextColor="#64748B"
              autoFocus
            />

            <Text style={styles.modalInputLabel}>Notas (opcional):</Text>
            <TextInput
              style={styles.modalInput}
              value={weighInNotes}
              onChangeText={setWeighInNotes}
              placeholder="Ej. Sentí más energía esta semana"
              placeholderTextColor="#64748B"
            />

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowWeighInModal(false)}>
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmBtn} onPress={handleSaveWeighIn}>
                <Text style={styles.modalConfirmText}>Guardar Pesaje</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0F172A' },
  loadingContainer: { flex: 1, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center' },
  loadingEmoji: { fontSize: 60, marginBottom: 12 },
  loadingText: { color: '#10B981', fontSize: 16, fontWeight: '700' },
  toast: {
    position: 'absolute', top: 50, left: 16, right: 16, borderRadius: 14, padding: 12,
    borderWidth: 1, zIndex: 999, elevation: 20,
  },
  toastText: { color: '#F8FAFC', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  mainContent: { flex: 1 },
  scrollPadding: { paddingBottom: 24 },
  topHeader: {
    paddingHorizontal: 16, paddingTop: 12, paddingBottom: 4,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  welcomeText: { color: '#F8FAFC', fontSize: 22, fontWeight: '800' },
  dateSubtext: { color: '#94A3B8', fontSize: 12, textTransform: 'capitalize', marginTop: 2 },
  changeProfileBtn: { backgroundColor: '#1E293B', borderRadius: 10, padding: 8, borderWidth: 1, borderColor: '#334155' },
  changeProfileBtnText: { fontSize: 16 },
  cardWater: { backgroundColor: '#1E293B', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#334155', marginHorizontal: 16, marginBottom: 8, marginTop: 4 },
  waterHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  waterTitle: { color: '#F8FAFC', fontSize: 15, fontWeight: '700' },
  waterSubtitle: { color: '#06B6D4', fontSize: 11, fontWeight: '600', marginTop: 2 },
  waterButtonsRow: { flexDirection: 'row', alignItems: 'center' },
  waterBtnMinus: { backgroundColor: '#334155', width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  waterBtnMinusText: { color: '#F8FAFC', fontSize: 16, fontWeight: '700' },
  waterBtnPlus: { backgroundColor: '#06B6D4', paddingHorizontal: 14, paddingVertical: 7, borderRadius: 12 },
  waterBtnPlusText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  glassesIndicatorRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  glassDot: { flex: 1, height: 8, borderRadius: 4, backgroundColor: '#334155', marginHorizontal: 1 },
  glassDotFilled: { backgroundColor: '#06B6D4' },
  glassDotBonus: { backgroundColor: '#10B981' },
  glassDotSeparator: { borderLeftWidth: 2, borderLeftColor: '#475569' },
  waterLegend: { flexDirection: 'row', marginTop: 8 },
  waterLegendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  waterLegendDot: { width: 8, height: 8, borderRadius: 4, marginRight: 4 },
  waterLegendText: { color: '#64748B', fontSize: 9 },
  weighInBanner: {
    backgroundColor: '#1E293B', borderRadius: 18, padding: 14, marginHorizontal: 16,
    marginTop: 6, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#10B981',
  },
  weighInBannerIcon: { fontSize: 26, marginRight: 12 },
  weighInBannerTextCol: { flex: 1 },
  weighInBannerTitle: { color: '#10B981', fontWeight: '700', fontSize: 14 },
  weighInBannerDesc: { color: '#94A3B8', fontSize: 11, marginTop: 2 },
  bottomNav: { flexDirection: 'row', backgroundColor: '#1E293B', borderTopWidth: 1, borderTopColor: '#334155', paddingVertical: 8, paddingBottom: 12 },
  navItem: { flex: 1, alignItems: 'center' },
  navIcon: { fontSize: 20, opacity: 0.5 },
  navIconActive: { opacity: 1 },
  navLabel: { color: '#64748B', fontSize: 10, fontWeight: '600', marginTop: 2 },
  navLabelActive: { color: '#10B981', fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: '#1E293B', borderRadius: 20, padding: 20, width: '100%', borderWidth: 1, borderColor: '#334155' },
  modalTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700' },
  modalSubtitle: { color: '#94A3B8', fontSize: 12, marginTop: 4, marginBottom: 16 },
  modalInputLabel: { color: '#CBD5E1', fontSize: 12, fontWeight: '600', marginBottom: 6 },
  modalInput: { backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#334155', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, color: '#F8FAFC', fontSize: 15, marginBottom: 14 },
  modalButtonsRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  modalCancelBtn: { paddingHorizontal: 16, paddingVertical: 10, marginRight: 8 },
  modalCancelText: { color: '#94A3B8', fontWeight: '600' },
  modalConfirmBtn: { backgroundColor: '#10B981', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10 },
  modalConfirmText: { color: '#FFFFFF', fontWeight: '700' },
});
