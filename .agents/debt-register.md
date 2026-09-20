# Registro de deuda técnica

La regla es no aumentar esta deuda. Cada modificación que toque un elemento registrado debe reducirla o actualizar su estado con evidencia.

| ID | Estado | Hallazgo | Control actual | Resolución prevista |
|---|---|---|---|---|
| DEBT-001 | Resuelta | El catálogo contenía URLs remotas de GIF que lo acoplaban a un CDN. | El catálogo usa únicamente `exerciseDbId`; `ExerciseMediaProvider` construye la URL opcional y la imagen usa el caché persistente nativo. Ante una falla, el reproductor solo permite un fallback local marcado como exacto; de otro modo muestra un estado seguro, sin fingir otra técnica. | Completada: no reintroducir URLs remotas en el catálogo. |
| DEBT-002 | Resuelta | El plan requería campos que no estaban declarados por su contrato. | `PlannedExerciseItem` declara el contrato completo y la pantalla no usa cast inseguro. | Completada. |
## Actualizaciones de estado

| ID | Estado | Evidencia |
|---|---|---|
| DEBT-005 | Resuelta | `useBmiAnalysis` y `useCalorieAnalysis` separan las fórmulas de la UI; el control de arquitectura prohíbe imports directos de los calculadores en pantallas. |
| DEBT-006 | Resuelta | `BoundedMediaLoadCache` limita el estado de GIFs cargados y el reproductor reinicia el fallback al cambiar de ejercicio; los frames SVG conservan el flujo offline. |
| DEBT-007 | Resuelta | Las herramientas de Jest, tipos y TypeScript se declaran solo en `devDependencies`; TypeScript quedó alineado a `~5.9.2` para Expo SDK 54 y la regla automática evita duplicaciones. |
| DEBT-008 | Resuelta | La sesión semanal elegía ejercicios por músculos secundarios; el contrato `workoutGroupPolicy` ahora exige músculo principal y las pruebas excluyen explícitamente remos del día de bíceps/tríceps. |
| DEBT-009 | Abierta | La auditoría de cobertura conserva grupos bajo la cuota de siete y la cuota de rotación mensual. CATALOG-011 corrigió déficits críticos sin usar músculos secundarios: bíceps/tríceps avanzado llega a 7, abdomen/oblicuos intermedio a 7 y core/cardio intermedio a 9. Permanecen pendientes los grupos y niveles que siguen bajo cuota. |
