import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Easing,
  Platform,
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as Speech from 'expo-speech';
import { Mic, MicOff, ChevronRight, Star } from 'lucide-react-native';
import { useApp, StoryStats } from '../context/AppContext';
import { STORY_MAP } from '../data/stories';
import { matchTranscriptToWord, stripNikud } from '../utils/sttMatcher';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { RootStackParamList } from '../navigation/RootNavigator';
import Story1Illustration from '../illustrations/Story1';
import Story2Illustration from '../illustrations/Story2';
import Story3Illustration from '../illustrations/Story3';
import Story4Illustration from '../illustrations/Story4';
import Story5Illustration from '../illustrations/Story5';
import Story6Illustration from '../illustrations/Story6';
import Story7Illustration from '../illustrations/Story7';
import Story8Illustration from '../illustrations/Story8';
import Story9Illustration from '../illustrations/Story9';
import Story10Illustration from '../illustrations/Story10';

type Nav = StackNavigationProp<RootStackParamList, 'Story'>;
type Route = RouteProp<RootStackParamList, 'Story'>;

const ILLUSTRATIONS: Record<string, React.FC<{ width?: number; height?: number }>> = {
  l1s1: Story1Illustration,
  l1s2: Story2Illustration,
  l1s3: Story3Illustration,
  l1s4: Story4Illustration,
  l1s5: Story5Illustration,
  l1s6: Story6Illustration,
  l1s7: Story7Illustration,
  l1s8: Story8Illustration,
  l1s9: Story9Illustration,
  l1s10: Story10Illustration,
};

// Progressive hint thresholds (seconds per level)
// Level 0: normal  Level 1: heavy pulse  Level 2: show stripped word
// Level 3: speak   Level 4: auto-advance
const HINT_THRESHOLDS = [0, 4, 7, 10, 15]; // seconds to reach each level

// ── Audio feedback ─────────────────────────────────────────────────────────────
let _audioCtx: AudioContext | null = null;
function getAudioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!_audioCtx || _audioCtx.state === 'closed') {
      _audioCtx = new AudioContext();
    }
    return _audioCtx;
  } catch { return null; }
}
function playBleep() {
  const ctx = getAudioCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'sine';
  osc.frequency.value = 660;
  gain.gain.setValueAtTime(0.18, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.18);
}

// Split a Hebrew word into individual consonant+nikud chunks for letter-by-letter display
function splitToLetters(word: string): string[] {
  const cleaned = word.replace(/[.,!?"״]/g, '');
  const letters: string[] = [];
  let cur = '';
  for (const ch of cleaned) {
    const code = ch.codePointAt(0) ?? 0;
    if (code >= 0x05D0 && code <= 0x05EA) {
      if (cur) letters.push(cur);
      cur = ch;
    } else {
      cur += ch;
    }
  }
  if (cur) letters.push(cur);
  return letters;
}

// Format word with middle dots between letters for easier reading
function formatWithDots(word: string): string {
  return splitToLetters(word).join('·');
}

// Get normalized form for character matching (strips nikud, punctuation, lowercase)
function normalizeForMatching(text: string): string {
  return stripNikud(text.replace(/[.,!?"״]/g, '')).toLowerCase();
}

// Count how many characters at the start of word match the transcript
function getLettersReadInWord(word: string, transcript: string): number {
  const normWord = normalizeForMatching(word);
  const normTranscript = normalizeForMatching(transcript);
  if (!normWord || !normTranscript) return 0;

  let matched = 0;
  for (let i = 0; i < normWord.length && i < normTranscript.length; i++) {
    const wChar = normWord[i];
    const tChar = normTranscript[i];
    if (wChar === tChar || isPhonemeConfusion(wChar, tChar)) {
      matched++;
    } else {
      break;
    }
  }
  return matched;
}

// Split word into read and unread parts based on character count
function splitWordByProgress(word: string, lettersRead: number): [string, string] {
  const letters = splitToLetters(word);
  const read = letters.slice(0, lettersRead).join('');
  const unread = letters.slice(lettersRead).join('');
  return [read, unread];
}

function speakWord(word: string) {
  const clean = word.replace(/[\u0591-\u05C7.,!?"״]/g, '');
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(clean);
    utt.lang = 'he-IL';
    utt.rate = 0.75;
    window.speechSynthesis.speak(utt);
  } else {
    Speech.speak(clean, { language: 'he-IL', rate: 0.75 });
  }
}

export default function StoryScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { storyId } = route.params;
  const { completeStory } = useApp();

  const story = STORY_MAP[storyId];
  const Illustration = ILLUSTRATIONS[storyId] ?? Story1Illustration;

  const allWords = story.sentences.flat();
  const totalWords = allWords.length;

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showLetterBreak, setShowLetterBreak] = useState(false);
  const [lettersReadInWord, setLettersReadInWord] = useState(0);

  const currentIndexRef = useRef(0);
  const completedRef = useRef(false);
  const startTimeRef = useRef(Date.now());
  const wordStartTimeRef = useRef(Date.now());
  const prevTranscriptRef = useRef('');
  const hasSpokenHintRef = useRef(false);
  const completionStatsRef = useRef<StoryStats | null>(null);

  const wordPulse = useRef(new Animated.Value(1)).current;
  const hintIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Pulse animation ────────────────────────────────────────────────────────
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(wordPulse, { toValue: 1.09, duration: 850, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(wordPulse, { toValue: 1.0, duration: 850, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [wordPulse]);

  // ── Progressive hint ticker (runs every 500ms) ─────────────────────────────
  const startHintTimer = useCallback((onAutoAdvance: () => void) => {
    if (hintIntervalRef.current) clearInterval(hintIntervalRef.current);
    wordStartTimeRef.current = Date.now();

    hintIntervalRef.current = setInterval(() => {
      if (completedRef.current) return;
      const elapsed = (Date.now() - wordStartTimeRef.current) / 1000;

      let level = 0;
      for (let i = HINT_THRESHOLDS.length - 1; i >= 0; i--) {
        if (elapsed >= HINT_THRESHOLDS[i]) { level = i; break; }
      }

      setHintLevel(level);

      // Level 3 → speak the word once (guard prevents repeat every 500ms)
      if (level === 3 && !hasSpokenHintRef.current) {
        hasSpokenHintRef.current = true;
        const word = allWords[currentIndexRef.current];
        if (word) speakWord(word);
      }

      // Level 4 → auto-advance
      if (level >= 4) {
        clearInterval(hintIntervalRef.current!);
        playBleep();
        onAutoAdvance();
      }
    }, 500);
  }, [allWords]);

  // ── Advance to next word ──────────────────────────────────────────────────
  const advanceTo = useCallback((nextIndex: number) => {
    if (hintIntervalRef.current) clearInterval(hintIntervalRef.current);
    setHintLevel(0);
    setShowLetterBreak(false);
    setLettersReadInWord(0);
    hasSpokenHintRef.current = false;

    if (nextIndex >= totalWords) {
      const timeSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
      const wpm = timeSeconds > 0 ? Math.round((totalWords / timeSeconds) * 60) : 0;
      completionStatsRef.current = {
        timeSeconds,
        wordsRead: totalWords,
        wpm,
        completedAt: new Date().toISOString(),
      };
      completedRef.current = true;
      setCompleted(true);
      return;
    }
    currentIndexRef.current = nextIndex;
    setCurrentWordIndex(nextIndex);

    // Restart hint timer for the new word
    startHintTimer(() => {
      const next = currentIndexRef.current + 1;
      hasSpokenHintRef.current = false;
      currentIndexRef.current = next;
      setCurrentWordIndex(next);
      if (next >= totalWords) {
        const t = Math.round((Date.now() - startTimeRef.current) / 1000);
        const w = t > 0 ? Math.round((totalWords / t) * 60) : 0;
        completionStatsRef.current = { timeSeconds: t, wordsRead: totalWords, wpm: w, completedAt: new Date().toISOString() };
        completedRef.current = true;
        setCompleted(true);
      }
    });
  }, [totalWords, startHintTimer]);

  // ── Transcript handler ────────────────────────────────────────────────────
  const handleTranscript = useCallback((transcripts: string[], isFinal: boolean) => {
    if (completedRef.current) return;

    // Build delta phrases: for the primary transcript, strip the already-processed prefix.
    // For alternatives (2, 3), use them as-is since they're independent hypotheses.
    const primary = transcripts[0] ?? '';
    const prev = prevTranscriptRef.current;
    let delta = primary;
    if (prev && primary.startsWith(prev)) {
      delta = primary.slice(prev.length).trim();
    }

    // Collect all phrases to try: delta of primary + all raw alternatives
    const phrasesToTry = [
      ...(delta ? [delta] : []),
      ...transcripts.slice(1),
    ];

    if (phrasesToTry.length === 0) return;

    const result = matchTranscriptToWord(phrasesToTry, allWords, currentIndexRef.current);
    if (result.matched) {
      playBleep();
      setShowLetterBreak(false);
      setLettersReadInWord(0);
      advanceTo(result.advanceTo);
    } else {
      // Even if no full match, track character-level progress
      let maxLettersRead = 0;
      for (const phrase of phrasesToTry) {
        const letters = getLettersReadInWord(allWords[currentIndexRef.current], phrase);
        maxLettersRead = Math.max(maxLettersRead, letters);
      }
      setLettersReadInWord(maxLettersRead);

      if (isFinal && phrasesToTry.some((p) => p.trim().length > 1)) {
        setShowLetterBreak(true);
      }
    }
    if (isFinal) prevTranscriptRef.current = primary;
  }, [allWords, advanceTo]);

  const { isListening, isSupported, start, stop } = useSpeechRecognition({
    lang: 'he-IL',
    onTranscript: handleTranscript,
  });

  useEffect(() => {
    if (isSupported) {
      start();
      startHintTimer(() => advanceTo(currentIndexRef.current + 1));
    }
    return () => {
      stop();
      if (hintIntervalRef.current) clearInterval(hintIntervalRef.current);
      if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Star calculation (WPM-based) ──────────────────────────────────────────
  function calcStars(): 0 | 1 | 2 | 3 {
    const seconds = (Date.now() - startTimeRef.current) / 1000;
    const wpm = seconds > 0 ? Math.round((totalWords / seconds) * 60) : 0;
    if (wpm > 40) return 3;
    if (wpm > 20) return 2;
    return 1;
  }

  // ── Build display sentences from flat index ───────────────────────────────
  let flatIdx = 0;
  const displaySentences = story.sentences.map((sentence) =>
    sentence.map((word) => {
      const idx = flatIdx;
      const state = idx < currentWordIndex ? 'done' : idx === currentWordIndex ? 'active' : 'idle';
      flatIdx++;
      return { word, state };
    })
  );

  const activeSentenceIndex = displaySentences.findIndex((s) => s.some((w) => w.state === 'active'));
  const visibleSentenceIndex = activeSentenceIndex >= 0 ? activeSentenceIndex : displaySentences.length - 1;

  // ── Completion screen ─────────────────────────────────────────────────────
  if (completed) {
    const stars = calcStars();

    function handleRetry() {
      completeStory(storyId, stars, completionStatsRef.current ?? undefined);
      setCurrentWordIndex(0);
      setHintLevel(0);
      setShowLetterBreak(false);
      setCompleted(false);
      currentIndexRef.current = 0;
      completedRef.current = false;
      startTimeRef.current = Date.now();
      wordStartTimeRef.current = Date.now();
      prevTranscriptRef.current = '';
      hasSpokenHintRef.current = false;
      completionStatsRef.current = null;
      start();
      startHintTimer(() => advanceTo(currentIndexRef.current + 1));
    }

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFDE7', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontSize: 64, marginBottom: 16 }}>🎉</Text>
        <Text style={{ fontFamily: 'Heebo_700Bold', fontSize: 28, color: '#333', textAlign: 'center', marginBottom: 8 }}>
          כל הכבוד לביא!
        </Text>
        <Text style={{ fontFamily: 'Heebo_400Regular', fontSize: 17, color: '#555', marginBottom: 24 }}>
          קיבלת +5 דקות זמן מסך! ⏱️
        </Text>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 32 }}>
          {[1, 2, 3].map((i) => (
            <Star key={i} size={48} color={i <= stars ? '#FFD700' : '#DDD'} fill={i <= stars ? '#FFD700' : 'transparent'} />
          ))}
        </View>
        <TouchableOpacity
          onPress={() => { completeStory(storyId, stars, completionStatsRef.current ?? undefined); navigation.navigate('MainTabs', { screen: 'Play' }); }}
          style={{ backgroundColor: '#FFD700', paddingHorizontal: 40, paddingVertical: 16, borderRadius: 32, elevation: 4, marginBottom: 16 }}
        >
          <Text style={{ fontFamily: 'Heebo_700Bold', fontSize: 18, color: '#333' }}>חזרה למפה 🗺️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleRetry}
          style={{ backgroundColor: '#fff', paddingHorizontal: 40, paddingVertical: 14, borderRadius: 32, borderWidth: 2, borderColor: '#4FC3F7', elevation: 2 }}
        >
          <Text style={{ fontFamily: 'Heebo_700Bold', fontSize: 17, color: '#4FC3F7' }}>קרא שוב 🔄</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const activeWord = allWords[currentWordIndex] ?? '';
  const strippedHint = stripNikud(activeWord).replace(/[.,!?"״]/g, '');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFDE7' }}>
      {/* Back */}
      <TouchableOpacity
        onPress={() => { stop(); navigation.goBack(); }}
        style={{ position: 'absolute', top: 48, right: 16, zIndex: 10, width: 44, height: 44, borderRadius: 22, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', elevation: 3 }}
      >
        <ChevronRight size={22} color="#333" />
      </TouchableOpacity>

      {/* Progress bar */}
      <View style={{ height: 6, backgroundColor: '#EEE', marginTop: Platform.OS === 'ios' ? 0 : 8 }}>
        <View style={{ height: 6, backgroundColor: '#FFD700', width: `${(currentWordIndex / totalWords) * 100}%` }} />
      </View>

      {/* TOP: Illustration or Episode Image */}
      {story.image ? (
        <View style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fafafa' }}>
          <View style={{ borderRadius: 16, overflow: 'hidden' }}>
            <ImageBackground
              source={story.image}
              style={{ width: '100%', height: 420, backgroundColor: '#f5f0eb' }}
              imageStyle={{ resizeMode: 'cover' }}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.2)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.2)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1, pointerEvents: 'none' }}
              />
            </ImageBackground>
          </View>
        </View>
      ) : (
        <View style={{ height: '38%', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', overflow: 'hidden' }}>
          <Illustration width={360} height={220} />
        </View>
      )}

      {/* Story title */}
      <Text style={{ fontFamily: 'Heebo_700Bold', fontSize: 18, color: '#333', textAlign: 'center', paddingTop: 10, paddingHorizontal: 16 }}>
        {story.title}
      </Text>

      {/* Hint strip — time-based hints only (stripped word at 4s, speaking at 7s, auto-advance at 15s) */}
      {hintLevel >= 2 && !showLetterBreak && (
        <View style={{ alignItems: 'center', marginTop: 6 }}>
          <View style={{ backgroundColor: '#FFF9C4', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 4, borderWidth: 1, borderColor: '#FFD700' }}>
            <Text style={{ fontFamily: 'Heebo_700Bold', fontSize: 20, color: '#888', letterSpacing: 4 }}>
              {strippedHint}
            </Text>
          </View>
          {hintLevel >= 3 && (
            <Text style={{ fontFamily: 'Heebo_400Regular', fontSize: 12, color: '#FF6B6B', marginTop: 3 }}>
              🔊 {hintLevel >= 4 ? 'דילגנו קדימה' : 'מקשיב לך...'}
            </Text>
          )}
        </View>
      )}

      {/* BOTTOM: Text area */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, alignItems: 'center', justifyContent: 'center', flexGrow: 1 }}
      >
        {displaySentences.map((sentence, si) => {
          const isPast = si < visibleSentenceIndex;
          if (si < visibleSentenceIndex - 1) return null;

          return (
            <View
              key={si}
              style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 10, opacity: isPast ? 0.35 : 1 }}
            >
              {sentence.map(({ word, state }, wi) => {
                const isActive = state === 'active';
                const isDone = state === 'done';
                // Scale pulse more aggressively at higher hint levels
                const pulseScale = isActive
                  ? hintLevel >= 2
                    ? wordPulse.interpolate({ inputRange: [1, 1.12], outputRange: [1.05, 1.18] })
                    : wordPulse
                  : new Animated.Value(1);

                const renderWord = () => {
                  if (!isActive) return word;
                  if (showLetterBreak) return formatWithDots(word);
                  if (lettersReadInWord > 0) {
                    const [read, unread] = splitWordByProgress(word, lettersReadInWord);
                    return (
                      <Text>
                        <Text style={{ color: '#2196F3' }}>{read}</Text>
                        <Text style={{ color: '#333' }}>{unread}</Text>
                      </Text>
                    );
                  }
                  return word;
                };

                return (
                  <Animated.View key={wi} style={{ margin: 3, transform: [{ scale: pulseScale }] }}>
                    <Text
                      style={{
                        fontFamily: 'Heebo_700Bold',
                        fontSize: 26,
                        color: isDone ? '#4CAF50' : isActive ? '#333' : '#999',
                        backgroundColor: isActive
                          ? hintLevel >= 3 ? '#FF6B6B' : hintLevel >= 1 ? '#FFB300' : '#FFD700'
                          : 'transparent',
                        borderRadius: 8,
                        paddingHorizontal: 6,
                        paddingVertical: 2,
                        overflow: 'hidden',
                        writingDirection: 'rtl',
                      }}
                    >
                      {renderWord()}
                    </Text>
                  </Animated.View>
                );
              })}
            </View>
          );
        })}
      </ScrollView>

      {/* Mic bar */}
      <View style={{ height: 70, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderTopWidth: 1, borderTopColor: '#EEE', gap: 12 }}>
        {!isSupported ? (
          <Text style={{ fontFamily: 'Heebo_400Regular', fontSize: 14, color: '#888', textAlign: 'center', paddingHorizontal: 20 }}>
            זיהוי קול לא נתמך בדפדפן זה. השתמש ב-Chrome.
          </Text>
        ) : (
          <>
            <TouchableOpacity
              onPress={isListening ? stop : start}
              style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: isListening ? '#FF6B6B' : '#4FC3F7', alignItems: 'center', justifyContent: 'center', elevation: 3 }}
            >
              {isListening ? <MicOff size={24} color="#fff" /> : <Mic size={24} color="#fff" />}
            </TouchableOpacity>
            <Text style={{ fontFamily: 'Heebo_400Regular', fontSize: 14, color: isListening ? '#FF6B6B' : '#888', flexShrink: 1 }}>
              {isListening ? 'מקשיב... קרא את המילה המסומנת! 🎤' : 'לחץ כדי להפעיל מיקרופון'}
            </Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
