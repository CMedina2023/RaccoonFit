import React from 'react';
import { Circle, Ellipse, G, Line, Rect } from 'react-native-svg';
import { AnimationFrameProps } from './AnimationFrameProps';

/** Bisagra rumana: cadera atrás y espalda neutra. */
export const DeadliftRdlFrame: React.FC<AnimationFrameProps> = ({ phase, color }) => {
  const hinge = phase === 1;
  return <G><Circle cx={hinge ? 75 : 100} cy={hinge ? 49 : 28} r="16" fill="#E2E8F0"/><Rect x={hinge ? 84 : 80} y={hinge ? 62 : 46} width="40" height="57" rx="8" transform={hinge ? 'rotate(-28 104 90)' : undefined} fill="#64748B"/>
    <Line x1="91" y1="105" x2="83" y2="160" stroke="#475569" strokeWidth="10"/><Line x1="109" y1="105" x2="118" y2="160" stroke="#475569" strokeWidth="10"/>
    <Line x1={hinge ? 109 : 84} y1={hinge ? 85 : 61} x2={hinge ? 124 : 76} y2={hinge ? 135 : 124} stroke="#94A3B8" strokeWidth="8"/><Rect x={hinge ? 117 : 69} y={hinge ? 130 : 119} width="18" height="12" rx="3" fill="#F59E0B"/>{hinge && <Ellipse cx="103" cy="112" rx="18" ry="13" fill={color} opacity=".6"/>}</G>;
};
