export interface BmiAnalysis {
  bmi: number;
  category: 'underweight' | 'normal' | 'overweight' | 'obese1' | 'obese2' | 'obese3';
  categoryLabel: string;
  colorHex: string;
  healthyWeightMinKg: number;
  healthyWeightMaxKg: number;
  idealWeightRobinsonKg: number;
  healthAdvice: string;
}

export function calculateBmi(
  weightKg: number,
  heightCm: number,
  gender: 'male' | 'female'
): BmiAnalysis {
  if (heightCm <= 0 || weightKg <= 0) {
    throw new Error('Estatura y peso deben ser valores positivos.');
  }

  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  // Rango saludable estándar OMS (18.5 - 24.9)
  const healthyWeightMinKg = Number((18.5 * (heightM * heightM)).toFixed(1));
  const healthyWeightMaxKg = Number((24.9 * (heightM * heightM)).toFixed(1));

  // Estimación de peso referencial Robinson (1983)
  const inchesOver5Feet = Math.max(0, (heightCm - 152.4) / 2.54);
  const idealWeightRobinsonKg = Number(
    (gender === 'male'
      ? 52 + 1.9 * inchesOver5Feet
      : 49 + 1.7 * inchesOver5Feet
    ).toFixed(1)
  );

  let category: BmiAnalysis['category'] = 'normal';
  let categoryLabel = 'Peso Saludable';
  let colorHex = '#10B981'; // Menta esmeralda
  let healthAdvice = '¡Excelente! Estás en un rango con bajo riesgo metabólico. Mantén tus hábitos activos.';

  if (bmi < 18.5) {
    category = 'underweight';
    categoryLabel = 'Bajo Peso';
    colorHex = '#38BDF8'; // Azul cielo
    healthAdvice = 'Tu peso está por debajo de la referencia OMS. Conviene fortalecer masa muscular con mancuernas y alimentación rica en proteínas.';
  } else if (bmi < 25.0) {
    category = 'normal';
    categoryLabel = 'Peso Saludable';
    colorHex = '#10B981';
  } else if (bmi < 30.0) {
    category = 'overweight';
    categoryLabel = 'Sobrepeso';
    colorHex = '#F59E0B'; // Ámbar
    healthAdvice = 'Un déficit calórico moderado junto a tus ejercicios de 20-30 min te devolverán gradualmente al rango normal sin rebote.';
  } else if (bmi < 35.0) {
    category = 'obese1';
    categoryLabel = 'Obesidad Grado I';
    colorHex = '#F97316'; // Naranja coral
    healthAdvice = 'Prioriza ejercicios sin impacto en rodillas (cardio suave, ligas de resistencia sentada/apoyada) y constancia en el agua.';
  } else if (bmi < 40.0) {
    category = 'obese2';
    categoryLabel = 'Obesidad Grado II';
    colorHex = '#EF4444'; // Rojo suave
    healthAdvice = 'Enfócate en metas pequeñas semanales de 0.5 kg. Cada paso cuenta para proteger tu salud cardiovascular y articulaciones.';
  } else {
    category = 'obese3';
    categoryLabel = 'Obesidad Grado III';
    colorHex = '#B91C1C'; // Rojo oscuro
    healthAdvice = 'Progresa con calma y asesoría médica continua. Evita saltos bruscos y mantén una hidratación disciplinada.';
  }

  return {
    bmi,
    category,
    categoryLabel,
    colorHex,
    healthyWeightMinKg,
    healthyWeightMaxKg,
    idealWeightRobinsonKg,
    healthAdvice,
  };
}
