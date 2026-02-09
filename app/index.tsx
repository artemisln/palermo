import { useEffect, useReducer } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { gameReducer } from '@/lib/game-reducer';
import { INITIAL_STATE } from '@/lib/game-types';
import { useGameStorage } from '@/hooks/use-game-storage';
import { Palermo } from '@/constants/theme';

import { SetupPhase } from '@/components/game/setup-phase';
import { RoleRevealPhase } from '@/components/game/role-reveal-phase';
import { NightIntroPhase } from '@/components/game/night-intro-phase';
import { DayDiscussionPhase } from '@/components/game/day-discussion-phase';
import { VotingPhase } from '@/components/game/voting-phase';
import { NightKillPhase } from '@/components/game/night-kill-phase';
import { EndPhase } from '@/components/game/end-phase';

export default function GameScreen() {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  const { loadPlayerNames, loadSettings, savePlayerNames, saveSettings } =
    useGameStorage();

  // Load persisted data on mount
  useEffect(() => {
    (async () => {
      const [players, settings] = await Promise.all([
        loadPlayerNames(),
        loadSettings(),
      ]);
      if (players.length > 0) {
        dispatch({ type: 'LOAD_SAVED_DATA', players, settings });
      }
    })();
  }, []);

  // Save on game start
  useEffect(() => {
    if (state.phase === 'ROLE_REVEAL') {
      savePlayerNames(state.players.map((p) => p.name));
      saveSettings(state.settings);
    }
  }, [state.phase]);

  function renderPhase() {
    switch (state.phase) {
      case 'SETUP':
        return <SetupPhase state={state} dispatch={dispatch} />;
      case 'ROLE_REVEAL':
        return <RoleRevealPhase state={state} dispatch={dispatch} />;
      case 'NIGHT_INTRO':
        return <NightIntroPhase state={state} dispatch={dispatch} />;
      case 'DAY_DISCUSSION':
        return <DayDiscussionPhase state={state} dispatch={dispatch} />;
      case 'VOTING':
        return <VotingPhase state={state} dispatch={dispatch} />;
      case 'NIGHT_KILL':
        return <NightKillPhase state={state} dispatch={dispatch} />;
      case 'END':
        return <EndPhase state={state} dispatch={dispatch} />;
    }
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        {renderPhase()}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Palermo.background,
  },
  safe: {
    flex: 1,
  },
});
