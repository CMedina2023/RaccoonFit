import { readFileSync } from 'fs';
import { join } from 'path';

describe('Rendimiento al montar la pantalla de ejercicios', () => {
  const screenSource = readFileSync(
    join(process.cwd(), 'src', 'screens', 'ExercisesScreen.tsx'),
    'utf8'
  );
  const detailModalSource = readFileSync(
    join(process.cwd(), 'src', 'components', 'ExerciseDetailModal.tsx'),
    'utf8'
  );

  it('calcula la sesión con historial anterior al día visible', () => {
    expect(screenSource).toContain('getWorkoutPresentationHistoryBeforeDate');
    expect(screenSource).toContain('priorPresentationHistory');
  });

  it('registra la presentación con una firma estable y no con el objeto sesión', () => {
    expect(screenSource).toContain('presentationSignature');
    expect(screenSource).toMatch(
      /\}, \[presentationSignature, recordWorkoutPresentation\]\);/
    );
    expect(screenSource).not.toMatch(
      /\}, \[[^\]]*session[^\]]*\]\);/
    );
  });

  it('difiere la persistencia hasta que termina la transición', () => {
    expect(screenSource).toContain('InteractionManager.runAfterInteractions');
    expect(screenSource).toContain('deferredRecord.cancel()');
  });

  it('no inicializa el reproductor ni los GIF hasta abrir el detalle', () => {
    expect(screenSource).toContain("React.lazy(() =>");
    expect(screenSource).not.toContain("from '../components/ExerciseAnimationPlayer'");
    expect(screenSource).not.toContain("from '../core/exerciseMedia/localExerciseMedia'");
    expect(detailModalSource).toContain("from './ExerciseAnimationPlayer'");
    expect(detailModalSource).toContain("from '../core/exerciseMedia/localExerciseMedia'");
  });
});
