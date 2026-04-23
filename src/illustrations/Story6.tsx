import React from 'react';
import Svg, { Rect, Circle, Path, Line } from 'react-native-svg';

export default function Story6Illustration({ width = 360, height = 220 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 360 220">
      {/* Classroom background */}
      <Rect width="360" height="220" fill="#E8F4FD" />
      {/* Floor */}
      <Rect x="0" y="178" width="360" height="42" fill="#FFECB3" />
      {/* Blackboard */}
      <Rect x="50" y="30" width="260" height="100" rx="6" fill="#2E7D32" />
      <Rect x="55" y="35" width="250" height="90" rx="4" fill="#388E3C" />
      {/* Letters on board (aleph, bet, gimel) */}
      <Path d="M100 60 Q110 50 120 60 L115 80 L105 80 Z" fill="#fff" opacity="0.9" />
      <Path d="M145 55 L145 80 Q155 80 160 70 Q160 60 150 58 Z" fill="#fff" opacity="0.9" />
      <Path d="M178 55 L178 80 L195 80 L195 75 L183 75 L183 67 L192 67 L192 62 L183 62 L183 55 Z" fill="#fff" opacity="0.9" />
      {/* Teacher figure */}
      <Circle cx="38" cy="115" r="15" fill="#FFCC80" />
      <Rect x="26" y="130" width="24" height="32" rx="6" fill="#5C6BC0" />
      {/* Pointer arm */}
      <Path d="M50 138 L80 85" stroke="#FFCC80" strokeWidth="8" strokeLinecap="round" />
      {/* Lavie at desk - raising hand */}
      <Circle cx="220" cy="148" r="16" fill="#FFCC80" />
      <Rect x="207" y="164" width="26" height="28" rx="7" fill="#A5D6A7" />
      {/* Raised hand */}
      <Path d="M220 148 L220 118" stroke="#FFCC80" strokeWidth="9" strokeLinecap="round" />
      <Circle cx="220" cy="115" r="7" fill="#FFCC80" />
      {/* Desk */}
      <Rect x="190" y="185" width="70" height="10" rx="3" fill="#A0522D" />
      <Rect x="195" y="195" width="8" height="20" rx="2" fill="#8B4513" />
      <Rect x="252" y="195" width="8" height="20" rx="2" fill="#8B4513" />
      {/* Noam at desk */}
      <Circle cx="290" cy="150" r="14" fill="#FFCC80" />
      <Rect x="279" y="164" width="22" height="26" rx="6" fill="#81D4FA" />
      {/* Star sparkle near Lavie's hand */}
      <Path d="M235 108 L237 103 L239 108 L244 108 L240 112 L242 117 L237 113 L232 117 L234 112 L230 108 Z" fill="#FFD700" opacity="0.9" />
    </Svg>
  );
}
