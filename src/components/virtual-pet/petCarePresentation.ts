import type { PetCareAction, PetCareNeed, PetCareState } from '../../types';
import { findLowestCareNeed, resolvePetCareStatus } from '../../core/petCareEngine';
import type { RockyAnimationName } from './rockyAnimationRegistry';

export interface PetCareNeedPresentation {
  label: string;
  icon: string;
  color: string;
  pressedColor: string;
  action: PetCareAction;
  actionLabel: string;
}

export interface PetCareActionPresentation {
  label: string;
  icon: string;
  color: string;
  animation: RockyAnimationName;
  feedback: string;
}

export const PET_CARE_NEED_PRESENTATION: Record<PetCareNeed, PetCareNeedPresentation> = {
  hunger: { label: 'Hambre', icon: '●', color: '#F59E0B', pressedColor: '#422D0D', action: 'feed', actionLabel: 'alimentar a Rocky' },
  happiness: { label: 'Ánimo', icon: '♥', color: '#FB7185', pressedColor: '#421C2A', action: 'play', actionLabel: 'jugar con Rocky' },
  energy: { label: 'Energía', icon: '⚡', color: '#FACC15', pressedColor: '#3D330A', action: 'sleep', actionLabel: 'dejar descansar a Rocky' },
  cleanliness: { label: 'Limpieza', icon: '✦', color: '#38BDF8', pressedColor: '#0D3444', action: 'clean', actionLabel: 'limpiar a Rocky' },
};

export const PET_CARE_ACTION_PRESENTATION: Record<PetCareAction, PetCareActionPresentation> = {
  feed: { label: 'Alimentar', icon: '●', color: '#F59E0B', animation: 'eat', feedback: '¡Ñam! Gracias por la comida.' },
  play: { label: 'Jugar', icon: '●', color: '#FB7185', animation: 'play', feedback: '¡Me divertí mucho jugando contigo!' },
  sleep: { label: 'Dormir', icon: 'Zz', color: '#A78BFA', animation: 'sleep', feedback: 'Voy a descansar un ratito.' },
  clean: { label: 'Limpiar', icon: '✦', color: '#38BDF8', animation: 'clean', feedback: '¡Listo! Ya me siento limpio.' },
};

export function selectPetMoodAnimation(state: PetCareState): 'idle' | 'tired' | 'sad' {
  const status = resolvePetCareStatus(state);
  if (status === 'content') return 'idle';
  return findLowestCareNeed(state) === 'happiness' ? 'sad' : 'tired';
}
