/** Estado efímero de medios ya cargados; no sustituye el caché nativo del sistema operativo. */
export interface MediaLoadCache {
  has(url: string): boolean;
  markLoaded(url: string): void;
}

/**
 * Caché LRU acotado para evitar crecimiento ilimitado al explorar un catálogo extenso.
 * La descarga y persistencia del archivo siguen siendo responsabilidad de la plataforma.
 */
export class BoundedMediaLoadCache implements MediaLoadCache {
  private readonly urls = new Map<string, true>();

  constructor(private readonly maxEntries = 32) {
    if (!Number.isInteger(maxEntries) || maxEntries < 1) {
      throw new RangeError('maxEntries debe ser un entero mayor que cero.');
    }
  }

  has(url: string): boolean {
    if (!this.urls.has(url)) {
      return false;
    }

    this.urls.delete(url);
    this.urls.set(url, true);
    return true;
  }

  markLoaded(url: string): void {
    this.urls.delete(url);
    this.urls.set(url, true);

    if (this.urls.size > this.maxEntries) {
      const oldestUrl = this.urls.keys().next().value;
      if (oldestUrl) {
        this.urls.delete(oldestUrl);
      }
    }
  }
}
