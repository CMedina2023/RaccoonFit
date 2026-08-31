import React from 'react';
import { G, Circle, Line, Rect, Ellipse } from 'react-native-svg';
import { AnimationFrameProps } from './AnimationFrameProps';

/**
 * CurlBicepsFrame — Curl de bíceps con mancuerna
 * Músculo activo: bíceps braquial (brazo derecho)
 */
export const CurlBicepsFrame: React.FC<AnimationFrameProps> = ({ phase, color }) => (
  <G>
    {/* Cabeza */}
    <Circle cx="100" cy="28" r="18" fill="#E2E8F0" />
    {/* Cuello */}
    <Line x1="100" y1="46" x2="100" y2="58" stroke="#CBD5E1" strokeWidth="6" />
    {/* Torso */}
    <Rect x="78" y="58" width="44" height="50" rx="8" fill="#64748B" />

    {/* Brazo superior derecho */}
    <Line x1="122" y1="62" x2="138" y2="82" stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" />

    {/* Antebrazo: fase 0=extendido, fase 1=flexionado, fase 2=retorno */}
    {phase === 0 && <Line x1="138" y1="82" x2="152" y2="112" stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" />}
    {phase === 1 && <Line x1="138" y1="82" x2="128" y2="62" stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" />}
    {phase === 2 && <Line x1="138" y1="82" x2="148" y2="100" stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" />}

    {/* Mancuerna */}
    {phase === 0 && <Rect x="150" y="108" width="20" height="8" rx="4" fill="#F59E0B" />}
    {phase === 1 && <Rect x="126" y="58" width="20" height="8" rx="4" fill="#F59E0B" />}
    {phase === 2 && <Rect x="146" y="96" width="20" height="8" rx="4" fill="#F59E0B" />}

    {/* Brazo izquierdo estático */}
    <Line x1="78" y1="62" x2="62" y2="82" stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" />
    <Line x1="62" y1="82" x2="48" y2="112" stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" />
    <Rect x="30" y="108" width="20" height="8" rx="4" fill="#F59E0B" />

    {/* Músculo bíceps resaltado en esfuerzo */}
    {phase === 1 && <Ellipse cx="133" cy="72" rx="12" ry="8" fill={color} opacity={0.7} />}

    {/* Piernas */}
    <Rect x="80" y="108" width="16" height="50" rx="6" fill="#475569" />
    <Rect x="104" y="108" width="16" height="50" rx="6" fill="#475569" />
    <Rect x="80" y="150" width="18" height="12" rx="4" fill="#334155" />
    <Rect x="102" y="150" width="18" height="12" rx="4" fill="#334155" />
  </G>
);
