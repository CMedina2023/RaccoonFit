import React from 'react';
import { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';
import { AnimationFrameProps } from './AnimationFrameProps';

/** Ostra lateral: apertura de rodilla sin rotar la pelvis. */
export const ClamshellFrame: React.FC<AnimationFrameProps> = ({ phase, color }) => {
  const open = phase === 1;
  return <G><Circle cx="55" cy="73" r="16" fill="#E2E8F0"/><Rect x="70" y="78" width="57" height="28" rx="8" fill="#64748B"/>
    <Line x1="121" y1="101" x2="158" y2="130" stroke="#475569" strokeWidth="11"/><Line x1="158" y1="130" x2="176" y2="151" stroke="#475569" strokeWidth="10"/>
    <Line x1="118" y1="106" x2="151" y2={open ? 91 : 128} stroke="#94A3B8" strokeWidth="10"/><Line x1="151" y1={open ? 91 : 128} x2="178" y2={open ? 105 : 150} stroke="#94A3B8" strokeWidth="9"/>
    <Path d="M 142 118 Q 155 111 164 120" fill="none" stroke="#F97316" strokeWidth={open ? 5 : 3}/>{open && <Ellipse cx="116" cy="107" rx="15" ry="11" fill={color} opacity=".6"/>}</G>;
};
