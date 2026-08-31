---
name: virtual-pet
description: >-
  Especialista en diseño de mascotas virtuales interactivas (gamificación tipo Tamagotchi),
  sistemas de progresión visual de peso/forma física del avatar, recordatorios empáticos
  (hidratación, pesaje semanal, inicio de rutina) y lazos emocionales de retención de usuario.
  OBLIGATORIO: La arquitectura del sistema de mascota debe cumplir los principios SOLID documentados en este skill.
---

# Skill: Especialista en Mascota Virtual y Gamificación de Hábitos

Este skill define la arquitectura visual, comportamiento reactivo, estados emocionales/físicos, animaciones y sistema de recordatorios de la mascota virtual de la aplicación (el Mapache Fitness y sus variantes).

---

## 1. Mecánica de Sincronización Isomórfica (Usuario ⇄ Mascota)

La mascota no es solo un adorno visual; es el **reflejo directo de la disciplina y progreso del usuario**:

```text
+-----------------------+                    +------------------------+
|   ESTADO DEL USUARIO  |                    |   ESTADO DE LA MASCOTA |
|  - Peso y progreso    | -----------------> |  - Forma corporal      |
|  - Hábitos cumplidos  |                    |  - Nivel de energía    |
|  - Hidratación y plan |                    |  - Accesorios y nivel  |
+-----------------------+                    +------------------------+
```

### A. Estados de Forma Física de la Mascota
1. **Fase Inicial (Sedentario / Gordito):**
   - Forma redondeada, mejillas rellenas, movimientos pausados.
   - Motivación cariñosa: *"¡Estamos listos para empezar nuestro cambio! Vamos juntos paso a pasito"*.
2. **Fase Progreso Positivo (Baja de peso y cumplimiento de plan):**
   - El mapache reduce su silueta gradualmente conforme bajan los kilos en el pesaje semanal.
   - Postura ágil, animaciones activas (haciendo estiramientos o saltitos).
   - Desbloqueo de accesorios cosméticos por nivel: cinta para la frente, termo de agua, guantes deportivos, tenis de colores.
3. **Fase Descuido / Incumplimiento prolongado (> 4 días sin actividad o plan abandonado):**
   - El mapache se sienta perezoso o come un bocadillo chatarra, mostrándose desanimado pero sin culpabilizar.
   - Frase empática: *"Te he extrañado... Unos 15 minutitos hoy nos harán sentir mucho mejor a los dos. ¿Hacemos algo suave?"*.

---

## 2. Sistema de Experiencia (XP) y Niveles de Hábitos

Cada acción positiva en la app otorga puntos de experiencia (XP) que alimentan el nivel de la mascota:

| Acción en la App | Puntos de XP | Efecto en la Mascota |
|---|:---:|---|
| **Registrar vaso de agua (250ml)** | +10 XP | Animación bebiendo agua feliz con sonido refrescante |
| **Completar rutina de ejercicio** | +50 XP | El mapache festeja con toalla al cuello y celebra |
| **Registrar las 4 comidas del día** | +30 XP | El mapache muestra un plato balanceado |
| **Completar el pesaje semanal** | +100 XP | Salto de alegría y actualización de su contextura corporal |
| **Cumplir meta del plan completo** | +300 XP | Fiesta de confeti y trofeo de nivel superior |

---

## 3. Sistema de Recordatorios Empáticos y Notificaciones Locales

El mapache es el encargado de comunicar los recordatorios mediante diálogos en pantalla y notificaciones locales:

### A. Recordatorio de Hidratación (Durante el día)
- Aparece un bocadillo con la mascota sosteniendo un vaso vacío:
  - *"¡Hey! Un traguito de agua para mantener el motor encendido. ¿Nos tomamos un vaso?"*.

### B. Recordatorio de Pesaje Semanal (Día asignado, ej. viernes o domingos)
- El mapache se sube a una báscula miniatura:
  - *"¡Hoy es nuestro día de pesaje semanal! Recuerda pesarte en ayunas y sin calzado para ver nuestro progreso real"*.

### C. Alerta de Expiración del Plan
- Al cumplirse el plazo del plan activo (ej. 2 semanas o 4 semanas):
  - *"¡Terminamos el ciclo de nuestro plan! Vamos a revisar nuestros resultados juntos y ajustar lo que sigue"*.

---

## 4. Especificación de Tipos de Dominio

```typescript
export type PetShape = 'chubby' | 'balanced' | 'fit' | 'athletic';
export type PetMood  = 'happy' | 'sleepy' | 'thirsty' | 'celebrating' | 'motivating';

export interface VirtualPetState {
  name: string;
  level: number;
  currentXp: number;
  xpToNextLevel: number;
  shape: PetShape;
  mood: PetMood;
  unlockedAccessories: string[];
  equippedAccessory?: string;
  dialogMessage: string;
}
```

- **Renderizado Dinámico:** Implementación con componentes SVG modulares o animaciones Lottie sincronizadas según `shape` y `mood`.
- **Interacción Táctil:** Al pulsar la mascota, reproduce una microanimación (hace un saludo, guiño o pirueta) acompañada de retroalimentación háptica suave.

---

## 5. Principios SOLID aplicados al Sistema de Mascota — OBLIGATORIOS

**Todo código relacionado con la mascota debe respetar estos principios sin excepción.**

### S — Single Responsibility: PetService como módulo independiente

La lógica de XP, nivel, mensajes y evolución de forma **vive en su propio servicio**, separada del store global.

```typescript
// ✅ CORRECTO — petService.ts con responsabilidad única
// src/core/petService.ts

/** Calcula el nuevo estado de XP y nivel de la mascota. */
export function computeXpGain(pet: VirtualPetState, action: PetXpAction): VirtualPetState {
  const gained = XP_TABLE[action];
  const newXp = pet.currentXp + gained;
  if (newXp >= pet.xpToNextLevel) {
    return { ...pet, level: pet.level + 1, currentXp: newXp - pet.xpToNextLevel };
  }
  return { ...pet, currentXp: newXp };
}

/** Determina la forma corporal según la diferencia de peso del usuario. */
export function computePetShape(lostKg: number): PetShape {
  if (lostKg >= 5) return 'athletic';
  if (lostKg >= 3) return 'fit';
  if (lostKg >= 1) return 'balanced';
  return 'chubby';
}

/** Genera el mensaje de diálogo según contexto. */
export function computePetDialogue(context: PetDialogueContext): string { ... }

// ❌ INCORRECTO — Lógica de mascota dentro del store o del componente
addWeeklyWeighIn: async (weight) => {
  // XP y mensajes NO van aquí ← rompe SRP del store
  petState.xp += 100;
  petState.message = '¡Campeón!';
  petState.shape = 'fit';
};
```

### O — Open/Closed: Registro de Diálogos y Formas Extensible

Los mensajes y formas de la mascota usan un **mapa de configuración**, no cadenas de `if/else`.

```typescript
// ✅ CORRECTO — Tablas extensibles sin modificar la lógica base
export const XP_TABLE: Record<PetXpAction, number> = {
  register_water:    10,
  complete_workout:  50,
  register_meals:    30,
  weekly_weigh_in:  100,
  complete_plan:    300,
  // Agregar nuevas acciones aquí sin tocar computeXpGain()
};

export const SHAPE_THRESHOLDS: Array<{ minLostKg: number; shape: PetShape }> = [
  { minLostKg: 5, shape: 'athletic' },
  { minLostKg: 3, shape: 'fit' },
  { minLostKg: 1, shape: 'balanced' },
  { minLostKg: 0, shape: 'chubby' },
  // Agregar nueva fase sin modificar computePetShape()
];
```

### I — Interface Segregation: Props del Componente VirtualPetView

El componente visual de la mascota recibe **solo lo que necesita para renderizarse**.

```typescript
// ✅ CORRECTO — Props específicas y mínimas
interface VirtualPetViewProps {
  shape: PetShape;
  mood: PetMood;
  level: number;
  dialogMessage: string;
  onPress: () => void;
}
// El componente NO recibe weighInHistory, currentPlan ni userProfile

// ❌ INCORRECTO — Over-fetching de datos
interface VirtualPetViewProps {
  petState: VirtualPetState;       // ok
  userProfile: UserProfile;        // ← el componente no necesita el perfil completo
  weighInHistory: WeeklyWeighIn[]; // ← tampoco el historial
}
```

### D — Dependency Inversion: PetService no depende de AsyncStorage

El servicio de mascota es **pura lógica funcional sin efectos secundarios**. El store es quien orquesta y persiste.

```typescript
// ✅ CORRECTO — petService.ts son funciones puras, sin imports de AsyncStorage
// La cadena es: acción del usuario → store → petService (puro) → store actualiza → persiste

// ❌ INCORRECTO — El servicio de mascota llama directamente al storage
export async function gainXp(pet: VirtualPetState, action: PetXpAction): Promise<void> {
  const newPet = computeXpGain(pet, action);
  await AsyncStorage.setItem('pet', JSON.stringify(newPet)); // ← DIP violado
}
```

---

## 6. Checklist de Calidad — Mascota Virtual (antes de cada entrega)

- [ ] **[SRP]** ¿La lógica de XP, forma y mensajes vive en `petService.ts` y no en el store o el componente?
- [ ] **[OCP]** ¿Los umbrales de XP y forma usan tablas de configuración extensibles?
- [ ] **[ISP]** ¿`VirtualPetView` recibe solo `shape`, `mood`, `level`, `dialogMessage` y `onPress`?
- [ ] **[DIP]** ¿Las funciones de `petService` son puras (sin imports de AsyncStorage o stores)?
- [ ] ¿La mascota reacciona visualmente al progreso semanal del usuario (pesaje)?
- [ ] ¿Los mensajes son empáticos y nunca culpabilizan al usuario?
- [ ] ¿La mascota tiene al menos 4 estados de forma (`chubby`, `balanced`, `fit`, `athletic`)?
