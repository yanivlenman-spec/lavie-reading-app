import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'lavie_app_state';

export async function loadState<T>(fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) return { ...fallback, ...JSON.parse(raw) };
  } catch {}
  return fallback;
}

export async function saveState(state: object): Promise<void> {
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
}
