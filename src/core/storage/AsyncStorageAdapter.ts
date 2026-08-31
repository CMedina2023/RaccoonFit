/**
 * AsyncStorageAdapter.ts — Dependency Inversion Principle (DIP)
 *
 * Implementación concreta de `StorageAdapter` usando @react-native-async-storage.
 * Es la ÚNICA clase que sabe que AsyncStorage existe.
 *
 * Para migrar a MMKV o SQLite basta con crear `MmkvStorageAdapter` o
 * `SqliteStorageAdapter` con la misma interfaz y reemplazar la instancia
 * exportada aquí abajo — sin tocar el store ni los servicios.
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageAdapter } from './StorageAdapter';

export class AsyncStorageAdapter implements StorageAdapter {
  async get(key: string): Promise<string | null> {
    return AsyncStorage.getItem(key);
  }

  async set(key: string, value: string): Promise<void> {
    await AsyncStorage.setItem(key, value);
  }

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }
}

/**
 * Instancia singleton exportada como default adapter.
 * El store la recibe como dependencia inyectada.
 */
export const defaultStorageAdapter: StorageAdapter = new AsyncStorageAdapter();
