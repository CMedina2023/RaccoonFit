import React from 'react';
import { G, Circle, Line, Rect, Ellipse, Path } from 'react-native-svg';
import { AnimationFrameProps } from './AnimationFrameProps';

/**
 * MonsterWalkFrame — Pasos laterales con banda elástica (Monster Walk)
 * Músculo activo: abductores / glúteo medio
 */
export const MonsterWalkFrame: React.FC<AnimationFrameProps> = ({ phase, color }) => (
  <G>
    <Circle cx="100" cy="28" r="18" fill="#E2E8F0" />
    <Rect x="78" y="46" width="44" height="50" rx="8" fill="#64748B" />
    <Line x1="78" y1="52" x2="55" y2="72" stroke="#94A3B8" strokeWidth="7" strokeLinecap="round" />
    <Line x1="122" y1="52" x2="145" y2="72" stroke="#94A3B8" strokeWidth="7" strokeLinecap="round" />

    {/* Piernas en semi-sentadilla abierta */}
    <Line x1="88" y1="96" x2={phase === 1 ? '64' : '72'} y2="148" stroke="#475569" strokeWidth="10" strokeLinecap="round" />
    <Line x1="112" y1="96" x2={phase === 1 ? '136' : '128'} y2="148" stroke="#475569" strokeWidth="10" strokeLinecap="round" />
    <Ellipse cx={phase === 1 ? 64 : 72} cy="152" rx="12" ry="6" fill="#334155" />
    <Ellipse cx={phase === 1 ? 136 : 128} cy="152" rx="12" ry="6" fill="#334155" />

    {/* Banda elástica entre rodillas */}
    <Path
      d={phase === 1
        ? 'M 70 128 Q 100 120 130 128'
        : 'M 78 128 Q 100 124 122 128'}
      fill="none"
      stroke="#F97316"
      strokeWidth="5"
    />

    {/* Abductores activos en esfuerzo */}
    {phase === 1 && <Ellipse cx="78" cy="124" rx="10" ry="16" fill={color} opacity={0.55} />}
    {phase === 1 && <Ellipse cx="122" cy="124" rx="10" ry="16" fill={color} opacity={0.55} />}
  </G>
);
