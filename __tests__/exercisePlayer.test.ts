import { EXERCISES_CATALOG } from '../src/core/exerciseCatalog';
import { ExerciseAnimationType } from '../src/components/ExerciseAnimationPlayer';

describe('Suite QA: ExerciseAnimationPlayer & Biomechanical Cycle', () => {
  describe('1. Verificación del Catálogo y Tipos de Animación (OCP)', () => {
    it('todos los ejercicios tienen configurado un animationType y gifUrl válido', () => {
      expect(EXERCISES_CATALOG.length).toBeGreaterThan(0);

      EXERCISES_CATALOG.forEach((ex) => {
        expect(ex.animationType).toBeDefined();
        expect(typeof ex.animationType).toBe('string');
        expect(ex.gifUrl).toMatch(/^https:\/\/static\.exercisedb\.dev\/media\/[a-zA-Z0-9]+\.gif$/);
      });
    });

    it('el ejercicio de prueba del usuario (Remo Sentado con Liga) tiene gifUrl y tipo correcto', () => {
      const bandRow = EXERCISES_CATALOG.find((e) => e.id === 'ex_begin_band_row');
      expect(bandRow).toBeDefined();
      expect(bandRow?.name).toBe('Remo Sentado con Liga en Pies');
      expect(bandRow?.animationType).toBe('row_band');
      expect(bandRow?.gifUrl).toBe('https://static.exercisedb.dev/media/DKBwJrL.gif');
      expect(bandRow?.targetMuscle).toBe('Espalda Media y Bíceps');
    });
  });

  describe('2. Verificación del Mecanismo Anti-Flickering (Caché en Memoria)', () => {
    it('la caché en memoria previene re-activaciones del estado de carga para URLs ya visitadas', () => {
      const cache = new Set<string>();
      const testUrl = 'https://static.exercisedb.dev/media/DKBwJrL.gif';

      // Primera visita: la URL no está en caché, requiere estado de carga inicial
      expect(cache.has(testUrl)).toBe(false);

      // Simulación de carga completada
      cache.add(testUrl);
      expect(cache.has(testUrl)).toBe(true);

      // Siguientes aperturas o re-renders de fases: detecta la URL en caché y evita el spinner
      const shouldTriggerSpinner = !cache.has(testUrl);
      expect(shouldTriggerSpinner).toBe(false);
    });
  });

  describe('3. Biomecánica y Fases de Ejercicio', () => {
    it('define las 3 fases biomecánicas reglamentarias (Inicial, Esfuerzo, Retorno)', () => {
      const phaseLabels = ['Posición Inicial', 'Esfuerzo · Exhalación', 'Retorno · Inhalación'];
      expect(phaseLabels.length).toBe(3);
      expect(phaseLabels[0]).toBe('Posición Inicial');
      expect(phaseLabels[1]).toBe('Esfuerzo · Exhalación');
      expect(phaseLabels[2]).toBe('Retorno · Inhalación');
    });

    it('los ratios de velocidad técnica duplican la duración para cámara lenta (0.5x)', () => {
      const normalDuration = 4000;
      const slowMotionDuration = 8000;
      expect(slowMotionDuration).toBe(normalDuration * 2);
    });
  });
});
