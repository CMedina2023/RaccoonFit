# Reporte de cumplimiento — GOV-001

- Solicitud y autorización del usuario: “procede” para implantar controles que eviten nueva deuda y hagan cumplir las reglas.
- Tipo de cambio: Deuda técnica / gobernanza de ingeniería.
- Archivos modificados: reglas, validación automática, CI, selectores de estado y limpieza de temporizador de pruebas.
- Skills aplicados: `change-planner`, `mobile-dev`, `mobile-qa`.

## Verificación SOLID

- SRP: La verificación de gobernanza vive en `scripts/verify-governance.cjs`; la UI ya no consume el store completo.
- OCP: La regla exige una estrategia de extensión declarada para catálogos nuevos.
- LSP: Se registró DEBT-002; no se amplió ni se ocultó con nuevas conversiones inseguras.
- ISP: Se eliminaron los consumos directos de `useAppStore()` en App, Profile y Exercises; los hooks se consumen por dominio.
- DIP: La validación prohíbe nuevos imports de AsyncStorage fuera de su adaptador.

## Validaciones

- `npm run typecheck`: aprobado.
- `npm run architecture:check`: aprobado; 21/21 GIFs remotos heredados.
- Pruebas unitarias/integración: 21 pruebas Jest aprobadas.
- QA funcional o UAT aplicable: no aplica cambio visual; `--detectOpenHandles` aprobado tras corregir el temporizador de toast.

## Deuda y excepciones

- Deuda reducida: se eliminaron tres consumos directos del store y el `any` de `GifCanvasPlayer`.
- Deuda afectada: DEBT-001 y DEBT-002 permanecen abiertas; no aumentaron.
- Excepciones aprobadas por el usuario: presupuesto temporal de 21 GIFs remotos heredados, registrado para migración futura.
- Veredicto: APROBADO
