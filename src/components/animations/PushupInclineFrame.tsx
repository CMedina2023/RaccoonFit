import React from 'react';
import { Circle, Ellipse, G, Line, Rect } from 'react-native-svg';
import { AnimationFrameProps } from './AnimationFrameProps';

/** Flexión inclinada con apoyo elevado y tronco alineado. */
export const PushupInclineFrame: React.FC<AnimationFrameProps> = ({ phase, color }) => {
  const lowered = phase === 1;
  return <G><Rect x="135" y="98" width="44" height="65" rx="5" fill="#475569"/><Circle cx={lowered ? 112 : 92} cy={lowered ? 78 : 58} r="15" fill="#E2E8F0"/>
    <Line x1={lowered ? 100 : 82} y1={lowered ? 88 : 68} x2="143" y2="108" stroke="#64748B" strokeWidth="16" strokeLinecap="round"/><Line x1="143" y1="108" x2="153" y2="102" stroke="#94A3B8" strokeWidth="7"/><Line x1={lowered ? 100 : 82} y1={lowered ? 91 : 71} x2="55" y2="150" stroke="#475569" strokeWidth="10"/><Line x1={lowered ? 105 : 87} y1={lowered ? 91 : 71} x2="78" y2="156" stroke="#475569" strokeWidth="10"/>{lowered && <Ellipse cx="120" cy="94" rx="14" ry="12" fill={color} opacity=".6"/>}</G>;
};
