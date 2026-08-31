import React from 'react';
import { G, Circle, Line, Rect, Ellipse } from 'react-native-svg';
import { AnimationFrameProps } from './AnimationFrameProps';

/**
 * ShoulderPressFrame — Press de hombros con mancuernas
 * Músculo activo: deltoides anterior
 */
export const ShoulderPressFrame: React.FC<AnimationFrameProps> = ({ phase, color }) => (
  <G>
    <Circle cx="100" cy="28" r="18" fill="#E2E8F0" />
    <Rect x="78" y="46" width="44" height="52" rx="8" fill="#64748B" />

    {/* Brazos según fase */}
    {phase === 1 ? (
      <>
        <Line x1="78" y1="52" x2="50" y2="40" stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" />
        <Line x1="122" y1="52" x2="150" y2="40" stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" />
        <Rect x="30" y="32" width="22" height="10" rx="5" fill="#F59E0B" />
        <Rect x="148" y="32" width="22" height="10" rx="5" fill="#F59E0B" />
      </>
    ) : (
      <>
        <Line x1="78" y1="52" x2="50" y2="66" stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" />
        <Line x1="122" y1="52" x2="150" y2="66" stroke="#94A3B8" strokeWidth="8" strokeLinecap="round" />
        <Rect x="30" y="60" width="22" height="10" rx="5" fill="#F59E0B" />
        <Rect x="148" y="60" width="22" height="10" rx="5" fill="#F59E0B" />
      </>
    )}

    {/* Deltoides activo en esfuerzo */}
    {phase === 1 && <Ellipse cx="80" cy="50" rx="12" ry="10" fill={color} opacity={0.65} />}
    {phase === 1 && <Ellipse cx="120" cy="50" rx="12" ry="10" fill={color} opacity={0.65} />}

    {/* Piernas sentado */}
    <Rect x="80" y="98" width="16" height="52" rx="6" fill="#475569" />
    <Rect x="104" y="98" width="16" height="52" rx="6" fill="#475569" />
  </G>
);
