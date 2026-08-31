---
name: mobile-ui-ux
description: >-
  Especialista en diseño gráfico, UI/UX y sistemas de diseño para aplicaciones móviles Android e iOS.
  Utilizar para definir la identidad visual, paleta cromática, tipografía, componentes visuales,
  microinteracciones, accesibilidad (WCAG) y consistencia con Material Design 3 y Human Interface Guidelines.
  OBLIGATORIO: Los componentes visuales deben cumplir los principios SOLID documentados en este skill.
---

# Skill: Especialista en Diseño Gráfico y UI/UX Móvil (iOS & Android)

Este skill define la dirección artística, el lenguaje visual, los componentes interactivos y la experiencia de usuario (UX) de la aplicación, garantizando una apariencia moderna, prémium, limpia e intuitiva en ambos sistemas operativos.

---

## 1. Filosofía de Diseño

- **Clara, Motivadora y Saludable:** El diseño debe inspirar vitalidad, constancia y progreso sin saturar con datos abrumadores.
- **Plataforma Nativa Respetada:**
  - En **iOS:** Bordes suavemente redondeados, desenfoques sutiles (frosted glass/glassmorphism), transiciones fluidas estilo UINavigationController, tipografía SF Pro / Inter.
  - En **Android:** Filosofía Material 3, tarjetas elevadas, soporte de temas tonalmente adaptativos, tipografía Roboto / Outfit.
- **Sin Aspecto Genérico:** Evitar colores planos sin vida. Utilizar paletas seleccionadas con altos niveles de contraste y armonía visual.

---

## 2. Sistema de Diseño (Design Tokens)

### A. Paleta Cromática
- **Primary (Energía / Acción):** Esmeralda / Menta vigorizante (`#10B981` / `#059669`) para reflejar salud y éxito.
- **Secondary (Énfasis y Fuerza):** Naranja coral cálido (`#F97316`) para métricas activas, cardio y calorías quemadas.
- **Accent (Agua e Hidratación / Calma):** Cian eléctrico suave (`#06B6D4`) para hidratación y métricas de peso.
- **Superficies Modo Oscuro (Predilecto para fitness):**
  - Fondo base: `#0F172A` (Azul medianoche profundo, no negro plano).
  - Tarjetas / Superficies: `#1E293B` con bordes sutiles en `#334155`.
- **Superficies Modo Claro:**
  - Fondo base: `#F8FAFC`.
  - Tarjetas / Superficies: `#FFFFFF` con sombra suave `box-shadow: 0 4px 20px rgba(0,0,0,0.05)`.
- **Estados Semánticos:**
  - Éxito / En Rango: `#22C55E`
  - Precaución / Sobrepeso o Bajo peso: `#EAB308`
  - Alerta / Riesgo de Salud: `#EF4444`

### B. Tipografía
- **Títulos y Display:** `Outfit` o `Inter` Semi-Bold / Bold (legible en tamaños grandes de números de peso/IMC).
- **Cuerpo y Descripciones:** `Inter` o `Roboto` Regular (alta legibilidad en instrucciones breves de ejercicios y recetas).
- **Escala de Tamaños:**
  - Hero Metrics (ej. "68.5 kg"): 36pt - 44pt Bold.
  - Títulos de Sección: 20pt - 24pt Bold.
  - Subtítulos / Categorías: 14pt - 16pt Medium.
  - Body / Texto: 13pt - 15pt Regular.
  - Labels / Metadatos: 11pt - 12pt Medium.

---

## 3. Componentes Visuales Clave

1. **Card de IMC con Dial / Barra Progresiva:**
   - Barra horizontal dividida en zonas de color continuo: Bajo Peso (Azul) -> Normal (Verde) -> Sobrepeso (Amarillo) -> Obesidad (Rojo).
   - Indicador de aguja o marcador flotante animado que aterriza en el valor actual del usuario.

2. **Selector de Comidas (Tab de 4 Tiempos):**
   - 4 píldoras interactivas con icono + etiqueta:
     - 🌅 Desayuno
     - ☀️ Comida / Almuerzo
     - 🌙 Cena
     - 🍎 Snacks

3. **Selector de Categorías de Ejercicio en Casa:**
   - Tarjetas horizontales de acceso rápido con microilustraciones:
     - ⚡ Cardio en Casa
     - 🏋️ Mancuernas / Pesas Libres
     - ➰ Ligas de Resistencia
     - 🦵 Bandas de Glúteo y Pierna
     - 🧘 Peso Corporal

4. **Microinteracciones y Feedback Háptico:**
   - Animación de confeti sutil o destello verde al alcanzar un nuevo mínimo de peso o completar una rutina.
   - Botón de acción flotante (FAB) para "Registrar Peso Hoy" con pulso discreto si no se ha pesado en el día.

---

## 4. Principios SOLID aplicados a Componentes UI — OBLIGATORIOS

**Todo componente visual producido por este skill debe respetar estos principios.**

### S — Single Responsibility en Componentes

Cada componente tiene **una única responsabilidad visual**. No mezcla render, lógica de estado y modales en el mismo archivo.

```typescript
// ✅ CORRECTO — Tres archivos, tres responsabilidades
// ProfileForm.tsx        → solo el formulario de datos
// ResetConfirmModal.tsx  → solo el modal de confirmación
// ProfileScreen.tsx      → solo orquesta ambos componentes

// ❌ INCORRECTO — Un archivo con 3 responsabilidades
// ProfileScreen.tsx → formulario + modal + llamada al plan engine
```

**Regla de corte:** Si un componente tiene más de **150 líneas de código JSX** o más de **2 modales**, debe dividirse.

### O — Open/Closed en Design Tokens y Variantes

Los componentes de UI usan **variantes configurables** vía props, no condicionales `if/else` internos.

```typescript
// ✅ CORRECTO — Componente abierto para extensión vía props
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  size: 'sm' | 'md' | 'lg';
}
const VARIANT_STYLES: Record<ButtonProps['variant'], ViewStyle> = {
  primary:   { backgroundColor: '#10B981' },
  secondary: { backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' },
  danger:    { backgroundColor: '#EF4444' },
  ghost:     { backgroundColor: 'transparent' },
};
// Agregar 'warning' solo requiere añadir una entrada al registro, no tocar el componente

// ❌ INCORRECTO — Condicionales dentro del componente
const Button = ({ variant }) => {
  let bg = '#10B981';
  if (variant === 'secondary') bg = '#1E293B';
  if (variant === 'danger') bg = '#EF4444';
  // ← Cada nueva variante modifica el componente base
};
```

### I — Interface Segregation en Props de Componentes

Las interfaces de props son **granulares y específicas**. No se crea una "super-prop" que agrupe todo.

```typescript
// ✅ CORRECTO — Props mínimas y específicas
interface WaterWidgetProps {
  glassesToday: number;
  goalGlasses: number;
  maxGlasses: number;
  onAdd: () => void;
  onRemove: () => void;
}

// ❌ INCORRECTO — Props que mezclan múltiples dominios
interface DashboardWidgetProps {
  waterGlasses: number;
  bmiValue: number;
  petMood: string;
  userProfile: UserProfile; // ← el widget de agua no necesita todo el perfil
  currentPlan: GeneratedPlan; // ← tampoco el plan
}
```

### D — Dependency Inversion en Componentes con Callbacks

Los componentes **no llaman directamente al store**. Reciben funciones como props (inyección de dependencias).

```typescript
// ✅ CORRECTO — El componente no sabe quién maneja el estado
interface WeighInModalProps {
  onConfirm: (weightKg: number, notes?: string) => void;
  onCancel: () => void;
}
// → El padre inyecta addWeeklyWeighIn del store

// ❌ INCORRECTO — Acoplamiento directo al store global
const WeighInModal = () => {
  const { addWeeklyWeighIn } = useAppStore(); // ← el modal depende del store concreto
};
```

---

## 5. Criterios de Calidad Visual + SOLID (Checklist de entrega)

- [ ] **[SRP]** ¿Cada componente tiene una única responsabilidad visual? ¿Los modales son componentes separados?
- [ ] **[OCP]** ¿Las variantes visuales usan un mapa de estilos (`VARIANT_STYLES`) en lugar de `if/else`?
- [ ] **[ISP]** ¿Las interfaces de props son mínimas y específicas al componente?
- [ ] **[DIP]** ¿Los componentes reciben callbacks como props en lugar de llamar directamente al store?
- [ ] Todo texto cumple contraste WCAG AA (mínimo 4.5:1).
- [ ] Los targets táctiles tienen un tamaño mínimo de 48x48 dp/pt para evitar toques erróneos.
- [ ] No existen pantallas vacías (Empty States); siempre hay una ilustración y un llamado a la acción (CTA).
- [ ] La app **nunca usa `Alert.alert`**; siempre usa Toasts, Modales o Banners propios con acceso táctil.
