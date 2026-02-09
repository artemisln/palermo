import { Player, GameSettings } from './game-types';

export function checkWinCondition(
  players: Player[],
  settings: GameSettings
): 'GOOD' | 'KILLERS' | 'LOVERS' | null {
  const alive = players.filter((p) => p.alive);
  const killersAlive = alive.filter(
    (p) => p.role === 'HIDDEN_KILLER' || p.role === 'REVEALED_KILLER'
  );
  const goodAlive = alive.filter(
    (p) => p.role !== 'HIDDEN_KILLER' && p.role !== 'REVEALED_KILLER'
  );

  // Both killers dead → Good wins
  if (killersAlive.length === 0) return 'GOOD';

  // Lovers win: if enabled and exactly 2 alive and both are lovers
  if (settings.loversEnabled && alive.length === 2) {
    if (alive.every((p) => p.isLover)) return 'LOVERS';
  }

  // Killers >= Good → Killers win
  if (killersAlive.length >= goodAlive.length) return 'KILLERS';

  return null;
}
