import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, StatusBar, ImageBackground, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Lock, LockOpen } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useApp } from '../context/AppContext';
import StatCard from '../components/StatCard';
import PinInput from '../components/PinInput';
import { STORIES } from '../data/stories';
import { RootStackParamList } from '../navigation/RootNavigator';

const LAUNCH_DATE = new Date('2026-04-22');
const DAY_NAMES = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

function getDaysSinceLaunch(): number {
  const now = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((now.getTime() - LAUNCH_DATE.getTime()) / msPerDay) + 1;
}

function getCurrentEpisode(storyStars: Record<string, number>): number {
  for (let ep = 1; ; ep++) {
    const epStories = STORIES.filter((s) => s.episode === ep);
    if (epStories.length === 0) return ep - 1; // no more episodes
    const required = epStories.length * 2;
    const earned = epStories.reduce((sum, s) => sum + (storyStars[s.id] ?? 0), 0);
    if (earned < required) return ep; // not completed, this is current
  }
}

function getStarsNeeded(episodeId: number, storyStars: Record<string, number>): number {
  const epStories = STORIES.filter((s) => s.episode === episodeId);
  const required = epStories.length * 2;
  const earned = epStories.reduce((sum, s) => sum + (storyStars[s.id] ?? 0), 0);
  return Math.max(0, required - earned);
}

const DIFFICULTY_LABEL: Record<number, string> = { 1: 'קל ⭐', 2: 'בינוני ⭐⭐', 3: 'מאתגר ⭐⭐⭐' };

function fmtTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}:${String(s).padStart(2, '0')} דק'` : `${s} שנ'`;
}

function getStoryToContinue(currentEpisodeId: number, storyStars: Record<string, number>): { type: 'continue'; story: typeof STORIES[0]; storyNumber: number; stars: number } | { type: 'suggest'; story: typeof STORIES[0]; episodeId: number } | null {
  const epStories = STORIES.filter((s) => s.episode === currentEpisodeId).sort((a, b) => {
    const aId = a.id;
    const bId = b.id;
    return aId.localeCompare(bId);
  });

  // Check if there's an incomplete story in current episode
  for (let i = 0; i < epStories.length; i++) {
    const stars = storyStars[epStories[i].id] ?? 0;
    if (stars < 3) {
      return { type: 'continue', story: epStories[i], storyNumber: i + 1, stars };
    }
  }

  // All stories in current episode complete — find story with least stars
  const allIncomplete = STORIES.filter((s) => (storyStars[s.id] ?? 0) < 3);
  if (allIncomplete.length === 0) return null; // all stories complete

  // Sort by: fewest stars, then lowest difficulty
  const suggested = allIncomplete.sort((a, b) => {
    const starsA = storyStars[a.id] ?? 0;
    const starsB = storyStars[b.id] ?? 0;
    if (starsA !== starsB) return starsA - starsB;
    return a.difficulty - b.difficulty;
  })[0];

  return { type: 'suggest', story: suggested, episodeId: suggested.episode };
}

type Nav = StackNavigationProp<RootStackParamList, 'MainTabs'>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { state, deductPoints, resetAll, isTestMode, enableTestMode, disableTestMode } = useApp();
  const [parentMode, setParentMode] = useState<'locked' | 'pin' | 'open'>('locked');
  const [showTestPin, setShowTestPin] = useState(false);
  const [deductAmount, setDeductAmount] = useState('');

  function handleReset() {
    if (window.confirm('האם אתה בטוח? כל הנתונים של לביא יאופסו.')) {
      resetAll();
      setParentMode('locked');
      window.alert('✅ כל הנתונים אופסו בהצלחה.');
    }
  }

  const totalStars = Object.values(state.storyStars).reduce<number>((sum, s) => sum + s, 0);
  const today = new Date();
  const dayName = DAY_NAMES[today.getDay()];
  const daysSinceLaunch = getDaysSinceLaunch();
  const currentEpisode = getCurrentEpisode(state.storyStars);
  const starsNeeded = getStarsNeeded(currentEpisode, state.storyStars);
  const storyToContinue = getStoryToContinue(currentEpisode, state.storyStars);

  function handleDeduct() {
    const amount = parseInt(deductAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      window.alert('שגיאה: אנא הכנס מספר חיובי');
      return;
    }
    if (amount > state.totalPoints) {
      window.alert(`שגיאה: אין מספיק זמן מסך (יש ${state.totalPoints} דקות)`);
      return;
    }
    deductPoints(amount);
    setDeductAmount('');
    window.alert(`✅ נוכו ${amount} דקות. נשאר: ${state.totalPoints - amount} דקות`);
  }

  if (parentMode === 'pin') {
    return (
      <PinInput
        onSuccess={() => setParentMode('open')}
        onCancel={() => setParentMode('locked')}
      />
    );
  }
  if (showTestPin) {
    return (
      <PinInput
        title="מצב בדיקה 🧪"
        onSuccess={() => { enableTestMode(); setShowTestPin(false); }}
        onCancel={() => setShowTestPin(false)}
      />
    );
  }

  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Math.min(Dimensions.get('window').width, 480);
  // Image is 941x1672 — scale to fit screen width, maintain aspect ratio
  const imageAspectRatio = 941 / 1672;
  const scaledHeight = screenWidth / imageAspectRatio;

  return (
    <ImageBackground
      source={require('../../assets/Lavie-reading-app-background-941x1672.webp')}
      resizeMode="cover"
      style={{ width: screenWidth, height: Math.max(scaledHeight, screenHeight), flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <StatusBar backgroundColor="transparent" barStyle="dark-content" />

        <ScrollView style={{ flex: 1, minHeight: 0, backgroundColor: 'transparent' }} contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>
        {/* Header */}
        <View style={{ backgroundColor: 'transparent', borderRadius: 16, padding: 16, marginBottom: 16 }}>
          <Text style={{ fontFamily: 'Heebo_400Regular', fontSize: 13, color: '#000', textAlign: 'right' }}>
            יום {dayName} · יום {daysSinceLaunch}
          </Text>
          <Text style={{ fontFamily: 'Heebo_700Bold', fontSize: 28, color: '#222', textAlign: 'right', marginTop: 4 }}>
            היי, לביא 👋
          </Text>
          <Text style={{ fontFamily: 'Heebo_400Regular', fontSize: 15, color: '#444', textAlign: 'right', marginTop: 6 }}>
            {starsNeeded > 0
              ? `חסרים לך עוד ${starsNeeded} כוכבים להשלמת פרק ${currentEpisode}`
              : `פרק ${currentEpisode} הושלם! 🎉`}
          </Text>
        </View>

        {/* Continue reading / Suggest story banner */}
        {storyToContinue && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Story', { storyId: storyToContinue.story.id })}
            activeOpacity={0.8}
            style={{ backgroundColor: '#fff', borderRadius: 16, padding: 14, marginBottom: 16, flexDirection: 'row', alignItems: 'center', gap: 12, elevation: 2 }}
          >
            <View style={{ flex: 1 }}>
              {storyToContinue.type === 'continue' ? (
                <>
                  <Text style={{ fontFamily: 'Heebo_400Regular', fontSize: 11, color: '#999', textAlign: 'right' }}>
                    המשך קריאה
                  </Text>
                  <Text style={{ fontFamily: 'Heebo_700Bold', fontSize: 15, color: '#333', textAlign: 'right', marginTop: 4, marginBottom: 8 }}>
                    {storyToContinue.story.title}
                  </Text>
                  <View style={{ height: 6, backgroundColor: '#E0E0E0', borderRadius: 3, overflow: 'hidden', marginBottom: 6 }}>
                    <View style={{ height: 6, width: `${(storyToContinue.stars / 3) * 100}%`, backgroundColor: '#FFD700', borderRadius: 3 }} />
                  </View>
                  <Text style={{ fontFamily: 'Heebo_400Regular', fontSize: 11, color: '#888', textAlign: 'right' }}>
                    {Math.round((storyToContinue.stars / 3) * 100)}% · סיפור {storyToContinue.storyNumber}
                  </Text>
                </>
              ) : (
                <>
                  <Text style={{ fontFamily: 'Heebo_400Regular', fontSize: 11, color: '#999', textAlign: 'right' }}>
                    קרא עוד מסדרה {storyToContinue.episodeId}
                  </Text>
                  <Text style={{ fontFamily: 'Heebo_700Bold', fontSize: 15, color: '#333', textAlign: 'right', marginTop: 4, marginBottom: 8 }}>
                    {storyToContinue.story.title}
                  </Text>
                  <Text style={{ fontFamily: 'Heebo_400Regular', fontSize: 11, color: '#888', textAlign: 'right' }}>
                    {DIFFICULTY_LABEL[storyToContinue.story.difficulty]}
                  </Text>
                </>
              )}
            </View>
            <View style={{ width: 60, height: 80, backgroundColor: '#F5F5F5', borderRadius: 8, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ fontSize: 36 }}>📖</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Stats grid */}
        <View style={{ marginBottom: 8 }}>
          <View style={{ flexDirection: 'row' }}>
            <StatCard label="רצף ימים" value={`${state.streakDays} 🔥`} emoji="📅" bgColor="#FFE0B2" />
            <StatCard label="זמן מסך שנצבר" value={`${state.totalPoints} דק'`} emoji="⏱️" bgColor="#B3E5FC" />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <StatCard label="סיפורים שהושלמו" value={state.storiesCompleted} emoji="📖" bgColor="#C8E6C9" />
            <StatCard label="כוכבים שנאספו" value={totalStars} emoji="⭐" bgColor="#F8BBD0" />
          </View>
        </View>

        {/* Lock buttons — shown only when neither mode is active */}
        {parentMode === 'locked' && !isTestMode && (
          <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 28, marginTop: 12 }}>
            <TouchableOpacity
              onPress={() => setParentMode('pin')}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10 }}
            >
              <Lock size={15} color="#AAA" />
              <Text style={{ fontFamily: 'Heebo_400Regular', fontSize: 13, color: '#AAA' }}>מצב הורה</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowTestPin(true)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10 }}
            >
              <Lock size={15} color="#AAA" />
              <Text style={{ fontFamily: 'Heebo_400Regular', fontSize: 13, color: '#AAA' }}>מצב בדיקה</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Test mode active — disable button (driven by context, survives tab navigation) */}
        {isTestMode && (
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
            <TouchableOpacity
              onPress={disableTestMode}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10 }}
            >
              <LockOpen size={15} color="#FF9800" />
              <Text style={{ fontFamily: 'Heebo_400Regular', fontSize: 13, color: '#FF9800' }}>כבה מצב בדיקה</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Parent mode panel */}
        {parentMode === 'open' && (
          <>
            {/* Panel header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, marginBottom: 12 }}>
              <TouchableOpacity
                onPress={() => setParentMode('locked')}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
              >
                <LockOpen size={16} color="#888" />
                <Text style={{ fontFamily: 'Heebo_400Regular', fontSize: 13, color: '#888' }}>נעל מחדש</Text>
              </TouchableOpacity>
              <Text style={{ fontFamily: 'Heebo_700Bold', fontSize: 17, color: '#333' }}>
                מצב הורה 👨‍👩‍👧‍👦
              </Text>
            </View>

            {/* Per-story stats */}
            <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 16, marginBottom: 20, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6 }}>
              {STORIES.map((story, i) => {
                const stats = state.storyStats[story.id];
                const stars = state.storyStars[story.id] ?? 0;
                return (
                  <View key={story.id} style={{ borderBottomWidth: i < STORIES.length - 1 ? 1 : 0, borderBottomColor: '#F0F0F0', paddingVertical: 12 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <Text style={{ fontFamily: 'Heebo_400Regular', fontSize: 11, color: '#999' }}>
                        {DIFFICULTY_LABEL[story.difficulty]}
                      </Text>
                      <Text style={{ fontFamily: 'Heebo_700Bold', fontSize: 14, color: '#333', textAlign: 'right', flex: 1, marginLeft: 8 }}>
                        {story.title}
                      </Text>
                    </View>
                    {stats ? (
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ alignItems: 'center', flex: 1 }}>
                          <Text style={{ fontFamily: 'Heebo_700Bold', fontSize: 15, color: '#4CAF50' }}>{fmtTime(stats.timeSeconds)}</Text>
                          <Text style={{ fontFamily: 'Heebo_400Regular', fontSize: 10, color: '#888' }}>זמן</Text>
                        </View>
                        <View style={{ alignItems: 'center', flex: 1 }}>
                          <Text style={{ fontFamily: 'Heebo_700Bold', fontSize: 15, color: '#FF6B6B' }}>{stats.wpm}</Text>
                          <Text style={{ fontFamily: 'Heebo_400Regular', fontSize: 10, color: '#888' }}>מילים/דק'</Text>
                        </View>
                        <View style={{ alignItems: 'center', flex: 1 }}>
                          <Text style={{ fontFamily: 'Heebo_700Bold', fontSize: 15, color: '#FFD700' }}>
                            {stars > 0 ? '★'.repeat(stars) + '☆'.repeat(3 - stars) : '—'}
                          </Text>
                          <Text style={{ fontFamily: 'Heebo_400Regular', fontSize: 10, color: '#888' }}>כוכבים</Text>
                        </View>
                      </View>
                    ) : (
                      <Text style={{ fontFamily: 'Heebo_400Regular', fontSize: 12, color: '#CCC', textAlign: 'center' }}>טרם נקרא</Text>
                    )}
                  </View>
                );
              })}
            </View>

            {/* Screen time balance */}
            <View style={{ backgroundColor: '#fff', borderRadius: 20, padding: 20, marginBottom: 16, alignItems: 'center', elevation: 2 }}>
              <Text style={{ fontSize: 36 }}>⏱️</Text>
              <Text style={{ fontFamily: 'Heebo_700Bold', fontSize: 40, color: '#333', marginTop: 4 }}>
                {state.totalPoints}
              </Text>
              <Text style={{ fontFamily: 'Heebo_400Regular', fontSize: 15, color: '#666' }}>דקות זמן מסך שנצברו</Text>
            </View>

            {/* Deduct controls */}
            <Text style={{ fontFamily: 'Heebo_700Bold', fontSize: 15, color: '#333', textAlign: 'right', marginBottom: 10 }}>
              השתמשנו בזמן מסך:
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 10 }}>
              {[10, 20, 30, 60].map((mins) => (
                <TouchableOpacity
                  key={mins}
                  onPress={() => setDeductAmount(String(mins))}
                  style={{ flex: 1, backgroundColor: '#E8F5E9', borderRadius: 12, paddingVertical: 10, alignItems: 'center' }}
                >
                  <Text style={{ fontFamily: 'Heebo_400Regular', fontSize: 13, color: '#333' }}>{mins} דק'</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center', marginBottom: 20 }}>
              <TouchableOpacity
                onPress={handleDeduct}
                style={{ backgroundColor: '#FF6B6B', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 16, elevation: 3 }}
              >
                <Text style={{ fontFamily: 'Heebo_700Bold', fontSize: 15, color: '#fff' }}>נכה דקות</Text>
              </TouchableOpacity>
              <TextInput
                value={deductAmount}
                onChangeText={setDeductAmount}
                keyboardType="number-pad"
                placeholder="כמה דקות?"
                style={{ flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 14, fontSize: 16, textAlign: 'right', fontFamily: 'Heebo_400Regular', elevation: 2 }}
              />
            </View>

            {/* Reset */}
            <TouchableOpacity
              onPress={handleReset}
              style={{ backgroundColor: '#FFEBEE', borderRadius: 16, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#EF9A9A' }}
            >
              <Text style={{ fontFamily: 'Heebo_700Bold', fontSize: 14, color: '#C62828' }}>איפוס כל הנתונים 🔄</Text>
            </TouchableOpacity>
          </>
        )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
