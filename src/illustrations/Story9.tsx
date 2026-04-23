import React from 'react';
import Svg, { Rect, Circle, Path, Ellipse } from 'react-native-svg';

export default function Story9Illustration({ width = 360, height = 220 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 360 220">
      {/* Sky */}
      <Rect width="360" height="220" fill="#E3F2FD" />
      {/* Grass field */}
      <Rect x="0" y="160" width="360" height="60" fill="#66BB6A" />
      <Rect x="0" y="155" width="360" height="12" fill="#81C784" />
      {/* Goal post (left) */}
      <Rect x="20" y="100" width="6" height="70" rx="2" fill="#fff" />
      <Rect x="26" y="100" width="60" height="6" rx="2" fill="#fff" />
      <Rect x="80" y="100" width="6" height="70" rx="2" fill="#fff" />
      {/* Goal net */}
      <Path d="M26 106 L80 106" stroke="#CCC" strokeWidth="1" />
      <Path d="M26 116 L80 116" stroke="#CCC" strokeWidth="1" />
      <Path d="M26 126 L80 126" stroke="#CCC" strokeWidth="1" />
      <Path d="M26 136 L80 136" stroke="#CCC" strokeWidth="1" />
      <Path d="M38 106 L26 170" stroke="#CCC" strokeWidth="1" />
      <Path d="M50 106 L38 170" stroke="#CCC" strokeWidth="1" />
      <Path d="M62 106 L50 170" stroke="#CCC" strokeWidth="1" />
      <Path d="M74 106 L62 170" stroke="#CCC" strokeWidth="1" />
      {/* Ball in net (scored!) */}
      <Circle cx="52" cy="148" r="14" fill="#fff" />
      <Path d="M52 134 L48 144 L40 144 L46 151 L43 161 L52 155 L61 161 L58 151 L64 144 L56 144 Z" fill="#333" opacity="0.15" />
      {/* Lavie running/kicking */}
      <Circle cx="240" cy="118" r="20" fill="#FFCC80" />
      <Rect x="226" y="138" width="28" height="34" rx="7" fill="#FF6B6B" />
      {/* Running legs */}
      <Path d="M233 172 L225 200" stroke="#FFCC80" strokeWidth="10" strokeLinecap="round" />
      <Path d="M247 172 L260 195" stroke="#FFCC80" strokeWidth="10" strokeLinecap="round" />
      {/* Kicking arm */}
      <Path d="M226 145 L200 135" stroke="#FFCC80" strokeWidth="9" strokeLinecap="round" />
      <Path d="M254 145 L280 130" stroke="#FFCC80" strokeWidth="9" strokeLinecap="round" />
      {/* Big smile */}
      <Path d="M232 126 Q240 134 248 126" stroke="#FF6B6B" strokeWidth="2.5" fill="#FFAB91" />
      {/* Motion lines from kick */}
      <Path d="M200 148 L170 152" stroke="#4FC3F7" strokeWidth="2.5" strokeDasharray="5,3" />
      <Path d="M198 140 L168 138" stroke="#4FC3F7" strokeWidth="2" strokeDasharray="4,3" />
      {/* Goal text effect */}
      <Path d="M290 80 Q310 65 300 85" stroke="#FFD700" strokeWidth="3" fill="none" />
      <Path d="M310 75 Q330 60 320 80" stroke="#FFD700" strokeWidth="3" fill="none" />
    </Svg>
  );
}
