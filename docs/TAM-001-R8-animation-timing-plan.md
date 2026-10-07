# TAM-001-R8 — Ritmo de las animaciones de cuidado de Rocky

## Estado

- **R8.1:** Completada — contrato de reproducción finita.
- **R8.2:** Completada — calibración declarativa y validaciones automatizadas aprobadas.
- **R8.2.1:** Completada — dormir usa una sola transición, pausa el cuadro con `Z` y superó las validaciones automatizadas.
- **R8.3:** Pendiente — QA perceptual y UAT móvil.

## Objetivo de usuario

Hacer que alimentar, jugar, dormir, beber, limpiar y celebrar se perciban como respuestas completas de Rocky, sin volver lentos los fotogramas ni bloquear la interfaz.

## Clasificación y dictamen

- **Tipo:** Mejora UI/UX de riesgo bajo.
- **Skills:** `change-planner`, `mobile-ui-ux`, `virtual-pet`, `fitness-committee`, `mobile-dev` y `mobile-qa`.
- **Veredicto del comité:** APROBADO CON OBSERVACIONES.
- **Observaciones obligatorias:** conservar movimiento reducido, funcionamiento offline, respuesta inmediata al toque y una única notificación de finalización por acción.

## Duraciones objetivo

| Acción | Configuración prevista | Duración nominal |
|---|---:|---:|
| Comer | 3 ciclos × 4 cuadros × 180 ms | 2.16 s |
| Beber | 2 ciclos × 4 cuadros × 180 ms | 1.44 s |
| Jugar | 5 ciclos × 4 cuadros × 160 ms | 3.20 s |
| Dormir | 1 ciclo; 320 ms en cuadros 1–3 y 4.16 s en el cuadro con `Z` | 5.12 s |
| Limpiar | 3 ciclos × 4 cuadros × 180 ms | 2.16 s |
| Celebrar | 4 ciclos × 4 cuadros × 150 ms | 2.40 s |

Las animaciones ambientales `idle`, `walk`, `tired` y `sad` continúan en ciclo indefinido. Las duraciones son nominales y pueden variar ligeramente por la planificación de temporizadores del sistema operativo.

## Fases

### R8.1 — Contrato de reproducción finita

- Ampliar el registro de animaciones con un número explícito de ciclos para secuencias no infinitas.
- Hacer que el reproductor termine y notifique una sola vez después del último ciclo configurado.
- Mantener un ciclo para todas las acciones durante esta fase, evitando cambios visuales antes de la calibración.
- Cubrir con pruebas puras uno, varios e infinitos ciclos.

### R8.2 — Calibración por acción

- Aplicar los ciclos de la tabla de duraciones objetivo desde el registro declarativo.
- No ralentizar `frameDurationMs`; la expresividad se obtiene repitiendo la secuencia completa.
- Confirmar que una nueva solicitud reinicia la animación desde el primer cuadro.

### R8.3 — QA y UAT móvil

- Validar pulsaciones consecutivas, cambio de acción durante una reproducción y finalización única.
- Confirmar que la interfaz permanece utilizable mientras Rocky se anima.
- En movimiento reducido, mostrar el estado estático y completar la acción sin espera artificial.
- Realizar UAT visual en al menos un dispositivo o emulador Android/iOS.

### R8.2.1 — Pausa semántica de dormir

- Reproducir una sola vez la transición despierto → somnoliento → dormido → dormido con `Z`.
- Mantener el último cuadro durante 4.16 segundos y conservar 5.12 segundos totales.
- No volver a los cuadros despiertos durante la misma acción.
- Declarar la pausa final en el registro para que el player permanezca abierto a otras animaciones con ritmo por fases.

## Criterios de aceptación

- **Dada** una acción con varios ciclos, **cuando** termina un ciclo intermedio, **entonces** vuelve al primer cuadro sin cerrar la acción.
- **Dado** el último ciclo configurado, **cuando** llega al final, **entonces** conserva el último cuadro y notifica la finalización exactamente una vez.
- **Dada** una animación ambiental, **cuando** completa un ciclo, **entonces** continúa indefinidamente.
- **Dado** movimiento reducido, **cuando** se solicita una acción, **entonces** no se ejecuta una secuencia prolongada ni se bloquea la interfaz.
- **Dada** cualquier acción de cuidado, **cuando** se reproduce, **entonces** no requiere red ni modifica la lógica de medidores, XP o persistencia.

## Impacto técnico y riesgos SOLID

- `rockyAnimationRegistry.ts` conserva la política de duración y ciclos mediante un registro declarativo (**OCP**).
- `spritePlayback.ts` mantiene el cálculo puro de avance (**SRP/DIP**).
- `useSpritePlayback.ts` coordina temporizadores, reinicio y finalización sin lógica de mascota (**SRP**).
- `RockySpritePlayer.tsx` consume solamente el contrato visual necesario (**ISP**).
- No se modifica el store, la persistencia ni el motor de cuidados.

