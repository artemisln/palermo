import { GameState, GameAction, INITIAL_STATE } from './game-types';
import { assignRoles } from './role-assignment';
import { checkWinCondition } from './win-conditions';

let nextId = 1;
function generateId(): string {
  return `player_${nextId++}_${Date.now()}`;
}

function applyLinkedDeath(players: typeof INITIAL_STATE.players): typeof INITIAL_STATE.players {
  // If a dead lover exists, kill their partner too
  const deadLover = players.find((p) => !p.alive && p.isLover);
  if (!deadLover) return players;

  return players.map((p) => {
    if (p.isLover && p.alive) {
      return { ...p, alive: false };
    }
    return p;
  });
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_PLAYER': {
      const trimmed = action.name.trim();
      if (!trimmed) return state;
      return {
        ...state,
        players: [
          ...state.players,
          { id: generateId(), name: trimmed, role: null, alive: true, isLover: false },
        ],
      };
    }

    case 'REMOVE_PLAYER':
      return {
        ...state,
        players: state.players.filter((p) => p.id !== action.id),
      };

    case 'RENAME_PLAYER': {
      const trimmed = action.name.trim();
      if (!trimmed) return state;
      return {
        ...state,
        players: state.players.map((p) =>
          p.id === action.id ? { ...p, name: trimmed } : p
        ),
      };
    }

    case 'REORDER_PLAYER': {
      const idx = state.players.findIndex((p) => p.id === action.id);
      if (idx === -1) return state;
      const swapIdx = action.direction === 'up' ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= state.players.length) return state;
      const players = [...state.players];
      [players[idx], players[swapIdx]] = [players[swapIdx], players[idx]];
      return { ...state, players };
    }

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.settings },
      };

    case 'LOAD_SAVED_DATA': {
      const players = action.players.map((name) => ({
        id: generateId(),
        name,
        role: null as null,
        alive: true,
        isLover: false,
      }));
      return {
        ...state,
        players,
        settings: action.settings,
      };
    }

    case 'START_GAME': {
      const assigned = assignRoles(state.players, state.settings);
      return {
        ...state,
        phase: 'ROLE_REVEAL',
        players: assigned,
        currentPlayerIndex: 0,
      };
    }

    case 'SHOW_ROLE':
      return state; // UI-only toggle, no state change needed

    case 'NEXT_PLAYER': {
      const nextIndex = state.currentPlayerIndex + 1;
      if (nextIndex >= state.players.length) {
        return { ...state, phase: 'NIGHT_INTRO', currentPlayerIndex: 0 };
      }
      return { ...state, currentPlayerIndex: nextIndex };
    }

    case 'FINISH_NIGHT_INTRO':
      return { ...state, phase: 'DAY_DISCUSSION' };

    case 'START_VOTING':
      return { ...state, phase: 'VOTING' };

    case 'ELIMINATE_PLAYER': {
      let players = state.players.map((p) =>
        p.id === action.playerId ? { ...p, alive: false } : p
      );
      players = applyLinkedDeath(players);
      const winner = checkWinCondition(players, state.settings);
      if (winner) {
        return { ...state, players, phase: 'END', winner };
      }
      return { ...state, players, phase: 'NIGHT_KILL' };
    }

    case 'START_NIGHT_KILL':
      return { ...state, phase: 'NIGHT_KILL' };

    case 'ANNOUNCE_VICTIM': {
      let players = state.players;
      if (action.victimId && !action.doctorSaved) {
        players = players.map((p) =>
          p.id === action.victimId ? { ...p, alive: false } : p
        );
        players = applyLinkedDeath(players);
      }
      const winner = checkWinCondition(players, state.settings);
      if (winner) {
        return { ...state, players, phase: 'END', winner };
      }
      return { ...state, players, phase: 'DAY_DISCUSSION', round: state.round + 1 };
    }

    case 'NEW_ROUND':
      return {
        ...INITIAL_STATE,
        players: state.players.map((p) => ({
          ...p,
          role: null,
          alive: true,
          isLover: false,
        })),
        settings: state.settings,
      };

    case 'RESET_GAME':
      return { ...INITIAL_STATE };

    default:
      return state;
  }
}
