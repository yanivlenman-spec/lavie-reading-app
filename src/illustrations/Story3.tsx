import React from 'react';
import Svg, { Rect, Circle, Path, Ellipse } from 'react-native-svg';

export default function Story3Illustration({ width = 360, height = 220 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 360 220">
      {/* Background - playroom */}
      <Rect width="360" height="220" fill="#FFF9E6" />
      {/* Floor */}
      <Rect x="0" y="175" width="360" height="45" fill="#FFE0B2" />
      {/* Ball on floor */}
      <Circle cx="200" cy="175" r="22" fill="#FF6B6B" />
      <Path d="M185 168 Q200 160 215 168" stroke="#fff" strokeWidth="2" fill="none" />
      <Path d="M185 182 Q200 190 215 182" stroke="#fff" strokeWidth="2" fill="none" />
      {/* Lavie (bigger, older - giving ball) */}
      <Circle cx="110" cy="115" r="24" fill="#FFCC80" />
      <Rect x="93" y="139" width="34" height="40" rx="9" fill="#A5D6A7" />
      {/* Lavie's arm reaching out */}
      <Path d="M127 148 Q155 155 175 163" stroke="#FFCC80" strokeWidth="10" strokeLinecap="round" />
      {/* Smile */}
      <Path d="M102 122 Q110 129 118 122" stroke="#FF6B6B" strokeWidth="2" fill="none" />
      {/* Ben (smaller, younger - happy) */}
      <Circle cx="260" cy="128" r="19" fill="#FFCC80" />
      <Rect x="245" y="147" width="30" height="34" rx="8" fill="#81D4FA" />
      {/* Ben's arms up (happy) */}
      <Path d="M245 155 Q228 140 225 130" stroke="#FFCC80" strokeWidth="9" strokeLinecap="round" />
      <Path d="M275 155 Q292 140 295 130" stroke="#FFCC80" strokeWidth="9" strokeLinecap="round" />
      {/* Big smile on Ben */}
      <Path d="M252 135 Q260 143 268 135" stroke="#FF6B6B" strokeWidth="2.5" fill="#FFAB91" />
      {/* "Please" speech bubble from Ben */}
      <Ellipse cx="220" cy="88" rx="38" ry="20" fill="#fff" />
      <Path d="M225 108 L220 120" stroke="#fff" strokeWidth="3" />
      <Path d="M220 120 L215 108" stroke="#fff" strokeWidth="3" />
      <Rect x="188" y="76" width="64" height="24" rx="10" fill="#fff" />
      {/* Stars / sparkles showing happiness */}
      <Path d="M300 90 L303 98 L311 98 L305 103 L307 111 L300 106 L293 111 L295 103 L289 98 L297 98 Z" fill="#FFD700" opacity="0.7" />
      <Path d="M70 80 L72 86 L78 86 L73 90 L75 96 L70 92 L65 96 L67 90 L62 86 L68 86 Z" fill="#FFD700" opacity="0.6" />
    </Svg>
  );
}
