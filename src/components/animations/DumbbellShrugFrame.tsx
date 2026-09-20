import React from 'react';
import { Circle, Ellipse, G, Line, Rect } from 'react-native-svg';
import { AnimationFrameProps } from './AnimationFrameProps';

/** Encogimiento: hombros suben verticalmente, sin hacer círculos ni elevar los brazos. */
export const DumbbellShrugFrame: React.FC<AnimationFrameProps> = ({ phase, color }) => {
  const raised = phase === 1;
  const shoulderY = raised ? 58 : 68;
  const dumbbellY = raised ? 112 : 128;
  return <G><Circle cx="100" cy={raised ? 27 : 32} r="16" fill="#E2E8F0"/><Rect x="79" y={shoulderY} width="42" height="56" rx="8" fill="#64748B"/>
    <Line x1="82" y1={shoulderY + 10} x2="61" y2={dumbbellY} stroke="#94A3B8" strokeWidth="8"/><Line x1="118" y1={shoulderY + 10} x2="139" y2={dumbbellY} stroke="#94A3B8" strokeWidth="8"/>
    <Rect x="51" y={dumbbellY - 7} width="20" height="14" rx="3" fill="#F59E0B"/><Rect x="129" y={dumbbellY - 7} width="20" height="14" rx="3" fill="#F59E0B"/>
    <Line x1="89" y1={shoulderY + 56} x2="82" y2="162" stroke="#475569" strokeWidth="10"/><Line x1="111" y1={shoulderY + 56} x2="118" y2="162" stroke="#475569" strokeWidth="10"/>
    {raised && <Ellipse cx="100" cy="65" rx="29" ry="11" fill={color} opacity=".6"/>}</G>;
};
