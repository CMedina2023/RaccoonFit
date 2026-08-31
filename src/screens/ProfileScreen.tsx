import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput,
} from 'react-native';
import { UserProfile } from '../types';
import { useAppStore } from '../store/useAppStore';

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
  const { currentPlan } = useAppStore();

  const [name, setName] = useState(profile?.name || '');
  const [gender, setGender] = useState<'male' | 'female'>(profile?.gender || 'male');
  const [age, setAge] = useState(profile?.age ? String(profile.age) : '');
  const [heightCm, setHeightCm] = useState(profile?.heightCm ? String(profile.heightCm) : '');
  const [startingWeightKg, setStartingWeightKg] = useState(profile?.startingWeightKg ? String(profile.startingWeightKg) : '');
  const [targetWeightKg, setTargetWeightKg] = useState(profile?.targetWeightKg ? String(profile.targetWeightKg) : '');
  const [activityLevel, setActivityLevel] = useState<UserProfile['activityLevel']>(profile?.activityLevel || 'sedentary');
  const [routineMinutes, setRoutineMinutes] = useState<20 | 30 | 60>(profile?.preferredRoutineMinutes || 30);

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
      preferredRoutineMinutes: routineMinutes,
      weighInDayOfWeek: profile?.weighInDayOfWeek ?? 5,
      createdAt: profile?.createdAt || new Date().toISOString(),
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

      {/* Nivel de Actividad */}
      <Text style={[styles.label, { marginTop: 14 }]}>Nivel de Actividad Actual:</Text>
      <View style={styles.row}>
        {(['sedentary', 'light', 'moderate', 'active'] as const).map((lv) => {
          const labels = { sedentary: 'Sedentario', light: 'Ligero', moderate: 'Moderado', active: 'Activo' };
          return (
            <TouchableOpacity key={lv} style={[styles.levelBtn, activityLevel === lv && styles.levelBtnActive]} onPress={() => setActivityLevel(lv)}>
              <Text style={[styles.levelBtnText, activityLevel === lv && styles.levelBtnTextActive]}>{labels[lv]}</Text>
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
  container: { flex: 1, backgroundColor: '#0F172A' },
  content: { padding: 16, paddingBottom: 40 },
  header: { marginBottom: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#F8FAFC' },
  subtitle: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  label: { color: '#CBD5E1', fontSize: 12, fontWeight: '600', marginBottom: 6 },
  input: { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, color: '#F8FAFC', fontSize: 14, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  col: { width: '48%' },
  genderBtn: { flex: 1, backgroundColor: '#1E293B', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginRight: 8, borderWidth: 1, borderColor: '#334155' },
  genderActive: { backgroundColor: '#10B981', borderColor: '#10B981' },
  genderText: { color: '#94A3B8', fontSize: 14, fontWeight: '600' },
  genderTextActive: { color: '#FFFFFF', fontWeight: '700' },
  levelBtn: { flex: 1, backgroundColor: '#1E293B', borderRadius: 8, paddingVertical: 8, alignItems: 'center', marginRight: 4, borderWidth: 1, borderColor: '#334155' },
  levelBtnActive: { backgroundColor: '#1D4ED8', borderColor: '#3B82F6' },
  levelBtnText: { color: '#94A3B8', fontSize: 10, fontWeight: '600' },
  levelBtnTextActive: { color: '#FFFFFF', fontWeight: '700' },
  timeBtn: { flex: 1, backgroundColor: '#1E293B', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginRight: 8, borderWidth: 1, borderColor: '#334155' },
  timeBtnActive: { backgroundColor: '#06B6D4', borderColor: '#06B6D4' },
  timeBtnText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },
  timeBtnTextActive: { color: '#FFFFFF', fontWeight: '700' },
  saveBtn: { backgroundColor: '#10B981', borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 8, marginBottom: 4 },
  saveBtnDisabled: { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' },
  saveBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  validationNote: { color: '#F59E0B', fontSize: 11, textAlign: 'center', marginBottom: 12 },
  disclaimer: { backgroundColor: '#1E293B', borderRadius: 14, padding: 14, borderLeftWidth: 4, borderLeftColor: '#F59E0B', marginBottom: 20 },
  disclaimerTitle: { color: '#F59E0B', fontSize: 12, fontWeight: '700', marginBottom: 4 },
  disclaimerText: { color: '#94A3B8', fontSize: 11, lineHeight: 16 },
  resetBtn: { paddingVertical: 10, alignItems: 'center' },
  resetBtnText: { color: '#EF4444', fontSize: 12, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: 24 },
  modalCard: { backgroundColor: '#1E293B', borderRadius: 20, padding: 24, width: '100%', alignItems: 'center', borderWidth: 1, borderColor: '#EF4444' },
  modalEmoji: { fontSize: 40, marginBottom: 8 },
  modalTitle: { color: '#F8FAFC', fontSize: 18, fontWeight: '700', marginBottom: 8 },
  modalDesc: { color: '#94A3B8', fontSize: 13, textAlign: 'center', lineHeight: 18, marginBottom: 20 },
  modalButtons: { flexDirection: 'row', width: '100%' },
  cancelBtn: { flex: 1, backgroundColor: '#334155', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginRight: 8 },
  cancelBtnText: { color: '#94A3B8', fontWeight: '600' },
  confirmResetBtn: { flex: 1, backgroundColor: '#EF4444', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  confirmResetText: { color: '#FFFFFF', fontWeight: '700' },
});
