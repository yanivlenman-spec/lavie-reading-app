# Lavie Reading App — Project Context

## What It Is
Hebrew reading app for Lavie (child, ~7 years old). Expo + React Native, **web-only** deployment to Vercel. Speech recognition via Web Speech API (Chrome only). The app teaches Hebrew reading through story levels with a voice-match mechanic.

## Stack
- TypeScript, Expo SDK 54, React Navigation (stack + bottom tabs)
- AsyncStorage (localStorage on web) for persistence
- `expo-speech` + `window.speechSynthesis` for TTS
- `react-native-svg` for map curves
- Fonts: `@expo-google-fonts/noto-serif-hebrew`

## Deploy Workflow
```bash
bash deploy.sh
```
This runs: `npx expo export --platform web` → `vercel deploy dist` → `vercel alias lavie-reading-app.vercel.app`

Always run `npx tsc --noEmit` before deploying. Never push to Vercel manually — always use `deploy.sh`.

## Key Files
| File | Purpose |
|---|---|
| `src/data/stories.ts` | All story content (sentences split word-by-word, with nikud) |
| `src/context/AppContext.tsx` | Global state, test mode snapshot/restore, AsyncStorage persistence |
| `src/screens/StoryScreen.tsx` | Reading screen: STT matching, hint system, breathing animation, letter-break |
| `src/screens/MapScreen.tsx` | Adventure map with zigzag node layout and SVG curves |
| `src/screens/HomeScreen.tsx` | Stats, parent mode panel, test mode toggle |
| `src/navigation/RootNavigator.tsx` | Stack nav + bottom tabs + swipe gesture wrapper |
| `src/utils/sttMatcher.ts` | Levenshtein-based Hebrew STT matching with prefix/skip logic |
| `src/hooks/useSpeechRecognition.ts` | Web Speech API hook with auto-restart |
| `deploy.sh` | One-command build + deploy + alias |

## Episode Structure
- **Episode 1 — כראמל** (`c1s1`–`c1s10`): Active, based on Israeli TV show כראמל (magical cat). IDs start with `c`.
- **Episode 2 — משפחה** (`l1s1`–`l1s10`): Locked until Ep1 complete. Lavie's family stories.
- **Episode 3 — אמנות**: Locked placeholder.

`STORIES[0].id` = `c1s1` is always unlocked (enforced in `LOADED` reducer).

## State & Persistence
- `AppState` in `AppContext.tsx`: streakDays, totalPoints, storiesCompleted, storyStars, storyStats, unlockedStories, badges
- Saved to AsyncStorage on every state change (suppressed during test mode)
- Completing a story unlocks the next by index order in `STORIES` array
- Points: +5 per story (first completion only), stars = max(previous, current)

## Test Mode
- PIN: **1979** (same as parent mode)
- Activated from HomeScreen → "מצב בדיקה" button
- Snapshots `AppState` in `snapshotRef` before activation
- Suppresses `saveState` via `isTestModeRef.current` (sync ref, not state — avoids batching race)
- On disable: sets ref to false FIRST, then dispatches `RESTORE_SNAPSHOT`, then sets state to false
- Orange banner (`#E65100`) shown on all screens via `RootNavigator.tsx` overlay

## Parent Mode
- PIN: **1979**
- Shows per-story stats, screen time balance, deduct controls, reset button
- `window.confirm` / `window.alert` used (not `Alert.alert` — broken on web)

## Navigation
- Landing → (tap anywhere) → MainTabs
- MainTabs: Home / Play (Map) / Rewards — bottom tabs + left/right swipe gesture
- `navigation.replace('MainTabs')` from landing prevents back-navigation to splash
- Story screen accessed from map nodes

## Hint System (StoryScreen)
Thresholds (seconds): `[0, 4, 7, 10, 15]`
- Level 0: normal pulse
- Level 1 (4s): heavy pulse
- Level 2 (7s): show stripped word (no nikud)
- Level 3 (10s): speak word via TTS
- Level 4 (15s): auto-advance + bleep sound (Web Audio API)
- **Letter break**: triggers immediately on failed final STT match — splits word into consonant+nikud boxes
