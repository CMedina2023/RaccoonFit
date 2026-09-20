# Puerta de Cumplimiento de Ingeniería

Esta regla convierte los skills de expertos en controles verificables. Aplica a toda tarea que modifique código, configuración, datos de catálogo, pruebas o documentación técnica.

## 1. Antes de editar

1. Clasificar la solicitud como Feature, Bugfix, Mejora UI/UX, Contenido o Deuda Técnica.
2. Indicar los skills requeridos por el flujo y leer sus instrucciones completas.
3. Documentar el impacto, criterios de aceptación y riesgos SOLID en el reporte de cumplimiento.
4. Obtener autorización explícita del usuario para implementar. Una solicitud de análisis, revisión o diagnóstico no autoriza cambios.

## 2. Durante la implementación

- UI consume estado únicamente mediante hooks de `src/store/selectors.ts`; no se admite `useAppStore()` sin selector fuera del store.
- No se admite `any` en `src/`.
- Solo `AsyncStorageAdapter.ts` puede importar AsyncStorage.
- Un catálogo extensible debe declarar su estrategia de extensión (Registry, provider o tabla de datos) y contar con prueba de contrato cuando corresponda.
- Ningún recurso remoto puede ser necesario para el funcionamiento básico offline. Los catálogos guardan identificadores, nunca URLs remotas; estas se resuelven mediante un `ExerciseMediaProvider` inyectable y con fallback local obligatorio.
- Una excepción solo es válida si está documentada y aprobada expresamente por el usuario antes de integrarla.

## 3. Antes de entregar

La entrega queda bloqueada hasta que se cumpla todo lo siguiente:

1. `npm run quality` finaliza correctamente.
2. Se crea un reporte a partir de `.agents/templates/compliance-report.md` con los skills aplicados, evidencia SOLID y pruebas ejecutadas.
3. `mobile-qa` valida el alcance de pruebas aplicable y registra incidencias o el veredicto.
4. Si hay deuda heredada afectada, la tarea no puede aumentarla y debe actualizar `.agents/debt-register.md`.

## 4. Regla de deuda: presupuesto cero

La deuda inventariada no se normaliza. No se puede introducir una nueva infracción ni aumentar una métrica heredada. Cada tarea que toque una zona con deuda debe reducirla o justificar por qué no puede hacerlo.
