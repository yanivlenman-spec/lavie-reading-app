import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Vibration } from 'react-native';
import { Delete } from 'lucide-react-native';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
  title?: string;
}

const CORRECT_PIN = '1979';
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'];

export default function PinInput({ onSuccess, onCancel, title = 'מצב הורה 🔐' }: Props) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  function handleKey(key: string) {
    if (key === 'del') {
      setPin((p) => p.slice(0, -1));
      setError(false);
      return;
    }
    if (pin.length >= 4) return;
    const next = pin + key;
    setPin(next);
    if (next.length === 4) {
      if (next === CORRECT_PIN) {
        onSuccess();
      } else {
        Vibration.vibrate(400);
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 600);
      }
    }
  }

  return (
    <View className="flex-1 items-center justify-center bg-bg px-6">
      <Text
        style={{
          fontFamily: 'Heebo_700Bold',
          fontSize: 24,
          color: '#333',
          marginBottom: 32,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>

      {/* Dots */}
      <View style={{ flexDirection: 'row', gap: 16, marginBottom: 40 }}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={{
              width: 18,
              height: 18,
              borderRadius: 9,
              backgroundColor:
                i < pin.length ? (error ? '#FF6B6B' : '#FFD700') : '#CCC',
            }}
          />
        ))}
      </View>

      {/* Keypad */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', width: 240, gap: 12 }}>
        {KEYS.map((key, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => key && handleKey(key)}
            disabled={!key}
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: key ? '#fff' : 'transparent',
              alignItems: 'center',
              justifyContent: 'center',
              elevation: key ? 3 : 0,
              shadowColor: '#000',
              shadowOpacity: key ? 0.1 : 0,
              shadowRadius: 4,
            }}
          >
            {key === 'del' ? (
              <Delete size={22} color="#555" />
            ) : (
              <Text style={{ fontSize: 24, fontWeight: '600', color: '#333' }}>
                {key}
              </Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={onCancel} style={{ marginTop: 32 }}>
        <Text
          style={{
            fontFamily: 'Heebo_400Regular',
            fontSize: 16,
            color: '#888',
          }}
        >
          חזרה
        </Text>
      </TouchableOpacity>
    </View>
  );
}
