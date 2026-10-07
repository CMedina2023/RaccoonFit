import React, { useState, useEffect } from 'react';
import {
  AppState,
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
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useAppLifecycle,
  useHydration,
  usePetState,
  usePetCare,
  usePlanActions,
  useToast,
  useUserProfile,
  useWeighIn,
} from './src/store/selectors';
import { useBmiAnalysis } from './src/hooks/useBmiAnalysis';
import { VirtualPetView } from './src/components/VirtualPetView';
import { usePetCareSession } from './src/hooks/usePetCareSession';
import { resolvePetCareStatus } from './src/core/petCareEngine';
import { BmiGaugeCard } from './src/components/BmiGaugeCard';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { PlanScreen } from './src/screens/PlanScreen';
import { ExercisesScreen } from './src/screens/ExercisesScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { UserProfile } from './src/types';
import { WATER_GOAL_GLASSES, MAX_WATER_GLASSES } from './src/store/useAppStore';
import { exerciseMediaCache, exerciseMediaProvider } from './src/app/exerciseMediaComposition';

export default function App() {
  const { isInitialized, initialize, resetAll: resetAppData } = useAppLifecycle();
  const { userProfile, saveUserProfile } = useUserProfile();
  const { weighInHistory, addWeeklyWeighIn } = useWeighIn();
  const { hydrationHistory, addWaterGlass, removeWaterGlass } = useHydration();
  const { petState } = usePetState();
  const { petCareState, petAnimationRequest, performPetCareAction, refreshPetCare, clearPetAnimationRequest } = usePetCare();
  const {
    currentPlan,
    mealsHistory,
    activatePlan,
    removeRecipeFromPlan,
    shuffleSingleMeal,
    shuffleAllMeals,
    selectMealForDay,
  } = usePlanActions();
  const { toastMessage, toastType } = useToast();
  const petCare = usePetCareSession(petAnimationRequest, performPetCareAction, clearPetAnimationRequest);
  const careStatus = resolvePetCareStatus(petCareState);

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

  useEffect(() => {
    const refreshIfActive = () => {
      if (isInitialized && AppState.currentState === 'active') void refreshPetCare();
    };
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active' && isInitialized) void refreshPetCare();
    });
    const intervalId = setInterval(refreshIfActive, 15 * 60 * 1000);
    return () => {
      subscription.remove();
      clearInterval(intervalId);
    };
  }, [isInitialized, refreshPetCare]);

  // Animate toast when it appears/disappears
  useEffect(() => {
    if (toastMessage) {
      Animated.timing(toastOpacity, { toValue: 1, duration: 250, useNativeDriver: true }).start();
    } else {
      Animated.timing(toastOpacity, { toValue: 0, duration: 250, useNativeDriver: true }).start();
    }
  }, [toastMessage]);

  const currentWeight =
    weighInHistory.length > 0 ? weighInHistory[0].weightKg : userProfile?.startingWeightKg ?? 0;
  const bmiAnalysis = useBmiAnalysis(currentWeight, userProfile?.heightCm, userProfile?.gender);

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

  if (!bmiAnalysis) {
    return null;
  }

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

  const handleResetAll = async () => {
    await resetAppData();
    petCare.reset();
  };

  const toastBgColor = toastType === 'success' ? '#064E3B' : toastType === 'error' ? '#7F1D1D' : '#1E3A5F';
  const toastBorderColor = toastType === 'success' ? '#10B981' : toastType === 'error' ? '#EF4444' : '#3B82F6';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'bottom', 'left']}>
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
            <VirtualPetView
              name={petState.name}
              level={petState.level}
              currentXp={petState.currentXp}
              xpToNextLevel={petState.xpToNextLevel}
              dialogMessage={petState.dialogMessage}
              careState={petCareState}
              careStatus={careStatus}
              lastCareAction={petCare.lastAction}
              animationRequest={petCare.animationRequest}
              onCareAction={petCare.performAction}
            />

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

        {/* TAB 2: DIETA */}
        {activeTab === 'plan' && (
          <PlanScreen
            plan={currentPlan}
            onActivatePlan={activatePlan}
            onRemoveRecipe={removeRecipeFromPlan}
            onShuffleMeal={shuffleSingleMeal}
            onShuffleAllMeals={shuffleAllMeals}
            selectedMealsHistory={mealsHistory}
            onSelectMealForDay={(date, mealType, recipe) => {
              selectMealForDay(date, mealType, recipe);
            }}
            dietaryPreference={userProfile?.dietaryPreference}
            onRequestNewPlan={() => setActiveTab('perfil')}
          />
        )}

        {/* TAB 3: HISTÓRICO */}
        {activeTab === 'historico' && (
          <HistoryScreen
            weighIns={weighInHistory}
            hydrationHistory={hydrationHistory}
            mealsHistory={mealsHistory}
            onOpenWeighInModal={() => setShowWeighInModal(true)}
          />
        )}

        {/* TAB 4: EJERCICIOS */}
        {activeTab === 'ejercicios' && (
          <ExercisesScreen mediaProvider={exerciseMediaProvider} mediaLoadCache={exerciseMediaCache} />
        )}

        {/* TAB 5: PERFIL */}
        {activeTab === 'perfil' && (
          <ProfileScreen
            profile={userProfile}
            onSaveProfile={saveUserProfile}
            onResetData={handleResetAll}
            showResetConfirm={showResetConfirm}
            setShowResetConfirm={setShowResetConfirm}
          />
        )}
      </View>

      {/* BARRA DE NAVEGACIÓN */}
      <View style={styles.bottomNav}>
        {([
          { id: 'hoy', icon: '🏠', label: 'Hoy' },
          { id: 'plan', icon: '🥗', label: 'Dieta' },
          { id: 'historico', icon: '📈', label: 'Histórico' },
          { id: 'ejercicios', icon: '🏋️', label: 'Ejercicios' },
          { id: 'perfil', icon: '👤', label: 'Perfil' },
        ] as const).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.navItem}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
            >
              <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
                <Text style={[styles.navIcon, isActive && styles.navIconActive]}>{tab.icon}</Text>
              </View>
              <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
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
  safeArea: { flex: 1, backgroundColor: '#000000' },
  loadingContainer: { flex: 1, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center' },
  loadingEmoji: { fontSize: 60, marginBottom: 12 },
  loadingText: { color: '#F59E0B', fontSize: 18, fontWeight: '700' },
  toast: {
    position: 'absolute', top: 50, left: 16, right: 16, borderRadius: 14, padding: 14,
    borderWidth: 1, zIndex: 999, elevation: 20,
  },
  toastText: { color: '#F8FAFC', fontSize: 14, fontWeight: '700', textAlign: 'center' },
  mainContent: { flex: 1 },
  scrollPadding: { paddingBottom: 28 },
  topHeader: {
    paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  welcomeText: { color: '#F8FAFC', fontSize: 26, fontWeight: '900', letterSpacing: 0.2 },
  dateSubtext: { color: '#A1A1AA', fontSize: 14, textTransform: 'capitalize', marginTop: 3, fontWeight: '500' },
  changeProfileBtn: { backgroundColor: '#121216', borderRadius: 12, padding: 10, borderWidth: 1, borderColor: '#27272A' },
  changeProfileBtnText: { fontSize: 18 },
  cardWater: { backgroundColor: '#121216', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#26262B', marginHorizontal: 16, marginBottom: 10, marginTop: 4 },
  waterHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  waterTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '800' },
  waterSubtitle: { color: '#06B6D4', fontSize: 13, fontWeight: '700', marginTop: 3 },
  waterButtonsRow: { flexDirection: 'row', alignItems: 'center' },
  waterBtnMinus: { backgroundColor: '#27272A', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  waterBtnMinusText: { color: '#F8FAFC', fontSize: 18, fontWeight: '800' },
  waterBtnPlus: { backgroundColor: '#F59E0B', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
  waterBtnPlusText: { color: '#000000', fontSize: 14, fontWeight: '900' },
  glassesIndicatorRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  glassDot: { flex: 1, height: 10, borderRadius: 5, backgroundColor: '#27272A', marginHorizontal: 1.5 },
  glassDotFilled: { backgroundColor: '#06B6D4' },
  glassDotBonus: { backgroundColor: '#10B981' },
  glassDotSeparator: { borderLeftWidth: 2, borderLeftColor: '#3F3F46' },
  waterLegend: { flexDirection: 'row', marginTop: 10 },
  waterLegendItem: { flexDirection: 'row', alignItems: 'center', marginRight: 16 },
  waterLegendDot: { width: 9, height: 9, borderRadius: 5, marginRight: 5 },
  waterLegendText: { color: '#A1A1AA', fontSize: 11, fontWeight: '600' },
  weighInBanner: {
    backgroundColor: '#121216', borderRadius: 18, padding: 16, marginHorizontal: 16,
    marginTop: 8, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#27272A',
  },
  weighInBannerIcon: { fontSize: 28, marginRight: 14 },
  weighInBannerTextCol: { flex: 1 },
  weighInBannerTitle: { color: '#F59E0B', fontWeight: '800', fontSize: 17 },
  weighInBannerDesc: { color: '#A1A1AA', fontSize: 13, marginTop: 3, lineHeight: 18 },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#09090B',
    borderTopWidth: 1,
    borderTopColor: '#26262B',
    paddingVertical: 8,
    paddingBottom: 14,
    paddingHorizontal: 6,
  },
  navItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  iconContainer: {
    width: 48,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  iconContainerActive: {
    backgroundColor: 'rgba(245, 158, 11, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.45)',
  },
  navIcon: { fontSize: 22, opacity: 0.6 },
  navIconActive: { fontSize: 24, opacity: 1 },
  navLabel: { color: '#71717A', fontSize: 12, fontWeight: '700', letterSpacing: 0.2 },
  navLabelActive: { color: '#F59E0B', fontSize: 13, fontWeight: '900', letterSpacing: 0.3 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: '#121216', borderRadius: 22, padding: 22, width: '100%', borderWidth: 1, borderColor: '#27272A' },
  modalTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: '800' },
  modalSubtitle: { color: '#A1A1AA', fontSize: 14, marginTop: 4, marginBottom: 18 },
  modalInputLabel: { color: '#CBD5E1', fontSize: 14, fontWeight: '700', marginBottom: 8 },
  modalInput: { backgroundColor: '#000000', borderWidth: 1, borderColor: '#27272A', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, color: '#F8FAFC', fontSize: 16, marginBottom: 16 },
  modalButtonsRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10 },
  modalCancelBtn: { paddingHorizontal: 16, paddingVertical: 12, marginRight: 8 },
  modalCancelText: { color: '#A1A1AA', fontWeight: '700', fontSize: 15 },
  modalConfirmBtn: { backgroundColor: '#F59E0B', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  modalConfirmText: { color: '#000000', fontWeight: '900', fontSize: 15 },
});
