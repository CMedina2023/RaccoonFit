import { defaultStorageAdapter } from '../core/storage/AsyncStorageAdapter';
import { createAppStore } from '../store/createAppStore';

/** Punto de composición de producción para la infraestructura de persistencia. */
export const useAppStore = createAppStore(defaultStorageAdapter);
