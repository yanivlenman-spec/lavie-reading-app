import React from 'react';
import Svg, { Rect, Circle, Path, Ellipse } from 'react-native-svg';

export default function Story10Illustration({ width = 360, height = 220 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 360 220">
      {/* Playground background */}
      <Rect width="360" height="220" fill="#FFF9C4" />
      {/* Sky gradient suggestion */}
      <Rect x="0" y="0" width="360" height="120" fill="#E3F2FD" />
      {/* Ground */}
      <Rect x="0" y="172" width="360" height="48" fill="#A5D6A7" />
      {/* Slide structure */}
      <Rect x="40" y="80" width="10" height="100" rx="3" fill="#FF8F00" />
      <Rect x="80" y="80" width="10" height="100" rx="3" fill="#FF8F00" />
      <Rect x="38" y="78" width="54" height="10" rx="3" fill="#FFB300" />
      {/* Slide surface */}
      <Path d="M86 88 L120 170" stroke="#4FC3F7" strokeWidth="14" strokeLinecap="round" />
      {/* Lavie */}
      <Circle cx="160" cy="128" r="20" fill="#FFCC80" />
      <Rect x="146" y="148" width="28" height="34" rx="7" fill="#A5D6A7" />
      {/* Lavie's big smile */}
      <Path d="M152 136 Q160 144 168 136" stroke="#FF6B6B" strokeWidth="2.5" fill="#FFAB91" />
      {/* Lavie waving */}
      <Path d="M174 155 Q195 142 205 138" stroke="#FFCC80" strokeWidth="9" strokeLinecap="round" />
      {/* Noam (new friend) */}
      <Circle cx="240" cy="125" r="19" fill="#FFCC80" />
      <Rect x="227" y="144" width="26" height="32" rx="7" fill="#CE93D8" />
      {/* Noam waving back */}
      <Path d="M227 150 Q208 138 200 134" stroke="#FFCC80" strokeWidth="9" strokeLinecap="round" />
      <Path d="M238 122 Q244 116 240 112" stroke="#FF6B6B" strokeWidth="2" fill="none" />
      {/* Heart / friendship sparkles between them */}
      <Path d="M198 118 Q200 112 204 116 Q208 112 210 118 Q210 124 204 130 Q198 124 198 118 Z" fill="#FF6B6B" opacity="0.8" />
      {/* Stars around */}
      <Path d="M290 70 L293 80 L303 80 L295 86 L298 96 L290 90 L282 96 L285 86 L277 80 L287 80 Z" fill="#FFD700" opacity="0.8" />
      <Path d="M60 70 L62 78 L70 78 L64 83 L66 91 L60 86 L54 91 L56 83 L50 78 L58 78 Z" fill="#FFD700" opacity="0.7" />
      {/* Swing set */}
      <Path d="M290 40 L290 120" stroke="#8D6E63" strokeWidth="4" />
      <Path d="M330 40 L330 120" stroke="#8D6E63" strokeWidth="4" />
      <Rect x="286" y="38" width="48" height="6" rx="3" fill="#A0522D" />
      <Path d="M300 46 L300 110" stroke="#9E9E9E" strokeWidth="2" />
      <Path d="M320 46 L320 110" stroke="#9E9E9E" strokeWidth="2" />
      <Rect x="296" y="110" width="28" height="8" rx="4" fill="#FF8F00" />
    </Svg>
  );
}
