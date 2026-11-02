import { DEFAULT_SETTINGS, GameSettings, Player, Role } from '@/lib/game-types';

export function makePlayers(count: number): Player[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `p${i + 1}`,
    name: `Player ${i + 1}`,
    role: null,
    alive: true,
    isLover: false,
  }));
}

// Builds players with fixed roles, so win checks don't depend on the shuffle.
export function withRoles(roles: Role[], overrides: Partial<Player>[] = []): Player[] {
  return roles.map((role, i) => ({
    id: `p${i + 1}`,
    name: `Player ${i + 1}`,
    role,
    alive: true,
    isLover: false,
    ...overrides[i],
  }));
}

export function settings(overrides: Partial<GameSettings> = {}): GameSettings {
  return { ...DEFAULT_SETTINGS, ...overrides };
}
