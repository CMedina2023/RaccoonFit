import React from 'react';
import { Circle, Ellipse, G, Line, Rect } from 'react-native-svg';
import { AnimationFrameProps } from './AnimationFrameProps';

/** Boxeo al aire: golpe al frente con pies estables y sin impacto. */
export const ShadowBoxFrame: React.FC<AnimationFrameProps> = ({ phase, color }) => {
  const punch = phase === 1;
  return <G><Circle cx="100" cy="28" r="17" fill="#E2E8F0"/><Rect x="80" y="46" width="40" height="56" rx="8" fill="#64748B"/>
    <Line x1="84" y1="61" x2={punch ? 160 : 64} y2={punch ? 70 : 83} stroke="#94A3B8" strokeWidth="9"/><Ellipse cx={punch ? 164 : 61} cy={punch ? 70 : 83} rx="9" ry="8" fill="#F97316"/>
    <Line x1="116" y1="61" x2="135" y2="82" stroke="#94A3B8" strokeWidth="9"/><Ellipse cx="138" cy="84" rx="9" ry="8" fill="#F97316"/>
    <Line x1="91" y1="102" x2="75" y2="160" stroke="#475569" strokeWidth="10"/><Line x1="109" y1="102" x2="130" y2="160" stroke="#475569" strokeWidth="10"/>{punch && <Ellipse cx="100" cy="78" rx="17" ry="17" fill={color} opacity=".45"/>}</G>;
};
