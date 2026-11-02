import { gameReducer } from '@/lib/game-reducer';
import { GameAction, GameState, INITIAL_STATE } from '@/lib/game-types';
import { settings, withRoles } from './helpers';

function run(state: GameState, ...actions: GameAction[]): GameState {
  return actions.reduce(gameReducer, state);
}

function inGame(players = withRoles(['HIDDEN_KILLER', 'REVEALED_KILLER', 'DETECTIVE', 'CITIZEN', 'CITIZEN', 'CITIZEN'])): GameState {
  return { ...INITIAL_STATE, phase: 'VOTING', players };
}

describe('setup', () => {
  it('trims names and ignores empty ones', () => {
    const state = run(
      INITIAL_STATE,
      { type: 'ADD_PLAYER', name: '  Maria ' },
      { type: 'ADD_PLAYER', name: '   ' }
    );
    expect(state.players.map((p) => p.name)).toEqual(['Maria']);
  });

  it('gives every player a unique id', () => {
    const state = run(
      INITIAL_STATE,
      { type: 'ADD_PLAYER', name: 'A' },
      { type: 'ADD_PLAYER', name: 'A' }
    );
    expect(state.players[0].id).not.toBe(state.players[1].id);
  });

  it('reorders players and stops at the edges', () => {
    let state = run(
      INITIAL_STATE,
      { type: 'ADD_PLAYER', name: 'A' },
      { type: 'ADD_PLAYER', name: 'B' }
    );
    const [a] = state.players;
    state = gameReducer(state, { type: 'REORDER_PLAYER', id: a.id, direction: 'up' });
    expect(state.players.map((p) => p.name)).toEqual(['A', 'B']);
    state = gameReducer(state, { type: 'REORDER_PLAYER', id: a.id, direction: 'down' });
    expect(state.players.map((p) => p.name)).toEqual(['B', 'A']);
  });
});

describe('phase transitions', () => {
  it('goes from setup through role reveal to the first night and then voting', () => {
    let state = INITIAL_STATE;
    for (const name of ['A', 'B', 'C', 'D', 'E']) {
      state = gameReducer(state, { type: 'ADD_PLAYER', name });
    }

    state = gameReducer(state, { type: 'START_GAME' });
    expect(state.phase).toBe('ROLE_REVEAL');
    expect(state.players.every((p) => p.role !== null)).toBe(true);

    for (let i = 0; i < 4; i++) {
      state = gameReducer(state, { type: 'NEXT_PLAYER' });
      expect(state.phase).toBe('ROLE_REVEAL');
      expect(state.currentPlayerIndex).toBe(i + 1);
    }
    state = gameReducer(state, { type: 'NEXT_PLAYER' });
    expect(state.phase).toBe('NIGHT_INTRO');
    expect(state.currentPlayerIndex).toBe(0);

    state = gameReducer(state, { type: 'FINISH_NIGHT_INTRO' });
    expect(state.phase).toBe('VOTING');
  });

  it('moves to the night after a vote that does not end the game', () => {
    const state = gameReducer(inGame(), { type: 'ELIMINATE_PLAYER', playerId: 'p4' });
    expect(state.phase).toBe('NIGHT_KILL');
    expect(state.players.find((p) => p.id === 'p4')?.alive).toBe(false);
  });

  it('moves back to the day after the night victim is announced', () => {
    const night = { ...inGame(), phase: 'NIGHT_KILL' as const };
    const state = gameReducer(night, { type: 'ANNOUNCE_VICTIM', victimId: 'p4', doctorSaved: false });
    expect(state.phase).toBe('VOTING');
    expect(state.round).toBe(2);
    expect(state.players.find((p) => p.id === 'p4')?.alive).toBe(false);
  });

  it('keeps the victim alive when the doctor saved them', () => {
    const night = { ...inGame(), phase: 'NIGHT_KILL' as const };
    const state = gameReducer(night, { type: 'ANNOUNCE_VICTIM', victimId: 'p4', doctorSaved: true });
    expect(state.players.every((p) => p.alive)).toBe(true);
    expect(state.phase).toBe('VOTING');
  });

  it('handles a night with no victim', () => {
    const night = { ...inGame(), phase: 'NIGHT_KILL' as const };
    const state = gameReducer(night, { type: 'ANNOUNCE_VICTIM', victimId: null, doctorSaved: false });
    expect(state.players.every((p) => p.alive)).toBe(true);
    expect(state.round).toBe(2);
  });
});

describe('game end', () => {
  it('ends with Good winning when the vote removes the last killer', () => {
    const players = withRoles(
      ['HIDDEN_KILLER', 'REVEALED_KILLER', 'DETECTIVE', 'CITIZEN', 'CITIZEN'],
      [{}, { alive: false }]
    );
    const state = gameReducer(inGame(players), { type: 'ELIMINATE_PLAYER', playerId: 'p1' });
    expect(state.phase).toBe('END');
    expect(state.winner).toBe('GOOD');
  });

  it('ends with the Killers winning when a night kill evens the numbers', () => {
    const players = withRoles(
      ['HIDDEN_KILLER', 'REVEALED_KILLER', 'DETECTIVE', 'CITIZEN', 'CITIZEN'],
      [{}, {}, {}, {}, { alive: false }]
    );
    const night = { ...inGame(players), phase: 'NIGHT_KILL' as const };
    const state = gameReducer(night, { type: 'ANNOUNCE_VICTIM', victimId: 'p3', doctorSaved: false });
    expect(state.phase).toBe('END');
    expect(state.winner).toBe('KILLERS');
  });
});

describe('lovers', () => {
  const loverPlayers = () =>
    withRoles(
      ['HIDDEN_KILLER', 'REVEALED_KILLER', 'DETECTIVE', 'CITIZEN', 'CITIZEN', 'CITIZEN', 'CITIZEN'],
      [{}, {}, {}, { isLover: true }, {}, { isLover: true }]
    );

  it('kills the partner when a lover is voted out', () => {
    const state = gameReducer(inGame(loverPlayers()), { type: 'ELIMINATE_PLAYER', playerId: 'p4' });
    expect(state.players.find((p) => p.id === 'p6')?.alive).toBe(false);
  });

  it('kills the partner when a lover dies at night', () => {
    const night = { ...inGame(loverPlayers()), phase: 'NIGHT_KILL' as const };
    const state = gameReducer(night, { type: 'ANNOUNCE_VICTIM', victimId: 'p6', doctorSaved: false });
    expect(state.players.find((p) => p.id === 'p4')?.alive).toBe(false);
  });

  it('can hand the Killers the win through the linked death', () => {
    // 2 killers vs 3 good, one vote takes out both lovers: 2 vs 1
    const players = withRoles(
      ['HIDDEN_KILLER', 'REVEALED_KILLER', 'DETECTIVE', 'CITIZEN', 'CITIZEN'],
      [{}, {}, {}, { isLover: true }, { isLover: true }]
    );
    const state = gameReducer(inGame(players), { type: 'ELIMINATE_PLAYER', playerId: 'p4' });
    expect(state.winner).toBe('KILLERS');
  });
});

describe('new round and reset', () => {
  it('keeps names and settings but clears roles for a new round', () => {
    const ended: GameState = {
      ...inGame(),
      phase: 'END',
      winner: 'GOOD',
      round: 4,
      settings: settings({ doctorEnabled: true, language: 'en' }),
    };
    const state = gameReducer(ended, { type: 'NEW_ROUND' });
    expect(state.phase).toBe('SETUP');
    expect(state.round).toBe(1);
    expect(state.winner).toBeNull();
    expect(state.settings).toEqual(ended.settings);
    expect(state.players.map((p) => p.name)).toEqual(ended.players.map((p) => p.name));
    expect(state.players.every((p) => p.role === null && p.alive && !p.isLover)).toBe(true);
  });

  it('clears everything on reset', () => {
    expect(gameReducer(inGame(), { type: 'RESET_GAME' })).toEqual(INITIAL_STATE);
  });

  it('restores a saved state for the back button', () => {
    const saved = inGame();
    expect(gameReducer(INITIAL_STATE, { type: 'RESTORE_STATE', state: saved })).toBe(saved);
  });
});
