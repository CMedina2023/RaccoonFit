import React from 'react';
import { Circle, Ellipse, G, Line, Path, Rect } from 'react-native-svg';
import { AnimationFrameProps } from './AnimationFrameProps';

/** Remo sentado: la liga se tensa al llevar los codos hacia las costillas. */
export const RowBandFrame: React.FC<AnimationFrameProps> = ({ phase, color }) => {
  const pulling = phase === 1;
  const hand = pulling ? 78 : 55;
  return <G><Circle cx="105" cy="32" r="17" fill="#E2E8F0"/><Rect x="86" y="50" width="38" height="48" rx="8" fill="#64748B"/>
    <Line x1="92" y1="98" x2="55" y2="150" stroke="#475569" strokeWidth="9"/><Line x1="118" y1="98" x2="150" y2="150" stroke="#475569" strokeWidth="9"/>
    <Line x1="88" y1="62" x2={hand} y2="85" stroke="#94A3B8" strokeWidth="7"/><Line x1="122" y1="62" x2={pulling ? 100 : 155} y2="85" stroke="#94A3B8" strokeWidth="7"/>
    <Path d={pulling ? 'M 55 150 Q 105 115 100 85' : 'M 55 150 Q 105 115 155 85'} fill="none" stroke="#F97316" strokeWidth={pulling ? 5 : 3}/>{pulling && <Ellipse cx="104" cy="72" rx="18" ry="14" fill={color} opacity=".55"/>}</G>;
};
