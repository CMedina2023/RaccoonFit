import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput,
} from 'react-native';
import { UserProfile, FitnessGoal, TrainingLevel } from '../types';
import { TRAINING_LEVELS } from '../core/trainingLevel';
import { usePlanActions } from '../store/selectors';

interface Props {
  profile: UserProfile | null;
  onSaveProfile: (profile: UserProfile) => void;
  onResetData: () => void;
  showResetConfirm: boolean;
  setShowResetConfirm: (v: boolean) => void;
}

export const ProfileScreen: React.FC<Props> = ({
  profile, onSaveProfile, onResetData, showResetConfirm, setShowResetConfirm,
}) => {
  const { currentPlan } = usePlanActions();

  const [name, setName] = useState(profile?.name || '');
  const [gender, setGender] = useState<'male' | 'female'>(profile?.gender || 'male');
  const [age, setAge] = useState(profile?.age ? String(profile.age) : '');
  const [heightCm, setHeightCm] = useState(profile?.heightCm ? String(profile.heightCm) : '');
  const [startingWeightKg, setStartingWeightKg] = useState(profile?.startingWeightKg ? String(profile.startingWeightKg) : '');
  const [targetWeightKg, setTargetWeightKg] = useState(profile?.targetWeightKg ? String(profile.targetWeightKg) : '');
  const [activityLevel, setActivityLevel] = useState<UserProfile['activityLevel']>(profile?.activityLevel || 'sedentary');
  const [trainingLevel, setTrainingLevel] = useState<TrainingLevel>(profile?.trainingLevel || (profile?.activityLevel === 'active' ? 'advanced' : profile?.activityLevel === 'moderate' ? 'intermediate' : 'beginner'));
  const [routineMinutes, setRoutineMinutes] = useState<20 | 30 | 60>(profile?.preferredRoutineMinutes || 30);
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal>(profile?.fitnessGoal || 'fat_loss');

  const isValid = name.trim().length >= 2
    && parseInt(age) >= 10 && parseFloat(heightCm) >= 100
    && parseFloat(startingWeightKg) >= 30 && parseFloat(targetWeightKg) >= 30;

  const handleSave = () => {
    if (!isValid) return;
    const updatedProfile: UserProfile = {
      name: name.trim(),
      gender,
      age: parseInt(age, 10),
      heightCm: parseFloat(heightCm),
      startingWeightKg: parseFloat(startingWeightKg),
      targetWeightKg: parseFloat(targetWeightKg),
      activityLevel,
      trainingLevel,
      preferredRoutineMinutes: routineMinutes,
      weighInDayOfWeek: profile?.weighInDayOfWeek ?? 5,
      createdAt: profile?.createdAt || new Date().toISOString(),
      fitnessGoal,
    };
    onSaveProfile(updatedProfile);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Perfil y Metas</Text>
        <Text style={styles.subtitle}>Modifica tus datos para recalcular tu plan</Text>
      </View>

      {/* Sexo */}
      <Text style={styles.label}>Sexo Biológico (fórmulas OMS/Robinson):</Text>
      <View style={styles.row}>
        <TouchableOpacity style={[styles.genderBtn, gender === 'male' && styles.genderActive]} onPress={() => setGender('male')}>
          <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>👨 Hombre</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.genderBtn, gender === 'female' && styles.genderActive]} onPress={() => setGender('female')}>
          <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>👩 Mujer</Text>
        </TouchableOpacity>
      </View>

      {/* Nombre y Edad */}
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>Nombre:</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholderTextColor="#64748B" placeholder="Tu nombre" />
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>Edad:</Text>
          <TextInput style={styles.input} value={age} onChangeText={setAge} keyboardType="numeric" placeholder="Ej. 30" placeholderTextColor="#64748B" />
        </View>
      </View>

      {/* Estatura y Peso */}
      <View style={styles.row}>
        <View style={styles.col}>
          <Text style={styles.label}>Estatura (cm):</Text>
          <TextInput style={styles.input} value={heightCm} onChangeText={setHeightCm} keyboardType="numeric" placeholder="Ej. 170" placeholderTextColor="#64748B" />
        </View>
        <View style={styles.col}>
          <Text style={styles.label}>Peso Actual (kg):</Text>
          <TextInput style={styles.input} value={startingWeightKg} onChangeText={setStartingWeightKg} keyboardType="numeric" placeholder="Ej. 82.0" placeholderTextColor="#64748B" />
        </View>
      </View>

      <Text style={styles.label}>Peso Objetivo (kg):</Text>
      <TextInput style={styles.input} value={targetWeightKg} onChangeText={setTargetWeightKg} keyboardType="numeric" placeholder="Ej. 74.0" placeholderTextColor="#64748B" />

      {/* Objetivo */}
      <Text style={[styles.label, { marginTop: 14 }]}>Objetivo Principal:</Text>
      <View style={styles.row}>
        {[
          { id: 'fat_loss', label: '🔥 Perder grasa' },
          { id: 'muscle_gain', label: '💪 Ganar músculo' },
          { id: 'stress_relief', label: '🧘 Anti-estrés' },
        ].map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.goalBtn, fitnessGoal === item.id && styles.goalBtnActive]}
            onPress={() => setFitnessGoal(item.id as FitnessGoal)}
          >
            <Text style={[styles.goalBtnText, fitnessGoal === item.id && styles.goalBtnTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Nivel de entrenamiento */}
      <Text style={[styles.label, { marginTop: 14 }]}>Nivel de entrenamiento:</Text>
      <View style={styles.row}>
        {(Object.values(TRAINING_LEVELS)).map((level) => {
          return (
            <TouchableOpacity key={level.id} style={[styles.levelBtn, trainingLevel === level.id && styles.levelBtnActive]} onPress={() => setTrainingLevel(level.id)} accessibilityRole="button" accessibilityLabel={`Nivel ${level.label}`}>
              <Text style={[styles.levelBtnText, trainingLevel === level.id && styles.levelBtnTextActive]}>{level.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Tiempo de rutina */}
      <Text style={[styles.label, { marginTop: 14 }]}>Tiempo disponible por rutina:</Text>
      <View style={styles.row}>
        {([20, 30, 60] as const).map((mins) => (
          <TouchableOpacity key={mins} style={[styles.timeBtn, routineMinutes === mins && styles.timeBtnActive]} onPress={() => setRoutineMinutes(mins)}>
            <Text style={[styles.timeBtnText, routineMinutes === mins && styles.timeBtnTextActive]}>
              {mins === 60 ? '1 Hora' : `${mins} min`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Botón de guardado con texto contextual */}
      <TouchableOpacity
        style={[styles.saveBtn, !isValid && styles.saveBtnDisabled]}
        onPress={isValid ? handleSave : undefined}
        activeOpacity={isValid ? 0.8 : 1}
      >
        <Text style={styles.saveBtnText}>
          {!currentPlan ? '🚀 Generar Mi Primer Plan' : '💾 Actualizar Perfil y Recalcular Plan'}
        </Text>
      </TouchableOpacity>

      {!isValid && (
        <Text style={styles.validationNote}>* Completa todos los campos para habilitar esta acción</Text>
      )}

      {/* Disclaimer médico */}
      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerTitle}>⚖️ Aviso Médico</Text>
        <Text style={styles.disclaimerText}>
          Esta aplicación tiene fines informativos de apoyo a hábitos saludables. No sustituye la evaluación médica,
          nutricional o cardiológica profesional. Si tienes condiciones de salud preexistentes, consulta siempre a tu médico.
        </Text>
      </View>

      {/* Reset con confirmación visual propia */}
      <TouchableOpacity style={styles.resetBtn} onPress={() => setShowResetConfirm(true)}>
        <Text style={styles.resetBtnText}>🗑️ Restablecer todos mis datos</Text>
      </TouchableOpacity>

      {/* Modal de confirmación de reset */}
      <Modal visible={showResetConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>⚠️</Text>
            <Text style={styles.modalTitle}>¿Restablecer Datos?</Text>
            <Text style={styles.modalDesc}>
              Se borrarán tu perfil, historial de peso, hidratación y plan actual. Esta acción no se puede deshacer.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowResetConfirm(false)}>
                <Text style={styles.cancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmResetBtn} onPress={() => { setShowResetConfirm(false); onResetData(); }}>
                <Text style={styles.confirmResetText}>Sí, Restablecer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  content: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#F8FAFC' },
  subtitle: { fontSize: 12, color: '#A1A1AA', marginTop: 2 },
  label: { color: '#E4E4E7', fontSize: 12, fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: '#121216', borderWidth: 1, borderColor: '#26262B', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, color: '#F8FAFC', fontSize: 14, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  col: { width: '48%' },
  genderBtn: { flex: 1, backgroundColor: '#121216', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginRight: 8, borderWidth: 1, borderColor: '#26262B' },
  genderActive: { backgroundColor: '#F59E0B', borderColor: '#F59E0B' },
  genderText: { color: '#A1A1AA', fontSize: 14, fontWeight: '600' },
  genderTextActive: { color: '#000000', fontWeight: '800' },
  goalBtn: { flex: 1, backgroundColor: '#121216', borderRadius: 10, paddingVertical: 10, alignItems: 'center', marginRight: 6, borderWidth: 1, borderColor: '#26262B' },
  goalBtnActive: { backgroundColor: '#0F291E', borderColor: '#10B981' },
  goalBtnText: { color: '#A1A1AA', fontSize: 11, fontWeight: '600' },
  goalBtnTextActive: { color: '#F8FAFC', fontWeight: '700' },
  levelBtn: { flex: 1, backgroundColor: '#121216', borderRadius: 8, paddingVertical: 8, alignItems: 'center', marginRight: 4, borderWidth: 1, borderColor: '#26262B' },
  levelBtnActive: { backgroundColor: '#1E1B4B', borderColor: '#6366F1' },
  levelBtnText: { color: '#A1A1AA', fontSize: 10, fontWeight: '600' },
  levelBtnTextActive: { color: '#FFFFFF', fontWeight: '700' },
  timeBtn: { flex: 1, backgroundColor: '#121216', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginRight: 8, borderWidth: 1, borderColor: '#26262B' },
  timeBtnActive: { backgroundColor: '#083344', borderColor: '#06B6D4' },
  timeBtnText: { color: '#A1A1AA', fontSize: 13, fontWeight: '600' },
  timeBtnTextActive: { color: '#FFFFFF', fontWeight: '700' },
  saveBtn: { backgroundColor: '#F59E0B', borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 8, marginBottom: 4 },
  saveBtnDisabled: { backgroundColor: '#121216', borderWidth: 1, borderColor: '#26262B' },
  saveBtnText: { color: '#000000', fontWeight: '800', fontSize: 15 },
  validationNote: { color: '#F59E0B', fontSize: 11, textAlign: 'center', marginBottom: 12 },
  disclaimer: { backgroundColor: '#121216', borderRadius: 14, padding: 14, borderLeftWidth: 4, borderLeftColor: '#F59E0B', marginBottom: 20, borderWidth: 1, borderColor: '#26262B' },
  disclaimerTitle: { color: '#F59E0B', fontSize: 12, fontWeight: '700', marginBottom: 4 },
  disclaimerText: { color: '#A1A1AA', fontSize: 11, lineHeight: 16 },
  resetBtn: { paddingVertical: 10, alignItems: 'center' },
  resetBtnText: { color: '#EF4444', fontSize: 12, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalCard: { backgroundColor: '#121216', borderRadius: 20, padding: 24, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#EF4444' },
  modalEmoji: { fontSize: 40, marginBottom: 8 },
  modalTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  modalDesc: { color: '#A1A1AA', fontSize: 13, textAlign: 'center', lineHeight: 18, marginBottom: 20 },
  modalButtons: { flexDirection: 'row', width: '100%' },
  cancelBtn: { flex: 1, backgroundColor: '#27272A', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginRight: 8 },
  cancelBtnText: { color: '#A1A1AA', fontWeight: '600' },
  confirmResetBtn: { flex: 1, backgroundColor: '#EF4444', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  confirmResetText: { color: '#FFFFFF', fontWeight: '700' },
});
