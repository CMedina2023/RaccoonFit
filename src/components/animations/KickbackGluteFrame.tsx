import React from 'react';
import { Circle, Ellipse, G, Line, Rect } from 'react-native-svg';
import { AnimationFrameProps } from './AnimationFrameProps';

/** Patada de glúteo cuadrúpeda sin extensión lumbar. */
export const KickbackGluteFrame: React.FC<AnimationFrameProps> = ({ phase, color }) => {
  const extend = phase === 1;
  return <G><Circle cx="65" cy="66" r="15" fill="#E2E8F0"/><Rect x="78" y="76" width="60" height="32" rx="8" fill="#64748B"/>
    <Line x1="84" y1="105" x2="65" y2="150" stroke="#94A3B8" strokeWidth="9"/><Line x1="118" y1="106" x2="128" y2="151" stroke="#94A3B8" strokeWidth="9"/>
    <Line x1="134" y1="102" x2={extend ? 169 : 154} y2={extend ? 77 : 132} stroke="#475569" strokeWidth="11"/><Line x1={extend ? 169 : 154} y1={extend ? 77 : 132} x2={extend ? 188 : 174} y2={extend ? 79 : 154} stroke="#475569" strokeWidth="10"/>{extend && <Ellipse cx="131" cy="102" rx="16" ry="13" fill={color} opacity=".6"/>}</G>;
};
