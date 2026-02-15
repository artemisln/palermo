import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGameReducer } from '@/hooks/use-game-reducer';
import { useGameStorage } from '@/hooks/use-game-storage';
import { useMessages } from '@/hooks/use-messages';
import { Palermo } from '@/constants/theme';
import { BackButton } from '@/components/ui/back-button';

import { SetupPhase } from '@/components/game/setup-phase';
import { RoleRevealPhase } from '@/components/game/role-reveal-phase';
import { NightIntroPhase } from '@/components/game/night-intro-phase';
import { VotingPhase } from '@/components/game/voting-phase';
import { NightKillPhase } from '@/components/game/night-kill-phase';
import { EndPhase } from '@/components/game/end-phase';

export default function GameScreen() {
  const [state, dispatch, canGoBack, goBack] = useGameReducer();
  const { loadPlayerNames, loadSettings, savePlayerNames, saveSettings } =
    useGameStorage();
  const t = useMessages(state.settings.language);

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
  }, [loadPlayerNames, loadSettings]);

  useEffect(() => {
    if (state.phase === 'ROLE_REVEAL') {
      savePlayerNames(state.players.map((p) => p.name));
      saveSettings(state.settings);
    }
  }, [savePlayerNames, saveSettings, state.phase, state.players, state.settings]);

  function renderPhase() {
    switch (state.phase) {
      case 'SETUP':
        return <SetupPhase state={state} dispatch={dispatch} t={t} />;
      case 'ROLE_REVEAL':
        return <RoleRevealPhase state={state} dispatch={dispatch} t={t} />;
      case 'NIGHT_INTRO':
        return <NightIntroPhase state={state} dispatch={dispatch} t={t} />;
      case 'VOTING':
        return <VotingPhase state={state} dispatch={dispatch} t={t} />;
      case 'NIGHT_KILL':
        return <NightKillPhase state={state} dispatch={dispatch} t={t} />;
      case 'END':
        return <EndPhase state={state} dispatch={dispatch} t={t} />;
    }
  }

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        {canGoBack && state.phase !== 'SETUP' && (
          <BackButton onPress={goBack} />
        )}
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
