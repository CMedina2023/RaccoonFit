# Catálogo de sprites pixel art de Rocky

## Contrato visual

- Formato de producción: PNG ARGB con fondo transparente.
- Tamaño por cuadro: `256 × 256 px`.
- Anclaje: inferior central.
- Dirección base: tres cuartos hacia la derecha; el player puede voltear horizontalmente para desplazarse a la izquierda.
- Fotograma común: `assets/rocky/pixel/rocky-pixel-seed-256.png`.
- Cantidad: 10 secuencias, 4 cuadros por secuencia, 40 cuadros totales.

## Registro previsto

| Animación | Ciclo | Duración sugerida por cuadro | Uso |
|---|---:|---:|---|
| `idle` | Sí | 220 ms | Reposo habitual |
| `walk` | Sí | 140 ms | Recorrido horizontal |
| `eat` | No | 180 ms | Acción de alimentar |
| `drink` | No | 180 ms | Hidratación directa o registrada |
| `play` | No | 160 ms | Acción de jugar |
| `sleep` | No | 320 ms | Acción breve de recuperación de energía |
| `clean` | No | 180 ms | Acción de limpieza |
| `celebrate` | No | 150 ms | Meta, nivel o hábito completado |
| `tired` | Sí | 280 ms | Energía baja |
| `sad` | Sí | 300 ms | Felicidad baja con expresión empática |

## Organización

```text
assets/rocky/pixel/
├── rocky-pixel-seed-v1.png
├── rocky-pixel-seed-256.png
├── sprites/
│   ├── idle/01.png ... 04.png
│   ├── walk/01.png ... 04.png
│   ├── eat/01.png ... 04.png
│   ├── drink/01.png ... 04.png
│   ├── play/01.png ... 04.png
│   ├── sleep/01.png ... 04.png
│   ├── clean/01.png ... 04.png
│   ├── celebrate/01.png ... 04.png
│   ├── tired/01.png ... 04.png
│   └── sad/01.png ... 04.png
└── previews/
    └── <animación>-preview.png
```

## Decisiones de producción

- Cada tira se generó completa desde el mismo Rocky aprobado para reducir deriva entre cuadros.
- Todos los cuadros se normalizaron con una escala compartida por secuencia y el mismo anclaje.
- El cuadro `01` se fijó al fotograma semilla normalizado para que las acciones comiencen desde una pose estable.
- `clean/03` repite `clean/02` y `sad/02` repite `sad/03`: las variantes originales tenían fragmentos aislados en el borde y fueron descartadas para conservar un recurso limpio.
- Las hojas de `previews/` son recursos de QA y no se cargarán en tiempo de ejecución.

## Estado de integración

El registro local integra las diez secuencias al reproductor pixel art. `TAM-001-R4` conectó acciones y estados de ánimo; `TAM-001-R6` retiró los antiguos assets de producción. Las hojas de preview pixel art se conservan para revisión y no se cargan en tiempo de ejecución.
