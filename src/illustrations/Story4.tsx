import React from 'react';
import Svg, { Rect, Circle, Ellipse, Path } from 'react-native-svg';

export default function Story4Illustration({ width = 360, height = 220 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 360 220">
      {/* Sky */}
      <Rect width="360" height="220" fill="#B3E5FC" />
      {/* Clouds */}
      <Ellipse cx="80" cy="40" rx="40" ry="20" fill="#fff" opacity="0.9" />
      <Ellipse cx="110" cy="33" rx="28" ry="18" fill="#fff" opacity="0.9" />
      <Ellipse cx="280" cy="50" rx="36" ry="18" fill="#fff" opacity="0.9" />
      {/* Sun */}
      <Circle cx="320" cy="35" r="24" fill="#FFD700" />
      {/* Grass */}
      <Rect x="0" y="170" width="360" height="50" fill="#A8E6CF" />
      {/* Tree */}
      <Rect x="280" y="120" width="16" height="60" fill="#8B4513" />
      <Circle cx="288" cy="110" r="38" fill="#66BB6A" />
      {/* Ball */}
      <Circle cx="200" cy="160" r="18" fill="#FF6B6B" />
      <Path d="M186 155 Q200 148 214 155" stroke="#fff" strokeWidth="2" fill="none" />
      {/* Dad running with Lavie */}
      <Circle cx="120" cy="130" r="20" fill="#FFCC80" />
      <Rect x="104" y="150" width="32" height="32" rx="8" fill="#81D4FA" />
      {/* Lavie smaller */}
      <Circle cx="155" cy="138" r="15" fill="#FFCC80" />
      <Rect x="143" y="153" width="24" height="26" rx="6" fill="#A5D6A7" />
      {/* Ari crouching, looking at bug */}
      <Circle cx="280" cy="170" r="14" fill="#FFCC80" />
      <Rect x="268" y="183" width="24" height="20" rx="5" fill="#FFB74D" />
      {/* Tiny ladybug */}
      <Circle cx="310" cy="178" r="6" fill="#FF6B6B" />
      <Circle cx="313" cy="176" r="2" fill="#333" />
      <Path d="M307 178 L313 178" stroke="#333" strokeWidth="1" />
    </Svg>
  );
}
