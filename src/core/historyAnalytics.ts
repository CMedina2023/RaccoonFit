export interface MonthSummary {
  monthKey: string; // "YYYY-MM" (ej. "2026-07")
  monthName: string; // "Julio 2026"
  startWeightKg: number;
  endWeightKg: number;
  weightDeltaKg: number; // negativo = pérdida de peso
  totalWaterLiters: number;
  avgDailyWaterLiters: number;
  weighInCount: number;
  dailyWaterSamples: { day: number; liters: number }[]; // para gráfica superpuesta del día 1 al 31
  weeklyWeightPoints: { weekIndex: number; weightKg: number }[];
}

export function compareTwoMonths(monthA: MonthSummary, monthB: MonthSummary): {
  weightDiffDelta: number;
  waterDiffAvg: number;
  insightPetText: string;
} {
  // weightDiffDelta: qué mes bajó más de peso
  const weightDiffDelta = Number((monthA.weightDeltaKg - monthB.weightDeltaKg).toFixed(1));
  const waterDiffAvg = Number((monthB.avgDailyWaterLiters - monthA.avgDailyWaterLiters).toFixed(2));

  let insightPetText = '';
  if (monthB.weightDeltaKg < monthA.weightDeltaKg && waterDiffAvg > 0) {
    insightPetText = `¡Mira la correlación! En ${monthB.monthName} tomaste ${waterDiffAvg}L más de agua al día y bajaste más peso que en ${monthA.monthName}. ¡El agua acelera el metabolismo!`;
  } else if (monthB.weightDeltaKg < monthA.weightDeltaKg) {
    insightPetText = `¡Gran progreso en ${monthB.monthName}! La constancia en tus rutinas superó el rendimiento de ${monthA.monthName}.`;
  } else if (waterDiffAvg > 0) {
    insightPetText = `En ${monthB.monthName} mejoraste tu ingesta de agua diaria en ${waterDiffAvg}L. Mantén esa hidratación para seguir desinflamando el cuerpo.`;
  } else {
    insightPetText = `Comparando ${monthA.monthName} y ${monthB.monthName}, cada ciclo te enseña cómo responde tu cuerpo. ¡Sigamos con paso firme!`;
  }

  return {
    weightDiffDelta,
    waterDiffAvg,
    insightPetText,
  };
}
