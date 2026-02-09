import { StyleSheet, Text, View } from 'react-native';
import { GameState, GameAction } from '@/lib/game-types';
import { getNarration } from '@/lib/narration';
import { Palermo, PalermoFonts } from '@/constants/theme';
import { Button } from '@/components/ui/button';
import { PlayerList } from './player-list';
import { TFunction } from '@/hooks/use-messages';

interface EndPhaseProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  t: TFunction;
}

function getWinnerText(winner: GameState['winner'], language: 'el' | 'en'): string {
  const narration = getNarration(language);
  switch (winner) {
    case 'GOOD':
      return narration.goodWins;
    case 'KILLERS':
      return narration.killersWin;
    case 'LOVERS':
      return narration.loversWin;
    default:
      return '';
  }
}

function getWinnerColor(winner: GameState['winner']): string {
  switch (winner) {
    case 'GOOD':
      return Palermo.accent;
    case 'KILLERS':
      return Palermo.danger;
    case 'LOVERS':
      return '#E879A8';
    default:
      return Palermo.text;
  }
}

export function EndPhase({ state, dispatch, t }: EndPhaseProps) {
  return (
    <View style={styles.container}>
      <Text style={[styles.winner, { color: getWinnerColor(state.winner) }]}>
        {getWinnerText(state.winner, state.settings.language)}
      </Text>

      <Text style={styles.subtitle}>{t('end.roleReveal')}</Text>

      <View style={styles.listContainer}>
        <PlayerList players={state.players} t={t} showRoles language={state.settings.language} />
      </View>

      <View style={styles.footer}>
        <Button
          title={t('end.newRound')}
          onPress={() => dispatch({ type: 'NEW_ROUND' })}
        />
        <Button
          title={t('end.newGame')}
          onPress={() => dispatch({ type: 'RESET_GAME' })}
          variant="secondary"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
  },
  winner: {
    fontSize: 44,
    fontWeight: '700',
    fontFamily: PalermoFonts?.title,
    textAlign: 'center',
    marginBottom: 32,
    letterSpacing: 2,
  },
  subtitle: {
    color: Palermo.textMuted,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: 16,
  },
  listContainer: {
    flex: 1,
  },
  footer: {
    gap: 10,
    paddingTop: 16,
  },
});
