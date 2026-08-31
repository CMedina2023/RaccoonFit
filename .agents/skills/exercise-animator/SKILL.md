---
name: exercise-animator
description: >-
  Especialista en diseño técnico y representación de animaciones de ejercicios para entrenar en casa.
  Utilizar cuando se diseñen, definan o implementen animaciones visuales paso a paso (Lottie, SVG animado, Canvas)
  enfocadas en movimientos con peso corporal, mancuernas, ligas de resistencia y bandas elásticas de piernas,
  garantizando claridad biomecánica, ligereza de archivo y reproducción fluida en móviles.
  OBLIGATORIO: La arquitectura del player y los frames de animación deben cumplir los principios SOLID documentados en este skill.
---

# Skill: Especialista en Animaciones de Ejercicios en Casa

Este skill es responsable de la dirección visual dinámica de los ejercicios. Su objetivo es que cualquier persona, sin importar su experiencia previa, comprenda en 3 segundos la trayectoria correcta del movimiento, la fase de respiración y los puntos de tensión muscular, utilizando únicamente material disponible en casa.

---

## 1. Principios de Animación de Movimiento Fitness

1. **Simplicidad Vectorial (Lottie / SVG):**
   - Evitar vídeos pesados de 50MB que consuman memoria y batería.
   - Utilizar ilustraciones estilizadas en 2D o esqueletos anatómicos animados vectoriales (JSON de Lottie o SVG keyframed).
   - Tamaño objetivo por animación: **< 150 KB**.
2. **Ciclo de Loop Continuo con Pausa de Retorno:**
   - Fase Concéntrica (esfuerzo): 2 segundos (indicador de exhalación).
   - Fase Isométrica (contracción máxima): 1 segundo.
   - Fase Excéntrica (retorno controlado): 2 a 3 segundos (indicador de inhalación).
   - Pausa natural de 0.5s antes del siguiente ciclo.
3. **Resaltado de Músculos Diana (Active Muscle Highlighting):**
   - El músculo principal trabajado debe colorearse en el acento cromático (ej. `#10B981` o `#F97316`) durante la fase de contracción.
4. **Indicador de Tensión de Ligas / Bandas:**
   - Las ligas y bandas deben estirarse visiblemente con cambio sutil de grosor para transmitir la resistencia elástica del implemento.

---

## 2. Catálogo de Animaciones por Implemento de Casa

### A. Mancuernas y Pesas Libres
- **Curl de Bíceps Alterno:** Trayectoria vertical, codos pegados al torso, antebrazo supinado en la cúspide.
- **Press Militar de Hombro Sentado/De Pie:** Mancuernas desde la altura de las orejas hacia arriba en arco convergente controlado.
- **Sentadilla Goblet con Mancuerna al Pecho:** Codos apuntando hacia abajo, descenso manteniendo el pecho erguido y talones apoyados.
- **Remo Unilateral con Apoyo en Silla:** Espalda neutra a 45°, codo rozando la caja torácica.

### B. Ligas de Resistencia (con Asas o Tubos)
- **Remo Sentado con Liga en los Pies:** Extensión de piernas al frente, tracción de codos hacia atrás con retracción escapular.
- **Elevaciones Laterales con Liga Pisada:** Codos ligeramente flexionados, elevación hasta la horizontal.
- **Press de Pecho de Pie con Liga Anclada en Puerta:** Empuje frontal a la altura media del pecho.

### C. Bandas de Resistencia para Piernas (Loop Bands)
- **Puente de Glúteos con Banda Sobre las Rodillas:** Banda manteniendo tensión abductora hacia afuera durante la elevación pélvica.
- **Paso Lateral de Monstruo (Monster Walk):** Postura de media sentadilla, desplazamiento lateral manteniendo tensión constante en abductores.
- **Patada de Glúteo en Cuadrupedial:** Extensión hacia atrás y arriba sin arquear la zona lumbar.

### D. Cardio sin Impacto y con Peso Corporal
- **Jumping Jacks Modificados (Bajo Impacto):** Paso lateral alterno sin salto para cuidar rodillas.
- **Elevación de Rodillas al Pecho (High Knees suave):** Ritmo constante con braceo activo.
- **Escaladores (Mountain Climbers) en Suelo:** Apoyo de manos firme, alternancia de rodillas hacia el pecho con core rígido.

---

## 3. Principios SOLID aplicados al Player de Animaciones — OBLIGATORIOS

**Todo código del sistema de animaciones debe cumplir estos principios. El incumplimiento debe bloquearse en revisión de código.**

### S — Single Responsibility: Separar el Player de los Frames

El componente `ExerciseAnimationPlayer` **solo orquesta y controla el ciclo** (fases, velocidad, pausa). Cada animación concreta vive en su **propio componente Frame**.

```typescript
// ✅ CORRECTO — Separación de responsabilidades
// src/components/animations/frames/CurlBicepsFrame.tsx → solo el SVG del curl de bíceps
// src/components/animations/frames/SquatGobletFrame.tsx → solo el SVG de la sentadilla
// src/components/animations/ExerciseAnimationPlayer.tsx → solo controla fase, velocidad y pausa
// src/hooks/useExercisePhase.ts → solo gestiona el Animated.Value y la lógica de fases

// ❌ INCORRECTO — Un solo archivo con 350 líneas que mezcla todo
// ExerciseAnimationPlayer.tsx:
//   - Lógica de fases (Animated.Value)    ← debería ser custom hook
//   - SVG de curl de bíceps               ← debería ser CurlBicepsFrame
//   - SVG de sentadilla goblet            ← debería ser SquatGobletFrame
//   - Controles de velocidad y pausa      ← ok si está en el player
```

**Custom hook recomendado:**
```typescript
// src/hooks/useExercisePhase.ts
export function useExercisePhase(options: { isPaused: boolean; speed: 1 | 0.5 }) {
  const phaseAnim = useRef(new Animated.Value(0)).current;
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  // ... lógica de animación
  return { phase, phaseAnim, muscleOpacity };
}
```

### O — Open/Closed: Patrón Registry para Frames de Animación

**Nunca usar cadenas `if/else` o `switch` para seleccionar el frame de animación.** Usar un registro de componentes que permita agregar nuevos ejercicios sin modificar el player.

```typescript
// ✅ CORRECTO — Registry extensible
// src/components/animations/animationRegistry.ts
import type { ExerciseAnimationType, AnimationFrameProps } from '../../types';
import { CurlBicepsFrame }  from './frames/CurlBicepsFrame';
import { SquatGobletFrame } from './frames/SquatGobletFrame';
import { BridgeGluteFrame } from './frames/BridgeGluteFrame';
import { MonsterWalkFrame } from './frames/MonsterWalkFrame';
import { ShoulderPressFrame } from './frames/ShoulderPressFrame';

export const ANIMATION_REGISTRY: Record<ExerciseAnimationType, React.FC<AnimationFrameProps>> = {
  curl_biceps:    CurlBicepsFrame,
  squat_goblet:   SquatGobletFrame,
  bridge_glute:   BridgeGluteFrame,
  monster_walk:   MonsterWalkFrame,
  shoulder_press: ShoulderPressFrame,
  // ✅ Agregar un nuevo ejercicio = agregar una línea aquí + crear el Frame
};

// ExerciseAnimationPlayer.tsx — cerrado para modificación
export const ExerciseAnimationPlayer: FC<Props> = ({ type, color, muscleName }) => {
  const { phase, muscleOpacity } = useExercisePhase({ isPaused, speed });
  const Frame = ANIMATION_REGISTRY[type] ?? DefaultExerciseFrame;
  return (
    <View>
      <Frame phase={phase} color={color} muscleOpacity={muscleOpacity} />
      <PhaseLabel phase={phase} />
      <PlayerControls isPaused={isPaused} speed={speed} onPause={...} onSpeed={...} />
    </View>
  );
};

// ❌ INCORRECTO — Violar OCP con condicionales
export const ExerciseAnimationPlayer: FC<Props> = ({ type }) => {
  if (type === 'curl_biceps')  return <CurlBicepsJSX />;
  if (type === 'squat_goblet') return <SquatGobletJSX />;
  // ← Agregar "pull_up" obliga a editar este archivo
};
```

### L — Liskov Substitution: Interfaz Uniforme para Todos los Frames

Todos los componentes Frame **implementan la misma interfaz** y son intercambiables dentro del Registry.

```typescript
// ✅ CORRECTO — Contrato uniforme para todos los frames
export interface AnimationFrameProps {
  phase: 0 | 1 | 2;     // 0=inicial, 1=esfuerzo, 2=retorno
  color: string;          // color del músculo activo
  muscleOpacity: Animated.Value;
}

// Cada frame cumple el mismo contrato
const CurlBicepsFrame: FC<AnimationFrameProps> = ({ phase, color, muscleOpacity }) => { ... };
const SquatGobletFrame: FC<AnimationFrameProps> = ({ phase, color, muscleOpacity }) => { ... };
// Cualquier Frame es sustituible por otro dentro del Registry sin alterar el player
```

### I — Interface Segregation: Props Mínimas por Componente

```typescript
// ✅ CORRECTO — Cada sub-componente recibe solo lo que necesita
interface PlayerControlsProps {
  isPaused: boolean;
  speed: 1 | 0.5;
  onTogglePause: () => void;
  onToggleSpeed: () => void;
}

interface PhaseLabelProps {
  phase: 0 | 1 | 2;
  color: string;
}

// ❌ INCORRECTO — Un solo objeto que mezcla todo
interface ExercisePlayerProps {
  type: ExerciseAnimationType;
  phase: number;
  isPaused: boolean;
  speed: number;
  color: string;
  muscleName: string;
  weighInHistory: WeeklyWeighIn[]; // ← innecesario en el animador
  userProfile: UserProfile;         // ← innecesario en el animador
}
```

### D — Dependency Inversion: Frames son Componentes Puros

Los frames de animación son **componentes puros sin dependencias externas** (sin stores, sin AsyncStorage, sin llamadas a API).

```typescript
// ✅ CORRECTO — Frame puro, sin efectos secundarios externos
const CurlBicepsFrame: FC<AnimationFrameProps> = ({ phase, color, muscleOpacity }) => (
  <Svg width={200} height={200} viewBox="0 0 200 200">
    {/* SVG paths que solo dependen de phase, color y muscleOpacity */}
  </Svg>
);

// ❌ INCORRECTO — Frame que accede al store (viola DIP)
const CurlBicepsFrame: FC = () => {
  const { userProfile } = useAppStore(); // ← depende del store concreto
  return <Svg>...</Svg>;
};
```

---

## 4. Especificación Técnica para la App Móvil

- **Librería de render:** `react-native-svg` para SVG animados o `lottie-react-native` para JSON Lottie.
- **Estructura de directorios recomendada:**
  ```text
  src/components/animations/
  ├── ExerciseAnimationPlayer.tsx   ← Orquestador principal (OCP: cerrado)
  ├── animationRegistry.ts          ← Registro extensible de frames
  ├── frames/                       ← Un archivo por tipo de animación (SRP)
  │   ├── CurlBicepsFrame.tsx
  │   ├── SquatGobletFrame.tsx
  │   ├── BridgeGluteFrame.tsx
  │   └── DefaultExerciseFrame.tsx  ← Fallback si el tipo no está registrado
  └── PlayerControls.tsx            ← Controles de pausa/velocidad (SRP)

  src/hooks/
  └── useExercisePhase.ts           ← Lógica de ciclo animado (SRP)
  ```
- **Props del componente Player (ISP aplicado):**
  ```tsx
  <ExerciseAnimationPlayer
    type={exercise.animationType}
    color="#10B981"
    muscleName={exercise.targetMuscle}
  />
  ```
- **Modo Pausa y Repetición Lenta:** La interfaz debe permitir al usuario pulsar la animación para ralentizarla al 50% y analizar la técnica.

---

## 5. Checklist de Calidad — Animaciones (antes de cada entrega)

- [ ] **[SRP]** ¿Cada frame de animación está en su propio archivo? ¿Existe `useExercisePhase` como custom hook separado?
- [ ] **[OCP]** ¿El player usa `ANIMATION_REGISTRY` y no contiene ningún `if/else` por tipo de ejercicio?
- [ ] **[LSP]** ¿Todos los frames implementan `AnimationFrameProps` con la misma firma exacta?
- [ ] **[ISP]** ¿`PlayerControls` y `PhaseLabel` tienen sus propias interfaces de props mínimas?
- [ ] **[DIP]** ¿Los frames son componentes puros sin imports de stores, AsyncStorage o servicios externos?
- [ ] ¿La animación muestra las 3 fases claramente (inicial, esfuerzo, retorno)?
- [ ] ¿El músculo diana se resalta durante la fase de contracción?
- [ ] ¿El tamaño del archivo SVG/Lottie es menor a 150 KB?
- [ ] ¿El player tiene controles de pausa y cámara lenta (50%)?
