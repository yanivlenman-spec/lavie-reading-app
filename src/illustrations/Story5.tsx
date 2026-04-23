import React from 'react';
import Svg, { Rect, Circle, Ellipse, Path, Defs, RadialGradient, Stop } from 'react-native-svg';

export default function Story5Illustration({ width = 360, height = 220 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 360 220">
      <Defs>
        <RadialGradient id="nightSky" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#3F51B5" />
          <Stop offset="100%" stopColor="#1A237E" />
        </RadialGradient>
      </Defs>
      {/* Night background */}
      <Rect width="360" height="220" fill="url(#nightSky)" />
      {/* Moon */}
      <Circle cx="300" cy="45" r="28" fill="#FFF9C4" />
      <Circle cx="315" cy="38" r="22" fill="#3F51B5" />
      {/* Stars */}
      {[[50, 30], [140, 20], [200, 40], [250, 15], [80, 60], [170, 55]].map(([x, y], i) => (
        <Circle key={i} cx={x} cy={y} r="3" fill="#FFD700" opacity="0.9" />
      ))}
      {/* Bed */}
      <Rect x="40" y="140" width="280" height="70" rx="10" fill="#5C6BC0" />
      <Rect x="40" y="130" width="280" height="20" rx="6" fill="#7986CB" />
      {/* Pillow */}
      <Ellipse cx="180" cy="142" rx="60" ry="14" fill="#E8EAF6" />
      {/* Blanket */}
      <Rect x="50" y="155" width="260" height="50" rx="8" fill="#9FA8DA" />
      {/* Lavie in bed, eyes closed */}
      <Circle cx="180" cy="138" r="22" fill="#FFCC80" />
      {/* Closed eyes */}
      <Path d="M171 135 Q175 132 179 135" stroke="#555" strokeWidth="2" fill="none" />
      <Path d="M181 135 Q185 132 189 135" stroke="#555" strokeWidth="2" fill="none" />
      {/* Small smile */}
      <Path d="M174 143 Q180 148 186 143" stroke="#FF6B6B" strokeWidth="1.5" fill="none" />
      {/* Mom and Dad silhouettes */}
      <Circle cx="80" cy="128" r="16" fill="#3949AB" />
      <Rect x="66" y="144" width="28" height="10" rx="4" fill="#3949AB" />
      <Circle cx="280" cy="128" r="16" fill="#3949AB" />
      <Rect x="266" y="144" width="28" height="10" rx="4" fill="#3949AB" />
      {/* Dream cloud */}
      <Ellipse cx="240" cy="70" rx="36" ry="20" fill="#fff" opacity="0.3" />
      <Ellipse cx="258" cy="62" rx="22" ry="15" fill="#fff" opacity="0.3" />
      <Path d="M205 88 Q215 80 220 75" stroke="#fff" strokeWidth="2" opacity="0.4" fill="none" />
    </Svg>
  );
}
