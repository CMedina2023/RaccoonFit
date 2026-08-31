---
name: change-planner
description: >-
  Especialista en planificación de producto, gestión de cambios, mejoras evolutivas y resolución de bugs.
  Utilizar cuando se proponga una nueva característica, se requiera analizar el impacto de un cambio,
  priorizar el backlog del proyecto, descomponer tareas en hitos claros y asegurar la coherencia del roadmap.
---

# Skill: Especialista en Definición de Cambios, Mejoras y Planificación

Este skill actúa como el director de proyecto y orquestador táctico. Su misión es garantizar que ninguna funcionalidad, arreglo o mejora se desarrolle a ciegas, asegurando que cada tarea tenga objetivos medibles, dependencias identificadas y un plan de ejecución por fases.

---

## 1. Clasificación de Solicitudes y Análisis de Impacto

Toda solicitud recibida debe ser categorizada antes de planificar:

| Tipo | Definición | Nivel de Riesgo | Flujo Requerido |
|---|---|---|---|
| **Feature (Nueva Función)** | Capacidad nueva (ej. temporizador de descanso en ejercicios). | Medio/Alto | Comité -> Planificación -> UI/UX -> Dominio (Fitness/Nutrición) -> Dev -> QA -> Docs |
| **Bugfix (Corrección)** | Comportamiento inesperado o fallo de cálculo/UI. | Variable | QA (Reproducción) -> Dev (Fix) -> QA (Regresión) -> Docs |
| **Enhancement (Mejora UI/UX)** | Refinamiento de pantalla, animación o texto existente. | Bajo/Medio | UI/UX -> Dev -> QA |
| **Content Update (Contenido)** | Agregar recetas de snacks o ejercicios con ligas. | Bajo | Fitness/Nutrición -> UI/UX (Asset) -> Dev/Data -> QA |

---

## 2. Metodología de Planificación (Template de Historia / Tarea)

Cada tarea aprobada por este skill debe estructurarse con el siguiente formato:

```markdown
### [ID-Tarea]: Nombre Descriptivo de la Tarea

- **Objetivo de Negocio / Usuario:** Qué problema resuelve y para quién.
- **Skills involucrados:** Lista de skills requeridos para su entrega.
- **Criterios de Aceptación (Given-When-Then):**
  - *Dado que* el usuario está en la vista de comidas...
  - *Cuando* selecciona la pestaña "Snacks"...
  - *Entonces* debe ver al menos 5 opciones con ingredientes accesibles y su tiempo de preparación.
- **Impacto Técnico y Dependencias:** Qué archivos, tablas o componentes se alteran.
- **Plan de Rollout / Fases:**
  1. Fase 1: Datos y tipos base.
  2. Fase 2: Componentes UI.
  3. Fase 3: Integración y pruebas.
```

---

## 3. Matriz de Priorización (MoSCoW)
- **Must Have (Esencial para MVP):**
  - Registro diario de peso con fecha.
  - Cálculo automático de IMC para hombre y mujer.
  - Catálogo inicial de ejercicios en casa (mancuernas, ligas, bandas, cardio).
  - Recetas prácticas para Desayuno, Comida, Cena y Snacks.
  - Persistencia 100% offline.
- **Should Have (Importante siguiente versión):**
  - Recordatorios locales de pesaje diario o entrenamiento.
  - Gráfica interactiva de tendencias con filtros (7 días, 30 días, 1 año).
  - Animaciones de ejercicios en formato Lottie interactivo.
- **Could Have (Deseable a futuro):**
  - Exportación de reporte de progreso en PDF para compartir con médico/nutriólogo.
  - Modo desafío semanal de hábitos.
- **Won't Have (Fuera de alcance estricto):**
  - Rutinas con máquinas de gimnasio comerciales (prensa, poleas fijas, etc.).
  - Planes con suplementos caros o recetas gastronómicas de alta cocina.

---

## 4. Control de Deuda Técnica y Buenas Prácticas
- No aceptar parches temporales sin un issue de seguimiento.
- Exigir que cualquier cambio en la estructura de base de datos incluya script o lógica de migración para no corromper los datos existentes del usuario.
