import React from 'react';
import Svg, { Rect, Circle, Path, Ellipse } from 'react-native-svg';

export default function Story7Illustration({ width = 360, height = 220 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 360 220">
      {/* Kitchen background */}
      <Rect width="360" height="220" fill="#FFF8E1" />
      {/* Wall tiles */}
      <Rect x="0" y="0" width="360" height="100" fill="#FFF3E0" />
      {/* Floor */}
      <Rect x="0" y="175" width="360" height="45" fill="#FFCC80" opacity="0.5" />
      {/* Table */}
      <Ellipse cx="180" cy="168" rx="150" ry="18" fill="#A0522D" />
      <Rect x="60" y="168" width="240" height="12" rx="4" fill="#8B4513" />
      {/* Bread loaf */}
      <Ellipse cx="130" cy="155" rx="35" ry="14" fill="#F9A825" />
      <Path d="M100 155 Q130 140 160 155" stroke="#E65100" strokeWidth="2" fill="none" />
      {/* Cheese slice */}
      <Rect x="165" y="148" width="30" height="20" rx="3" fill="#FDD835" transform="rotate(-5 165 148)" />
      {/* Glass of milk */}
      <Rect x="235" y="138" width="22" height="30" rx="4" fill="#E3F2FD" />
      <Ellipse cx="246" cy="138" rx="11" ry="4" fill="#BBDEFB" />
      <Ellipse cx="246" cy="168" rx="11" ry="4" fill="#90CAF9" />
      {/* Yogurt cup */}
      <Rect x="272" y="145" width="28" height="25" rx="6" fill="#fff" />
      <Ellipse cx="286" cy="145" rx="14" ry="5" fill="#F8BBD0" />
      {/* Mom (Yafat) */}
      <Circle cx="55" cy="120" r="18" fill="#FFCC80" />
      <Rect x="40" y="138" width="30" height="36" rx="8" fill="#F48FB1" />
      <Path d="M48 128 Q55 134 62 128" stroke="#FF6B6B" strokeWidth="2" fill="none" />
      {/* Lavie eating */}
      <Circle cx="230" cy="118" r="17" fill="#FFCC80" />
      <Rect x="216" y="135" width="28" height="34" rx="7" fill="#A5D6A7" />
      <Path d="M222 126 Q230 132 238 126" stroke="#FF6B6B" strokeWidth="2.5" fill="#FFAB91" />
      {/* Fork in Lavie's hand */}
      <Path d="M215 130 L205 145" stroke="#9E9E9E" strokeWidth="3" strokeLinecap="round" />
      {/* Steam from food */}
      <Path d="M130 136 Q133 126 130 116" stroke="#CCC" strokeWidth="2" fill="none" opacity="0.7" />
      <Path d="M138 136 Q141 126 138 116" stroke="#CCC" strokeWidth="2" fill="none" opacity="0.5" />
    </Svg>
  );
}
