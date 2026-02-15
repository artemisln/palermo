import { useCallback, useReducer, useRef, useState } from 'react';
import { gameReducer } from '@/lib/game-reducer';
import { GameState, GameAction, INITIAL_STATE } from '@/lib/game-types';

const MAX_HISTORY = 20;

// Actions that don't advance the game — no history snapshot needed
const SKIP_HISTORY: Set<GameAction['type']> = new Set([
  'ADD_PLAYER',
  'REMOVE_PLAYER',
  'RENAME_PLAYER',
  'REORDER_PLAYER',
  'UPDATE_SETTINGS',
  'LOAD_SAVED_DATA',
  'SHOW_ROLE',
]);

export function useGameReducer() {
  const [state, rawDispatch] = useReducer(gameReducer, INITIAL_STATE);
  const historyRef = useRef<GameState[]>([]);
  const [canGoBack, setCanGoBack] = useState(false);

  const dispatch = useCallback(
    (action: GameAction) => {
      if (!SKIP_HISTORY.has(action.type)) {
        historyRef.current = [
          ...historyRef.current.slice(-(MAX_HISTORY - 1)),
          state,
        ];
        setCanGoBack(true);
      }
      rawDispatch(action);
    },
    [state],
  );

  const goBack = useCallback(() => {
    const history = historyRef.current;
    if (history.length === 0) return;

    const previous = history[history.length - 1];
    historyRef.current = history.slice(0, -1);
    setCanGoBack(historyRef.current.length > 0);

    // Restore previous state via a special action
    rawDispatch({ type: 'RESTORE_STATE', state: previous });
  }, []);

  return [state, dispatch, canGoBack, goBack] as const;
}
