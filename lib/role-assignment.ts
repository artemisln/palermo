import { Player, GameSettings, Role } from './game-types';

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function assignRoles(players: Player[], settings: GameSettings): Player[] {
  const shuffled = shuffle(players);
  const roles: Role[] = [];

  // Core roles (always)
  roles.push('HIDDEN_KILLER', 'REVEALED_KILLER', 'DETECTIVE');

  // Optional roles
  if (settings.doctorEnabled) roles.push('DOCTOR');
  if (settings.informantEnabled) roles.push('INFORMANT');

  // Fill remaining with citizens
  while (roles.length < shuffled.length) {
    roles.push('CITIZEN');
  }

  // Shuffle roles so they're randomly distributed
  const shuffledRoles = shuffle(roles);

  const assigned = shuffled.map((player, i) => ({
    ...player,
    role: shuffledRoles[i],
    alive: true,
    isLover: false,
  }));

  // Assign lovers (secondary role on top of primary)
  if (settings.loversEnabled && assigned.length >= 7) {
    const loverIndices = shuffle(
      assigned.map((_, i) => i)
    ).slice(0, 2);
    loverIndices.forEach((i) => {
      assigned[i] = { ...assigned[i], isLover: true };
    });
  }

  return assigned;
}
