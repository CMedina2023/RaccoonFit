import React from 'react';
import { Circle, Ellipse, G, Line, Rect } from 'react-native-svg';
import { AnimationFrameProps } from './AnimationFrameProps';

/** Escalador: manos estables y rodilla alterna hacia el pecho. */
export const MountainClimberFrame: React.FC<AnimationFrameProps> = ({ phase, color }) => {
  const drive = phase === 1;
  return <G><Circle cx="55" cy="64" r="15" fill="#E2E8F0"/><Rect x="69" y="75" width="66" height="27" rx="8" fill="#64748B"/>
    <Line x1="80" y1="99" x2="56" y2="151" stroke="#94A3B8" strokeWidth="9"/><Line x1="117" y1="101" x2="130" y2="151" stroke="#94A3B8" strokeWidth="9"/>
    <Line x1="132" y1="99" x2={drive ? 102 : 162} y2={drive ? 128 : 137} stroke="#475569" strokeWidth="11"/><Line x1={drive ? 102 : 162} y1={drive ? 128 : 137} x2={drive ? 117 : 183} y2={drive ? 155 : 157} stroke="#475569" strokeWidth="10"/>{drive && <Ellipse cx="105" cy="106" rx="18" ry="13" fill={color} opacity=".6"/>}</G>;
};
