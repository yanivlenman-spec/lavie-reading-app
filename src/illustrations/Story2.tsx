import React from 'react';
import Svg, { Rect, Circle, Path, Ellipse, Defs, RadialGradient, Stop } from 'react-native-svg';

export default function Story2Illustration({ width = 360, height = 220 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 360 220">
      {/* Warm indoor background */}
      <Rect width="360" height="220" fill="#FFF8E1" />
      {/* Floor */}
      <Rect x="0" y="175" width="360" height="45" fill="#FFE0B2" />
      {/* Table */}
      <Rect x="80" y="140" width="200" height="14" rx="6" fill="#A0522D" />
      <Rect x="100" y="154" width="12" height="32" rx="4" fill="#8B4513" />
      <Rect x="248" y="154" width="12" height="32" rx="4" fill="#8B4513" />
      {/* Challah bread on table */}
      <Ellipse cx="180" cy="138" rx="38" ry="12" fill="#F9A825" />
      <Path d="M148 138 Q165 128 180 132 Q195 128 212 138" stroke="#E65100" strokeWidth="2.5" fill="none" />
      <Path d="M152 140 Q170 132 180 136 Q190 132 208 140" stroke="#E65100" strokeWidth="1.5" fill="none" opacity="0.6" />
      {/* White tablecloth */}
      <Rect x="78" y="136" width="204" height="6" rx="3" fill="#fff" opacity="0.7" />
      {/* Kiddush cup */}
      <Rect x="238" y="120" width="16" height="20" rx="3" fill="#9E9E9E" />
      <Ellipse cx="246" cy="120" rx="10" ry="4" fill="#BDBDBD" />
      {/* Candles - two lit candles */}
      <Rect x="110" y="90" width="10" height="50" rx="3" fill="#FFFDE7" />
      <Rect x="135" y="90" width="10" height="50" rx="3" fill="#FFFDE7" />
      {/* Flames */}
      <Ellipse cx="115" cy="87" rx="6" ry="10" fill="#FFD700" opacity="0.9" />
      <Ellipse cx="115" cy="85" rx="3" ry="7" fill="#FF6B6B" opacity="0.8" />
      <Ellipse cx="140" cy="87" rx="6" ry="10" fill="#FFD700" opacity="0.9" />
      <Ellipse cx="140" cy="85" rx="3" ry="7" fill="#FF6B6B" opacity="0.8" />
      {/* Candlestick holders */}
      <Ellipse cx="115" cy="141" rx="12" ry="4" fill="#9E9E9E" />
      <Ellipse cx="140" cy="141" rx="12" ry="4" fill="#9E9E9E" />
      {/* Warm glow from candles */}
      <Ellipse cx="127" cy="110" rx="50" ry="30" fill="#FFD700" opacity="0.08" />
      {/* Dad (Yaniv) holding challah/wine */}
      <Circle cx="285" cy="112" r="18" fill="#FFCC80" />
      <Rect x="270" y="130" width="30" height="34" rx="8" fill="#81D4FA" />
      <Path d="M270 140 Q255 132 250 125" stroke="#FFCC80" strokeWidth="9" strokeLinecap="round" />
      <Path d="M285 118 Q290 124 283 128" stroke="#FF6B6B" strokeWidth="2" fill="none" />
      {/* Lavie singing */}
      <Circle cx="62" cy="118" r="16" fill="#FFCC80" />
      <Rect x="49" y="134" width="26" height="30" rx="7" fill="#A5D6A7" />
      <Path d="M55 126 Q62 132 69 126" stroke="#FF6B6B" strokeWidth="2.5" fill="#FFAB91" />
      {/* Music notes from Lavie */}
      <Path d="M74 110 L79 104 L82 108" stroke="#FFD700" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Circle cx="74" cy="112" r="3" fill="#FFD700" />
      <Path d="M83 105 L88 99 L91 103" stroke="#FFD700" strokeWidth="2" fill="none" strokeLinecap="round" />
      <Circle cx="83" cy="107" r="3" fill="#FFD700" />
      {/* Shabbat Shalom text area - subtle */}
      <Ellipse cx="180" cy="32" rx="70" ry="18" fill="#FFF9C4" opacity="0.7" />
      <Path d="M135 32 Q180 22 225 32" stroke="#FFD700" strokeWidth="1.5" fill="none" opacity="0.5" />
    </Svg>
  );
}
