import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { STORIES } from '../data/stories';

const BADGE_DEFS = [
  { id: 'first_story', emoji: '🥇', label: 'סיפור ראשון' },
  { id: 'perfect', emoji: '🏆', label: 'קורא מושלם' },
  { id: 'level_champion', emoji: '👑', label: 'אלוף השלב' },
];

export default function RewardsScreen() {
  const { state } = useApp();

  const totalStars = Object.values(state.storyStars).reduce<number>((s, v) => s + v, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFDE7' }}>
      <ScrollView
        style={{ flex: 1, minHeight: 0 }}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
      >
        {/* Header */}
        <Text style={{ fontFamily: 'Heebo_700Bold', fontSize: 22, color: '#333', textAlign: 'center', marginBottom: 20 }}>
          הפרסים שלי 🏅
        </Text>

        {/* Screen time */}
        <View style={{ backgroundColor: '#fff', borderRadius: 24, padding: 28, alignItems: 'center', marginBottom: 20, elevation: 3, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 8 }}>
          <Text style={{ fontSize: 52 }}>⏱️</Text>
          <Text style={{ fontFamily: 'Heebo_700Bold', fontSize: 52, color: '#FFD700', marginTop: 4 }}>
            {state.totalPoints}
          </Text>
          <Text style={{ fontFamily: 'Heebo_400Regular', fontSize: 17, color: '#666' }}>
            דקות זמן מסך שנצברו
          </Text>
        </View>

        {/* Stars per story */}
        <Text style={{ fontFamily: 'Heebo_700Bold', fontSize: 16, color: '#333', textAlign: 'right', marginBottom: 10 }}>
          כוכבים לפי סיפור ({totalStars} סה״כ):
        </Text>
        <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 20, elevation: 2 }}>
          {STORIES.map((story, i) => {
            const stars = state.storyStars[story.id] ?? 0;
            return (
              <View
                key={story.id}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingVertical: 10,
                  borderBottomWidth: i < STORIES.length - 1 ? 1 : 0,
                  borderBottomColor: '#F5F5F5',
                }}
              >
                <Text style={{ fontSize: 18 }}>
                  {stars > 0
                    ? '★'.repeat(stars) + '☆'.repeat(3 - stars)
                    : '☆☆☆'}
                </Text>
                <Text style={{ fontFamily: 'Heebo_400Regular', fontSize: 14, color: stars > 0 ? '#333' : '#CCC', flex: 1, textAlign: 'right', marginLeft: 8 }}>
                  {story.title}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Badges */}
        <Text style={{ fontFamily: 'Heebo_700Bold', fontSize: 16, color: '#333', textAlign: 'right', marginBottom: 10 }}>
          עיטורים:
        </Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          {BADGE_DEFS.map((badge) => {
            const earned = state.badges.includes(badge.id);
            return (
              <View
                key={badge.id}
                style={{
                  flex: 1,
                  backgroundColor: earned ? '#FFF9C4' : '#F5F5F5',
                  borderRadius: 16,
                  padding: 16,
                  alignItems: 'center',
                  borderWidth: earned ? 2 : 0,
                  borderColor: '#FFD700',
                  opacity: earned ? 1 : 0.5,
                }}
              >
                <Text style={{ fontSize: 36 }}>{earned ? badge.emoji : '❓'}</Text>
                <Text style={{ fontFamily: 'Heebo_400Regular', fontSize: 11, color: '#555', textAlign: 'center', marginTop: 6 }}>
                  {badge.label}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
