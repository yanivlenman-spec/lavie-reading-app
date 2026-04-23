import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { Star } from 'lucide-react-native';

export type NodeStatus = 'locked' | 'unread' | 'completed';

interface Props {
  storyNumber: number;
  title: string;
  status: NodeStatus;
  stars: 0 | 1 | 2 | 3;
  onPress: () => void;
}

const STATUS_COLOR: Record<NodeStatus, string> = {
  locked: '#B0BEC5',
  unread: '#29B6F6',
  completed: '#66BB6A',
};

const STATUS_BORDER: Record<NodeStatus, string> = {
  locked: '#90A4AE',
  unread: '#0288D1',
  completed: '#388E3C',
};

export const NODE_D = 76;

export default function StoryNode({ storyNumber, title, status, stars, onPress }: Props) {
  const bg = STATUS_COLOR[status];
  const border = STATUS_BORDER[status];
  const isLocked = status === 'locked';

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLocked}
      activeOpacity={0.8}
      style={{ alignItems: 'center' }}
    >
      {/* Main circle */}
      <View
        style={{
          width: NODE_D,
          height: NODE_D,
          borderRadius: NODE_D / 2,
          backgroundColor: bg,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 3,
          borderColor: border,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 6,
          elevation: 5,
        }}
      >
        {/* Story number - top half */}
        <Text
          style={{
            fontFamily: 'Heebo_700Bold',
            fontSize: 28,
            color: '#fff',
            lineHeight: 32,
            marginTop: isLocked ? 0 : -4,
          }}
        >
          {isLocked ? '🔒' : storyNumber}
        </Text>
      </View>

      {/* Stars */}
      <View style={{ flexDirection: 'row', marginTop: 5, gap: 1 }}>
        {[1, 2, 3].map((i) => (
          <Star
            key={i}
            size={14}
            color={i <= stars ? '#FFD700' : '#DDD'}
            fill={i <= stars ? '#FFD700' : 'transparent'}
          />
        ))}
      </View>

      {/* Title */}
      <Text
        style={{
          fontFamily: 'Heebo_400Regular',
          fontSize: 10,
          color: isLocked ? '#AAA' : '#444',
          marginTop: 2,
          textAlign: 'center',
          maxWidth: NODE_D + 20,
        }}
        numberOfLines={1}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
