import React from 'react';
import { View, Text, ScrollView, Dimensions, ImageBackground, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { Path as SvgPath } from 'react-native-svg';
import { useApp } from '../context/AppContext';
import StoryNode, { NODE_D, NodeStatus } from '../components/StoryNode';
import { STORIES } from '../data/stories';
import { RootStackParamList } from '../navigation/RootNavigator';

const readBannerImage = require('../../assets/read-series-top-banner.webp');

type Nav = StackNavigationProp<RootStackParamList, 'MainTabs'>;

// ── Layout constants ───────────────────────────────────────────────────────────
const NODE_R = NODE_D / 2;
const ROW_H = 125; // vertical distance between node centers
const EP1_TOP = 20; // top padding inside episode section
const ZIGZAG_X_RATIO = [0.72, 0.50, 0.28, 0.50, 0.72, 0.50, 0.28, 0.50, 0.72, 0.50];

const EP1_STORIES = STORIES.filter((s) => s.episode === 1);

export default function MapScreen() {
  const navigation = useNavigation<Nav>();
  const { state } = useApp();
  const { width: screenWidth } = useWindowDimensions();

  const CONTENT_W = Math.min(screenWidth, 420);
  const nodeX = (i: number) => ZIGZAG_X_RATIO[i % ZIGZAG_X_RATIO.length] * CONTENT_W;
  const nodeY = (i: number) => EP1_TOP + i * ROW_H + NODE_R;
  const EP1_SVG_H = EP1_TOP + EP1_STORIES.length * ROW_H + NODE_R + 60;

  const curvePath = (i: number): string => {
    const x1 = nodeX(i);
    const y1 = nodeY(i) + NODE_R + 2;
    const x2 = nodeX(i + 1);
    const y2 = nodeY(i + 1) - NODE_R - 2;
    const gap = y2 - y1;
    return `M ${x1} ${y1} C ${x1} ${y1 + gap * 0.45}, ${x2} ${y2 - gap * 0.45}, ${x2} ${y2}`;
  };

  function storyStatus(storyId: string): NodeStatus {
    if (!state.unlockedStories.includes(storyId)) return 'locked';
    return (state.storyStars[storyId] ?? 0) > 0 ? 'completed' : 'unread';
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ADDFFF' }}>
      {/* Header */}
      <View style={{ alignItems: 'center', paddingVertical: 12 }}>
        <Text style={{ fontFamily: 'Heebo_700Bold', fontSize: 20, color: '#fff' }}>
          מפת ההרפתקאות 🗺️
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1, minHeight: 0 }}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 60 }}
      >
        {/* ── Episode 1 ────────────────────────────────────────────────────────── */}
        <EpisodeBanner
          id={1} episodeNum="פרק 1" storyTitle="החתול המדבר והטירה המסתורית" color="#FF9800"
          earnedStars={EP1_STORIES.reduce((s, st) => s + (state.storyStars[st.id] ?? 0), 0)}
          requiredStars={EP1_STORIES.length * 2}
        />

        {/* Zigzag map with SVG curves */}
        <View style={{ width: CONTENT_W, height: EP1_SVG_H, position: 'relative' }}>
          {/* Curved path SVG layer */}
          <Svg
            width={CONTENT_W}
            height={EP1_SVG_H}
            style={{ position: 'absolute', top: 0, left: 0 }}
          >
            {EP1_STORIES.map((story, i) => {
              if (i >= EP1_STORIES.length - 1) return null;
              const status = storyStatus(story.id);
              const nextStatus = storyStatus(EP1_STORIES[i + 1].id);
              const done = status === 'completed';
              const color = done ? '#FFD700' : nextStatus !== 'locked' ? '#81D4FA' : '#546E7A';
              return (
                <SvgPath
                  key={story.id}
                  d={curvePath(i)}
                  stroke={color}
                  strokeWidth={7}
                  strokeLinecap="round"
                  fill="none"
                />
              );
            })}
          </Svg>

          {/* Story nodes */}
          {EP1_STORIES.map((story, i) => {
            const status = storyStatus(story.id);
            const stars = (state.storyStars[story.id] ?? 0) as 0 | 1 | 2 | 3;
            const cx = nodeX(i);
            const cy = nodeY(i);
            return (
              <View
                key={story.id}
                style={{
                  position: 'absolute',
                  top: cy - NODE_R,
                  left: cx - NODE_R,
                  width: NODE_D + 24,
                  marginLeft: -12,
                  alignItems: 'center',
                }}
              >
                <StoryNode
                  storyNumber={i + 1}
                  title={story.title}
                  status={status}
                  stars={stars}
                  onPress={() => navigation.navigate('Story', { storyId: story.id })}
                />
              </View>
            );
          })}
        </View>

        {/* ── Episode 2 (locked) ───────────────────────────────────────────────── */}
        <EpisodeBanner id={2} storyTitle="פרק 2 — משפחה" color="#4FC3F7" locked earnedStars={0} requiredStars={20} />
        <LockedEpisodeGrid count={10} color="#4FC3F7" />

        {/* ── Episode 3 (locked) ───────────────────────────────────────────────── */}
        <EpisodeBanner id={3} storyTitle="פרק 3 — אמנות" color="#CE93D8" locked earnedStars={0} requiredStars={20} />
        <LockedEpisodeGrid count={10} color="#CE93D8" />
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Episode banner ─────────────────────────────────────────────────────────────
function EpisodeBanner({ episodeNum, storyTitle, color, locked, earnedStars, requiredStars }: {
  id: number; episodeNum?: string; storyTitle?: string; color: string; locked?: boolean;
  earnedStars: number; requiredStars: number;
}) {
  const progress = Math.min(earnedStars / requiredStars, 1);
  const done = earnedStars >= requiredStars;

  if (locked) {
    return (
      <View
        style={{
          width: '90%',
          backgroundColor: '#37474F',
          borderRadius: 20,
          paddingVertical: 14,
          paddingHorizontal: 20,
          alignItems: 'center',
          marginVertical: 14,
          borderWidth: 2,
          borderColor: color,
          opacity: 0.85,
        }}
      >
        <Text style={{ fontSize: 28, marginBottom: 4 }}>🔒</Text>
        <Text style={{ fontFamily: 'Heebo_700Bold', fontSize: 18, color: '#fff' }}>
          {storyTitle}
        </Text>
        <Text style={{ fontFamily: 'Heebo_400Regular', fontSize: 13, color: '#CCC', marginTop: 4 }}>
          סיים את הפרק הקודם כדי לפתוח!
        </Text>
      </View>
    );
  }

  return (
    <View style={{ marginVertical: 14, width: '90%' }}>
      <ImageBackground
        source={readBannerImage}
        style={{
          width: '100%',
          height: 140,
          paddingVertical: 16,
          paddingHorizontal: 20,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        imageStyle={{ resizeMode: 'contain' }}
      >
        <View style={{ alignItems: 'center' }}>
          {episodeNum && <Text style={{ fontFamily: 'Heebo_700Bold', fontSize: 16, color: '#000', textAlign: 'center' }}>{episodeNum}</Text>}
          {storyTitle && <Text style={{ fontFamily: 'Heebo_700Bold', fontSize: 16, color: '#000', textAlign: 'center' }}>{storyTitle}</Text>}
        </View>
      </ImageBackground>
      <View style={{ paddingHorizontal: 20, paddingVertical: 12, backgroundColor: 'rgba(0,0,0,0.1)' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={{ fontFamily: 'Heebo_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.9)' }}>
            {done ? '✅ הושלם!' : `${earnedStars} / ${requiredStars} ⭐`}
          </Text>
        </View>
        <View style={{ height: 8, backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 4, overflow: 'hidden' }}>
          <View style={{ height: 8, width: `${progress * 100}%` as any, backgroundColor: done ? '#76FF03' : '#FFD700', borderRadius: 4 }} />
        </View>
      </View>
    </View>
  );
}

// ── Locked episode node grid ───────────────────────────────────────────────────
function LockedEpisodeGrid({ count, color }: { count: number; color: string }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 10,
        paddingHorizontal: 20,
        marginBottom: 8,
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={{
            width: 52,
            height: 52,
            borderRadius: 26,
            backgroundColor: '#37474F',
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 2,
            borderColor: color,
            opacity: 0.5,
          }}
        >
          <Text style={{ fontFamily: 'Heebo_700Bold', fontSize: 16, color: '#90A4AE' }}>
            {i + 1}
          </Text>
        </View>
      ))}
    </View>
  );
}
