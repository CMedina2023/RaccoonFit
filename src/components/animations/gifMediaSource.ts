/** Fuente remota para GIFs con preferencia por el caché persistente nativo de la plataforma. */
export interface CachedGifSource {
  uri: string;
  cache: 'force-cache';
}

/**
 * React Native delega el almacenamiento binario al caché de imágenes del sistema.
 * Si el archivo no está disponible offline, el reproductor informa el error y usa SVG local.
 */
export function createCachedGifSource(gifUrl: string): CachedGifSource {
  return { uri: gifUrl, cache: 'force-cache' };
}
