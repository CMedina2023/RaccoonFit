import React from 'react';
import { Circle, Ellipse, G, Line, Rect } from 'react-native-svg';
import { AnimationFrameProps } from './AnimationFrameProps';

/** Remo con mancuerna: columna neutra y codo hacia la cadera. */
export const RowDumbbellFrame: React.FC<AnimationFrameProps> = ({ phase, color }) => {
  const pull = phase === 1;
  return <G><Circle cx="82" cy="37" r="15" fill="#E2E8F0"/><Rect x="84" y="52" width="36" height="66" rx="8" transform="rotate(-20 102 85)" fill="#64748B"/>
    <Line x1="102" y1="112" x2="76" y2="160" stroke="#475569" strokeWidth="10"/><Line x1="114" y1="110" x2="141" y2="158" stroke="#475569" strokeWidth="10"/>
    <Line x1="104" y1="67" x2={pull ? 125 : 150} y2={pull ? 91 : 128} stroke="#94A3B8" strokeWidth="8"/><Rect x={pull ? 120 : 145} y={pull ? 86 : 123} width="15" height="11" rx="3" fill="#F59E0B"/>{pull && <Ellipse cx="106" cy="77" rx="14" ry="16" fill={color} opacity=".6"/>}</G>;
};
