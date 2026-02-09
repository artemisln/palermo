import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameSettings, DEFAULT_SETTINGS } from '@/lib/game-types';

const PLAYERS_KEY = 'palermo_lastPlayers';
const SETTINGS_KEY = 'palermo_lastSettings';

export function useGameStorage() {
  async function savePlayerNames(names: string[]) {
    try {
      await AsyncStorage.setItem(PLAYERS_KEY, JSON.stringify(names));
    } catch {}
  }

  async function saveSettings(settings: GameSettings) {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch {}
  }

  async function loadPlayerNames(): Promise<string[]> {
    try {
      const data = await AsyncStorage.getItem(PLAYERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  async function loadSettings(): Promise<GameSettings> {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_KEY);
      return data ? JSON.parse(data) : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  return { savePlayerNames, saveSettings, loadPlayerNames, loadSettings };
}
