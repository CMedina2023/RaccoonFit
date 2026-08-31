---
name: bmi-calculator
description: >-
  Especialista en cálculo de IMC (Índice de Masa Corporal), métricas antropométricas y peso saludable para hombre y mujer.
  Utilizar cuando se implementen, verifiquen o expliquen las fórmulas matemáticas de IMC, rangos de la OMS,
  cálculo de peso ideal estimado por fórmulas clínicas (Devine, Robinson, Miller) según sexo biológico y validación de rangos seguros.
---

# Skill: Especialista en Cálculo de IMC y Métricas de Peso (Hombre y Mujer)

Este skill define la lógica matemática, los fundamentos de salud antropométrica y la presentación clínica rigurosa de las métricas de peso e Índice de Masa Corporal (IMC) en la aplicación, diferenciando adecuadamente entre hombres y mujeres.

---

## 1. Fórmulas Matemáticas Centrales

### A. Cálculo del Índice de Masa Corporal (Quetelet)
$$\text{IMC} = \frac{\text{Peso (kg)}}{\left(\frac{\text{Estatura (cm)}}{100}\right)^2} = \frac{\text{Peso (kg)}}{(\text{Estatura en metros})^2}$$

*Conversión previa si el usuario ingresa libras (lb) y pulgadas (in):*
- $\text{kg} = \text{lb} \times 0.45359237$
- $\text{m} = (\text{in}) \times 0.0254$

### B. Rangos de Clasificación de la OMS (Organización Mundial de la Salud)
El IMC estándar se categoriza según los siguientes intervalos:

| Rango de IMC ($kg/m^2$) | Categoría | Color UI | Riesgo Asociado |
|---|---|---|---|
| $< 18.5$ | Bajo Peso | Azul (`#38BDF8`) | Déficit nutricional, debilidad ósea |
| $18.5 - 24.9$ | Peso Saludable / Normal | Verde (`#22C55E`) | Mínimo riesgo cardiovascular |
| $25.0 - 29.9$ | Sobrepeso | Amarillo / Ámbar (`#EAB308`) | Riesgo moderado |
| $30.0 - 34.9$ | Obesidad Grado I | Naranja (`#F97316`) | Riesgo alto |
| $35.0 - 39.9$ | Obesidad Grado II | Rojo claro (`#EF4444`) | Riesgo muy alto |
| $\ge 40.0$ | Obesidad Grado III (Mórbida) | Rojo oscuro (`#B91C1C`) | Riesgo extremadamente alto |

---

## 2. Diferenciación por Sexo Biológico (Hombre vs Mujer)

Si bien la fórmula del IMC en sí es idéntica en unidades métricas, la interpretación de composición corporal y la estimación del **Peso Ideal / Peso Referencial Saludable** difiere significativamente por masa muscular, densidad ósea y porcentaje de grasa esencial.

### A. Estimación de Peso Referencial (Fórmula de Robinson 1983)
Para estaturas superiores a 5 pies (152.4 cm), con $h$ en pulgadas sobre 5 pies ($h = (\text{altura\_cm} - 152.4) / 2.54$):

- **Hombres:**
  $$\text{Peso Ideal (kg)} = 52 + 1.9 \times h$$
- **Mujeres:**
  $$\text{Peso Ideal (kg)} = 49 + 1.7 \times h$$

### B. Rango de Peso Saludable (Basado en IMC 18.5 a 24.9)
Es más empático y médicamente preciso mostrar al usuario un **rango** en lugar de un único número fijo:
$$\text{Peso Mínimo Saludable} = 18.5 \times (\text{Estatura en m})^2$$
$$\text{Peso Máximo Saludable} = 24.9 \times (\text{Estatura en m})^2$$

### C. Porcentaje de Grasa Corporal Estimado (Fórmula de Deurenberg)
Permite contextualizar el IMC diferenciando por sexo:
$$\text{Grasa \%} = (1.20 \times \text{IMC}) + (0.23 \times \text{Edad}) - (10.8 \times \text{Sexo}) - 5.4$$
Donde:
- $\text{Sexo} = 1$ para Hombres
- $\text{Sexo} = 0$ para Mujeres

---

## 3. Implementación en Código (TypeScript / Lógica Pura)

```typescript
export interface BmiResult {
  bmi: number;
  category: 'underweight' | 'normal' | 'overweight' | 'obese1' | 'obese2' | 'obese3';
  categoryLabel: string;
  colorHex: string;
  healthyWeightMinKg: number;
  healthyWeightMaxKg: number;
  idealWeightKg: number;
  recommendation: string;
}

export function calculateBmi(
  weightKg: number,
  heightCm: number,
  gender: 'male' | 'female'
): BmiResult {
  if (heightCm <= 0 || weightKg <= 0) {
    throw new Error('Estatura y peso deben ser valores positivos.');
  }

  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));
  const healthyWeightMinKg = Number((18.5 * (heightM * heightM)).toFixed(1));
  const healthyWeightMaxKg = Number((24.9 * (heightM * heightM)).toFixed(1));

  // Cálculo de peso ideal (Robinson)
  const inchesOver5Feet = Math.max(0, (heightCm - 152.4) / 2.54);
  const idealWeightKg = Number(
    (gender === 'male'
      ? 52 + 1.9 * inchesOver5Feet
      : 49 + 1.7 * inchesOver5Feet
    ).toFixed(1)
  );

  let category: BmiResult['category'] = 'normal';
  let categoryLabel = 'Peso Normal';
  let colorHex = '#22C55E';
  let recommendation = '¡Excelente! Mantén tus hábitos activos y alimentación balanceada.';

  if (bmi < 18.5) {
    category = 'underweight';
    categoryLabel = 'Bajo Peso';
    colorHex = '#38BDF8';
    recommendation = 'Se recomienda reforzar el aporte calórico con alimentos nutritivos y ejercicios de fuerza.';
  } else if (bmi < 25.0) {
    category = 'normal';
    categoryLabel = 'Peso Normal';
    colorHex = '#22C55E';
  } else if (bmi < 30.0) {
    category = 'overweight';
    categoryLabel = 'Sobrepeso';
    colorHex = '#EAB308';
    recommendation = 'Un déficit calórico moderado y rutinas regulares de cardio y fuerza te ayudarán a regresar al rango saludable.';
  } else if (bmi < 35.0) {
    category = 'obese1';
    categoryLabel = 'Obesidad Grado I';
    colorHex = '#F97316';
    recommendation = 'Enfócate en constancia con caminatas diarias, ejercicios con ligas y control de porciones.';
  } else {
    category = 'obese2';
    categoryLabel = 'Obesidad Alta';
    colorHex = '#EF4444';
    recommendation = 'Prioriza ejercicios de bajo impacto para proteger rodillas y articulaciones.';
  }

  return {
    bmi,
    category,
    categoryLabel,
    colorHex,
    healthyWeightMinKg,
    healthyWeightMaxKg,
    idealWeightKg,
    recommendation,
  };
}
```

---

## 4. Limitaciones y Exención de Responsabilidad Médica
- La aplicación debe mostrar siempre un aviso discreto: *"El IMC es una métrica de referencia general. En personas con alta masa muscular atlética o mujeres embarazadas, el IMC puede no reflejar fielmente el estado de grasa corporal"*.
