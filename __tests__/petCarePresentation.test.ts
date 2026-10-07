import { createInitialPetCare } from '../src/core/petCareEngine';
import {
  PET_CARE_ACTION_PRESENTATION,
  PET_CARE_NEED_PRESENTATION,
  selectPetMoodAnimation,
} from '../src/components/virtual-pet/petCarePresentation';

describe('presentación del cuidado de Rocky', () => {
  it('asigna una acción, texto y animación a cada acción del motor', () => {
    expect(Object.keys(PET_CARE_ACTION_PRESENTATION).sort()).toEqual(['clean', 'feed', 'play', 'sleep']);
    expect(PET_CARE_ACTION_PRESENTATION.feed.animation).toBe('eat');
    expect(PET_CARE_ACTION_PRESENTATION.play.animation).toBe('play');
    expect(PET_CARE_ACTION_PRESENTATION.sleep.animation).toBe('sleep');
    expect(PET_CARE_ACTION_PRESENTATION.clean.animation).toBe('clean');
    Object.values(PET_CARE_ACTION_PRESENTATION).forEach((presentation) => {
      expect(presentation.label.length).toBeGreaterThan(0);
      expect(presentation.feedback.length).toBeGreaterThan(0);
    });
  });

  it('conecta cada burbuja con una acción directa y una presentación accesible', () => {
    expect(Object.keys(PET_CARE_NEED_PRESENTATION).sort()).toEqual([
      'cleanliness',
      'energy',
      'happiness',
      'hunger',
    ]);
    expect(PET_CARE_NEED_PRESENTATION.hunger.action).toBe('feed');
    expect(PET_CARE_NEED_PRESENTATION.happiness.action).toBe('play');
    expect(PET_CARE_NEED_PRESENTATION.energy.action).toBe('sleep');
    expect(PET_CARE_NEED_PRESENTATION.cleanliness.action).toBe('clean');
    Object.values(PET_CARE_NEED_PRESENTATION).forEach((presentation) => {
      expect(presentation.label.length).toBeGreaterThan(0);
      expect(presentation.icon.length).toBeGreaterThan(0);
      expect(presentation.actionLabel.length).toBeGreaterThan(0);
      expect(presentation.color).toMatch(/^#[0-9A-F]{6}$/i);
      expect(presentation.pressedColor).toMatch(/^#[0-9A-F]{6}$/i);
    });
  });

  it('mantiene a Rocky contento en su nivel inicial', () => {
    expect(selectPetMoodAnimation(createInitialPetCare(0))).toBe('idle');
  });

  it('muestra el estado triste cuando ánimo es la necesidad más baja', () => {
    const state = {
      ...createInitialPetCare(0),
      happiness: 10,
    };
    expect(selectPetMoodAnimation(state)).toBe('sad');
  });

  it('muestra cansancio cuando otra necesidad requiere cuidado', () => {
    const state = {
      ...createInitialPetCare(0),
      energy: 10,
    };
    expect(selectPetMoodAnimation(state)).toBe('tired');
  });
});
