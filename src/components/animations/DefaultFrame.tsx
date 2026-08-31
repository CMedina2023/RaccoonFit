import React from 'react';
import { G, Circle, Rect, Line, Ellipse } from 'react-native-svg';
import { AnimationFrameProps } from './AnimationFrameProps';

/**
 * DefaultFrame — Animación genérica de fallback
 *
 * Se muestra cuando el tipo de ejercicio no tiene aún
 * un frame específico registrado.
 */
export const DefaultFrame: React.FC<AnimationFrameProps> = ({ phase, color }) => (
  <G>
    <Circle cx="100" cy="40" r="20" fill="#E2E8F0" />
    <Rect x="80" y="60" width="40" height="50" rx="8" fill="#64748B" />
    <Line x1="80" y1="70" x2={phase === 1 ? '50' : '60'} y2={phase === 1 ? '55' : '90'} stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" />
    <Line x1="120" y1="70" x2={phase === 1 ? '150' : '140'} y2={phase === 1 ? '55' : '90'} stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" />
    {phase === 1 && <Ellipse cx="100" cy="80" rx="18" ry="10" fill={color} opacity={0.6} />}
    <Line x1="88" y1="110" x2="82" y2="165" stroke="#475569" strokeWidth="10" strokeLinecap="round" />
    <Line x1="112" y1="110" x2="118" y2="165" stroke="#475569" strokeWidth="10" strokeLinecap="round" />
  </G>
);
