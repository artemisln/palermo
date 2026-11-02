import { getMinPlayers, Role } from '@/lib/game-types';
import { assignRoles } from '@/lib/role-assignment';
import { makePlayers, settings } from './helpers';

function countRoles(roles: (Role | null)[]) {
  const counts: Partial<Record<Role, number>> = {};
  for (const role of roles) {
    if (role) counts[role] = (counts[role] ?? 0) + 1;
  }
  return counts;
}

describe('assignRoles', () => {
  it('gives 5 players two killers, a detective and two citizens', () => {
    const assigned = assignRoles(makePlayers(5), settings());
    expect(countRoles(assigned.map((p) => p.role))).toEqual({
      HIDDEN_KILLER: 1,
      REVEALED_KILLER: 1,
      DETECTIVE: 1,
      CITIZEN: 2,
    });
  });

  it('fills every extra seat with a citizen', () => {
    const assigned = assignRoles(makePlayers(12), settings());
    expect(countRoles(assigned.map((p) => p.role))).toEqual({
      HIDDEN_KILLER: 1,
      REVEALED_KILLER: 1,
      DETECTIVE: 1,
      CITIZEN: 9,
    });
  });

  it('adds the doctor and the informant when enabled', () => {
    const assigned = assignRoles(
      makePlayers(8),
      settings({ doctorEnabled: true, informantEnabled: true })
    );
    expect(countRoles(assigned.map((p) => p.role))).toEqual({
      HIDDEN_KILLER: 1,
      REVEALED_KILLER: 1,
      DETECTIVE: 1,
      DOCTOR: 1,
      INFORMANT: 1,
      CITIZEN: 3,
    });
  });

  it('keeps the setup order of players and marks everyone alive', () => {
    const players = makePlayers(6).map((p, i) => ({ ...p, alive: i % 2 === 0 }));
    const assigned = assignRoles(players, settings());
    expect(assigned.map((p) => p.id)).toEqual(players.map((p) => p.id));
    expect(assigned.every((p) => p.alive)).toBe(true);
  });

  it('shuffles roles between games', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 50; i++) {
      seen.add(assignRoles(makePlayers(5), settings()).map((p) => p.role).join(','));
    }
    expect(seen.size).toBeGreaterThan(1);
  });

  it('picks exactly two lovers when lovers are enabled with 7 or more players', () => {
    for (let i = 0; i < 20; i++) {
      const assigned = assignRoles(makePlayers(7), settings({ loversEnabled: true }));
      expect(assigned.filter((p) => p.isLover)).toHaveLength(2);
    }
  });

  it('picks no lovers below 7 players or when lovers are off', () => {
    const small = assignRoles(makePlayers(6), settings({ loversEnabled: true }));
    const off = assignRoles(makePlayers(10), settings());
    expect(small.some((p) => p.isLover)).toBe(false);
    expect(off.some((p) => p.isLover)).toBe(false);
  });
});

describe('getMinPlayers', () => {
  it('needs 5 players for the base game', () => {
    expect(getMinPlayers(settings())).toBe(5);
  });

  it('raises the minimum for optional roles', () => {
    expect(getMinPlayers(settings({ doctorEnabled: true }))).toBe(6);
    expect(getMinPlayers(settings({ informantEnabled: true }))).toBe(7);
    expect(getMinPlayers(settings({ loversEnabled: true }))).toBe(7);
    expect(
      getMinPlayers(settings({ doctorEnabled: true, informantEnabled: true, loversEnabled: true }))
    ).toBe(7);
  });

  it('always leaves at least one citizen at the minimum', () => {
    const all = settings({ doctorEnabled: true, informantEnabled: true });
    const assigned = assignRoles(makePlayers(getMinPlayers(all)), all);
    expect(assigned.some((p) => p.role === 'CITIZEN')).toBe(true);
  });
});
