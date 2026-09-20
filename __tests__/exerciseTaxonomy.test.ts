import { EXERCISES_CATALOG } from '../src/core/exerciseCatalog';
import { classifyExercise, hasValidClassification } from '../src/core/exerciseTaxonomy';

describe('Taxonomía de prescripción del catálogo', () => {
  it('clasifica todos los ejercicios con músculo, patrón, seguridad y regresión', () => {
    expect(EXERCISES_CATALOG).toHaveLength(127);
    expect(EXERCISES_CATALOG.every(hasValidClassification)).toBe(true);
  });

  it('no usa etiquetas de UI para programar pecho/espalda/piernas', () => {
    const row = EXERCISES_CATALOG.find((exercise) => exercise.id === 'ex_int_db_row');
    const squat = EXERCISES_CATALOG.find((exercise) => exercise.id === 'ex_int_goblet_squat');
    const pushup = EXERCISES_CATALOG.find((exercise) => exercise.id === 'ex_begin_wall_pushup');
    const rearFly = EXERCISES_CATALOG.find((exercise) => exercise.id === 'ex_int_reverse_fly');

    expect(row).toBeDefined();
    expect(squat).toBeDefined();
    expect(pushup).toBeDefined();
    expect(rearFly).toBeDefined();
    expect(classifyExercise(row!).primaryMuscles).toEqual(['back']);
    expect(classifyExercise(squat!).movementPattern).toBe('squat');
    expect(classifyExercise(pushup!).primaryMuscles).toEqual(['chest']);
    expect(classifyExercise(rearFly!).primaryMuscles).toEqual(['shoulders']);
    expect(classifyExercise(pushup!).allowedPhases).toEqual(['main']);
  });

  it('solo permite cardio de bajo impacto en calentamiento; no confunde una fase con una categoría', () => {
    const stepJack = EXERCISES_CATALOG.find((exercise) => exercise.id === 'ex_begin_step_jack');
    const jumpSquat = EXERCISES_CATALOG.find((exercise) => exercise.id === 'ex_adv_jump_squat');

    expect(classifyExercise(stepJack!).allowedPhases).toEqual(['warmup', 'main']);
    expect(classifyExercise(jumpSquat!).allowedPhases).toEqual(['main']);
  });

  it('no certifica un frame genérico como si fuera el ejercicio exacto', () => {
    const row = EXERCISES_CATALOG.find((exercise) => exercise.id === 'ex_int_db_row');
    const squat = EXERCISES_CATALOG.find((exercise) => exercise.id === 'ex_int_goblet_squat');

    expect(classifyExercise(row!).animationAudit).toBe('requires_dedicated_frame');
    expect(classifyExercise(squat!).animationAudit).toBe('requires_dedicated_frame');
  });
});
