import { ExerciseItem } from '../types';
import { ExerciseAnimationType } from '../components/ExerciseAnimationPlayer';

export interface ExtendedExerciseItem extends ExerciseItem {
  animationType: ExerciseAnimationType;
  levelNumeric: 1 | 2 | 3;
}

export const EXERCISES_CATALOG: ExtendedExerciseItem[] = [

  // ============================================================
  // NIVEL 1: PRINCIPIANTE — Sin impacto, articulaciones seguras
  // Para personas sedentarias, sobrepeso alto o inicio absoluto
  // ============================================================

  {
    id: 'ex_begin_wall_squat',
    name: 'Sentadilla Asistida en Pared',
    category: 'peso_corporal',
    targetMuscle: 'Cuádriceps y Glúteos',
    suggestedSets: 2,
    suggestedRepsOrSeconds: '8 - 10 reps lentas',
    restSeconds: 60,
    description: 'Apoya la espalda baja en la pared y baja poco a poco doblando las rodillas hasta 90°. Sube empujando con los talones.',
    tips: ['Rodillas no pasan la punta de los pies', 'Espalda siempre pegada a la pared', 'Sube lento en 3 segundos'],
    requiresEquipment: 'Pared lisa',
    difficulty: 'principiante',
    animationType: 'squat_goblet',
    levelNumeric: 1,
  },
  {
    id: 'ex_begin_glute_bridge',
    name: 'Puente de Glúteo Básico en el Suelo',
    category: 'peso_corporal',
    targetMuscle: 'Glúteos e Isquiotibiales',
    suggestedSets: 2,
    suggestedRepsOrSeconds: '12 reps',
    restSeconds: 45,
    description: 'Acostado boca arriba, pies apoyados en el suelo separados al ancho de caderas. Empuja con los talones y eleva la pelvis apretando los glúteos.',
    tips: ['Aprieta los glúteos 2 segundos arriba', 'No arquees la espalda baja', 'Bajar suave sin golpear el suelo'],
    requiresEquipment: 'Colchoneta o suelo alfombrado',
    difficulty: 'principiante',
    animationType: 'bridge_glute',
    levelNumeric: 1,
  },
  {
    id: 'ex_begin_band_bridge',
    name: 'Puente de Glúteo con Banda Elástica en Rodillas',
    category: 'bandas_pierna',
    targetMuscle: 'Glúteo Medio y Mayor',
    suggestedSets: 3,
    suggestedRepsOrSeconds: '12 - 15 reps',
    restSeconds: 45,
    description: 'Igual que el puente básico pero con la banda loop justo arriba de las rodillas. Presiona las rodillas hacia afuera venciendo la resistencia de la banda.',
    tips: ['Mantén las rodillas separadas en todo el movimiento', 'No dejes que las rodillas colapsen hacia adentro'],
    requiresEquipment: 'Banda elástica corta (mini band)',
    difficulty: 'principiante',
    animationType: 'bridge_glute',
    levelNumeric: 1,
  },
  {
    id: 'ex_begin_step_jack',
    name: 'Step Jacks (Jumping Jacks Sin Salto)',
    category: 'cardio',
    targetMuscle: 'Cardio General y Calentamiento',
    suggestedSets: 2,
    suggestedRepsOrSeconds: '40 segundos',
    restSeconds: 30,
    description: 'Abre un pie al lateral coordinado con los brazos, regresa al centro, luego el otro pie. Mantén ritmo constante sin saltar para cuidar rodillas.',
    tips: ['Coordinación brazo-pierna', 'Mantén el abdomen ligeramente activado', 'Respiración fluida todo el tiempo'],
    requiresEquipment: 'Ninguno',
    difficulty: 'principiante',
    animationType: 'step_jack',
    levelNumeric: 1,
  },
  {
    id: 'ex_begin_wall_pushup',
    name: 'Flexión en Pared (Principiante)',
    category: 'peso_corporal',
    targetMuscle: 'Pectoral, Tríceps y Hombros',
    suggestedSets: 2,
    suggestedRepsOrSeconds: '10 - 12 reps',
    restSeconds: 45,
    description: 'Apoya las palmas en la pared a la altura del pecho. Mantén el cuerpo recto y flexiona los codos acercando el pecho a la pared.',
    tips: ['Cuerpo como una tabla — cadera no sobresale', 'Codos a 45° (no 90°) para proteger hombros'],
    requiresEquipment: 'Pared',
    difficulty: 'principiante',
    animationType: 'pushup_incline',
    levelNumeric: 1,
  },
  {
    id: 'ex_begin_clamshell',
    name: 'Ejercicio Ostra (Clamshell)',
    category: 'bandas_pierna',
    targetMuscle: 'Glúteo Medio y Abductores de Cadera',
    suggestedSets: 2,
    suggestedRepsOrSeconds: '12 reps por lado',
    restSeconds: 30,
    description: 'Acostado de lado con caderas y rodillas dobladas a 90°. Abre la rodilla superior como una concha sin mover la pelvis.',
    tips: ['Pelvis estable — no ruedes hacia atrás', 'Sube lento, baja más lento aún', 'El movimiento viene de la cadera, no de la cintura'],
    requiresEquipment: 'Colchoneta (banda opcional)',
    difficulty: 'principiante',
    animationType: 'clamshell',
    levelNumeric: 1,
  },
  {
    id: 'ex_begin_band_row',
    name: 'Remo Sentado con Liga en Pies',
    category: 'ligas',
    targetMuscle: 'Espalda Media y Bíceps',
    suggestedSets: 2,
    suggestedRepsOrSeconds: '12 reps',
    restSeconds: 45,
    description: 'Siéntate en el suelo con piernas estiradas y pasa la liga por las plantas de los pies. Jala las asas hacia tu ombligo retrayendo los omóplatos.',
    tips: ['Pecho orgulloso al jalar', 'No encorves la espalda para llegar más atrás', 'Pausa 1 segundo apretando la espalda'],
    requiresEquipment: 'Liga elástica con asas',
    difficulty: 'principiante',
    animationType: 'row_band',
    levelNumeric: 1,
  },

  // ============================================================
  // NIVEL 2: INTERMEDIO — Uso de mancuernas y carga moderada
  // Para personas con 3-6 semanas de hábito o actividad ligera
  // ============================================================

  {
    id: 'ex_int_goblet_squat',
    name: 'Sentadilla Goblet con Mancuerna',
    category: 'mancuernas',
    targetMuscle: 'Cuádriceps, Glúteos y Core',
    suggestedSets: 3,
    suggestedRepsOrSeconds: '10 - 12 reps',
    restSeconds: 60,
    description: 'Sostén una mancuerna pegada al pecho con ambas manos. Desciende como si fueras a sentarte en una silla sin despegar los talones.',
    tips: ['Pecho erguido todo el tiempo', 'Rodillas apuntando en dirección de los pies', 'Talones en el suelo en todo momento'],
    requiresEquipment: '1 mancuerna (4-8 kg)',
    difficulty: 'intermedio',
    animationType: 'squat_goblet',
    levelNumeric: 2,
  },
  {
    id: 'ex_int_db_curl',
    name: 'Curl de Bíceps con Mancuernas Alterno',
    category: 'mancuernas',
    targetMuscle: 'Bíceps y Antebrazo',
    suggestedSets: 3,
    suggestedRepsOrSeconds: '10 reps por brazo',
    restSeconds: 45,
    description: 'De pie con mancuernas a los costados, palmas hacia arriba. Flexiona un brazo a la vez llevando la mancuerna al hombro con codo pegado al torso.',
    tips: ['No balancea el cuerpo para ayudarte', 'Gira ligeramente la palma hacia arriba al subir (supinación)', 'Baja lento en 2-3 segundos'],
    requiresEquipment: '2 mancuernas (3-6 kg)',
    difficulty: 'intermedio',
    animationType: 'curl_biceps',
    levelNumeric: 2,
  },
  {
    id: 'ex_int_db_row',
    name: 'Remo a una Mano en Silla',
    category: 'mancuernas',
    targetMuscle: 'Dorsal Ancho y Espalda Media',
    suggestedSets: 3,
    suggestedRepsOrSeconds: '10 reps por lado',
    restSeconds: 45,
    description: 'Apoya la mano y rodilla contraria en una silla resistente. Con la espalda neutral a 45°, jala la mancuerna hacia la cadera conduciendo con el codo.',
    tips: ['No gires la cadera para jalar', 'El codo roza la caja torácica al subir', 'Baja completamente para estirar la espalda'],
    requiresEquipment: '1 mancuerna (4-10 kg) + silla',
    difficulty: 'intermedio',
    animationType: 'row_dumbbell',
    levelNumeric: 2,
  },
  {
    id: 'ex_int_shoulder_press',
    name: 'Press de Hombros Sentado',
    category: 'mancuernas',
    targetMuscle: 'Deltoides (Hombros)',
    suggestedSets: 3,
    suggestedRepsOrSeconds: '10 - 12 reps',
    restSeconds: 60,
    description: 'Sentado con la espalda recta, mancuernas a la altura de las orejas. Empuja hacia arriba en arco controlado hasta casi juntar las manos arriba.',
    tips: ['No arquees la zona lumbar', 'Baja lento en 3 segundos', 'Muñecas neutras, no dobladas'],
    requiresEquipment: '2 mancuernas (3-6 kg) + silla',
    difficulty: 'intermedio',
    animationType: 'shoulder_press',
    levelNumeric: 2,
  },
  {
    id: 'ex_int_monster_walk',
    name: 'Monster Walk — Pasos Laterales en Semi-Sentadilla',
    category: 'bandas_pierna',
    targetMuscle: 'Glúteo Medio y Abductores',
    suggestedSets: 3,
    suggestedRepsOrSeconds: '10 pasos a cada lado',
    restSeconds: 60,
    description: 'Coloca la banda sobre rodillas o tobillos. Adopta postura de media sentadilla y da pasos laterales controlados manteniendo tensión continua.',
    tips: ['Nunca juntes los pies del todo para mantener tensión', 'Pecho erguido y cadera levemente hacia atrás', 'Peso en talones y parte media del pie'],
    requiresEquipment: 'Banda elástica mini band',
    difficulty: 'intermedio',
    animationType: 'monster_walk',
    levelNumeric: 2,
  },
  {
    id: 'ex_int_lateral_raise',
    name: 'Elevaciones Laterales con Liga Pisada',
    category: 'ligas',
    targetMuscle: 'Deltoides Lateral (Hombro)',
    suggestedSets: 3,
    suggestedRepsOrSeconds: '12 - 15 reps',
    restSeconds: 45,
    description: 'Pisa el centro de la liga con ambos pies. Eleva los brazos lateralmente con codos ligeramente flexionados hasta la horizontal.',
    tips: ['No subas más allá de la altura del hombro', 'Movimiento lento al bajar para más tensión muscular', 'Usa una liga de resistencia media'],
    requiresEquipment: 'Liga elástica',
    difficulty: 'intermedio',
    animationType: 'lateral_raise',
    levelNumeric: 2,
  },
  {
    id: 'ex_int_rdl',
    name: 'Peso Muerto Rumano con Mancuernas',
    category: 'mancuernas',
    targetMuscle: 'Femorales, Glúteos y Espalda Baja',
    suggestedSets: 3,
    suggestedRepsOrSeconds: '10 - 12 reps',
    restSeconds: 60,
    description: 'De pie con mancuernas al frente de los muslos. Desliza las mancuernas por las piernas bajando con la espalda recta hasta sentir tensión en la parte trasera de los muslos.',
    tips: ['Espalda recta (NO redondes la columna)', 'Rodillas ligeramente dobladas', 'Empuja la cadera hacia atrás, no hacia abajo'],
    requiresEquipment: '2 mancuernas (4-10 kg)',
    difficulty: 'intermedio',
    animationType: 'deadlift_rdl',
    levelNumeric: 2,
  },
  {
    id: 'ex_int_cardio_hknees',
    name: 'Elevación de Rodillas al Pecho (High Knees Suave)',
    category: 'cardio',
    targetMuscle: 'Cardio, Core y Hip Flexors',
    suggestedSets: 3,
    suggestedRepsOrSeconds: '45 segundos',
    restSeconds: 30,
    description: 'Marcha en el lugar elevando cada rodilla al nivel de la cintura alternadamente con braceo activo. Ritmo constante y moderado.',
    tips: ['Mantén el abdomen ligeramente activado', 'No te dobles hacia adelante', 'Respira con ritmo constante'],
    requiresEquipment: 'Ninguno',
    difficulty: 'intermedio',
    animationType: 'step_jack',
    levelNumeric: 2,
  },

  // ============================================================
  // NIVEL 3: AVANZADO — Combinaciones, tempo y HIIT casero
  // Para personas con hábito establecido de 6+ semanas
  // ============================================================

  {
    id: 'ex_adv_jump_squat',
    name: 'Sentadilla con Salto Controlado',
    category: 'peso_corporal',
    targetMuscle: 'Cuádriceps, Glúteos y Potencia Cardiovascular',
    suggestedSets: 4,
    suggestedRepsOrSeconds: '10 reps explosivas',
    restSeconds: 60,
    description: 'Sentadilla completa. En la subida, explota empujando con los pies para saltar y aterriza suave doblando rodillas inmediatamente.',
    tips: ['Aterriza suave para proteger rodillas', 'Cadera hacia atrás al bajar', 'Si tienes problemas de rodilla, omite este ejercicio'],
    requiresEquipment: 'Ninguno (suelo con espacio)',
    difficulty: 'avanzado',
    animationType: 'squat_goblet',
    levelNumeric: 3,
  },
  {
    id: 'ex_adv_db_band_squat',
    name: 'Sentadilla Mancuerna + Banda en Rodillas',
    category: 'mancuernas',
    targetMuscle: 'Cuádriceps, Glúteo Medio y Mayor',
    suggestedSets: 4,
    suggestedRepsOrSeconds: '10 - 12 reps',
    restSeconds: 60,
    description: 'Coloca la banda justo arriba de las rodillas y sostén mancuernas a los costados. Realiza sentadilla profunda venciendo la resistencia de la banda con las rodillas hacia afuera.',
    tips: ['Doble estímulo: fuerza de cuádriceps + activación de glúteo medio', 'No dejes que las rodillas colapsen', 'Tempo 2-1-3 (2 baja, 1 pausa, 3 sube)'],
    requiresEquipment: '2 mancuernas + mini band',
    difficulty: 'avanzado',
    animationType: 'squat_goblet',
    levelNumeric: 3,
  },
  {
    id: 'ex_adv_pushup_floor',
    name: 'Flexión Completa en Suelo',
    category: 'peso_corporal',
    targetMuscle: 'Pectoral, Tríceps, Deltoides y Core',
    suggestedSets: 4,
    suggestedRepsOrSeconds: '12 - 15 reps',
    restSeconds: 45,
    description: 'En posición de plancha alta, baja el pecho hasta casi tocar el suelo con control total y empuja de vuelta a la posición inicial.',
    tips: ['Cuerpo como una tabla rígida', 'Codos a 45° respecto al torso', 'Exhala al empujar, inhala al bajar'],
    requiresEquipment: 'Suelo firme',
    difficulty: 'avanzado',
    animationType: 'pushup_incline',
    levelNumeric: 3,
  },
  {
    id: 'ex_adv_mountain_climber',
    name: 'Escaladores (Mountain Climbers)',
    category: 'cardio',
    targetMuscle: 'Core, Hip Flexors y Cardio HIIT',
    suggestedSets: 3,
    suggestedRepsOrSeconds: '30 - 45 segundos',
    restSeconds: 30,
    description: 'En posición de plancha alta, alterna cada rodilla hacia el pecho de forma explosiva manteniendo la cadera baja y el core rígido.',
    tips: ['Cadera ABAJO — no la eleves', 'Core activado en todo momento', 'Respiración controlada, no apnea'],
    requiresEquipment: 'Ninguno',
    difficulty: 'avanzado',
    animationType: 'mountain_climber',
    levelNumeric: 3,
  },
  {
    id: 'ex_adv_shadow_box',
    name: 'Boxeo al Aire con Giros de Torso (Shadow Box)',
    category: 'cardio',
    targetMuscle: 'Oblicuos, Core y Cardio',
    suggestedSets: 3,
    suggestedRepsOrSeconds: '45 - 60 segundos',
    restSeconds: 30,
    description: 'De pie con pies separados al ancho de hombros, lanza combinaciones de golpes directos alternando brazos y girando el torso en cada impacto.',
    tips: ['Giro de torso desde el core, no solo brazo', 'No bloquees los codos de golpe — cede ligeramente', 'Mantén las rodillas ligeramente dobladas para agilidad'],
    requiresEquipment: 'Ninguno',
    difficulty: 'avanzado',
    animationType: 'shadow_box',
    levelNumeric: 3,
  },
  {
    id: 'ex_adv_kickback',
    name: 'Patada de Glúteo en Cuadrupedial con Banda',
    category: 'bandas_pierna',
    targetMuscle: 'Glúteo Mayor y Femorales',
    suggestedSets: 3,
    suggestedRepsOrSeconds: '15 reps por pierna',
    restSeconds: 30,
    description: 'En cuadrupedial (4 puntos de apoyo), coloca la banda en las rodillas. Extiende una pierna hacia atrás y arriba apretando el glúteo sin arquear la columna.',
    tips: ['La espalda baja NO se arquea', 'La extensión viene de la cadera, no de la columna', 'Aprieta el glúteo 2 segundos arriba'],
    requiresEquipment: 'Banda elástica mini band + colchoneta',
    difficulty: 'avanzado',
    animationType: 'kickback_glute',
    levelNumeric: 3,
  },
];

/** Devuelve el catálogo filtrado por nivel, sin mezclar niveles incompatibles */
export function getExercisesByLevel(level: 1 | 2 | 3): ExtendedExerciseItem[] {
  return EXERCISES_CATALOG.filter((e) => e.levelNumeric === level);
}

/** Devuelve ejercicios para el generador de planes según tiempo y nivel */
export function selectExercisesForPlan(
  preferredMinutes: 20 | 30 | 60,
  levelNumeric: 1 | 2 | 3
): ExtendedExerciseItem[] {
  const pool = getExercisesByLevel(levelNumeric);
  const count = preferredMinutes === 20 ? 4 : preferredMinutes === 30 ? 5 : 8;

  // Asegurar variedad de categorías
  const categories = ['cardio', 'peso_corporal', 'mancuernas', 'ligas', 'bandas_pierna'] as const;
  const selected: ExtendedExerciseItem[] = [];

  // Primero incluir cardio como calentamiento si está disponible
  const cardio = pool.find((e) => e.category === 'cardio');
  if (cardio) selected.push(cardio);

  // Luego rellenar con variedad
  for (const cat of categories) {
    if (selected.length >= count) break;
    const fromCat = pool.find((e) => e.category === cat && !selected.includes(e));
    if (fromCat) selected.push(fromCat);
  }

  // Completar si faltan
  while (selected.length < count) {
    const remaining = pool.filter((e) => !selected.includes(e));
    if (remaining.length === 0) break;
    selected.push(remaining[0]);
  }

  return selected.slice(0, count);
}

// Re-export recipes from old catalogs (unchanged)
export { RECIPES_CATALOG } from './catalogs';
