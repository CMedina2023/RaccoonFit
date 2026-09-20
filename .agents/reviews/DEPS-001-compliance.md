# Reporte de cumplimiento — DEPS-001

- Solicitud y autorización del usuario: continuar con el punto 7 de la deuda técnica (versiones duplicadas de dependencias).
- Tipo de cambio: mantenimiento de configuración / deuda técnica.
- Archivos modificados: `package.json`, `package-lock.json`, `scripts/verify-governance.cjs`.
- Skills aplicados: `mobile-dev`, `mobile-qa`.

## Criterios de aceptación

- Las herramientas de compilación, tipos y pruebas se declaran únicamente en `devDependencies`.
- El lockfile y la instalación local resuelven una única versión de TypeScript compatible con Expo SDK 54.
- Un control automático previene que estas herramientas regresen a `dependencies`.

## Verificación SOLID

- SRP: las dependencias de ejecución y las de desarrollo tienen responsabilidades separadas en el manifiesto.
- OCP: la regla de gobernanza valida el contrato de clasificación sin depender de una lista de versiones duplicadas previa.
- LSP: no se alteran contratos de módulos de aplicación ni de runtime.
- ISP: la aplicación de producción no declara herramientas de prueba o compilación como dependencias de ejecución.
- DIP: la configuración de pruebas permanece desacoplada de las dependencias que necesita el runtime móvil.

## Validaciones

- Resolución: `package-lock.json` y el binario local usan TypeScript 5.9.3; no hay paquetes compartidos entre `dependencies` y `devDependencies`.
- `npm run typecheck`: aprobado con TypeScript 5.9.3.
- `npm run architecture:check`: aprobado; bloquea `@types/jest`, `@types/react`, `jest` y `typescript` fuera de `devDependencies` y exige TypeScript `~5.9.2` para Expo SDK 54.
- Pruebas Jest: 26 aprobadas en 5 suites.
- QA de configuración: aprobada; `npm ls --depth=0` no reporta dependencias inválidas.

## Deuda y excepciones

- Deuda reducida: DEBT-007, herramientas declaradas dos veces con rangos incompatibles (`jest`, tipos de Jest y React, TypeScript).
- Excepciones aprobadas por el usuario: ninguna. La actualización de `@types/react` a 19.1.x no se aplicó porque el registro falló la verificación TLS; se conserva la versión 19.2.x existente, compatible con el peer `^19.1.0` de React Native y sin duplicación.
- Veredicto: APROBADO.
