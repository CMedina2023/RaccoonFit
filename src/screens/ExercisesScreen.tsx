import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WorkoutPhaseSection } from '../components/WorkoutPhaseSection';
import { WorkoutCompletionAction } from '../components/WorkoutCompletionAction';
import { WorkoutProgressionHint } from '../components/WorkoutProgressionHint';
import { ExerciseAnimationPlayer } from '../components/ExerciseAnimationPlayer';
import { ExtendedExerciseItem } from '../core/exerciseCatalog';
import { PlannedExerciseItem } from '../types';
import { ExerciseMediaProvider } from '../core/exerciseMedia/ExerciseMediaProvider';
import { MediaLoadCache } from '../core/exerciseMedia/MediaLoadCache';
import { hasExactLocalFallback } from '../core/exerciseMedia/exerciseMediaContract';
import { getLocalExerciseGif } from '../core/exerciseMedia/localExerciseMedia';
import { buildWeeklyWorkoutSession } from '../core/weeklyWorkoutSession';
import { getWeeklyRotationSeed } from '../core/weeklyRotation';
import { countRestDays, getWeeklyWorkoutDayForDate, getWeeklyWorkoutSchedule, isValidWeeklyRoutine, WorkoutFocus, WorkoutLevel, WeeklyWorkoutDay } from '../core/weeklyWorkoutPlanner';
import { createWorkoutCompletion, getLocalDateKey } from '../core/workoutProgressService';
import { getCompletedWorkoutStreak, getWorkoutProgressionRecommendation } from '../core/workoutProgressionService';
import { getWorkoutLevel } from '../core/trainingLevel';
import { applyWorkoutMainOverride, createWorkoutSessionKey, replaceAllWorkoutMainExercises, replaceWorkoutMainExercise } from '../core/workoutExerciseReplacement';
import { usePlanActions, useToast, useUserProfile, useWorkoutMainOverrides, useWorkoutPresentation, useWorkoutProgress, useWeeklyRoutine } from '../store/selectors';

interface Props { mediaProvider: ExerciseMediaProvider; mediaLoadCache: MediaLoadCache; }
const COLORS: Record<string, string> = { principiante: '#10B981', intermedio: '#F59E0B', avanzado: '#EF4444' };
const FOCUS_LABELS: Record<WorkoutFocus, string> = { full_body: 'Cuerpo completo', chest_back: 'Pecho y espalda', biceps_triceps: 'Bíceps y tríceps', shoulders_traps: 'Hombro y trapecio', abs_obliques: 'Abdomen y oblicuos', legs_glutes: 'Pierna y glúteo', core_cardio: 'Core y cardio', rest: 'Descanso' };
const FOCUS_OPTIONS: WorkoutFocus[] = ['full_body', 'chest_back', 'biceps_triceps', 'shoulders_traps', 'abs_obliques', 'legs_glutes', 'core_cardio', 'rest'];

export const ExercisesScreen: React.FC<Props> = ({ mediaProvider, mediaLoadCache }) => {
  const { currentPlan } = usePlanActions(); const { userProfile } = useUserProfile();
  const { workoutHistory, toggleWorkoutCompletion } = useWorkoutProgress();
  const { workoutPresentationHistory, recordWorkoutPresentation } = useWorkoutPresentation();
  const { workoutMainOverrides, saveWorkoutMainOverride } = useWorkoutMainOverrides();
  const { showToast } = useToast();
  const { weeklyRoutine, saveWeeklyRoutine } = useWeeklyRoutine();
  const [selected, setSelected] = useState<ExtendedExerciseItem | null>(null);
  const [selectedDayId, setSelectedDayId] = useState<string | null>(null);
  const [editingDayIndex, setEditingDayIndex] = useState<number | null>(null);
  const [draftDays, setDraftDays] = useState<WeeklyWorkoutDay[] | null>(null);
  const [showReplaceAllConfirm, setShowReplaceAllConfirm] = useState(false);
  if (!currentPlan || !userProfile) return <View style={s.empty}><Text style={s.emptyTitle}>Aún no tienes una rutina</Text><Text style={s.emptyText}>Completa tu perfil para crear una sesión segura.</Text></View>;
  const level: WorkoutLevel = getWorkoutLevel(userProfile);
  const weeklySchedule = weeklyRoutine?.days ?? getWeeklyWorkoutSchedule(level);
  const visibleSchedule = draftDays ?? weeklySchedule;
  const todayDay = getWeeklyWorkoutDayForDate(weeklySchedule);
  const todayKey = getLocalDateKey();
  const activeDay = weeklySchedule.find((day) => day.day === (selectedDayId ?? todayDay.day)) ?? weeklySchedule[0];
  const activeDayIndex = weeklySchedule.findIndex((day) => day.day === activeDay.day);
  const rotationSeed = getWeeklyRotationSeed(new Date(), activeDayIndex);
  const baseSession = activeDay.focus === 'rest'
    ? null
    : buildWeeklyWorkoutSession(userProfile.preferredRoutineMinutes, level, activeDay.focus, undefined, rotationSeed, workoutPresentationHistory);
  const sessionKey = baseSession && activeDay.focus !== 'rest'
    ? createWorkoutSessionKey(todayKey, activeDay.day, activeDay.focus, rotationSeed)
    : null;
  const session = baseSession && sessionKey ? applyWorkoutMainOverride(baseSession, workoutMainOverrides[sessionKey]) : baseSession;
  useEffect(() => {
    if (!session || activeDay.focus === 'rest') return;
    void recordWorkoutPresentation(session.phases[1].exercises.map((exercise) => ({ date: todayKey, focus: activeDay.focus as Exclude<WorkoutFocus, 'rest'>, exerciseId: exercise.id, variantLabel: exercise.executionVariant?.label ?? 'Base', weekSeed: rotationSeed })));
  }, [activeDay.focus, recordWorkoutPresentation, rotationSeed, session, todayKey]);
  const isTodaySelected = activeDay.day === todayDay.day;
  const isTodayCompleted = Boolean(workoutHistory[todayKey]);
  const progressionStreak = getCompletedWorkoutStreak(workoutHistory, weeklySchedule);
  const progressionRecommendation = getWorkoutProgressionRecommendation(progressionStreak);
  const onToggleCompletion = () => {
    if (!session || !isTodaySelected) return;
    void toggleWorkoutCompletion(createWorkoutCompletion(activeDay, session.totalMinutes));
  };
  const saveMainExercises = (exercises: PlannedExerciseItem[], successMessage: string) => {
    if (!session || !sessionKey) return;
    void saveWorkoutMainOverride({ sessionKey, exercises, updatedAt: new Date().toISOString() });
    showToast(successMessage, 'success');
  };
  const replaceOne = (exerciseId: string) => {
    if (!session || activeDay.focus === 'rest') return;
    const mainExercises = session.phases[1].exercises;
    const replacements = replaceWorkoutMainExercise(mainExercises, exerciseId, level, activeDay.focus, workoutPresentationHistory, rotationSeed);
    if (replacements.every((exercise, index) => exercise.id === mainExercises[index]?.id)) {
      showToast('No hay una alternativa segura disponible para este ejercicio.', 'info');
      return;
    }
    saveMainExercises(replacements, 'Ejercicio actualizado. Se mantiene tu nivel y duración.');
  };
  const confirmReplaceAll = () => {
    if (!session || activeDay.focus === 'rest') return;
    const mainExercises = session.phases[1].exercises;
    const replacements = replaceAllWorkoutMainExercises(mainExercises, level, activeDay.focus, workoutPresentationHistory, rotationSeed);
    setShowReplaceAllConfirm(false);
    if (replacements.every((exercise, index) => exercise.id === mainExercises[index]?.id)) {
      showToast('No hay más alternativas seguras para renovar esta rutina.', 'info');
      return;
    }
    saveMainExercises(replacements, 'Ejercicios principales renovados.');
  };
  const startWeekEdit = () => {
    setDraftDays(weeklySchedule.map((day) => ({ ...day })));
    setEditingDayIndex(0);
  };
  const cancelWeekEdit = () => {
    setDraftDays(null);
    setEditingDayIndex(null);
  };
  const updateDayFocus = (focus: WorkoutFocus) => {
    if (editingDayIndex === null || !draftDays) return;
    const status: WeeklyWorkoutDay['status'] = focus === 'rest' ? 'rest' : focus === 'core_cardio' ? 'active_recovery' : 'training';
    setDraftDays(draftDays.map((day, index) => index === editingDayIndex ? { ...day, focus, status, label: FOCUS_LABELS[focus] } : day));
  };
  const draftRoutine = draftDays ? { days: draftDays } : null;
  const restDays = draftRoutine ? countRestDays(draftRoutine) : 0;
  const canSaveDraft = draftRoutine !== null && isValidWeeklyRoutine(draftRoutine);
  const saveWeekDraft = () => {
    if (!draftRoutine || !canSaveDraft) return;
    void saveWeeklyRoutine(draftRoutine).then((saved) => { if (saved) cancelWeekEdit(); });
  };
  return <View style={s.container}>
    <View style={s.header}><Text style={s.title}>Mi Rutina</Text><Text style={s.sub}>{activeDay.label}{session ? ` · ${session.label} · ${session.totalMinutes} min` : ''}</Text></View>
    <ScrollView style={s.list} contentContainerStyle={s.content}><View style={s.safety}><Text style={s.safetyText}>Consulta a tu médico antes de iniciar si tienes condiciones preexistentes, problemas articulares o hipertensión.</Text></View>
      <View style={s.weekHeader}><Text style={s.weekTitle}>Tu semana</Text><TouchableOpacity accessibilityRole="button" onPress={editingDayIndex === null ? startWeekEdit : cancelWeekEdit} style={s.editButton}><Text style={s.editText}>{editingDayIndex === null ? 'Editar semana' : 'Cancelar'}</Text></TouchableOpacity></View><ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.weekScroll}>{visibleSchedule.map((day, index) => <TouchableOpacity key={day.day} accessibilityRole="button" accessibilityLabel={`${day.day}: ${day.label}${day.day === todayDay.day && isTodayCompleted ? ', completada' : ''}`} onPress={() => editingDayIndex === null ? setSelectedDayId(day.day) : setEditingDayIndex(index)} style={[s.dayCard, day.status === 'rest' && s.dayRest, day.status === 'active_recovery' && s.dayRecovery, editingDayIndex === null && day.day === activeDay.day && s.daySelected, day.day === todayDay.day && isTodayCompleted && s.dayCompleted, editingDayIndex === index && s.dayEditing]}><Text style={s.dayName}>{day.day}{day.day === todayDay.day && isTodayCompleted ? ' ✓' : ''}</Text><Text style={s.dayLabel}>{day.label}</Text></TouchableOpacity>)}</ScrollView>
      {editingDayIndex !== null && draftDays && <View style={s.editor}><Text style={s.editorTitle}>Configura {visibleSchedule[editingDayIndex].day}</Text><View style={s.optionGrid}>{FOCUS_OPTIONS.map((focus) => <TouchableOpacity key={focus} accessibilityRole="button" style={s.option} onPress={() => updateDayFocus(focus)}><Text style={s.optionText}>{FOCUS_LABELS[focus]}</Text></TouchableOpacity>)}</View><Text style={s.editorHint}>Elige libremente los grupos y los días. Para guardar, incluye al menos 2 días de descanso ({restDays}/2).</Text><TouchableOpacity accessibilityRole="button" disabled={!canSaveDraft} onPress={saveWeekDraft} style={[s.saveRoutine, !canSaveDraft && s.saveRoutineDisabled]}><Text style={s.saveRoutineText}>{canSaveDraft ? 'Guardar semana' : `Agrega ${2 - restDays} descanso(s) para guardar`}</Text></TouchableOpacity></View>}
      {session ? <>{isTodaySelected && <WorkoutProgressionHint recommendation={progressionRecommendation} streak={progressionStreak} />}{session.phases.map((phase) => <WorkoutPhaseSection key={phase.id} phase={phase} onSelectExercise={setSelected} onReplaceExercise={phase.id === 'main' ? replaceOne : undefined} onReplaceAll={phase.id === 'main' ? () => setShowReplaceAllConfirm(true) : undefined} />)}{isTodaySelected && <WorkoutCompletionAction completed={isTodayCompleted} onToggle={onToggleCompletion} />}</> : <View style={s.restPanel}><Text style={s.restTitle}>Hoy toca descansar</Text><Text style={s.restText}>Deja que el músculo se recupere. Si quieres moverte, elige una caminata suave o movilidad sin dolor.</Text></View>}
    </ScrollView>
    <Modal visible={showReplaceAllConfirm} transparent animationType="fade"><View style={s.overlay}><View style={s.confirmModal}><Text style={s.confirmTitle}>¿Cambiar ejercicios?</Text><Text style={s.confirmText}>Renovaremos los ejercicios principales. Tu nivel, duración, calentamiento y vuelta a la calma se mantienen.</Text><View style={s.confirmActions}><TouchableOpacity accessibilityRole="button" style={s.confirmCancel} onPress={() => setShowReplaceAllConfirm(false)}><Text style={s.confirmCancelText}>Cancelar</Text></TouchableOpacity><TouchableOpacity accessibilityRole="button" style={s.confirmAccept} onPress={confirmReplaceAll}><Text style={s.confirmAcceptText}>Cambiar todos</Text></TouchableOpacity></View></View></View></Modal>
    <Modal visible={selected !== null} transparent animationType="slide"><View style={s.overlay}><View style={s.modal}><TouchableOpacity style={s.close} onPress={() => setSelected(null)}><Text style={s.closeText}>✕ Cerrar</Text></TouchableOpacity>
      {selected && <ScrollView><Text style={s.modalTitle}>{selected.name}</Text><Text style={[s.level, { color: COLORS[selected.difficulty] }]}>Nivel: {selected.difficulty}</Text>
        <ExerciseAnimationPlayer type={selected.animationType} gifUrl={mediaProvider.getOptionalGifUrl(selected.exerciseDbId)} localGifSource={getLocalExerciseGif(selected.exerciseDbId)} mediaLoadCache={mediaLoadCache} muscleName={selected.targetMuscle} exerciseName={selected.name} hasExactLocalFallback={hasExactLocalFallback(selected.media)} color={COLORS[selected.difficulty]} />
        <Info title="Descripción" value={selected.description}/><Info title="Series y descanso" value={selected.suggestedSets + ' series · ' + selected.suggestedRepsOrSeconds + ' · ' + selected.restSeconds + 's descanso'}/><Info title="Consejos" value={selected.tips.join('\n• ')}/><Info title="Equipo" value={selected.requiresEquipment || 'Ninguno'}/>
      </ScrollView>}
    </View></View></Modal>
  </View>;
};
const Info = ({ title, value }: { title: string; value: string }) => <View style={s.info}><Text style={s.infoTitle}>{title}</Text><Text style={s.infoText}>{value}</Text></View>;
const s = StyleSheet.create({
  container:{flex:1,backgroundColor:'#000000'},header:{paddingHorizontal:16,paddingTop:16,paddingBottom:10},title:{color:'#F8FAFC',fontSize:24,fontWeight:'700'},sub:{color:'#A1A1AA',fontSize:12,marginTop:3},list:{flex:1,paddingHorizontal:12},content:{paddingBottom:20},safety:{backgroundColor:'#121216',borderColor:'#27272A',borderWidth:1,borderRadius:12,marginBottom:14,padding:12},safetyText:{color:'#A1A1AA',fontSize:12,lineHeight:18},
  weekHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center'},weekTitle:{color:'#F8FAFC',fontSize:16,fontWeight:'700',marginBottom:8},editButton:{minHeight:40,justifyContent:'center',paddingHorizontal:8},editText:{color:'#FBBF24',fontSize:12,fontWeight:'700'},weekScroll:{marginBottom:14,flexGrow:0},dayCard:{width:96,minHeight:88,backgroundColor:'#121216',borderColor:'#26262B',borderWidth:1,borderRadius:12,padding:10,marginRight:8},dayRest:{backgroundColor:'#0A0A0C',borderColor:'#27272A'},dayRecovery:{backgroundColor:'#121820',borderColor:'#06B6D455'},daySelected:{borderColor:'#F59E0B',borderWidth:2,backgroundColor:'#1C1914'},dayCompleted:{backgroundColor:'#0F291E',borderColor:'#10B981'},dayEditing:{borderColor:'#FBBF24',borderWidth:2},dayName:{color:'#F8FAFC',fontSize:13,fontWeight:'800'},dayLabel:{color:'#A1A1AA',fontSize:10,lineHeight:14,marginTop:6},editor:{backgroundColor:'#121216',borderColor:'#26262B',borderWidth:1,borderRadius:14,padding:12,marginBottom:14},editorTitle:{color:'#F8FAFC',fontSize:14,fontWeight:'700',marginBottom:10},optionGrid:{flexDirection:'row',flexWrap:'wrap',gap:8},option:{backgroundColor:'#27272A',borderRadius:10,minHeight:44,justifyContent:'center',paddingHorizontal:10},optionText:{color:'#F8FAFC',fontSize:12,fontWeight:'700'},editorHint:{color:'#A1A1AA',fontSize:11,lineHeight:16,marginTop:10},saveRoutine:{backgroundColor:'#F59E0B',borderRadius:10,minHeight:48,justifyContent:'center',alignItems:'center',marginTop:12,paddingHorizontal:12},saveRoutineDisabled:{backgroundColor:'#27272A'},saveRoutineText:{color:'#000000',fontSize:13,fontWeight:'800'},restPanel:{backgroundColor:'#121216',borderColor:'#26262B',borderWidth:1,borderRadius:14,padding:16},restTitle:{color:'#F8FAFC',fontSize:17,fontWeight:'700'},restText:{color:'#A1A1AA',fontSize:13,lineHeight:19,marginTop:6},
  empty:{flex:1,backgroundColor:'#000000',justifyContent:'center',alignItems:'center',padding:32},emptyTitle:{color:'#F8FAFC',fontSize:22,fontWeight:'700'},emptyText:{color:'#A1A1AA',fontSize:13,textAlign:'center',marginTop:10},overlay:{flex:1,backgroundColor:'rgba(0,0,0,0.85)',justifyContent:'flex-end'},modal:{backgroundColor:'#000000',borderTopLeftRadius:24,borderTopRightRadius:24,padding:20,maxHeight:'92%',borderTopWidth:1,borderColor:'#26262B'},close:{alignSelf:'flex-end',minHeight:48,justifyContent:'center',paddingHorizontal:12},closeText:{color:'#A1A1AA',fontSize:12},modalTitle:{color:'#F8FAFC',fontSize:20,fontWeight:'700'},level:{fontSize:12,fontWeight:'700',marginTop:6,marginBottom:8,textTransform:'capitalize'},info:{backgroundColor:'#121216',borderRadius:12,padding:12,marginBottom:10,borderWidth:1,borderColor:'#26262B'},infoTitle:{color:'#F59E0B',fontSize:11,fontWeight:'700',textTransform:'uppercase',marginBottom:5},infoText:{color:'#D4D4D8',fontSize:13,lineHeight:19},
  confirmModal:{backgroundColor:'#121216',borderRadius:18,padding:20,margin:20,borderWidth:1,borderColor:'#26262B'},confirmTitle:{color:'#F8FAFC',fontSize:18,fontWeight:'800'},confirmText:{color:'#D4D4D8',fontSize:13,lineHeight:19,marginTop:8},confirmActions:{flexDirection:'row',justifyContent:'flex-end',marginTop:18},confirmCancel:{minHeight:48,justifyContent:'center',paddingHorizontal:14,marginRight:8},confirmCancelText:{color:'#A1A1AA',fontWeight:'700'},confirmAccept:{minHeight:48,justifyContent:'center',paddingHorizontal:14,borderRadius:10,backgroundColor:'#F59E0B'},confirmAcceptText:{color:'#000000',fontWeight:'800'},
});
