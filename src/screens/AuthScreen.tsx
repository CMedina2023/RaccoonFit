import React, { useState, useEffect, useRef } from 'react';
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
  Dimensions,
} from 'react-native';
import { UserProfile } from '../types';

const { width } = Dimensions.get('window');

interface Props {
  onComplete: (profile: UserProfile) => void;
  existingProfile: UserProfile | null;
}

type Step = 'welcome' | 'name' | 'gender' | 'age' | 'height' | 'weight' | 'goal' | 'time' | 'summary';

const STEPS: Step[] = ['welcome', 'name', 'gender', 'age', 'height', 'weight', 'goal', 'time', 'summary'];

export const AuthScreen: React.FC<Props> = ({ onComplete, existingProfile }) => {
  const [step, setStep] = useState<Step>('welcome');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [age, setAge] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [currentWeightKg, setCurrentWeightKg] = useState('');
  const [targetWeightKg, setTargetWeightKg] = useState('');
  const [routineMinutes, setRoutineMinutes] = useState<20 | 30 | 60 | null>(null);

  const animateTransition = (nextStep: Step) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 180,
      useNativeDriver: true,
    }).start(() => {
      setStep(nextStep);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }).start();
    });
  };

  const next = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) animateTransition(STEPS[idx + 1]);
  };

  const back = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) animateTransition(STEPS[idx - 1]);
  };

  const currentStepIndex = STEPS.indexOf(step);
  const progress = currentStepIndex / (STEPS.length - 1);

  const handleFinish = () => {
    const profile: UserProfile = {
      name: name.trim() || 'Compañero',
      gender: gender || 'male',
      age: parseInt(age, 10) || 30,
      heightCm: parseFloat(heightCm) || 170,
      startingWeightKg: parseFloat(currentWeightKg) || 80,
      targetWeightKg: parseFloat(targetWeightKg) || 70,
      activityLevel: 'sedentary',
      preferredRoutineMinutes: routineMinutes || 30,
      weighInDayOfWeek: 5,
      createdAt: new Date().toISOString(),
    };
    onComplete(profile);
  };

  const canProceed = (): boolean => {
    switch (step) {
      case 'welcome': return true;
      case 'name': return name.trim().length >= 2;
      case 'gender': return gender !== null;
      case 'age': return parseInt(age) >= 10 && parseInt(age) <= 99;
      case 'height': return parseFloat(heightCm) >= 100 && parseFloat(heightCm) <= 250;
      case 'weight': return parseFloat(currentWeightKg) >= 30 && parseFloat(currentWeightKg) <= 300;
      case 'goal': return parseFloat(targetWeightKg) >= 30 && parseFloat(targetWeightKg) <= 300;
      case 'time': return routineMinutes !== null;
      case 'summary': return true;
      default: return false;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

      {/* Barra de progreso del wizard */}
      {step !== 'welcome' && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      )}

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>

        {/* PANTALLA DE BIENVENIDA */}
        {step === 'welcome' && (
          <View style={styles.centerContent}>
            <Text style={styles.raccoonEmoji}>🦝</Text>
            <Text style={styles.appTitle}>Dieta & Fitness</Text>
            <Text style={styles.appTagline}>Tu compañero de hábitos saludables</Text>

            {existingProfile && (
              <TouchableOpacity
                style={styles.continueBtn}
                onPress={() => onComplete(existingProfile)}
              >
                <Text style={styles.continueBtnText}>
                  Continuar como {existingProfile.name} ▶
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.primaryBtn, existingProfile && styles.secondaryOutlineBtn]}
              onPress={() => animateTransition('name')}
            >
              <Text style={[styles.primaryBtnText, existingProfile && styles.secondaryOutlineBtnText]}>
                {existingProfile ? 'Crear Nuevo Perfil' : 'Comenzar mi Transformación'}
              </Text>
            </TouchableOpacity>

            <Text style={styles.disclaimerMini}>
              ⚖️ Guía informativa de hábitos. No sustituye consulta médica.
            </Text>
          </View>
        )}

        {/* PASO: NOMBRE */}
        {step === 'name' && (
          <View style={styles.stepContent}>
            <Text style={styles.stepEmoji}>👋</Text>
            <Text style={styles.stepTitle}>¿Cómo te llamamos?</Text>
            <Text style={styles.stepSubtitle}>Rocky, tu Mapache, quiere conocerte</Text>
            <TextInput
              style={styles.bigInput}
              value={name}
              onChangeText={setName}
              placeholder="Tu nombre"
              placeholderTextColor="#64748B"
              autoFocus
              maxLength={30}
            />
          </View>
        )}

        {/* PASO: SEXO BIOLÓGICO */}
        {step === 'gender' && (
          <View style={styles.stepContent}>
            <Text style={styles.stepEmoji}>⚕️</Text>
            <Text style={styles.stepTitle}>Sexo Biológico</Text>
            <Text style={styles.stepSubtitle}>
              Necesitamos este dato para calcular tu IMC y peso referencial de forma precisa según la OMS
            </Text>
            <TouchableOpacity
              style={[styles.optionCard, gender === 'male' && styles.optionCardActive]}
              onPress={() => setGender('male')}
            >
              <Text style={styles.optionCardEmoji}>👨</Text>
              <Text style={styles.optionCardLabel}>Hombre</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionCard, gender === 'female' && styles.optionCardActive]}
              onPress={() => setGender('female')}
            >
              <Text style={styles.optionCardEmoji}>👩</Text>
              <Text style={styles.optionCardLabel}>Mujer</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* PASO: EDAD */}
        {step === 'age' && (
          <View style={styles.stepContent}>
            <Text style={styles.stepEmoji}>🎂</Text>
            <Text style={styles.stepTitle}>¿Cuántos años tienes?</Text>
            <Text style={styles.stepSubtitle}>La edad ajusta tu metabolismo basal estimado</Text>
            <TextInput
              style={styles.bigInput}
              value={age}
              onChangeText={setAge}
              placeholder="Ej. 30"
              placeholderTextColor="#64748B"
              keyboardType="numeric"
              maxLength={3}
              autoFocus
            />
          </View>
        )}

        {/* PASO: ESTATURA */}
        {step === 'height' && (
          <View style={styles.stepContent}>
            <Text style={styles.stepEmoji}>📏</Text>
            <Text style={styles.stepTitle}>¿Cuál es tu estatura?</Text>
            <Text style={styles.stepSubtitle}>En centímetros (ej. 170 para 1.70 m)</Text>
            <TextInput
              style={styles.bigInput}
              value={heightCm}
              onChangeText={setHeightCm}
              placeholder="Ej. 170"
              placeholderTextColor="#64748B"
              keyboardType="numeric"
              maxLength={3}
              autoFocus
            />
            <Text style={styles.inputUnit}>centímetros</Text>
          </View>
        )}

        {/* PASO: PESO ACTUAL */}
        {step === 'weight' && (
          <View style={styles.stepContent}>
            <Text style={styles.stepEmoji}>⚖️</Text>
            <Text style={styles.stepTitle}>¿Cuánto pesas ahora?</Text>
            <Text style={styles.stepSubtitle}>
              Tómate un momento, pésate en ayunas si puedes. Este será nuestro punto de partida.
            </Text>
            <TextInput
              style={styles.bigInput}
              value={currentWeightKg}
              onChangeText={setCurrentWeightKg}
              placeholder="Ej. 82.5"
              placeholderTextColor="#64748B"
              keyboardType="numeric"
              autoFocus
            />
            <Text style={styles.inputUnit}>kilogramos</Text>
          </View>
        )}

        {/* PASO: PESO OBJETIVO */}
        {step === 'goal' && (
          <View style={styles.stepContent}>
            <Text style={styles.stepEmoji}>🎯</Text>
            <Text style={styles.stepTitle}>¿Cuál es tu meta de peso?</Text>
            <Text style={styles.stepSubtitle}>
              Recuerda: perder 0.5 a 1 kg por semana es sostenible y saludable. Sin prisa, sin rebote.
            </Text>
            <TextInput
              style={styles.bigInput}
              value={targetWeightKg}
              onChangeText={setTargetWeightKg}
              placeholder="Ej. 74.0"
              placeholderTextColor="#64748B"
              keyboardType="numeric"
              autoFocus
            />
            <Text style={styles.inputUnit}>kilogramos objetivo</Text>
          </View>
        )}

        {/* PASO: TIEMPO DE RUTINA */}
        {step === 'time' && (
          <View style={styles.stepContent}>
            <Text style={styles.stepEmoji}>⏱️</Text>
            <Text style={styles.stepTitle}>¿Cuánto tiempo tienes al día?</Text>
            <Text style={styles.stepSubtitle}>
              Sé honesto. Empezar con 20 minutos y ser constante supera a 1 hora irregular.
            </Text>
            <TouchableOpacity
              style={[styles.optionCard, routineMinutes === 20 && styles.optionCardActive]}
              onPress={() => setRoutineMinutes(20)}
            >
              <Text style={styles.optionCardLabel}>⚡ 20 Minutos</Text>
              <Text style={styles.optionCardDesc}>3-4 ejercicios en circuito. Ideal para empezar.</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionCard, routineMinutes === 30 && styles.optionCardActive]}
              onPress={() => setRoutineMinutes(30)}
            >
              <Text style={styles.optionCardLabel}>💪 30 Minutos</Text>
              <Text style={styles.optionCardDesc}>5 ejercicios con series y descansos.</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionCard, routineMinutes === 60 && styles.optionCardActive]}
              onPress={() => setRoutineMinutes(60)}
            >
              <Text style={styles.optionCardLabel}>🏋️ 1 Hora</Text>
              <Text style={styles.optionCardDesc}>Rutina completa con fuerza y cardio.</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* RESUMEN FINAL ANTES DE GENERAR PLAN */}
        {step === 'summary' && (
          <View style={styles.stepContent}>
            <Text style={styles.stepEmoji}>🦝✨</Text>
            <Text style={styles.stepTitle}>¡Listo, {name || 'Compañero'}!</Text>
            <Text style={styles.stepSubtitle}>Rocky revisó todo. Este es tu punto de partida:</Text>

            <View style={styles.summaryCard}>
              <SummaryRow label="Nombre" value={name} />
              <SummaryRow label="Sexo" value={gender === 'male' ? 'Hombre' : 'Mujer'} />
              <SummaryRow label="Edad" value={`${age} años`} />
              <SummaryRow label="Estatura" value={`${heightCm} cm`} />
              <SummaryRow label="Peso Actual" value={`${currentWeightKg} kg`} />
              <SummaryRow label="Peso Objetivo" value={`${targetWeightKg} kg`} />
              <SummaryRow label="Tiempo de Rutina" value={routineMinutes === 60 ? '1 Hora' : `${routineMinutes} minutos`} />
            </View>

            <Text style={styles.summaryNote}>
              ⚖️ Esta app es una guía de hábitos saludables y no sustituye la consulta con tu médico o nutriólogo.
            </Text>
          </View>
        )}
      </Animated.View>

      {/* BOTONES DE NAVEGACIÓN DEL WIZARD */}
      {step !== 'welcome' && (
        <View style={styles.navButtons}>
          <TouchableOpacity style={styles.backBtn} onPress={back}>
            <Text style={styles.backBtnText}>← Atrás</Text>
          </TouchableOpacity>

          {step === 'summary' ? (
            <TouchableOpacity
              style={[styles.nextBtn, styles.finishBtn]}
              onPress={handleFinish}
            >
              <Text style={styles.nextBtnText}>Generar Mi Plan 🚀</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.nextBtn, !canProceed() && styles.nextBtnDisabled]}
              onPress={canProceed() ? next : undefined}
            >
              <Text style={styles.nextBtnText}>Siguiente →</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
};

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <View style={summaryRowStyles.row}>
    <Text style={summaryRowStyles.label}>{label}</Text>
    <Text style={summaryRowStyles.value}>{value}</Text>
  </View>
);

const summaryRowStyles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#334155' },
  label: { color: '#94A3B8', fontSize: 13 },
  value: { color: '#10B981', fontWeight: '700', fontSize: 13 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F172A' },
  progressBar: { height: 4, backgroundColor: '#1E293B', marginHorizontal: 0 },
  progressFill: { height: 4, backgroundColor: '#10B981', borderRadius: 2 },
  content: { flex: 1, justifyContent: 'center', padding: 24 },
  centerContent: { alignItems: 'center' },
  raccoonEmoji: { fontSize: 80, marginBottom: 16 },
  appTitle: { fontSize: 32, fontWeight: '800', color: '#F8FAFC', textAlign: 'center' },
  appTagline: { fontSize: 15, color: '#94A3B8', marginTop: 8, marginBottom: 32, textAlign: 'center' },
  continueBtn: {
    width: '100%', backgroundColor: '#10B981', borderRadius: 16,
    paddingVertical: 16, alignItems: 'center', marginBottom: 12,
  },
  continueBtnText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
  primaryBtn: {
    width: '100%', backgroundColor: '#1E293B', borderRadius: 16,
    paddingVertical: 16, alignItems: 'center', borderWidth: 1, borderColor: '#334155',
  },
  primaryBtnText: { color: '#F8FAFC', fontWeight: '700', fontSize: 15 },
  secondaryOutlineBtn: { borderColor: '#475569' },
  secondaryOutlineBtnText: { color: '#94A3B8' },
  disclaimerMini: { color: '#475569', fontSize: 11, textAlign: 'center', marginTop: 24, lineHeight: 16 },
  stepContent: { alignItems: 'center' },
  stepEmoji: { fontSize: 64, marginBottom: 16, textAlign: 'center' },
  stepTitle: { fontSize: 26, fontWeight: '800', color: '#F8FAFC', textAlign: 'center', marginBottom: 10 },
  stepSubtitle: { fontSize: 14, color: '#94A3B8', textAlign: 'center', lineHeight: 20, marginBottom: 28 },
  bigInput: {
    width: '100%', backgroundColor: '#1E293B', borderRadius: 16, borderWidth: 1,
    borderColor: '#334155', paddingHorizontal: 20, paddingVertical: 18,
    color: '#F8FAFC', fontSize: 22, fontWeight: '700', textAlign: 'center',
  },
  inputUnit: { color: '#64748B', fontSize: 12, marginTop: 8 },
  optionCard: {
    width: '100%', backgroundColor: '#1E293B', borderRadius: 14, padding: 16,
    marginBottom: 10, borderWidth: 1, borderColor: '#334155', alignItems: 'center',
  },
  optionCardActive: { borderColor: '#10B981', backgroundColor: '#064E3B' },
  optionCardEmoji: { fontSize: 36, marginBottom: 6 },
  optionCardLabel: { color: '#F8FAFC', fontSize: 16, fontWeight: '700' },
  optionCardDesc: { color: '#94A3B8', fontSize: 12, marginTop: 4, textAlign: 'center' },
  summaryCard: { width: '100%', backgroundColor: '#1E293B', borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#334155' },
  summaryNote: { color: '#64748B', fontSize: 11, textAlign: 'center', lineHeight: 16 },
  navButtons: { flexDirection: 'row', padding: 20, paddingBottom: 30 },
  backBtn: { paddingHorizontal: 20, paddingVertical: 14, borderRadius: 12, backgroundColor: '#1E293B', marginRight: 10 },
  backBtnText: { color: '#94A3B8', fontWeight: '600' },
  nextBtn: { flex: 1, backgroundColor: '#10B981', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  nextBtnDisabled: { backgroundColor: '#1E293B' },
  nextBtnText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  finishBtn: { backgroundColor: '#F59E0B' },
});
