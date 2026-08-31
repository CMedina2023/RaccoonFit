import React from 'react';
import { G, Circle, Line, Rect, Ellipse } from 'react-native-svg';
import { AnimationFrameProps } from './AnimationFrameProps';

/**
 * SquatGobletFrame — Sentadilla goblet con mancuerna
 * Músculo activo: cuádriceps
 */
export const SquatGobletFrame: React.FC<AnimationFrameProps> = ({ phase, color }) => (
  <G>
    {/* Cabeza */}
    <Circle cx="100" cy={phase === 1 ? 42 : 28} r="18" fill="#E2E8F0" />
    {/* Mancuerna al pecho */}
    <Rect x="88" y={phase === 1 ? 62 : 48} width="24" height="12" rx="6" fill="#F59E0B" />
    {/* Torso */}
    <Rect x="78" y={phase === 1 ? 74 : 60} width="44" height="44" rx="8" fill="#64748B" />
    {/* Brazos sosteniendo */}
    <Line x1="78" y1={phase === 1 ? 82 : 68} x2="60" y2={phase === 1 ? 92 : 78} stroke="#94A3B8" strokeWidth="7" strokeLinecap="round" />
    <Line x1="122" y1={phase === 1 ? 82 : 68} x2="140" y2={phase === 1 ? 92 : 78} stroke="#94A3B8" strokeWidth="7" strokeLinecap="round" />

    {/* Piernas según fase */}
    {phase === 1 ? (
      <>
        <Line x1="88" y1="118" x2="68" y2="158" stroke="#475569" strokeWidth="10" strokeLinecap="round" />
        <Line x1="112" y1="118" x2="132" y2="158" stroke="#475569" strokeWidth="10" strokeLinecap="round" />
        <Ellipse cx="68" cy="160" rx="10" ry="6" fill="#334155" />
        <Ellipse cx="132" cy="160" rx="10" ry="6" fill="#334155" />
      </>
    ) : (
      <>
        <Line x1="88" y1="104" x2="82" y2="158" stroke="#475569" strokeWidth="10" strokeLinecap="round" />
        <Line x1="112" y1="104" x2="118" y2="158" stroke="#475569" strokeWidth="10" strokeLinecap="round" />
        <Ellipse cx="82" cy="160" rx="10" ry="6" fill="#334155" />
        <Ellipse cx="118" cy="160" rx="10" ry="6" fill="#334155" />
      </>
    )}

    {/* Cuádriceps activo en esfuerzo */}
    {phase === 1 && <Ellipse cx="80" cy="134" rx="10" ry="18" fill={color} opacity={0.6} />}
    {phase === 1 && <Ellipse cx="120" cy="134" rx="10" ry="18" fill={color} opacity={0.6} />}
  </G>
);
