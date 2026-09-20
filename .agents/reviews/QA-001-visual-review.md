# Revisión visual/UAT — QA-001

## Alcance

- Onboarding sin la etapa “Concentración”.
- Módulo Ejercicios: semanario, grupos musculares, días de descanso y tarjetas de rutina.

## Evidencia disponible

- `npm run quality`: aprobado previamente para este estado (14 suites, 55 pruebas).
- Servidor Expo web: arrancó en modo `--offline` y respondió `HTTP 200` en `http://localhost:8081`.
- Búsqueda estática: no hay referencias activas a `focus_areas`, `focusZones`, `Concentración` ni los controles de zonas en las pantallas. El campo opcional de tipo se mantiene solo como compatibilidad de lectura para perfiles históricos.

## Resultado de UAT visual

- Estado: BLOQUEADO POR ENTORNO.
- Motivo: no hay navegador, emulador ni aplicación de escritorio expuesta al control visual en la sesión, por lo que no se pueden capturar ni inspeccionar pantallas reales.
- No se declara aprobación visual hasta verificar manualmente en Expo web, Android o iOS.

## Checklist para la siguiente ejecución visual

1. Completar onboarding y confirmar que después de preferencias de dieta continúa a peso objetivo, sin pantalla de Concentración.
2. Abrir Ejercicios y comprobar los siete días, los descansos y los grupos configurables.
3. Cambiar un día de rutina, cerrar/reabrir la app y verificar que se conserva.
