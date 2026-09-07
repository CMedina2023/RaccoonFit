import React, { useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import {
  UserProfile,
  FitnessGoal,
  TargetZone,
  ApproachType,
  ObstacleType,
  DietaryPreference,
} from '../types';
import { calculateCalorieNeeds } from '../core/calorieCalculator';
import Svg, { Path, Circle, Line, Defs, LinearGradient, Stop, G, Rect, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');

interface Props {
  onComplete: (profile: UserProfile) => void;
  existingProfile: UserProfile | null;
}

type Step =
  | 'welcome'
  | 'name'
  | 'gender'
  | 'age'
  | 'height'
  | 'weight'
  | 'goal_type'
  | 'approach_type'
  | 'obstacles'
  | 'calorie_intro'
  | 'calorie_analysis'
  | 'progress_projection'
  | 'meal_plan_intro'
  | 'dietary_preference'
  | 'focus_areas'
  | 'target_weight'
  | 'time'
  | 'summary';

const STEPS: Step[] = [
  'welcome',
  'name',
  'gender',
  'age',
  'height',
  'weight',
  'goal_type',
  'approach_type',
  'obstacles',
  'calorie_intro',
  'calorie_analysis',
  'progress_projection',
  'meal_plan_intro',
  'dietary_preference',
  'focus_areas',
  'target_weight',
  'time',
  'summary',
];

export const AuthScreen: React.FC<Props> = ({ onComplete, existingProfile }) => {
  const [step, setStep] = useState<Step>('welcome');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Form State
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [age, setAge] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [currentWeightKg, setCurrentWeightKg] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState<FitnessGoal | null>(null);
  const [approachType, setApproachType] = useState<ApproachType | null>(null);
  const [obstacles, setObstacles] = useState<ObstacleType[]>([]);
  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference | null>(null);
  const [focusZones, setFocusZones] = useState<TargetZone[]>([]);
  const [targetWeightKg, setTargetWeightKg] = useState('');
  const [routineMinutes, setRoutineMinutes] = useState<20 | 30 | 60 | null>(null);

  const animateTransition = (nextStep: Step) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setStep(nextStep);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 180,
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

  // Multi-select obstacle toggle
  const toggleObstacle = (obs: ObstacleType) => {
    if (obstacles.includes(obs)) {
      setObstacles(obstacles.filter((o) => o !== obs));
    } else {
      setObstacles([...obstacles, obs]);
    }
  };

  // Focus Zones toggle
  const toggleZone = (zone: TargetZone) => {
    if (zone === 'full_body') {
      if (focusZones.includes('full_body')) {
        setFocusZones([]);
      } else {
        setFocusZones(['full_body']);
      }
      return;
    }

    const withoutFullBody = focusZones.filter((z) => z !== 'full_body');
    if (withoutFullBody.includes(zone)) {
      setFocusZones(withoutFullBody.filter((z) => z !== zone));
    } else {
      const updated = [...withoutFullBody, zone];
      if (updated.length === 4) {
        setFocusZones(['full_body']);
      } else {
        setFocusZones(updated);
      }
    }
  };

  const isZoneActive = (zone: TargetZone) => {
    if (focusZones.includes('full_body')) return true;
    return focusZones.includes(zone);
  };

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
      fitnessGoal: fitnessGoal || 'fat_loss',
      approachType: approachType || 'nutrition_plan',
      obstacles: obstacles.length > 0 ? obstacles : ['inconsistency'],
      focusZones: focusZones.length > 0 ? focusZones : ['full_body'],
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
      case 'goal_type': return fitnessGoal !== null;
      case 'approach_type': return approachType !== null;
      case 'obstacles': return obstacles.length > 0;
      case 'calorie_intro': return true;
      case 'calorie_analysis': return true;
      case 'progress_projection': return true;
      case 'focus_areas': return focusZones.length > 0;
      case 'target_weight': return parseFloat(targetWeightKg) >= 30 && parseFloat(targetWeightKg) <= 300;
      case 'time': return routineMinutes !== null;
      case 'summary': return true;
      default: return false;
    }
  };

  const getGoalLabel = (g: FitnessGoal | null) => {
    switch (g) {
      case 'fat_loss': return 'Perder Grasa 🔥';
      case 'muscle_gain': return 'Ganar Músculo 💪';
      case 'maintain_weight': return 'Mantener Peso ❤️';
      case 'stress_relief': return 'Liberar Estrés 🧘';
      default: return '-';
    }
  };

  const getApproachLabel = (a: ApproachType | null) => {
    switch (a) {
      case 'nutrition_plan': return 'Plan Nutricional 🥗';
      case 'calorie_tracking': return 'Conteo / Hábitos 📊';
      default: return '-';
    }
  };

  const getFocusLabels = () => {
    if (focusZones.includes('full_body') || focusZones.length === 0) return 'Todo el cuerpo 🌟';
    const dict: Record<TargetZone, string> = {
      arms: 'Brazos',
      abs: 'Abdominales',
      glutes: 'Glúteos',
      legs: 'Piernas',
      full_body: 'Todo el cuerpo',
    };
    return focusZones.map((z) => dict[z]).join(', ');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A0A0C" />

      {/* HEADER SUPERIOR CON BOTÓN BACK Y PROGRESS BAR */}
      {step !== 'welcome' && (
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.circleBackBtn} onPress={back}>
            <Text style={styles.circleBackIcon}>←</Text>
          </TouchableOpacity>
          <View style={styles.progressBarWrapper}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>
      )}

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* PANTALLA: BIENVENIDA */}
          {step === 'welcome' && (
            <View style={styles.centerHero}>
              <View style={styles.heroBadge}>
                <Text style={styles.heroBadgeText}>🦝 RACCOON FIT</Text>
              </View>
              <Text style={styles.appTitle}>Tu Transformación{'\n'}Comienza Hoy</Text>
              <Text style={styles.appTagline}>
                Planes de entrenamiento y nutrición adaptados a tu estilo de vida, 100% prácticos y sin complicaciones.
              </Text>

              {existingProfile && (
                <TouchableOpacity
                  style={styles.continueCardBtn}
                  onPress={() => onComplete(existingProfile)}
                >
                  <Text style={styles.continueCardBtnEmoji}>⚡</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.continueCardBtnTitle}>Continuar perfil existente</Text>
                    <Text style={styles.continueCardBtnSubtitle}>Hola de nuevo, {existingProfile.name}</Text>
                  </View>
                  <Text style={styles.continueCardBtnArrow}>▶</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.primaryGoldBtn}
                onPress={() => animateTransition('name')}
              >
                <Text style={styles.primaryGoldBtnText}>
                  {existingProfile ? 'Crear Nuevo Perfil' : 'Comenzar Ahora'}
                </Text>
              </TouchableOpacity>

              <Text style={styles.disclaimerMini}>
                ⚖️ Guía de hábitos saludables. No sustituye consulta médica profesional.
              </Text>
            </View>
          )}

          {/* PASO: NOMBRE */}
          {step === 'name' && (
            <View style={styles.stepBlock}>
              <Text style={styles.stepTitle}>¿Cómo te llamas?</Text>
              <Text style={styles.stepSubtitle}>Para personalizar tus recordatorios y entrenamientos</Text>
              <TextInput
                style={styles.sleekInput}
                value={name}
                onChangeText={setName}
                placeholder="Escribe tu nombre"
                placeholderTextColor="#52525B"
                autoFocus
                maxLength={30}
              />
            </View>
          )}

          {/* PASO: GÉNERO */}
          {step === 'gender' && (
            <View style={styles.stepBlock}>
              <Text style={styles.stepTitle}>Sexo Biológico</Text>
              <Text style={styles.stepSubtitle}>
                Utilizado para el cálculo calórico exacto y métricas OMS
              </Text>

              <TouchableOpacity
                style={[styles.selectCard, gender === 'male' && styles.selectCardActive]}
                onPress={() => setGender('male')}
                activeOpacity={0.8}
              >
                <View style={styles.cardEmojiCircle}>
                  <Text style={styles.cardEmoji}>👨</Text>
                </View>
                <View style={styles.cardTextCol}>
                  <Text style={styles.cardTitle}>Hombre</Text>
                  <Text style={styles.cardSub}>Fórmulas metabólicas masculinas</Text>
                </View>
                <View style={[styles.radioCircle, gender === 'male' && styles.radioCircleActive]}>
                  {gender === 'male' && <Text style={styles.radioCheck}>✓</Text>}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.selectCard, gender === 'female' && styles.selectCardActive]}
                onPress={() => setGender('female')}
                activeOpacity={0.8}
              >
                <View style={styles.cardEmojiCircle}>
                  <Text style={styles.cardEmoji}>👩</Text>
                </View>
                <View style={styles.cardTextCol}>
                  <Text style={styles.cardTitle}>Mujer</Text>
                  <Text style={styles.cardSub}>Fórmulas metabólicas femeninas</Text>
                </View>
                <View style={[styles.radioCircle, gender === 'female' && styles.radioCircleActive]}>
                  {gender === 'female' && <Text style={styles.radioCheck}>✓</Text>}
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* PASO: EDAD */}
          {step === 'age' && (
            <View style={styles.stepBlock}>
              <Text style={styles.stepTitle}>¿Cuántos años tienes?</Text>
              <Text style={styles.stepSubtitle}>Calcularemos tu gasto metabólico en reposo</Text>
              <TextInput
                style={styles.sleekInput}
                value={age}
                onChangeText={setAge}
                placeholder="Ej. 28"
                placeholderTextColor="#52525B"
                keyboardType="numeric"
                maxLength={3}
                autoFocus
              />
              <Text style={styles.unitLabel}>Años cumplidos</Text>
            </View>
          )}

          {/* PASO: ESTATURA */}
          {step === 'height' && (
            <View style={styles.stepBlock}>
              <Text style={styles.stepTitle}>¿Cuál es tu estatura?</Text>
              <Text style={styles.stepSubtitle}>En centímetros para calcular tu índice corporal</Text>
              <TextInput
                style={styles.sleekInput}
                value={heightCm}
                onChangeText={setHeightCm}
                placeholder="Ej. 172"
                placeholderTextColor="#52525B"
                keyboardType="numeric"
                maxLength={3}
                autoFocus
              />
              <Text style={styles.unitLabel}>Centímetros (cm)</Text>
            </View>
          )}

          {/* PASO: PESO ACTUAL */}
          {step === 'weight' && (
            <View style={styles.stepBlock}>
              <Text style={styles.stepTitle}>¿Cuál es tu peso actual?</Text>
              <Text style={styles.stepSubtitle}>
                Pésate preferentemente en ayunas. Este será nuestro punto de partida.
              </Text>
              <TextInput
                style={styles.sleekInput}
                value={currentWeightKg}
                onChangeText={setCurrentWeightKg}
                placeholder="Ej. 78.5"
                placeholderTextColor="#52525B"
                keyboardType="numeric"
                autoFocus
              />
              <Text style={styles.unitLabel}>Kilogramos (kg)</Text>
            </View>
          )}

          {/* PASO: OBJETIVO (INSPIRADO EN REFERENCIA) */}
          {step === 'goal_type' && (
            <View style={styles.stepBlock}>
              <Text style={styles.stepTitle}>¿Cuál es tu objetivo?</Text>
              <Text style={styles.stepSubtitle}>
                Calcularemos tus calorías y estímulo de entrenamiento necesarios
              </Text>

              <TouchableOpacity
                style={[styles.selectCard, fitnessGoal === 'fat_loss' && styles.selectCardActive]}
                onPress={() => setFitnessGoal('fat_loss')}
                activeOpacity={0.8}
              >
                <View style={styles.cardEmojiCircle}>
                  <Text style={styles.cardEmoji}>🔥</Text>
                </View>
                <View style={styles.cardTextCol}>
                  <Text style={styles.cardTitle}>Perder Grasa</Text>
                  <Text style={styles.cardSub}>Optimiza la pérdida de peso y conserva masa muscular</Text>
                </View>
                <View style={[styles.radioCircle, fitnessGoal === 'fat_loss' && styles.radioCircleActive]}>
                  {fitnessGoal === 'fat_loss' && <Text style={styles.radioCheck}>✓</Text>}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.selectCard, fitnessGoal === 'muscle_gain' && styles.selectCardActive]}
                onPress={() => setFitnessGoal('muscle_gain')}
                activeOpacity={0.8}
              >
                <View style={styles.cardEmojiCircle}>
                  <Text style={styles.cardEmoji}>💪</Text>
                </View>
                <View style={styles.cardTextCol}>
                  <Text style={styles.cardTitle}>Ganar Músculo</Text>
                  <Text style={styles.cardSub}>Incrementa tu fuerza, tono y masa magra con constancia</Text>
                </View>
                <View style={[styles.radioCircle, fitnessGoal === 'muscle_gain' && styles.radioCircleActive]}>
                  {fitnessGoal === 'muscle_gain' && <Text style={styles.radioCheck}>✓</Text>}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.selectCard, fitnessGoal === 'maintain_weight' && styles.selectCardActive]}
                onPress={() => setFitnessGoal('maintain_weight')}
                activeOpacity={0.8}
              >
                <View style={styles.cardEmojiCircle}>
                  <Text style={styles.cardEmoji}>❤️</Text>
                </View>
                <View style={styles.cardTextCol}>
                  <Text style={styles.cardTitle}>Mantener Peso</Text>
                  <Text style={styles.cardSub}>Mantén tu peso estable y busca la recomposición corporal</Text>
                </View>
                <View style={[styles.radioCircle, fitnessGoal === 'maintain_weight' && styles.radioCircleActive]}>
                  {fitnessGoal === 'maintain_weight' && <Text style={styles.radioCheck}>✓</Text>}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.selectCard, fitnessGoal === 'stress_relief' && styles.selectCardActive]}
                onPress={() => setFitnessGoal('stress_relief')}
                activeOpacity={0.8}
              >
                <View style={styles.cardEmojiCircle}>
                  <Text style={styles.cardEmoji}>🧘</Text>
                </View>
                <View style={styles.cardTextCol}>
                  <Text style={styles.cardTitle}>Liberar el Estrés</Text>
                  <Text style={styles.cardSub}>Movilidad activa, endorfinas y energía sin agotarte</Text>
                </View>
                <View style={[styles.radioCircle, fitnessGoal === 'stress_relief' && styles.radioCircleActive]}>
                  {fitnessGoal === 'stress_relief' && <Text style={styles.radioCheck}>✓</Text>}
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* PASO NUEVO: ¿CÓMO QUIERES LOGRARLO? */}
          {step === 'approach_type' && (
            <View style={styles.stepBlock}>
              <Text style={styles.stepTitle}>¿Cómo quieres lograrlo?</Text>
              <Text style={styles.stepSubtitle}>
                Elige la forma en la que prefieres que Rocky te guíe en tus comidas
              </Text>

              <TouchableOpacity
                style={[styles.selectCard, approachType === 'nutrition_plan' && styles.selectCardActive]}
                onPress={() => setApproachType('nutrition_plan')}
                activeOpacity={0.8}
              >
                <View style={styles.cardEmojiCircle}>
                  <Text style={styles.cardEmoji}>🥗</Text>
                </View>
                <View style={styles.cardTextCol}>
                  <Text style={styles.cardTitle}>Necesito un plan nutricional</Text>
                  <Text style={styles.cardSub}>Recetas estructuradas, prácticas y económicas</Text>
                </View>
                <View style={[styles.radioCircle, approachType === 'nutrition_plan' && styles.radioCircleActive]}>
                  {approachType === 'nutrition_plan' && <Text style={styles.radioCheck}>✓</Text>}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.selectCard, approachType === 'calorie_tracking' && styles.selectCardActive]}
                onPress={() => setApproachType('calorie_tracking')}
                activeOpacity={0.8}
              >
                <View style={styles.cardEmojiCircle}>
                  <Text style={styles.cardEmoji}>📊</Text>
                </View>
                <View style={styles.cardTextCol}>
                  <Text style={styles.cardTitle}>Necesito controlar mis calorías</Text>
                  <Text style={styles.cardSub}>Sé qué comer. Necesito monitorear metas y hábitos</Text>
                </View>
                <View style={[styles.radioCircle, approachType === 'calorie_tracking' && styles.radioCircleActive]}>
                  {approachType === 'calorie_tracking' && <Text style={styles.radioCheck}>✓</Text>}
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* PASO: ¿QUÉ TE IMPIDE ALCANZAR TUS METAS? (MULTI-SELECT) */}
          {step === 'obstacles' && (
            <View style={styles.stepBlock}>
              <Text style={styles.stepTitleObstacles}>¿Qué te impide alcanzar{"\n"}tus metas?</Text>

              {[
                { id: 'cravings', emoji: '🍰', title: 'Antojos constantes' },
                { id: 'inconsistency', emoji: '🪫', title: 'Falta de constancia' },
                { id: 'lack_of_time', emoji: '📅', title: 'Falta de tiempo' },
                { id: 'anxiety_eating', emoji: '🥺', title: 'Comer por ansiedad' },
                { id: 'social_events', emoji: '🍻', title: 'Las reuniones sociales' },
                { id: 'dont_know_what_to_eat', emoji: '🥣', title: 'No sé qué comer' },
              ].map((item) => {
                const active = obstacles.includes(item.id as ObstacleType);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.selectCardCompact, active && styles.selectCardCompactActive]}
                    onPress={() => toggleObstacle(item.id as ObstacleType)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.compactEmoji}>{item.emoji}</Text>
                    <Text style={[styles.compactTitle, active && styles.compactTitleActive]}>
                      {item.title}
                    </Text>
                    <View style={[styles.radioCircleOutline, active && styles.radioCircleOutlineActive]}>
                      {active && <Text style={styles.radioCheckmarkBlack}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {/* PASO: CALCULEMOS CUÁNTAS CALORÍAS NECESITAS AL DÍA (PORTADA CON CÍRCULOS CONCÉNTRICOS Y LLAMA) */}
          {step === 'calorie_intro' && (
            <View style={styles.calorieIntroContainer}>
              <View style={styles.fireConcentricOuter}>
                <View style={styles.fireConcentricMid}>
                  <View style={styles.fireConcentricInner}>
                    <Text style={styles.fireEmoji}>🔥</Text>
                  </View>
                </View>
              </View>

              <Text style={styles.calorieIntroTitle}>
                Calculemos cuántas calorías{"\n"}necesitas al día
              </Text>
              <Text style={styles.calorieIntroSubtitle}>
                Basado en tu metabolismo basal, edad, estatura y meta de bienestar
              </Text>
            </View>
          )}

          {/* PASO: ANÁLISIS Y GRÁFICA RESUMEN DE CALORÍAS */}
          {step === 'calorie_analysis' && (() => {
            const calorieData = calculateCalorieNeeds(
              parseFloat(currentWeightKg) || 75,
              parseFloat(heightCm) || 170,
              parseInt(age, 10) || 30,
              gender || 'male',
              'sedentary',
              fitnessGoal || 'fat_loss'
            );

            const maxBarValue = Math.max(calorieData.tdee, calorieData.targetCalories) * 1.15;
            const tdeeWidthPct = Math.min(100, Math.round((calorieData.tdee / maxBarValue) * 100));
            const targetWidthPct = Math.min(100, Math.round((calorieData.targetCalories / maxBarValue) * 100));
            const bmrWidthPct = Math.min(100, Math.round((calorieData.bmr / maxBarValue) * 100));

            return (
              <View style={styles.stepBlock}>
                <View style={styles.summaryBadge}>
                  <Text style={styles.summaryBadgeText}>🔥 REPORTE ENERGÉTICO CIENTÍFICO</Text>
                </View>

                <Text style={styles.stepTitle}>Tu Presupuesto Calórico</Text>
                <Text style={styles.stepSubtitle}>
                  Fórmula de Mifflin-St Jeor calibrada para tu organismo
                </Text>

                {/* HERO CARD CON CALORÍAS OBJETIVO */}
                <View style={styles.calorieHeroCard}>
                  <Text style={styles.calorieHeroNumber}>
                    {calorieData.targetCalories.toLocaleString()}
                  </Text>
                  <Text style={styles.calorieHeroUnit}>kcal recomendadas al día</Text>
                  <View style={styles.calorieBadge}>
                    <Text style={styles.calorieBadgeText}>{calorieData.deficitLabel}</Text>
                  </View>
                </View>

                {/* GRÁFICA COMPARATIVA DE BARRAS */}
                <View style={styles.chartCard}>
                  <Text style={styles.chartCardTitle}>📊 Análisis de Consumo y Mantenimiento</Text>
                  
                  {/* Barra 1: Meta Diaria */}
                  <View style={styles.chartBarGroup}>
                    <View style={styles.chartBarLabelRow}>
                      <Text style={styles.chartBarName}>🎯 Meta Diaria</Text>
                      <Text style={[styles.chartBarValue, { color: '#FBBF24' }]}>{calorieData.targetCalories} kcal</Text>
                    </View>
                    <View style={styles.chartBarTrack}>
                      <View style={[styles.chartBarFill, { width: `${targetWidthPct}%`, backgroundColor: '#FBBF24' }]} />
                    </View>
                  </View>

                  {/* Barra 2: Mantenimiento (TDEE) */}
                  <View style={styles.chartBarGroup}>
                    <View style={styles.chartBarLabelRow}>
                      <Text style={styles.chartBarName}>⚡ Gasto Diario (Mantenimiento)</Text>
                      <Text style={styles.chartBarValue}>{calorieData.tdee} kcal</Text>
                    </View>
                    <View style={styles.chartBarTrack}>
                      <View style={[styles.chartBarFill, { width: `${tdeeWidthPct}%`, backgroundColor: '#38BDF8' }]} />
                    </View>
                  </View>

                  {/* Barra 3: Metabolismo Basal (BMR) */}
                  <View style={styles.chartBarGroup}>
                    <View style={styles.chartBarLabelRow}>
                      <Text style={styles.chartBarName}>🫀 Tasa Metabólica Basal (Reposo)</Text>
                      <Text style={styles.chartBarValue}>{calorieData.bmr} kcal</Text>
                    </View>
                    <View style={styles.chartBarTrack}>
                      <View style={[styles.chartBarFill, { width: `${bmrWidthPct}%`, backgroundColor: '#A1A1AA' }]} />
                    </View>
                  </View>
                </View>

                {/* GRÁFICA DE MACRONUTRIENTES */}
                <View style={styles.chartCard}>
                  <Text style={styles.chartCardTitle}>🥗 Distribución de Macronutrientes</Text>
                  <View style={styles.macrosRow}>
                    <View style={styles.macroPill}>
                      <Text style={styles.macroEmoji}>🍗</Text>
                      <Text style={styles.macroValue}>{calorieData.proteinGrams}g</Text>
                      <Text style={styles.macroLabel}>Proteínas</Text>
                    </View>
                    <View style={styles.macroPill}>
                      <Text style={styles.macroEmoji}>🥑</Text>
                      <Text style={styles.macroValue}>{calorieData.fatsGrams}g</Text>
                      <Text style={styles.macroLabel}>Grasas</Text>
                    </View>
                    <View style={styles.macroPill}>
                      <Text style={styles.macroEmoji}>🍚</Text>
                      <Text style={styles.macroValue}>{calorieData.carbsGrams}g</Text>
                      <Text style={styles.macroLabel}>Carbohidratos</Text>
                    </View>
                  </View>
                </View>

                {/* EXPLICACIÓN Y CONSEJO */}
                <View style={styles.insightCard}>
                  <Text style={styles.insightTitle}>🦝 Consejo de Rocky:</Text>
                  <Text style={styles.insightText}>{calorieData.explanation}</Text>
                </View>
              </View>
            );
          })()}

          {/* PASO: ...Y ASÍ SERÁ TU PROGRESO (GRÁFICA CURVA CON PESO ACTUAL Y META) */}
          {step === 'progress_projection' && (() => {
            const startWeight = parseFloat(currentWeightKg) || 65;
            const goalWeight = parseFloat(targetWeightKg) || (fitnessGoal === 'muscle_gain' ? startWeight + 3 : Math.max(40, startWeight - 3));

            const now = new Date();
            const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            const formatShortDate = (d: Date) => {
              const day = String(d.getDate()).padStart(2, '0');
              return `${months[d.getMonth()]} ${day}`;
            };
            const d1 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            const d2 = new Date(now.getTime() + 23 * 24 * 60 * 60 * 1000);
            const d3 = new Date(now.getTime() + 31 * 24 * 60 * 60 * 1000);

            return (
              <View style={styles.stepBlock}>
                {/* ICONO CHECK VERDE SUPERIOR */}
                <View style={styles.greenCheckCircle}>
                  <Text style={styles.greenCheckText}>✓</Text>
                </View>

                {/* TÍTULO */}
                <Text style={styles.progressProjectionTitle}>...y así será tu progreso</Text>

                {/* TARJETA DE LA GRÁFICA DE PROYECCIÓN */}
                <View style={styles.projectionCard}>
                  {/* ENCABEZADOS DE SECCIÓN DENTRO DE LA TARJETA */}
                  <View style={styles.projectionHeaderRow}>
                    <Text style={styles.projectionGoalTitle}>Objetivo actual</Text>
                    <Text style={styles.projectionNextGoalTitle}>Siguiente{"\n"}objetivo</Text>
                  </View>

                  {/* SVG CURVA DE PESO Y DEGRADADO (TAMAÑO MAXIMIZADO Y MÁS GRANDE) */}
                  <View style={styles.svgChartWrapper}>
                    <Svg width="100%" height={270} viewBox="0 0 380 250">
                      <Defs>
                        <LinearGradient id="curveFill" x1="0" y1="0" x2="0" y2="1">
                          <Stop offset="0%" stopColor="#FBBF24" stopOpacity="0.48" />
                          <Stop offset="65%" stopColor="#FBBF24" stopOpacity="0.12" />
                          <Stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
                        </LinearGradient>
                      </Defs>

                      {/* Líneas Guía Verticales */}
                      <Line x1="52" y1="18" x2="52" y2="200" stroke="#684C0A" strokeWidth="1.5" />
                      <Line x1="275" y1="18" x2="275" y2="200" stroke="#684C0A" strokeWidth="1.5" />

                      {/* Relleno con Degradado bajo la Curva */}
                      <Path
                        d="M 52 82 C 78 92, 102 118, 132 110 C 165 102, 192 148, 228 142 C 255 138, 265 162, 275 160 L 275 200 L 52 200 Z"
                        fill="url(#curveFill)"
                      />

                      {/* Curva Principal Dorada Fluida */}
                      <Path
                        d="M 52 82 C 78 92, 102 118, 132 110 C 165 102, 192 148, 228 142 C 255 138, 265 162, 275 160"
                        fill="none"
                        stroke="#FBBF24"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />

                      {/* Líneas Proyectivas Punteadas hacia Siguiente Objetivo */}
                      <Line x1="275" y1="160" x2="355" y2="135" stroke="#785E1E" strokeWidth="2" strokeDasharray="4,4" />
                      <Line x1="275" y1="160" x2="365" y2="160" stroke="#785E1E" strokeWidth="2" strokeDasharray="4,4" />
                      <Line x1="275" y1="160" x2="355" y2="188" stroke="#785E1E" strokeWidth="2" strokeDasharray="4,4" />

                      {/* Punto Inicio (Hoy) */}
                      <Circle cx="52" cy="82" r="9.5" fill="#FBBF24" stroke="#FFFFFF" strokeWidth="4" />

                      {/* Badge Peso Inicial (Exactamente anclado al punto x=52) */}
                      <G>
                        <Rect x="18" y="30" width="68" height="30" rx="8" fill="#FBBF24" />
                        <SvgText x="52" y="50" fill="#000000" fontSize="14" fontWeight="800" textAnchor="middle">
                          {startWeight} kg
                        </SvgText>
                      </G>

                      {/* Punto Meta (Objetivo actual) */}
                      <Circle cx="275" cy="160" r="10" fill="#FBBF24" stroke="#FFFFFF" strokeWidth="4" />

                      {/* Trofeo y Badge Peso Meta (Exactamente anclados al punto x=275) */}
                      <G>
                        <SvgText x="275" y="96" fontSize="22" textAnchor="middle">
                          🏆
                        </SvgText>
                        <Rect x="241" y="106" width="68" height="30" rx="8" fill="#FBBF24" />
                        <SvgText x="275" y="126" fill="#000000" fontSize="14" fontWeight="800" textAnchor="middle">
                          {goalWeight} kg
                        </SvgText>
                      </G>

                      {/* Eje de Fechas Integrado Fiel a la Línea de Tiempo */}
                      <SvgText x="52" y="232" fill="#71717A" fontSize="13" fontWeight="600" textAnchor="middle">
                        Hoy
                      </SvgText>
                      <SvgText x="126" y="232" fill="#71717A" fontSize="13" fontWeight="600" textAnchor="middle">
                        {formatShortDate(d1)}
                      </SvgText>
                      <SvgText x="200" y="232" fill="#71717A" fontSize="13" fontWeight="600" textAnchor="middle">
                        {formatShortDate(d2)}
                      </SvgText>
                      <SvgText x="275" y="232" fill="#71717A" fontSize="13" fontWeight="600" textAnchor="middle">
                        {formatShortDate(d3)}
                      </SvgText>
                    </Svg>
                  </View>
                </View>
              </View>
            );
          })()}

          {/* PASO: CONCENTRACIÓN CON SILUETAS INTERACTIVAS */}
          {step === 'focus_areas' && (
            <View style={styles.stepBlock}>
              <Text style={styles.stepTitle}>Concentración</Text>
              <Text style={styles.stepSubtitle}>
                {gender === 'female' ? '👩 Figura Femenina' : '👨 Figura Masculina'} — Toca las zonas clave o elige todo el cuerpo
              </Text>

              <View style={styles.anatomyCard}>
                <View style={styles.anatomyHeader}>
                  <Text style={styles.anatomyIcon}>{gender === 'female' ? '💃' : '🏃‍♂️'}</Text>
                  <View style={styles.badgePill}>
                    <Text style={styles.badgePillText}>
                      {focusZones.includes('full_body') ? '✨ Enfoque Completo' : `${focusZones.length} zona(s) activa(s)`}
                    </Text>
                  </View>
                </View>

                {/* ZONAS */}
                <View style={styles.zoneGrid}>
                  <TouchableOpacity
                    style={[styles.zoneTile, isZoneActive('arms') && styles.zoneTileActive]}
                    onPress={() => toggleZone('arms')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.zoneTileEmoji}>🦾</Text>
                    <Text style={[styles.zoneTileLabel, isZoneActive('arms') && styles.zoneTileLabelActive]}>Brazos</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.zoneTile, isZoneActive('abs') && styles.zoneTileActive]}
                    onPress={() => toggleZone('abs')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.zoneTileEmoji}>🍫</Text>
                    <Text style={[styles.zoneTileLabel, isZoneActive('abs') && styles.zoneTileLabelActive]}>Abdomen</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.zoneTile, isZoneActive('glutes') && styles.zoneTileActive]}
                    onPress={() => toggleZone('glutes')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.zoneTileEmoji}>🍑</Text>
                    <Text style={[styles.zoneTileLabel, isZoneActive('glutes') && styles.zoneTileLabelActive]}>Glúteos</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.zoneTile, isZoneActive('legs') && styles.zoneTileActive]}
                    onPress={() => toggleZone('legs')}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.zoneTileEmoji}>🦵</Text>
                    <Text style={[styles.zoneTileLabel, isZoneActive('legs') && styles.zoneTileLabelActive]}>Piernas</Text>
                  </TouchableOpacity>
                </View>

                {/* BOTÓN TODO EL CUERPO */}
                <TouchableOpacity
                  style={[styles.fullBodyOption, focusZones.includes('full_body') && styles.fullBodyOptionActive]}
                  onPress={() => toggleZone('full_body')}
                  activeOpacity={0.8}
                >
                  <Text style={styles.fullBodyEmoji}>🌟</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.fullBodyTitle, focusZones.includes('full_body') && styles.fullBodyTitleActive]}>
                      Todo el cuerpo
                    </Text>
                    <Text style={styles.fullBodySub}>Rutina integral equilibrada para todas las áreas</Text>
                  </View>
                  <View style={[styles.radioCircle, focusZones.includes('full_body') && styles.radioCircleActive]}>
                    {focusZones.includes('full_body') && <Text style={styles.radioCheck}>✓</Text>}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* PASO: PESO OBJETIVO */}
          {step === 'target_weight' && (
            <View style={styles.stepBlock}>
              <Text style={styles.stepTitle}>¿Cuál es tu peso objetivo?</Text>
              <Text style={styles.stepSubtitle}>
                Recomendamos un ritmo sostenible de 0.5 a 1 kg por semana
              </Text>
              <TextInput
                style={styles.sleekInput}
                value={targetWeightKg}
                onChangeText={setTargetWeightKg}
                placeholder="Ej. 72.0"
                placeholderTextColor="#52525B"
                keyboardType="numeric"
                autoFocus
              />
              <Text style={styles.unitLabel}>Kilogramos objetivo (kg)</Text>
            </View>
          )}

          {/* PASO: TIEMPO DE RUTINA */}
          {step === 'time' && (
            <View style={styles.stepBlock}>
              <Text style={styles.stepTitle}>¿Cuánto tiempo tienes al día?</Text>
              <Text style={styles.stepSubtitle}>
                El mejor entrenamiento es el que puedes cumplir con regularidad
              </Text>

              <TouchableOpacity
                style={[styles.selectCard, routineMinutes === 20 && styles.selectCardActive]}
                onPress={() => setRoutineMinutes(20)}
                activeOpacity={0.8}
              >
                <View style={styles.cardEmojiCircle}>
                  <Text style={styles.cardEmoji}>⚡</Text>
                </View>
                <View style={styles.cardTextCol}>
                  <Text style={styles.cardTitle}>20 Minutos</Text>
                  <Text style={styles.cardSub}>Circuito ágil de alta efectividad</Text>
                </View>
                <View style={[styles.radioCircle, routineMinutes === 20 && styles.radioCircleActive]}>
                  {routineMinutes === 20 && <Text style={styles.radioCheck}>✓</Text>}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.selectCard, routineMinutes === 30 && styles.selectCardActive]}
                onPress={() => setRoutineMinutes(30)}
                activeOpacity={0.8}
              >
                <View style={styles.cardEmojiCircle}>
                  <Text style={styles.cardEmoji}>💪</Text>
                </View>
                <View style={styles.cardTextCol}>
                  <Text style={styles.cardTitle}>30 Minutos</Text>
                  <Text style={styles.cardSub}>Estructurado con descansos y series controladas</Text>
                </View>
                <View style={[styles.radioCircle, routineMinutes === 30 && styles.radioCircleActive]}>
                  {routineMinutes === 30 && <Text style={styles.radioCheck}>✓</Text>}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.selectCard, routineMinutes === 60 && styles.selectCardActive]}
                onPress={() => setRoutineMinutes(60)}
                activeOpacity={0.8}
              >
                <View style={styles.cardEmojiCircle}>
                  <Text style={styles.cardEmoji}>🏋️</Text>
                </View>
                <View style={styles.cardTextCol}>
                  <Text style={styles.cardTitle}>1 Hora</Text>
                  <Text style={styles.cardSub}>Sesión completa con fuerza y acondicionamiento</Text>
                </View>
                <View style={[styles.radioCircle, routineMinutes === 60 && styles.radioCircleActive]}>
                  {routineMinutes === 60 && <Text style={styles.radioCheck}>✓</Text>}
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* PASO: RESUMEN FINAL */}
          {step === 'summary' && (
            <View style={styles.stepBlock}>
              <View style={styles.summaryBadge}>
                <Text style={styles.summaryBadgeText}>🦝 PLAN PERSONALIZADO LISTO</Text>
              </View>
              <Text style={styles.stepTitle}>¡Todo listo, {name || 'Compañero'}!</Text>
              <Text style={styles.stepSubtitle}>
                Hemos calibrado tu plan inicial según tus datos y preferencias:
              </Text>

              <View style={styles.summaryCard}>
                <SummaryRow label="Nombre" value={name} />
                <SummaryRow label="Sexo" value={gender === 'male' ? 'Hombre' : 'Mujer'} />
                <SummaryRow label="Edad" value={`${age} años`} />
                <SummaryRow label="Estatura" value={`${heightCm} cm`} />
                <SummaryRow label="Peso Actual" value={`${currentWeightKg} kg`} />
                <SummaryRow label="Objetivo" value={getGoalLabel(fitnessGoal)} />
                <SummaryRow label="Enfoque" value={getApproachLabel(approachType)} />
                <SummaryRow label="Concentración" value={getFocusLabels()} />
                <SummaryRow label="Meta de Peso" value={`${targetWeightKg} kg`} />
                <SummaryRow label="Duración Rutina" value={routineMinutes === 60 ? '1 Hora' : `${routineMinutes} min`} />
              </View>

              <Text style={styles.disclaimerMini}>
                ⚖️ Esta app es una guía de hábitos y no sustituye la consulta con un médico o nutriólogo colegiado.
              </Text>
            </View>
          )}
        </ScrollView>
      </Animated.View>

      {/* FOOTER INFERIOR CON BOTÓN CONTINUAR DORADO */}
      {step !== 'welcome' && (
        <View style={styles.bottomFooter}>
          <TouchableOpacity
            style={[styles.primaryGoldBtn, !canProceed() && styles.primaryGoldBtnDisabled]}
            onPress={canProceed() ? (step === 'summary' ? handleFinish : next) : undefined}
            activeOpacity={0.85}
          >
            <Text style={[styles.primaryGoldBtnText, !canProceed() && styles.primaryGoldBtnTextDisabled]}>
              {step === 'summary' ? 'Generar Mi Plan 🚀' : 'Continuar'}
            </Text>
          </TouchableOpacity>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
  },
  label: { color: '#A1A1AA', fontSize: 13, flex: 1 },
  value: { color: '#FBBF24', fontWeight: '700', fontSize: 13, textAlign: 'right', flex: 1.3 },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0A0C',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  circleBackBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1C1C22',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#2A2A35',
  },
  circleBackIcon: {
    color: '#F4F4F5',
    fontSize: 18,
    fontWeight: '700',
  },
  progressBarWrapper: {
    flex: 1,
    height: 5,
    backgroundColor: '#1C1C22',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FBBF24',
    borderRadius: 3,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 30,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  centerHero: {
    alignItems: 'center',
    paddingTop: 40,
  },
  heroBadge: {
    backgroundColor: '#1C1C22',
    borderColor: '#3F3F46',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 20,
  },
  heroBadgeText: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 14,
  },
  appTagline: {
    fontSize: 15,
    color: '#A1A1AA',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 34,
    paddingHorizontal: 10,
  },
  continueCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181B',
    borderRadius: 18,
    padding: 16,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#27272A',
  },
  continueCardBtnEmoji: {
    fontSize: 26,
    marginRight: 12,
  },
  continueCardBtnTitle: {
    color: '#F4F4F5',
    fontSize: 15,
    fontWeight: '700',
  },
  continueCardBtnSubtitle: {
    color: '#A1A1AA',
    fontSize: 12,
    marginTop: 2,
  },
  continueCardBtnArrow: {
    color: '#FBBF24',
    fontSize: 16,
  },
  stepBlock: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#A1A1AA',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 26,
    paddingHorizontal: 14,
  },
  sleekInput: {
    width: '100%',
    backgroundColor: '#18181B',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#27272A',
    paddingHorizontal: 20,
    paddingVertical: 18,
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  unitLabel: {
    color: '#71717A',
    fontSize: 13,
    marginTop: 10,
    fontWeight: '500',
  },
  
  // Card de Selección Moderna (Dark Theme con Acentos Dorados)
  selectCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#18181B',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#27272A',
  },
  selectCardActive: {
    borderColor: '#FBBF24',
    backgroundColor: '#2A2006',
  },
  cardEmojiCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#24242A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardEmoji: {
    fontSize: 22,
  },
  cardTextCol: {
    flex: 1,
    paddingRight: 8,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  cardSub: {
    color: '#A1A1AA',
    fontSize: 12,
    lineHeight: 16,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3F3F46',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleActive: {
    borderColor: '#FBBF24',
    backgroundColor: '#FBBF24',
  },
  radioCheck: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '900',
  },

  stepTitleObstacles: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 32,
    marginTop: 10,
    letterSpacing: -0.4,
  },

  // Cards de Obstáculos (Diseño idéntico a las capturas)
  selectCardCompact: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#1E1E20',
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 12,
    borderWidth: 1.2,
    borderColor: '#2A2A2E',
  },
  selectCardCompactActive: {
    borderColor: '#8A630A',
    backgroundColor: '#42310A',
  },
  compactEmoji: {
    fontSize: 22,
    marginRight: 14,
  },
  compactTitle: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  compactTitleActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  radioCircleOutline: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.8,
    borderColor: '#48484A',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  radioCircleOutlineActive: {
    borderColor: '#FBBF24',
    backgroundColor: '#FBBF24',
  },
  radioCheckmarkBlack: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '900',
  },

  // Paso Calorie Intro (Concéntrico de Llama idéntico a la captura)
  calorieIntroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 36,
    width: '100%',
  },
  fireConcentricOuter: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 36,
  },
  fireConcentricMid: {
    width: 165,
    height: 165,
    borderRadius: 82.5,
    backgroundColor: 'rgba(245, 158, 11, 0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fireConcentricInner: {
    width: 115,
    height: 115,
    borderRadius: 57.5,
    backgroundColor: 'rgba(245, 158, 11, 0.28)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fireEmoji: {
    fontSize: 46,
  },
  calorieIntroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 10,
    letterSpacing: -0.4,
  },
  calorieIntroSubtitle: {
    fontSize: 14,
    color: '#A1A1AA',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },

  // Paso Calorie Analysis (Hero Card, Gráficas y Macronutrientes)
  calorieHeroCard: {
    width: '100%',
    backgroundColor: '#1E1E22',
    borderRadius: 24,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#382D10',
    marginBottom: 16,
  },
  calorieHeroNumber: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FBBF24',
    letterSpacing: -1,
  },
  calorieHeroUnit: {
    fontSize: 14,
    color: '#A1A1AA',
    fontWeight: '600',
    marginTop: 2,
    marginBottom: 12,
  },
  calorieBadge: {
    backgroundColor: '#2A2006',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#FBBF24',
  },
  calorieBadgeText: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  chartCard: {
    width: '100%',
    backgroundColor: '#18181B',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#27272A',
    marginBottom: 14,
  },
  chartCardTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 14,
  },
  chartBarGroup: {
    marginBottom: 12,
  },
  chartBarLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  chartBarName: {
    color: '#D4D4D8',
    fontSize: 13,
    fontWeight: '600',
  },
  chartBarValue: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '700',
  },
  chartBarTrack: {
    width: '100%',
    height: 10,
    backgroundColor: '#27272A',
    borderRadius: 5,
    overflow: 'hidden',
  },
  chartBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  macrosRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroPill: {
    width: '31%',
    backgroundColor: '#121215',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: '#27272A',
  },
  macroEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  macroValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  macroLabel: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '600',
  },
  insightCard: {
    width: '100%',
    backgroundColor: '#1E1E22',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.2,
    borderColor: '#3F3F46',
    marginBottom: 16,
  },
  insightTitle: {
    color: '#FBBF24',
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 6,
  },
  insightText: {
    color: '#D4D4D8',
    fontSize: 13,
    lineHeight: 19,
  },

  // Paso Proyección de Progreso (...y así será tu progreso)
  greenCheckCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  greenCheckText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
  },
  progressProjectionTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 28,
    letterSpacing: -0.4,
  },
  projectionCard: {
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 28,
    paddingTop: 22,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderWidth: 1.2,
    borderColor: '#2A2A2E',
    marginBottom: 24,
  },
  projectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    marginBottom: 8,
  },
  projectionGoalTitle: {
    color: '#F4F4F5',
    fontSize: 16,
    fontWeight: '700',
  },
  projectionNextGoalTitle: {
    color: '#A1A1AA',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 18,
  },
  svgChartWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Anatomía y Concentración
  anatomyCard: {
    width: '100%',
    backgroundColor: '#18181B',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#27272A',
  },
  anatomyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#27272A',
  },
  anatomyIcon: {
    fontSize: 34,
  },
  badgePill: {
    backgroundColor: '#27272A',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#3F3F46',
  },
  badgePillText: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '700',
  },
  zoneGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  zoneTile: {
    width: '48%',
    backgroundColor: '#121215',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: '#27272A',
  },
  zoneTileActive: {
    borderColor: '#FBBF24',
    backgroundColor: '#2A2006',
  },
  zoneTileEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  zoneTileLabel: {
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '700',
  },
  zoneTileLabelActive: {
    color: '#FFFFFF',
  },
  fullBodyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121215',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#27272A',
  },
  fullBodyOptionActive: {
    borderColor: '#FBBF24',
    backgroundColor: '#2A2006',
  },
  fullBodyEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  fullBodyTitle: {
    color: '#A1A1AA',
    fontSize: 15,
    fontWeight: '700',
  },
  fullBodyTitleActive: {
    color: '#FFFFFF',
  },
  fullBodySub: {
    color: '#71717A',
    fontSize: 11,
    marginTop: 2,
  },

  // Resumen
  summaryBadge: {
    backgroundColor: '#2A2006',
    borderWidth: 1,
    borderColor: '#FBBF24',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 5,
    marginBottom: 12,
  },
  summaryBadgeText: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: '#18181B',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#27272A',
    marginBottom: 16,
  },

  bottomFooter: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    backgroundColor: '#0A0A0C',
    borderTopWidth: 1,
    borderTopColor: '#18181B',
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  primaryGoldBtn: {
    width: '100%',
    backgroundColor: '#FBBF24',
    borderRadius: 28,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryGoldBtnDisabled: {
    backgroundColor: '#262628',
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryGoldBtnText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  primaryGoldBtnTextDisabled: {
    color: '#636366',
  },
  disclaimerMini: {
    color: '#52525B',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 20,
    lineHeight: 16,
    paddingHorizontal: 20,
  },
});
