# Reporte de cumplimiento — PRESENTATION-001

- Solicitud y autorización del usuario: continuar con el punto 5 de la deuda técnica (separar cálculos de dominio de la UI).
- Tipo de cambio: refactorización de arquitectura / deuda técnica.
- Archivos modificados: `App.tsx`, `src/screens/AuthScreen.tsx`, `src/hooks/useBmiAnalysis.ts`, `src/hooks/useCalorieAnalysis.ts`, `scripts/verify-governance.cjs`.
- Skills aplicados: `mobile-dev`, `mobile-qa`.

## Criterios de aceptación

- Las pantallas no importan calculadoras de IMC ni de calorías desde `src/core`.
- Los cálculos se exponen mediante hooks de presentación reutilizables.
- Los hooks se invocan incondicionalmente y la interfaz conserva los mismos datos mostrados.
- La verificación de arquitectura evita reincidencias.

## Verificación SOLID

- SRP: `useBmiAnalysis` y `useCalorieAnalysis` adaptan datos de entrada para la UI; las fórmulas permanecen en sus servicios de dominio.
- OCP: futuras vistas pueden reutilizar los hooks sin modificar las calculadoras.
- LSP: no se alteraron los contratos ni resultados de `calculateBmi` o `calculateCalorieNeeds`.
- ISP: las vistas consumen solo el análisis que requieren, sin depender de módulos de cálculo completos.
- DIP: las pantallas dependen de la abstracción de presentación (hooks), no de implementaciones de dominio.

## Validaciones

- `npm run typecheck`: aprobado.
- `npm run architecture:check`: aprobado; impide imports directos de `bmiCalculator` o `calorieCalculator` desde `App.tsx` y las pantallas.
- Pruebas Jest: 24 aprobadas en 5 suites.
- QA funcional aplicable: refactorización sin cambios visuales; la suite existente mantiene cubiertos los cálculos de dominio y el control estático cubre el límite UI/dominio.

## Deuda y excepciones

- Deuda reducida: DEBT-005, cálculos de IMC y calorías embebidos en la capa de presentación.
- Excepciones aprobadas por el usuario: ninguna.
- Veredicto: APROBADO.
