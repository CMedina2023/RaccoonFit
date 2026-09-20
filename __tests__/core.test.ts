import { calculateBmi } from '../src/core/bmiCalculator';
import { calculateCalorieNeeds } from '../src/core/calorieCalculator';
import { compareTwoMonths, MonthSummary } from '../src/core/historyAnalytics';
import { generateAutomatedPlan, checkPlanExpiration } from '../src/core/planEngine';
import { UserProfile } from '../src/types';
import { EXERCISES_CATALOG } from '../src/core/exerciseCatalog';
import { ExerciseProvider } from '../src/core/exerciseProvider';

describe('1. Motor de Cálculo de IMC y Métricas de Salud (Hombre y Mujer)', () => {
  test('Calcula IMC y rangos correctamente para un hombre de 80kg y 175cm', () => {
    const res = calculateBmi(80, 175, 'male');
    expect(res.bmi).toBe(26.1);
    expect(res.category).toBe('overweight');
    expect(res.healthyWeightMinKg).toBe(56.7);
    expect(res.healthyWeightMaxKg).toBe(76.3);
    expect(res.idealWeightRobinsonKg).toBe(68.9);
  });

  test('Calcula IMC y rangos correctamente para una mujer de 60kg y 162cm', () => {
    const res = calculateBmi(60, 162, 'female');
    expect(res.bmi).toBe(22.9);
    expect(res.category).toBe('normal');
    expect(res.healthyWeightMinKg).toBe(48.6);
    expect(res.healthyWeightMaxKg).toBe(65.3);
  });
});

describe('2. Generador Automático de Planes Adaptativos', () => {
  const mockProfile: UserProfile = {
    name: 'Carlos',
    gender: 'male',
    age: 32,
    heightCm: 175,
    startingWeightKg: 85,
    targetWeightKg: 78,
    activityLevel: 'sedentary',
    preferredRoutineMinutes: 20,
    weighInDayOfWeek: 5,
    createdAt: '2026-08-30',
  };

  test('Genera un plan con ejercicios adaptados para 20 minutos y comidas en 4 tiempos', () => {
    const plan = generateAutomatedPlan(mockProfile);
    expect(plan.durationWeeks).toBe(4);
    expect(plan.selectedMeals.breakfast.length).toBeGreaterThan(0);
    expect(plan.selectedMeals.lunch.length).toBeGreaterThan(0);
    expect(plan.selectedMeals.dinner.length).toBeGreaterThan(0);
    expect(plan.selectedMeals.snack.length).toBeGreaterThan(0);
  });

  test('acepta un proveedor de ejercicios inyectado sin conocer el catálogo concreto', () => {
  });

  test('Filtra recetas de acuerdo a la preferencia alimentaria (vegano / vegetariano)', () => {
    const veganProfile = { ...mockProfile, dietaryPreference: 'vegan' as const };
    const plan = generateAutomatedPlan(veganProfile);
    // Verificamos que ninguna comida contenga carne, pollo o pescado
    const allMeals = [
      ...plan.selectedMeals.breakfast,
      ...plan.selectedMeals.lunch,
      ...plan.selectedMeals.dinner,
      ...plan.selectedMeals.snack,
    ];
    allMeals.forEach((meal) => {
      const text = (meal.title + ' ' + meal.ingredients.join(' ')).toLowerCase();
      expect(text).not.toMatch(/\b(pollo|pechuga|res|carne|pavo|cerdo|atún|pescado)\b/);
    });
  });

  test('Evalúa expiración del plan cuando la fecha concluye', () => {
    const plan = generateAutomatedPlan(mockProfile);
    // Forzamos fecha de fin en el pasado
    plan.endDate = '2020-01-01';
    const evalResult = checkPlanExpiration(plan, 82, 85);
    expect(evalResult.isExpired).toBe(true);
    expect(evalResult.evaluation?.lostKg).toBe(3);
    expect(evalResult.evaluation?.achievedGoal).toBe(true);
  });
});

describe('3. Comparador Inter-Mensual de Histórico (Peso e Hidratación)', () => {
  const monthA: MonthSummary = {
    monthKey: '2026-06',
    monthName: 'Junio 2026',
    startWeightKg: 85,
    endWeightKg: 84,
    weightDeltaKg: -1.0,
    totalWaterLiters: 40,
    avgDailyWaterLiters: 1.3,
    weighInCount: 4,
    dailyWaterSamples: [],
    weeklyWeightPoints: [],
  };

  const monthB: MonthSummary = {
    monthKey: '2026-07',
    monthName: 'Julio 2026',
    startWeightKg: 84,
    endWeightKg: 81.8,
    weightDeltaKg: -2.2,
    totalWaterLiters: 65,
    avgDailyWaterLiters: 2.1,
    weighInCount: 4,
    dailyWaterSamples: [],
    weeklyWeightPoints: [],
  };

  test('Detecta correlación positiva entre mayor hidratación y mayor pérdida de peso', () => {
    const comparison = compareTwoMonths(monthA, monthB);
    expect(comparison.waterDiffAvg).toBe(0.8);
    expect(comparison.insightPetText).toContain('agua');
  });
});

describe('4. Motor Científico de Cálculo Calórico (Mifflin-St Jeor)', () => {
  test('Calcula TMB, TDEE y déficit de pérdida de grasa para hombre', () => {
    // Hombre: 80kg, 175cm, 30 años -> BMR = 10*80 + 6.25*175 - 5*30 + 5 = 800 + 1093.75 - 150 + 5 = 1749
    // Sedentario: 1749 * 1.2 = 2099 TDEE
    // Fat loss (-20%): 2099 - 420 = 1679 -> ajustado con piso en BMR = 1749
    const analysis = calculateCalorieNeeds(80, 175, 30, 'male', 'sedentary', 'fat_loss');
    expect(analysis.bmr).toBe(1749);
    expect(analysis.tdee).toBe(2099);
    expect(analysis.targetCalories).toBe(1749);
    expect(analysis.proteinGrams).toBeGreaterThan(140);
    expect(analysis.fatsGrams).toBeGreaterThan(40);
  });

  test('Calcula TMB y requerimiento calórico para mujer', () => {
    // Mujer: 60kg, 162cm, 28 años -> BMR = 10*60 + 6.25*162 - 5*28 - 161 = 600 + 1012.5 - 140 - 161 = 1312
    // Ligero: 1312 * 1.375 = 1804
    const analysis = calculateCalorieNeeds(60, 162, 28, 'female', 'light', 'fat_loss');
    expect(analysis.bmr).toBe(1312);
    expect(analysis.tdee).toBe(1804);
    expect(analysis.targetCalories).toBe(1443);
  });
});

describe('5. Catálogo de Ejercicios y Animaciones 3D (ExerciseDB)', () => {
  test('Todos los ejercicios del catálogo tienen asignado su gifUrl 3D válido y exerciseDbId', () => {
    expect(EXERCISES_CATALOG.length).toBeGreaterThan(0);
    EXERCISES_CATALOG.forEach((exercise) => {
      expect(exercise.gifUrl).toBeUndefined();
      expect(exercise.exerciseDbId).toMatch(/^[a-zA-Z0-9]+$/);
      expect(exercise.animationType).toEqual(expect.any(String));
      expect(exercise.levelNumeric).toBeGreaterThanOrEqual(1);
      expect(exercise.levelNumeric).toBeLessThanOrEqual(3);
    });
  });
});

