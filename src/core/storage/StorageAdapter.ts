/**
 * StorageAdapter.ts — Dependency Inversion Principle (DIP)
 *
 * Interfaz abstracta de persistencia.
 * El store y los servicios dependen de esta abstracción,
 * NO de AsyncStorage, MMKV ni SQLite directamente.
 *
 * Para cambiar el motor de persistencia basta con crear
 * una nueva clase que implemente esta interfaz.
 */
export interface StorageAdapter {
  /**
   * Lee el valor almacenado bajo la clave indicada.
   * Retorna `null` si la clave no existe.
   */
  get(key: string): Promise<string | null>;

  /**
   * Almacena el valor bajo la clave indicada.
   */
  set(key: string, value: string): Promise<void>;

  /**
   * Elimina la entrada asociada a la clave indicada.
   */
  remove(key: string): Promise<void>;
}
