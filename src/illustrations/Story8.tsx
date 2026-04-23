import React from 'react';
import Svg, { Rect, Circle, Path, Ellipse } from 'react-native-svg';

export default function Story8Illustration({ width = 360, height = 220 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 360 220">
      {/* Outdoor/doorway background */}
      <Rect width="360" height="220" fill="#E8F5E9" />
      {/* Ground */}
      <Rect x="0" y="178" width="360" height="42" fill="#C8E6C9" />
      {/* Path/sidewalk */}
      <Rect x="100" y="178" width="160" height="42" fill="#DCEDC8" />
      {/* Door frame */}
      <Rect x="30" y="60" width="90" height="130" rx="6" fill="#8D6E63" />
      <Rect x="36" y="66" width="78" height="120" rx="4" fill="#A5D6A7" />
      {/* Door knob */}
      <Circle cx="106" cy="135" r="5" fill="#FFD700" />
      {/* Orange cat body */}
      <Ellipse cx="200" cy="165" rx="42" ry="28" fill="#FF8F00" />
      {/* Cat head */}
      <Circle cx="232" cy="142" r="26" fill="#FF8F00" />
      {/* Cat ears */}
      <Path d="M218 120 L210 100 L228 118 Z" fill="#FF8F00" />
      <Path d="M246 120 L254 100 L236 118 Z" fill="#FF8F00" />
      {/* Cat ear inner */}
      <Path d="M220 118 L214 104 L226 116 Z" fill="#FFCC80" />
      <Path d="M244 118 L250 104 L238 116 Z" fill="#FFCC80" />
      {/* Cat face */}
      <Circle cx="225" cy="139" r="4" fill="#333" />
      <Circle cx="240" cy="139" r="4" fill="#333" />
      {/* Cat nose */}
      <Path d="M230 146 L233 149 L236 146" fill="#FF6B6B" />
      {/* Whiskers */}
      <Path d="M220 147 L200 143" stroke="#555" strokeWidth="1.5" />
      <Path d="M220 150 L198 150" stroke="#555" strokeWidth="1.5" />
      <Path d="M246 147 L266 143" stroke="#555" strokeWidth="1.5" />
      <Path d="M246 150 L268 150" stroke="#555" strokeWidth="1.5" />
      {/* Cat tail curled */}
      <Path d="M160 170 Q140 155 145 138 Q150 120 165 130" stroke="#FF8F00" strokeWidth="10" fill="none" strokeLinecap="round" />
      {/* Lavie petting the cat */}
      <Circle cx="290" cy="130" r="18" fill="#FFCC80" />
      <Rect x="276" y="148" width="28" height="34" rx="8" fill="#A5D6A7" />
      {/* Lavie's petting arm */}
      <Path d="M276 155 Q255 148 242 142" stroke="#FFCC80" strokeWidth="9" strokeLinecap="round" />
      <Path d="M288 128 Q292 122 286 120" stroke="#FF6B6B" strokeWidth="2" fill="none" />
      {/* Speech bubble meow */}
      <Ellipse cx="195" cy="110" rx="30" ry="18" fill="#fff" />
      <Path d="M200 128 L195 140 L190 128" fill="#fff" />
      <Path d="M183 110 Q195 102 207 110 Q207 118 195 118 Q183 118 183 110 Z" fill="#fff" />
    </Svg>
  );
}
