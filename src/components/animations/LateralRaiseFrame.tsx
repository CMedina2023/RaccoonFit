import React from 'react';
import { Circle, Ellipse, G, Line, Rect } from 'react-native-svg';
import { AnimationFrameProps } from './AnimationFrameProps';

/** Elevación lateral: brazos hasta la horizontal, sin superar los hombros. */
export const LateralRaiseFrame: React.FC<AnimationFrameProps> = ({ phase, color }) => {
  const raised = phase === 1;
  const y = raised ? 70 : 122;
  return <G><Circle cx="100" cy="30" r="17" fill="#E2E8F0"/><Rect x="80" y="48" width="40" height="58" rx="8" fill="#64748B"/>
    <Line x1="82" y1="62" x2="50" y2={y} stroke="#94A3B8" strokeWidth="8"/><Line x1="118" y1="62" x2="150" y2={y} stroke="#94A3B8" strokeWidth="8"/>
    <Ellipse cx="48" cy={y} rx="8" ry="6" fill="#F59E0B"/><Ellipse cx="152" cy={y} rx="8" ry="6" fill="#F59E0B"/>
    <Line x1="90" y1="106" x2="82" y2="160" stroke="#475569" strokeWidth="10"/><Line x1="110" y1="106" x2="118" y2="160" stroke="#475569" strokeWidth="10"/>{raised && <><Ellipse cx="82" cy="61" rx="11" ry="12" fill={color} opacity=".6"/><Ellipse cx="118" cy="61" rx="11" ry="12" fill={color} opacity=".6"/></>}</G>;
};
