export type GamePhase =
  | 'SETUP'
  | 'ROLE_REVEAL'
  | 'NIGHT_INTRO'
  | 'DAY_DISCUSSION'
  | 'VOTING'
  | 'NIGHT_KILL'
  | 'END';

export type Role =
  | 'HIDDEN_KILLER'
  | 'REVEALED_KILLER'
  | 'DETECTIVE'
  | 'CITIZEN'
  | 'DOCTOR'
  | 'INFORMANT';

export interface Player {
  id: string;
  name: string;
  role: Role | null;
  alive: boolean;
  isLover: boolean;
}

export interface GameSettings {
  doctorEnabled: boolean;
  informantEnabled: boolean;
  loversEnabled: boolean;
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  settings: GameSettings;
  currentPlayerIndex: number;
  winner: 'GOOD' | 'KILLERS' | 'LOVERS' | null;
  round: number;
}

export type GameAction =
  | { type: 'ADD_PLAYER'; name: string }
  | { type: 'REMOVE_PLAYER'; id: string }
  | { type: 'RENAME_PLAYER'; id: string; name: string }
  | { type: 'REORDER_PLAYER'; id: string; direction: 'up' | 'down' }
  | { type: 'UPDATE_SETTINGS'; settings: Partial<GameSettings> }
  | { type: 'LOAD_SAVED_DATA'; players: string[]; settings: GameSettings }
  | { type: 'START_GAME' }
  | { type: 'SHOW_ROLE' }
  | { type: 'NEXT_PLAYER' }
  | { type: 'FINISH_NIGHT_INTRO' }
  | { type: 'START_VOTING' }
  | { type: 'ELIMINATE_PLAYER'; playerId: string }
  | { type: 'START_NIGHT_KILL' }
  | { type: 'ANNOUNCE_VICTIM'; victimId: string | null; doctorSaved: boolean }
  | { type: 'NEW_ROUND' }
  | { type: 'RESET_GAME' };

export const DEFAULT_SETTINGS: GameSettings = {
  doctorEnabled: false,
  informantEnabled: false,
  loversEnabled: false,
};

export const INITIAL_STATE: GameState = {
  phase: 'SETUP',
  players: [],
  settings: { ...DEFAULT_SETTINGS },
  currentPlayerIndex: 0,
  winner: null,
  round: 1,
};

export function getMinPlayers(settings: GameSettings): number {
  let min = 5; // 2 killers + 1 detective + 2 citizens
  if (settings.doctorEnabled) min = Math.max(min, 6);
  if (settings.informantEnabled) min = Math.max(min, 7);
  if (settings.loversEnabled) min = Math.max(min, 7);
  return min;
}

export const ROLE_INFO: Record<Role, { name: string; description: string; faction: 'killer' | 'good' }> = {
  HIDDEN_KILLER: {
    name: 'Hidden Killer',
    description: 'You are a Killer. Coordinate with your partner each night to eliminate players. Stay hidden.',
    faction: 'killer',
  },
  REVEALED_KILLER: {
    name: 'Revealed Killer',
    description: 'You are a Killer. The Detective knows your identity. Work with the Hidden Killer to eliminate everyone.',
    faction: 'killer',
  },
  DETECTIVE: {
    name: 'Detective',
    description: 'You know the Revealed Killer\'s identity. Guide the group to find the Hidden Killer. Protect your information.',
    faction: 'good',
  },
  CITIZEN: {
    name: 'Citizen',
    description: 'You have no special ability. Use your instincts to find the killers. Trust no one.',
    faction: 'good',
  },
  DOCTOR: {
    name: 'Doctor',
    description: 'Each night, choose one player to save. If they are the killers\' target, the kill fails.',
    faction: 'good',
  },
  INFORMANT: {
    name: 'Informant',
    description: 'Each night, you receive limited information. Use it wisely to help the group.',
    faction: 'good',
  },
};
