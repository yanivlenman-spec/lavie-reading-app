import React from 'react';
import Svg, { Rect, Circle, Path, Ellipse } from 'react-native-svg';

export default function Story1Illustration({ width = 360, height = 220 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 360 220">
      {/* Sky */}
      <Rect width="360" height="220" fill="#E3F2FD" />
      {/* Sun */}
      <Circle cx="320" cy="38" r="26" fill="#FFD700" opacity="0.95" />
      {/* Pool water */}
      <Rect x="40" y="130" width="280" height="75" rx="12" fill="#4FC3F7" />
      <Rect x="40" y="130" width="280" height="20" rx="12" fill="#81D4FA" />
      {/* Pool edge / tiles */}
      <Rect x="30" y="124" width="300" height="14" rx="6" fill="#B0BEC5" />
      {/* Wave lines in water */}
      <Path d="M60 155 Q90 148 120 155 Q150 162 180 155 Q210 148 240 155 Q270 162 300 155" stroke="#fff" strokeWidth="2.5" fill="none" opacity="0.6" />
      <Path d="M70 170 Q100 163 130 170 Q160 177 190 170 Q220 163 250 170 Q280 177 300 170" stroke="#fff" strokeWidth="2" fill="none" opacity="0.4" />
      {/* Lavie jumping mid-air */}
      <Circle cx="180" cy="90" r="20" fill="#FFCC80" />
      <Rect x="165" y="110" width="30" height="28" rx="7" fill="#FF6B6B" />
      {/* Arms out (jumping pose) */}
      <Path d="M165 118 Q142 108 130 112" stroke="#FFCC80" strokeWidth="10" strokeLinecap="round" />
      <Path d="M195 118 Q218 108 230 112" stroke="#FFCC80" strokeWidth="10" strokeLinecap="round" />
      {/* Legs together (jump) */}
      <Path d="M172 138 L168 158" stroke="#FFCC80" strokeWidth="9" strokeLinecap="round" />
      <Path d="M188 138 L192 158" stroke="#FFCC80" strokeWidth="9" strokeLinecap="round" />
      {/* Big smile */}
      <Path d="M172 98 Q180 106 188 98" stroke="#FF6B6B" strokeWidth="2.5" fill="#FFAB91" />
      {/* Eyes (excited/closed from joy) */}
      <Path d="M174 91 Q177 88 180 91" stroke="#555" strokeWidth="2" fill="none" />
      <Path d="M180 91 Q183 88 186 91" stroke="#555" strokeWidth="2" fill="none" />
      {/* Splash drops */}
      <Circle cx="140" cy="130" r="5" fill="#81D4FA" opacity="0.8" />
      <Circle cx="220" cy="128" r="4" fill="#81D4FA" opacity="0.8" />
      <Circle cx="155" cy="122" r="3" fill="#4FC3F7" opacity="0.7" />
      <Circle cx="205" cy="120" r="3" fill="#4FC3F7" opacity="0.7" />
      {/* Mom watching on side */}
      <Circle cx="58" cy="110" r="16" fill="#FFCC80" />
      <Rect x="45" y="126" width="26" height="30" rx="7" fill="#F48FB1" />
      {/* Camera in mom's hand */}
      <Rect x="70" y="108" width="20" height="14" rx="3" fill="#555" />
      <Circle cx="80" cy="115" r="5" fill="#90CAF9" />
      {/* Mom smile */}
      <Path d="M52 118 Q58 124 64 118" stroke="#FF6B6B" strokeWidth="2" fill="none" />
    </Svg>
  );
}
