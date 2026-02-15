import { t as translate, MessageKey } from './messages';

export type GamePhase =
  | 'SETUP'
  | 'ROLE_REVEAL'
  | 'NIGHT_INTRO'
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
  language: 'el' | 'en';
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
  | { type: 'ELIMINATE_PLAYER'; playerId: string }
  | { type: 'START_NIGHT_KILL' }
  | { type: 'ANNOUNCE_VICTIM'; victimId: string | null; doctorSaved: boolean }
  | { type: 'NEW_ROUND' }
  | { type: 'RESET_GAME' }
  | { type: 'RESTORE_STATE'; state: GameState };

export const DEFAULT_SETTINGS: GameSettings = {
  doctorEnabled: false,
  informantEnabled: false,
  loversEnabled: false,
  language: 'el',
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

export const ROLE_FACTIONS: Record<Role, 'killer' | 'good'> = {
  HIDDEN_KILLER: 'killer',
  REVEALED_KILLER: 'killer',
  DETECTIVE: 'good',
  CITIZEN: 'good',
  DOCTOR: 'good',
  INFORMANT: 'good',
};

export const ROLE_MESSAGE_KEYS: Record<Role, { name: MessageKey; desc: MessageKey }> = {
  HIDDEN_KILLER: { name: 'role.hiddenKiller.name', desc: 'role.hiddenKiller.desc' },
  REVEALED_KILLER: { name: 'role.revealedKiller.name', desc: 'role.revealedKiller.desc' },
  DETECTIVE: { name: 'role.detective.name', desc: 'role.detective.desc' },
  CITIZEN: { name: 'role.citizen.name', desc: 'role.citizen.desc' },
  DOCTOR: { name: 'role.doctor.name', desc: 'role.doctor.desc' },
  INFORMANT: { name: 'role.informant.name', desc: 'role.informant.desc' },
};

export function getRoleInfo(role: Role, language: 'el' | 'en') {
  const keys = ROLE_MESSAGE_KEYS[role];
  return {
    name: translate(language, keys.name),
    description: translate(language, keys.desc),
    faction: ROLE_FACTIONS[role],
  };
}
