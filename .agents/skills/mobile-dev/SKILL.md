---
name: mobile-dev
description: >-
  Experto en arquitectura y desarrollo de aplicaciones móviles multiplataforma para Android e iOS.
  Utilizar cuando se requiera diseñar la arquitectura técnica, escribir o refactorizar código de la app,
  configurar el stack tecnológico (React Native/Expo o Flutter), persistencia local offline-first,
  gestión de estado global y optimización de rendimiento en dispositivos móviles.
  OBLIGATORIO: Todo código producido debe cumplir los principios SOLID documentados en este skill.
---

# Skill: Experto en Desarrollo de Aplicaciones Mobile (Android & iOS)

Este skill define los lineamientos, arquitectura, patrones de diseño y estándares de ingeniería de software para el desarrollo de la aplicación móvil de seguimiento de peso, IMC, ejercicios y alimentación en Android e iOS.

---

## 1. Stack Tecnológico Recomendado y Principios

- **Framework Base:** React Native con Expo (TypeScript) o Flutter (Dart).
  - *Enfoque prioritario:* React Native con Expo SDK moderno por su agilidad, ecosistema rico de animaciones (Reanimated, Skia, Lottie) y soporte nativo multiplataforma sin fricción.
- **Persistencia Local (Offline-First):** La app debe ser 100% funcional sin conexión a internet.
  - SQLite (WatermelonDB / expo-sqlite / op-sqlite) o Realm / MMKV para almacenamiento rápido de configuraciones y registros diarios.
- **Gestión de Estado:** Zustand o Redux Toolkit (React Native) / Riverpod o Bloc (Flutter). Estado desacoplado de la UI, reactivo y predecible.
- **Navegación:** React Navigation v6+ (Stack, Bottom Tabs) con transiciones suaves y soporte de gestos nativos.

---

## 2. Arquitectura de Software (Clean Architecture + Modular)

```text
src/
├── app/                  # Entry point, providers y navegación
├── core/                 # Utilidades globales, constantes, temas, tipos base
├── features/             # Módulos encapsulados por dominio
│   ├── weight-bmi/       # Registro de peso, cálculo y tendencias de IMC
│   ├── workouts/         # Catálogo de ejercicios (ligas, mancuernas, bandas, cardio)
│   ├── nutrition/        # Planes (Desayuno, Comida, Cena, Snacks) y recetas
│   └── profile/          # Datos del usuario (sexo, estatura, fecha nacimiento, objetivos)
├── shared/               # Componentes UI reutilizables, hooks, base de datos local
└── assets/               # Iconos, fuentes y animaciones Lottie/SVG
```

---

## 3. Principios SOLID — OBLIGATORIOS en Todo el Código

**Todos los módulos, servicios, componentes y hooks producidos deben respetar estos principios sin excepción.**

### S — Single Responsibility Principle (SRP)
> "Un módulo tiene una sola razón para cambiar."

**Reglas obligatorias:**
- Cada archivo de `core/` tiene **una única responsabilidad de dominio** (ej. `bmiCalculator.ts` solo calcula IMC, nunca persiste datos).
- Los componentes React solo renderízan UI. La lógica de negocio se extrae a **custom hooks** (`useHydration`, `usePlan`, `usePetLevel`).
- El store de Zustand **no incrusta lógica de dominio**. Las funciones de negocio (XP, nivel de mascota, cálculo de IMC) se llaman desde servicios independientes.

```typescript
// ✅ CORRECTO — Responsabilidad única por archivo
// petService.ts → solo calcula XP, nivel y mensajes de la mascota
export function computePetLevelUp(pet: VirtualPetState, xpGained: number): VirtualPetState { ... }

// ❌ INCORRECTO — Lógica de mascota dentro del store
addWeeklyWeighIn: async (weight) => {
  // ← XP y mensajes NO van aquí
  petState.xp += 100; petState.message = '¡Campeón!';
}
```

### O — Open/Closed Principle (OCP)
> "Abierto para extensión, cerrado para modificación."

**Regla obligatoria:** Usar el **patrón Registry** para todo catálogo extensible (animaciones, ejercicios, recetas). Nunca usar cadenas de `if/else` o `switch` que requieran editar el componente base para agregar entradas.

```typescript
// ✅ CORRECTO — Registro extensible
type AnimationRegistry = Record<ExerciseAnimationType, React.FC<AnimationFrameProps>>;

const ANIMATION_REGISTRY: AnimationRegistry = {
  curl_biceps: CurlBicepsFrame,
  squat_goblet: SquatGobletFrame,
  bridge_glute: BridgeGluteFrame,
  // Agregar nuevas animaciones AQUÍ sin tocar el player base
};

export const ExerciseAnimationPlayer: FC<Props> = ({ type }) => {
  const Frame = ANIMATION_REGISTRY[type];
  return Frame ? <Frame /> : <DefaultFrame />;
};

// ❌ INCORRECTO — Violar OCP
export const ExerciseAnimationPlayer: FC<Props> = ({ type }) => {
  if (type === 'curl_biceps') return <CurlBicepsJSX />;
  if (type === 'squat_goblet') return <SquatJSX />;
  // ← Cada nuevo ejercicio obliga a modificar este componente
};
```

### L — Liskov Substitution Principle (LSP)
> "Los subtipos deben poder usarse en lugar del tipo base sin alterar el comportamiento esperado."

**Regla obligatoria:** Las extensiones de interfaces de dominio **nunca rompen el contrato original**. Solo agregan, nunca modifican ni eliminan propiedades requeridas.

```typescript
// ✅ CORRECTO — ExtendedExerciseItem es 100% sustituible por ExerciseItem
export interface ExtendedExerciseItem extends ExerciseItem {
  animationType: ExerciseAnimationType; // adición
  levelNumeric: 1 | 2 | 3;             // adición
}
// Cualquier función que acepte ExerciseItem también acepta ExtendedExerciseItem sin problema
```

### I — Interface Segregation Principle (ISP)
> "Los clientes no deben depender de interfaces que no usan."

**Regla obligatoria:** El store global **no se consume directo**; se accede mediante **selectors específicos por dominio** que exponen solo lo necesario.

```typescript
// ✅ CORRECTO — Selectors granulares
const useHydration = () =>
  useAppStore(s => ({
    glasses: s.hydrationHistory,
    add: s.addWaterGlass,
    remove: s.removeWaterGlass,
  }));

const usePetState = () => useAppStore(s => ({ pet: s.petState }));

const usePlanActions = () =>
  useAppStore(s => ({
    plan: s.currentPlan,
    activate: s.activatePlan,
    removeExercise: s.removeExerciseFromPlan,
  }));

// ❌ INCORRECTO — Un componente que solo necesita agua consume TODO el store
const { hydrationHistory, addWaterGlass, userProfile, currentPlan, petState, ... } = useAppStore();
```

### D — Dependency Inversion Principle (DIP)
> "Los módulos de alto nivel dependen de abstracciones, no de implementaciones concretas."

**Regla obligatoria:**
1. La persistencia debe ir detrás de una interfaz `StorageAdapter`. El store depende de esa interfaz, no de `AsyncStorage` directamente.
2. Los servicios de dominio (`planEngine`, `petService`) reciben sus dependencias como parámetros, no las importan directamente.

```typescript
// ✅ CORRECTO — Abstracción de almacenamiento
interface StorageAdapter {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  remove(key: string): Promise<void>;
}

// Implementación concreta (intercambiable por MMKV, SQLite, etc.)
class AsyncStorageAdapter implements StorageAdapter { ... }

// ✅ CORRECTO — planEngine recibe recipeProvider como dependencia inyectable
export function generateAutomatedPlan(
  profile: UserProfile,
  recipeProvider: RecipeProvider = defaultCatalogProvider
): GeneratedPlan { ... }
```

---

## 4. Directrices de Implementación

### A. Rendimiento y Fluidez (60/120 FPS)
- Utilizar `react-native-reanimated` y componentes nativos acelerados por hardware.
- Evitar re-renders innecesarios mediante memoización (`useMemo`, `useCallback`, `React.memo`).
- Virtualización eficiente de listas con `FlashList` (Shopify) en catálogos de ejercicios y recetas.

### B. Compatibilidad de Plataformas (Android vs iOS)
- Respetar áreas seguras nativas (`SafeAreaView` / `react-native-safe-area-context`).
- Respetar comportamiento del teclado (`KeyboardAvoidingView` / `react-native-keyboard-controller`).
- Integrar retroalimentación háptica nativa (`expo-haptics`) en pulsaciones de botones, temporizadores de ejercicios y logros.

### C. Persistencia y Sincronización
- Modelo de datos estructurado:
  - `UserMetrics`: `{ id, date, weight, height, gender, bmi, bodyFatEstimate, notes }`
  - `WorkoutLog`: `{ id, date, exerciseId, routineType, completedReps, completedSets, durationSeconds }`
  - `MealLog`: `{ id, date, mealType: 'breakfast'|'lunch'|'dinner'|'snack', recipeId, notes }`

---

## 5. Checklist de Validación SOLID + Técnica (Obligatorio antes de cada PR/entrega)

- [ ] **[SRP]** ¿Cada archivo tiene una única razón de cambio? ¿La lógica de dominio está fuera de los componentes UI?
- [ ] **[OCP]** ¿Los catálogos extensibles usan patrón Registry? ¿Agregar contenido no requiere modificar el componente base?
- [ ] **[LSP]** ¿Las interfaces extendidas son sustituibles por su tipo base sin alterar comportamiento?
- [ ] **[ISP]** ¿Los componentes consumen el store vía selectors específicos, no el store completo?
- [ ] **[DIP]** ¿La persistencia va detrás de una interfaz `StorageAdapter`? ¿Los servicios de dominio reciben dependencias inyectadas?
- [ ] ¿El código está estrictamente tipado (TypeScript sin `any`)?
- [ ] ¿La aplicación funciona y guarda datos en modo avión sin conexión a red?
- [ ] ¿Se probaron los layouts en pantallas con notch, Dynamic Island y barra de navegación de Android?
