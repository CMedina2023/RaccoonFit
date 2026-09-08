import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Platform } from 'react-native';

export interface GifCanvasPlayerProps {
  gifUrl: string;
  isPaused: boolean;
  speed: 1 | 0.5;
  color?: string;
  onError?: () => void;
}

// Registro en memoria de URLs cargadas con éxito para evitar re-triggers del spinner
const loadedUrlsCache = new Set<string>();

/**
 * GifCanvasPlayer — SRP: Renderizado estable de animaciones GIF con soporte de pausa en Canvas
 *
 * 1. Resuelve el parpadeo (flickering): Memoiza referencias y nunca vuelve a activar el estado de
 *    carga para un recurso ya en memoria caché.
 * 2. Habilita pausa real (Opción A): En plataformas Web, al pausar captura el fotograma actual en un
 *    <canvas> HTML5 y lo mantiene estático, congelando la ejecución biomecánica al instante.
 */
export const GifCanvasPlayer: React.FC<GifCanvasPlayerProps> = ({
  gifUrl,
  isPaused,
  speed,
  color = '#10B981',
  onError,
}) => {
  const isAlreadyLoaded = loadedUrlsCache.has(gifUrl);
  const [isLoading, setIsLoading] = useState(!isAlreadyLoaded);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<any>(null);

  // Memoizar el objeto source para evitar que react-native-web reinicie la carga
  const imageSource = useMemo(() => ({ uri: gifUrl }), [gifUrl]);

  // Si cambia la URL del GIF, verificar caché
  useEffect(() => {
    if (loadedUrlsCache.has(gifUrl)) {
      setIsLoading(false);
    } else {
      setIsLoading(true);
    }
  }, [gifUrl]);

  // Callbacks estables para evitar re-triggers en el hook de react-native-web
  const handleLoadStart = useCallback(() => {
    if (!loadedUrlsCache.has(gifUrl)) {
      setIsLoading(true);
    }
  }, [gifUrl]);

  const handleLoadEnd = useCallback(() => {
    loadedUrlsCache.add(gifUrl);
    setIsLoading(false);
  }, [gifUrl]);

  const handleError = useCallback(() => {
    setIsLoading(false);
    onError?.();
  }, [onError]);

  // Opción A: Al pausar en Web, capturar el fotograma instantáneo en el Canvas
  useEffect(() => {
    if (Platform.OS === 'web' && isPaused && canvasRef.current) {
      const canvas = canvasRef.current;
      // Buscar el elemento <img> nativo dentro del contenedor o por atributo src
      let imgElement: HTMLImageElement | null = null;
      if (containerRef.current) {
        imgElement = containerRef.current.querySelector?.('img') || null;
      }
      if (!imgElement && typeof document !== 'undefined') {
        imgElement = document.querySelector(`img[src="${gifUrl}"]`);
      }

      if (imgElement && canvas) {
        const width = imgElement.naturalWidth || 220;
        const height = imgElement.naturalHeight || 220;
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          try {
            ctx.drawImage(imgElement, 0, 0, width, height);
          } catch {
            // Si el canvas no puede dibujar por alguna restricción, el overlay de pausa sigue activo
          }
        }
      }
    }
  }, [isPaused, gifUrl]);

  return (
    <View style={styles.mediaContainer} ref={containerRef}>
      {/* Imagen animada activa (visible cuando no está en pausa o como base) */}
      <Image
        source={imageSource}
        style={[styles.gifImage, isPaused && Platform.OS === 'web' && styles.hiddenUnderCanvas]}
        resizeMode="contain"
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onError={handleError}
      />

      {/* Opción A: Canvas para congelar el fotograma en Web */}
      {isPaused && Platform.OS === 'web' && (
        <View style={styles.canvasOverlay}>
          {React.createElement('canvas', {
            ref: canvasRef,
            style: {
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            },
          })}
        </View>
      )}

      {/* Indicador de carga inicial (solo si no está en caché) */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="small" color={color} />
          <Text style={styles.loadingText}>Cargando animación 3D...</Text>
        </View>
      )}

      {/* Badges de estado de reproducción sobre el medio */}
      <View style={styles.badgesContainer}>
        {isPaused && (
          <View style={styles.pausedBadge}>
            <Text style={styles.pausedText}>⏸ En pausa</Text>
          </View>
        )}
        {speed === 0.5 && !isPaused && (
          <View style={styles.speedBadge}>
            <Text style={styles.speedText}>🔍 0.5x Cámara Lenta</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mediaContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    position: 'relative',
  },
  gifImage: {
    width: '100%',
    height: '100%',
  },
  hiddenUnderCanvas: {
    opacity: 0,
  },
  canvasOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 6,
  },
  badgesContainer: {
    position: 'absolute',
    bottom: 8,
    alignItems: 'center',
    zIndex: 5,
  },
  pausedBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  pausedText: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '700',
  },
  speedBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  speedText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700',
  },
});
