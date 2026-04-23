import React from 'react';
import { View, Text } from 'react-native';

interface Props {
  label: string;
  value: string | number;
  emoji: string;
  bgColor: string;
}

export default function StatCard({ label, value, emoji, bgColor }: Props) {
  return (
    <View
      className="flex-1 rounded-3xl p-4 m-2 items-center justify-center"
      style={{ backgroundColor: bgColor, minHeight: 100 }}
    >
      <Text style={{ fontSize: 32 }}>{emoji}</Text>
      <Text
        style={{
          fontFamily: 'Heebo_700Bold',
          fontSize: 26,
          color: '#333',
          marginTop: 4,
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontFamily: 'Heebo_400Regular',
          fontSize: 13,
          color: '#555',
          textAlign: 'center',
          marginTop: 2,
        }}
      >
        {label}
      </Text>
    </View>
  );
}
