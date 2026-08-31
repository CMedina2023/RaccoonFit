---
name: doc-mermaid
description: >-
  Especialista en documentación técnica, funcional y generación de diagramas visuales con Mermaid.
  Utilizar cuando se requiera documentar arquitecturas, crear flujos de usuario, diagramas de estado,
  diagramas entidad-relación (ER), diagramas de secuencia y especificaciones claras en Markdown.
---

# Skill: Especialista en Documentación y Flujos Mermaid

Este skill es responsable de estandarizar, estructurar y mantener viva toda la documentación del proyecto, transformando requerimientos de negocio y arquitecturas de software en diagramas visuales claros y especificaciones técnicas precisas.

---

## 1. Tipos de Diagramas Mermaid Obligatorios en el Proyecto

### A. Diagramas de Flujo de Usuario (`flowchart TD / LR`)
Modelan el camino que sigue el usuario a través de las pantallas y funcionalidades de la app.
- Ejemplo para Registro de Peso e IMC:
```mermaid
flowchart TD
    A([Inicio: Pantalla Home]) --> B{¿Registrar peso hoy?}
    B -- Sí --> C[Abrir Modal / Formulario de Peso]
    B -- No --> D[Explorar Ejercicios o Comidas]
    C --> E[Ingresar Peso en kg/lb]
    E --> F[Calcular IMC según Estatura y Sexo]
    F --> G[(Guardar en Storage Local)]
    G --> H[Actualizar Gráfica de Progreso]
    H --> I([Mostrar Feedback Motivacional])
```

### B. Diagramas de Secuencia (`sequenceDiagram`)
Para documentar interacción entre componentes, hooks, servicios y persistencia:
```mermaid
sequenceDiagram
    autonumber
    actor Usuario
    participant UI as Pantalla Ejercicio
    participant Controller as WorkoutEngine
    participant Storage as LocalDatabase
    participant Haptics as Sistema Háptico

    Usuario->>UI: Presiona "Iniciar Rutina (Ligas)"
    UI->>Controller: startRoutine(routineId)
    Controller->>Haptics: triggerVibration('medium')
    loop Cada Ejercicio
        Controller->>UI: renderExerciseAnimation(exerciseId)
        Usuario->>UI: Presiona "Siguiente Serie"
        Controller->>Storage: logCompletedSet(setId, reps)
    end
    Controller->>UI: showRoutineSummary()
```

### C. Diagramas de Entidad-Relación (`erDiagram`)
Para modelar la base de datos local:
```mermaid
erDiagram
    USER ||--o{ WEIGHT_LOG : records
    USER ||--o{ WORKOUT_SESSION : completes
    WORKOUT_SESSION ||--|{ EXERCISE_LOG : contains
    EXERCISE_CATEGORY ||--|{ EXERCISE : groups
    MEAL_CATEGORY ||--|{ MEAL_RECIPE : classifies

    USER {
        string id PK
        string gender "male | female"
        float height_cm
        float target_weight_kg
        date birthdate
    }

    WEIGHT_LOG {
        string id PK
        string user_id FK
        float weight_kg
        float calculated_bmi
        date timestamp
    }
```

---

## 2. Reglas de Estilo para Diagramas Mermaid
1. **Evitar caracteres especiales en etiquetas:** Si se usan paréntesis o comillas, envolver el texto entre comillas dobles: `node["Texto (Detalle)"]`.
2. **Nombres de nodos semánticos:** Usar identificadores legibles (`HomeScreen`, `CalcService`) en vez de identificadores genéricos (`A`, `B`, `C`) en diagramas medianos o grandes.
3. **Flujo direccional coherente:** Usar preferentemente `TD` (Top-Down) para procesos paso a paso y `LR` (Left-Right) para pipelines o arquitecturas de capas.
4. **Legibilidad móvil:** Diagramas concisos y segmentados por módulo; no crear un único diagrama monolítico ilegible.

---

## 3. Estructura de Documentos Técnicos
Toda documentación técnica en el repositorio debe seguir la plantilla:
1. **Propósito y Alcance:** Qué resuelve este documento.
2. **Diagrama Mermaid Conceptual:** Vista visual inmediata.
3. **Detalles de Implementación:** Tablas de parámetros, tipos TypeScript o esquemas.
4. **Casos de Borde y Manejo de Errores.**
5. **Referencias Cruzadas:** Enlaces a otros archivos o skills relacionados.
