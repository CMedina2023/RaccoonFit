---
name: practical-nutrition
description: >-
  Especialista en dietas, nutrición práctica y planes alimenticios alcanzables para pérdida de peso.
  Utilizar cuando se diseñen menús, recetas, porciones y guías nutricionales divididas en:
  Desayuno, Comida/Almuerzo, Cena y Snacks, garantizando ingredientes económicos, accesibles para cualquier persona y cero recetas gourmet costosas.
---

# Skill: Especialista en Dietas y Alimentación Práctica

Este skill define la estrategia nutricional de la aplicación. Su objetivo fundamental es erradicar las dietas restrictivas extremas y las recetas de alta cocina costosas, ofreciendo opciones realistas, nutritivas y accesibles para cualquier presupuesto y estilo de vida familiar.

---

## 1. Filosofía Nutricional "Alcanzable y Sostenible"
- **Sin ingredientes exóticos:** Cero requerimientos de superalimentos costosos (nada de bayas de goji raras, aceites carísimos o cortes de carne inaccesibles).
- **Alimentos del mercado local / supermercado común:** Huevos, pollo, atún en lata, avena, arroz, frijoles/legumbres, verduras de temporada, manzanas, plátanos, papas, tortillas de maíz o pan integral común.
- **Estructura del Plato Saludable (Método 50-25-25):**
  - **50% del plato:** Vegetales / Verduras (fibra, volumen, saciedad).
  - **25% del plato:** Proteína magra (pollo, huevo, atún, tofu, legumbres).
  - **25% del plato:** Carbohidratos complejos o almidones (arroz, papa, avena, tortilla).
  - Grasa saludable en moderación (1 cucharadita de aceite para cocinar, aguacate local, semillas).

---

## 2. Los 4 Momentos del Día: Catálogo Base de Ejemplos

### A. Desayuno (Energía limpia y saciedad matutina)
1. **Opción 1 (Huevos con verduras y tortilla):**
   - 2 huevos revueltos con tomate, cebolla y espinaca.
   - 1 o 2 tortillas de maíz o 1 rebanada de pan integral.
   - Café o té sin azúcar (o con edulcorante no calórico).
2. **Opción 2 (Avena con manzana y canela):**
   - 4-5 cucharadas de hojuelas de avena cocida en agua o leche semidescremada.
   - 1/2 manzana picada y canela en polvo.
   - 1 huevo cocido aparte o un puñado pequeño de cacahuates sin sal para proteína/grasa.
3. **Opción 3 (Tostadas de frijol y queso fresco):**
   - 2 tostadas horneadas con frijoles molidos sin manteca.
   - 40g de queso panela o fresco.
   - Salsa pico de gallo al gusto.

### B. Comida / Almuerzo (Plato fuerte balanceado)
1. **Opción 1 (Pollo a la plancha con arroz y ensalada):**
   - 120-150g de pechuga de pollo marinada con ajo, limón y orégano.
   - 1/2 taza de arroz blanco o integral cocido.
   - Ensalada abundante de lechuga, pepino y zanahoria rallada con limón y sal.
2. **Opción 2 (Atún a la mexicana con papa cocida):**
   - 1 lata de atún en agua escurrida, mezclada con jitomate, cebolla y cilantro.
   - 1 papa mediana cocida al vapor o dorada con gotitas de aceite.
   - Verduras al vapor (calabacitas o brócoli).
3. **Opción 3 (Guisado casero de lentejas o frijoles con huevo o queso):**
   - 1 plato hondo de sopa de lentejas con verduras (zanahoria, apio, tomate).
   - 1 huevo duro o 50g de queso fresco picado adentro.
   - 1 tortilla de maíz.

### C. Cena (Ligera, nutritiva y favorecedora del descanso)
1. **Opción 1 (Quesadillas ligeras con champiñones/verdura):**
   - 2 tortillas de maíz con queso bajo en grasa (tipo Oaxaca ligero o panela).
   - Relleno de flor de calabaza o champiñones cocidos.
2. **Opción 2 (Sopa de verduras con pollo deshebrado):**
   - Caldo claro con calabacita, chayote, zanahoria y 80g de pollo deshebrado.
   - 1/4 de aguacate picado.
3. **Opción 3 (Sándwich casero tradicional):**
   - 2 rebanadas de pan de molde común.
   - 2 rebanadas de jamón de pavo o pechuga de pollo, lechuga, tomate y mostaza.

### D. Snacks Saludables (Control de ansiedad entre comidas)
1. **Snack 1 (Fruta fresca con limón y chile piquín):**
   - 1 taza de jícama, pepino o sandía picada.
2. **Snack 2 (Manzana con crema de cacahuate o cacahuates):**
   - 1 manzana verde o roja pequeña + 10-12 cacahuates tostados.
3. **Snack 3 (Gelatina light con yogur natural):**
   - 1 porción de gelatina sin azúcar + 2 cucharadas de yogur natural sin azúcar añadida.
4. **Snack 4 (Huevo cocido con sal y pimienta):**
   - Rápido, transportable y altamente saciante.

---

## 3. Modelo de Datos Nutricional en la App
Cada receta debe contener en la base de datos:
- `title`: Nombre claro y apetitoso.
- `mealType`: `'breakfast' | 'lunch' | 'dinner' | 'snack'`.
- `prepTimeMinutes`: Tiempo estimado (máximo 20 min en la mayoría).
- `costLevel`: `'muy_economico' | 'economico'`.
- `ingredients`: Array de `{ name, quantity, unit }` con lenguaje cotidiano (cucharadas, tazas, piezas).
- `instructions`: Lista de pasos cortos numerados.
- `approxCalories`: Estimado calórico orientativo (no obsesivo).
- `approxProteinGrams`: Gramos aproximados de proteína.
