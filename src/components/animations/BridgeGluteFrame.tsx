import React from 'react';
import { G, Circle, Line, Rect, Ellipse, Path } from 'react-native-svg';
import { AnimationFrameProps } from './AnimationFrameProps';

/**
 * BridgeGluteFrame — Puente de glúteo con banda elástica
 * Músculo activo: glúteo mayor
 */
export const BridgeGluteFrame: React.FC<AnimationFrameProps> = ({ phase, color }) => (
  <G>
    {/* Suelo */}
    <Line x1="10" y1="175" x2="190" y2="175" stroke="#334155" strokeWidth="3" />

    {/* Cabeza */}
    <Circle cx="28" cy={phase === 1 ? 150 : 158} r="14" fill="#E2E8F0" />
    {/* Torso */}
    <Rect x="38" y={phase === 1 ? 144 : 152} width="80" height="22" rx="8" fill="#64748B" />
    {/* Cadera elevada en esfuerzo */}
    <Rect x="108" y={phase === 1 ? 134 : 152} width="30" height="20" rx="8" fill="#475569" />

    {/* Piernas dobladas */}
    <Line x1="108" y1={phase === 1 ? 144 : 162} x2="130" y2="170" stroke="#475569" strokeWidth="10" strokeLinecap="round" />
    <Line x1="138" y1={phase === 1 ? 154 : 162} x2="162" y2="170" stroke="#475569" strokeWidth="10" strokeLinecap="round" />

    {/* Pies en el suelo */}
    <Ellipse cx="130" cy="172" rx="12" ry="5" fill="#334155" />
    <Ellipse cx="162" cy="172" rx="12" ry="5" fill="#334155" />

    {/* Banda elástica */}
    <Path
      d={phase === 1
        ? 'M 108 144 Q 120 130 138 144'
        : 'M 108 162 Q 120 158 138 162'}
      fill="none"
      stroke="#F97316"
      strokeWidth="4"
      strokeDasharray="4"
    />

    {/* Glúteo activo en esfuerzo */}
    {phase === 1 && <Ellipse cx="120" cy="140" rx="14" ry="10" fill={color} opacity={0.65} />}
  </G>
);
