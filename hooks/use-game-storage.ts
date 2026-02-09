import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback } from 'react';
import { GameSettings, DEFAULT_SETTINGS } from '@/lib/game-types';

const PLAYERS_KEY = 'palermo_lastPlayers';
const SETTINGS_KEY = 'palermo_lastSettings';

export function useGameStorage() {
  const savePlayerNames = useCallback(async (names: string[]) => {
    try {
      await AsyncStorage.setItem(PLAYERS_KEY, JSON.stringify(names));
    } catch {}
  }, []);

  const saveSettings = useCallback(async (settings: GameSettings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {}
  }, []);

  const loadPlayerNames = useCallback(async (): Promise<string[]> => {
    try {
      const data = await AsyncStorage.getItem(PLAYERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }, []);

  const loadSettings = useCallback(async (): Promise<GameSettings> => {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_KEY);
      const parsed = data ? JSON.parse(data) : null;
      return { ...DEFAULT_SETTINGS, ...(parsed ?? {}) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }, []);

  return { savePlayerNames, saveSettings, loadPlayerNames, loadSettings };
}
