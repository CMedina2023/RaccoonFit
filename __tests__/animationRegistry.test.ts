import { readFileSync } from 'fs';
import { join } from 'path';

describe('Registro de animaciones locales', () => {
  const animationTypes = [
    'curl_biceps', 'squat_goblet', 'bridge_glute', 'row_band', 'lateral_raise',
    'step_jack', 'pushup_incline', 'monster_walk', 'shoulder_press', 'clamshell',
    'row_dumbbell', 'kickback_glute', 'deadlift_rdl', 'mountain_climber', 'shadow_box',
    'band_chest_press', 'dumbbell_shrug', 'band_vup',
  ];

  it('registra cada tipo declarado con un frame local', () => {
    const registryPath = join(process.cwd(), 'src', 'components', 'animations', 'animationRegistry.ts');
    const registrySource = readFileSync(registryPath, 'utf8');

    animationTypes.forEach((type) => {
      expect(registrySource).toContain(type + ':');
    });
  });
});
