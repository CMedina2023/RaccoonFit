import React from 'react';
import { Circle, Ellipse, G, Line, Rect } from 'react-native-svg';
import { AnimationFrameProps } from './AnimationFrameProps';

/** Step jack de bajo impacto: un pie permanece apoyado en cada transición. */
export const StepJackFrame: React.FC<AnimationFrameProps> = ({ phase, color }) => {
  const open = phase === 1;
  return <G><Circle cx="100" cy="28" r="17" fill="#E2E8F0"/><Rect x="80" y="46" width="40" height="52" rx="8" fill="#64748B"/>
    <Line x1="84" y1="57" x2={open ? 52 : 70} y2={open ? 35 : 78} stroke="#94A3B8" strokeWidth="7"/><Line x1="116" y1="57" x2={open ? 148 : 130} y2={open ? 35 : 78} stroke="#94A3B8" strokeWidth="7"/>
    <Line x1="91" y1="98" x2={open ? 62 : 84} y2="156" stroke="#475569" strokeWidth="10"/><Line x1="109" y1="98" x2="116" y2="156" stroke="#475569" strokeWidth="10"/><Ellipse cx={open ? 62 : 84} cy="160" rx="12" ry="6" fill="#334155"/><Ellipse cx="116" cy="160" rx="12" ry="6" fill="#334155"/>{open && <Ellipse cx="100" cy="82" rx="18" ry="16" fill={color} opacity=".45"/>}</G>;
};
