import React from 'react';
import { Circle, Ellipse, G, Line, Rect } from 'react-native-svg';
import { AnimationFrameProps } from './AnimationFrameProps';

/** Press sentado: la liga se alarga al extender los brazos desde el pecho. */
export const BandChestPressFrame: React.FC<AnimationFrameProps> = ({ phase, color }) => {
  const pressed = phase === 1;
  const handX = pressed ? 153 : 124;
  const chestX = 102;
  return <G><Rect x="53" y="124" width="72" height="8" rx="4" fill="#475569"/><Line x1="76" y1="126" x2="76" y2="166" stroke="#475569" strokeWidth="8"/><Line x1="112" y1="126" x2="112" y2="166" stroke="#475569" strokeWidth="8"/>
    <Circle cx="89" cy="37" r="16" fill="#E2E8F0"/><Rect x="69" y="54" width="40" height="58" rx="8" fill="#64748B"/>
    <Line x1="73" y1="68" x2={handX} y2="83" stroke="#94A3B8" strokeWidth="8"/><Line x1="105" y1="68" x2={handX} y2="94" stroke="#94A3B8" strokeWidth="8"/>
    <Line x1="115" y1="83" x2={handX} y2="83" stroke="#A855F7" strokeWidth={pressed ? 5 : 3}/><Line x1="115" y1="94" x2={handX} y2="94" stroke="#A855F7" strokeWidth={pressed ? 5 : 3}/>
    <Ellipse cx={chestX} cy="79" rx="14" ry="15" fill={color} opacity={pressed ? ".65" : ".25"}/></G>;
};
