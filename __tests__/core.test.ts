import { calculateBmi } from '../src/core/bmiCalculator';
import { compareTwoMonths, MonthSummary } from '../src/core/historyAnalytics';
import { generateAutomatedPlan, checkPlanExpiration } from '../src/core/planEngine';
import { UserProfile } from '../src/types';

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
    expect(plan.routineDurationMinutes).toBe(20);
    expect(plan.selectedExercises.length).toBeGreaterThan(0);
    expect(plan.selectedMeals.breakfast.length).toBeGreaterThan(0);
    expect(plan.selectedMeals.lunch.length).toBeGreaterThan(0);
    expect(plan.selectedMeals.dinner.length).toBeGreaterThan(0);
    expect(plan.selectedMeals.snack.length).toBeGreaterThan(0);
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
