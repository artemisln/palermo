import { checkWinCondition } from '@/lib/win-conditions';
import { settings, withRoles } from './helpers';

const BASE = ['HIDDEN_KILLER', 'REVEALED_KILLER', 'DETECTIVE', 'CITIZEN', 'CITIZEN'] as const;

describe('checkWinCondition', () => {
  it('returns null while the game is still open', () => {
    expect(checkWinCondition(withRoles([...BASE]), settings())).toBeNull();
  });

  it('gives the win to Good once both killers are dead', () => {
    const players = withRoles([...BASE], [{ alive: false }, { alive: false }]);
    expect(checkWinCondition(players, settings())).toBe('GOOD');
  });

  it('keeps going while one killer is still alive', () => {
    const players = withRoles([...BASE], [{ alive: false }]);
    expect(checkWinCondition(players, settings())).toBeNull();
  });

  it('gives the win to the Killers when they equal the good players', () => {
    // 2 killers vs detective + 1 citizen
    const players = withRoles([...BASE], [{}, {}, {}, { alive: false }]);
    expect(checkWinCondition(players, settings())).toBe('KILLERS');
  });

  it('gives the win to the Killers when one killer faces one good player', () => {
    const players = withRoles([...BASE], [{}, { alive: false }, { alive: false }, {}, { alive: false }]);
    expect(checkWinCondition(players, settings())).toBe('KILLERS');
  });

  it('counts the doctor and informant as good', () => {
    const players = withRoles(['HIDDEN_KILLER', 'REVEALED_KILLER', 'DOCTOR', 'INFORMANT', 'CITIZEN']);
    expect(checkWinCondition(players, settings())).toBeNull();
  });

  it('gives the win to the Lovers when they are the last two alive', () => {
    const players = withRoles(
      ['HIDDEN_KILLER', 'REVEALED_KILLER', 'DETECTIVE', 'CITIZEN', 'CITIZEN', 'CITIZEN', 'CITIZEN'],
      [{ isLover: true }, { alive: false }, { alive: false }, { isLover: true }, { alive: false }, { alive: false }, { alive: false }]
    );
    // A killer and a citizen alone would be a Killers win, but the lovers check comes first.
    expect(checkWinCondition(players, settings({ loversEnabled: true }))).toBe('LOVERS');
  });

  it('ignores lover flags when the lovers option is off', () => {
    const players = withRoles(
      [...BASE],
      [{ isLover: true }, { alive: false }, { alive: false }, { isLover: true }, { alive: false }]
    );
    expect(checkWinCondition(players, settings())).toBe('KILLERS');
  });

  it('does not give the Lovers the win if only one of the last two is a lover', () => {
    const players = withRoles(
      [...BASE],
      [{}, { alive: false }, { alive: false }, { isLover: true }, { alive: false }]
    );
    expect(checkWinCondition(players, settings({ loversEnabled: true }))).toBe('KILLERS');
  });
});
