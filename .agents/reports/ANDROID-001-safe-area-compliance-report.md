# Reporte de cumplimiento — ANDROID-001

- Solicitud y autorización del usuario: El usuario autorizó corregir el primer hallazgo de la UAT Android: contenido y acciones invadiendo las barras del sistema.
- Tipo de cambio: Bugfix UI/UX global — áreas seguras Android/iOS.
- Archivos previstos: `package.json`, `package-lock.json`, `index.ts`, `App.tsx`, `src/screens/AuthScreen.tsx`, `__tests__/safeAreaLayout.test.ts`, `docs/android-safe-area.md`, `.agents/reports/ANDROID-001-safe-area-compliance-report.md`.
- Skills aplicados: `mobile-qa`, `mobile-dev`, `mobile-ui-ux`, `doc-mermaid`.

## Incidencia QA

- Título: `[Android] Encabezados y acciones quedan bajo las barras del sistema`.
- Severidad: Mayor; puede provocar pulsaciones accidentales y ocultar contenido.
- Reproducción: Abrir onboarding o dashboard en Android edge-to-edge con navegación de tres botones.
- Resultado obtenido: textos bajo la barra de estado y CTA/navegación sobre los botones del sistema.
- Resultado esperado: todo elemento visual e interactivo permanece dentro de los insets del dispositivo.
- Causa raíz: uso del `SafeAreaView` legado de React Native, limitado y deprecado para este escenario.

## Verificación SOLID

- SRP: El provider raíz obtiene los insets; las pantallas solo delimitan su superficie segura.
- OCP: Nuevas pantallas pueden consumir el mismo contexto sin agregar cálculos por plataforma.
- LSP: El reemplazo conserva el contrato visual de un contenedor `View` y añade protección multiplataforma.
- ISP: Las pantallas no reciben props nuevas ni dependen de dimensiones completas del dispositivo.
- DIP: La UI depende de la abstracción de insets de `react-native-safe-area-context`, no de cifras o APIs Android específicas.

## Validaciones

- `npm run typecheck`: APROBADO mediante `npm run quality`.
- `npm run architecture:check`: APROBADO; reglas verificadas y catálogo sin URLs remotas.
- Pruebas unitarias/integración: APROBADAS; 26 suites y 127 pruebas. El contrato impide el regreso al `SafeAreaView` legado en las raíces y exige provider único más protección de cuatro aristas.
- QA funcional o UAT aplicable: Metro reiniciado en `exp://192.168.1.25:8082`; queda pendiente la confirmación visual/táctil del usuario en Android físico.

## Deuda y excepciones

- Deuda reducida o afectada: Se elimina el uso raíz de una API deprecada; `DEBT-009` no se modifica.
- Excepciones aprobadas por el usuario: Ninguna.
- Veredicto: APROBADO en validación automatizada; pendiente confirmación UAT física Android.
