---
name: mobile-qa
description: >-
  Experto en control de calidad (QA), aseguramiento y estrategias de testing para aplicaciones móviles en Android e iOS.
  Utilizar cuando se necesite diseñar casos de prueba, escribir pruebas unitarias, de integración,
  pruebas de extremo a extremo (E2E), protocolos UAT (User Acceptance Testing) y validar compatibilidad multiplataforma.
---

# Skill: Experto en Pruebas y QA para Aplicaciones Mobile (Android & iOS)

Este skill establece los protocolos de calidad, metodologías de testing y criterios de aceptación para garantizar que la aplicación móvil sea robusta, confiable, precisa en sus cálculos y sin errores visuales o funcionales.

---

## 1. Pirámide de Pruebas Móviles

```text
         ▲
        / \     E2E / UAT (Maestro / Detox)
       /   \    Pruebas de aceptación en emuladores y dispositivos reales
      /-----\
     /       \   Integración (React Native Testing Library / Mock Stores)
    /         \  Interacción entre vistas, storage y cálculo de métricas
   /-----------\
  /             \ Pruebas Unitarias (Jest / Vitest)
 /_______________\ Fórmulas matemáticas de IMC, validadores, reducers y utils
```

---

## 2. Niveles de Prueba y Herramientas

### A. Pruebas Unitarias (Fórmulas y Lógica Pura)
- **Herramienta:** `Jest` o `Vitest`.
- **Cobertura Crítica:**
  - Fórmulas de IMC (hombres vs mujeres, casos de borde como estaturas bajas o altas).
  - Cálculo de gasto calórico estimado y macronutrientes.
  - Formateadores de fecha, temporizadores de rutinas y conversión de unidades (kg/lbs, cm/in).
- **Criterio:** 100% de cobertura en funciones de cálculo matemático y de salud.

### B. Pruebas de Integración (Componentes y Estado)
- **Herramienta:** `@testing-library/react-native`.
- **Escenarios Clave:**
  - Flujo de registro de nuevo peso: verificar que actualiza el historial y refresca la gráfica de progreso.
  - Flujo de completar un ejercicio: verificar que guarda la serie y reproduce feedback háptico/sonoro.
  - Persistencia offline: verificar que los datos persisten al reiniciar el estado simulado.

### C. Pruebas End-to-End (E2E)
- **Herramienta:** `Maestro` (recomendado por rapidez y legibilidad YAML) o `Detox`.
- **Casos de prueba esenciales:**
  1. Onboarding completo (ingreso de género, edad, peso inicial, meta).
  2. Navegación por catálogo de ejercicios por categoría (ligas, mancuernas, bandas piernas, cardio).
  3. Consulta del plan de comidas (Desayuno, Comida, Cena, Snacks).
  4. Visualización de estadísticas históricas de peso e IMC.

### D. Pruebas de Aceptación de Usuario (UAT)
- Listas de verificación funcionales para usuarios finales (testers no técnicos):
  - ¿La lectura del IMC es clara y no confunde al usuario?
  - ¿Las animaciones de ejercicio se entienden inmediatamente sin necesidad de leer párrafos largos?
  - ¿Los ingredientes de las recetas son fáciles de encontrar en cualquier supermercado local?

---

## 3. Matriz de Validación de Plataforma (Android vs iOS)

| Factor de Prueba | Validación Android | Validación iOS |
|---|---|---|
| **Fragmentación de Pantalla** | Múltiples densidades (xhdpi, xxhdpi), relación de aspecto 19:9, 20:9. | Tamaños estándar iPhone (SE, base, Pro, Pro Max) y Dynamic Island. |
| **Teclado Virtual** | Comportamiento con teclado Gboard / SwiftKey sobre inputs de peso. | `inputAccessoryView` con botón "Listo" / "Done". |
| **Modo Oscuro / Claro** | Cambio dinámico desde ajustes del sistema Android. | Integración nativa con `Appearance` de iOS. |
| **Ciclo de Vida de la App** | Pausa y reanudación de cronómetro de ejercicio en segundo plano. | Suspensión correcta y restauración de estado sin pérdida de datos. |

---

## 4. Reporte de Incidencias (Estructura Estándar de Bug)
Al detectar un fallo, este skill exige documentarlo con:
1. **Título Conciso:** `[Módulo] Descripción clara del error`.
2. **Severidad:** Crítica (bloquea la app), Mayor (función rota sin workaround), Menor (cosmético).
3. **Pasos para reproducir:** 1, 2, 3...
4. **Resultado Esperado vs Resultado Obtenido.**
5. **Entorno:** OS (Android 14 / iOS 17), dispositivo o simulador.
