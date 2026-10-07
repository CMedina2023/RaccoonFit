import { useCallback, useEffect, useState } from 'react';
import type { PetCareAction, RockyAnimationRequest } from '../types';

interface PetCareSession {
  animationRequest: RockyAnimationRequest | null;
  lastAction: PetCareAction | null;
  performAction: (action: PetCareAction) => void;
  reset: () => void;
}

export function usePetCareSession(
  animationRequest: RockyAnimationRequest | null,
  performCareAction: (action: PetCareAction) => void,
  clearAnimationRequest: (id: number) => void
): PetCareSession {
  const [lastAction, setLastAction] = useState<PetCareAction | null>(null);

  useEffect(() => {
    if (!animationRequest) {
      setLastAction(null);
      return;
    }
    const requestId = animationRequest.id;
    const timeoutId = setTimeout(() => {
      setLastAction(null);
      clearAnimationRequest(requestId);
    }, 1400);
    return () => clearTimeout(timeoutId);
  }, [animationRequest?.id, clearAnimationRequest]);

  const performAction = useCallback((action: PetCareAction) => {
    setLastAction(action);
    performCareAction(action);
  }, [performCareAction]);

  const reset = useCallback(() => setLastAction(null), []);

  return { animationRequest, lastAction, performAction, reset };
}
