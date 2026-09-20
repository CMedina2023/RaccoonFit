import React from 'react';
import { Circle, Ellipse, G, Line, Rect } from 'react-native-svg';
import { AnimationFrameProps } from './AnimationFrameProps';

/** V-up con banda: torso y piernas convergen, con la banda visiblemente tensa. */
export const BandVUpFrame: React.FC<AnimationFrameProps> = ({ phase, color }) => {
  const raised = phase === 1;
  const headX = raised ? 78 : 42;
  const headY = raised ? 69 : 115;
  const kneeX = raised ? 130 : 164;
  const kneeY = raised ? 83 : 142;
  return <G><Rect x="25" y="163" width="156" height="6" rx="3" fill="#CBD5E1"/><Circle cx={headX} cy={headY} r="15" fill="#E2E8F0"/>
    <Line x1={headX + 12} y1={headY + 11} x2="99" y2="130" stroke="#64748B" strokeWidth="16" strokeLinecap="round"/>
    <Line x1="96" y1="125" x2="132" y2="151" stroke="#94A3B8" strokeWidth="8"/><Line x1="101" y1="126" x2="72" y2="146" stroke="#94A3B8" strokeWidth="8"/>
    <Line x1="103" y1="136" x2={kneeX} y2={kneeY} stroke="#475569" strokeWidth="11"/><Line x1={kneeX} y1={kneeY} x2="172" y2="153" stroke="#475569" strokeWidth="10"/>
    <Line x1="99" y1="136" x2="128" y2="151" stroke="#475569" strokeWidth="11"/><Line x1="128" y1="151" x2="173" y2="157" stroke="#475569" strokeWidth="10"/>
    <Line x1="70" y1="146" x2={kneeX} y2={kneeY} stroke="#A855F7" strokeWidth={raised ? 5 : 3}/>{raised && <Ellipse cx="98" cy="115" rx="20" ry="16" fill={color} opacity=".65"/>}</G>;
};
