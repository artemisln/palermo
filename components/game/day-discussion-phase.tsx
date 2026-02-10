import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GameState, GameAction } from '@/lib/game-types';
import { Palermo, PalermoFonts } from '@/constants/theme';
import { Button } from '@/components/ui/button';
import { PlayerList } from './player-list';
import { TFunction } from '@/hooks/use-messages';

interface DayDiscussionPhaseProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  t: TFunction;
}

const DISCUSSION_SECONDS = 180; // 3 minutes

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function DayDiscussionPhase({ state, dispatch, t }: DayDiscussionPhaseProps) {
  const [timeLeft, setTimeLeft] = useState(DISCUSSION_SECONDS);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  return (
    <View style={styles.container} testID="day-discussion-phase">
      <Text style={styles.phase} testID="day-phase-label">{t('day.discussion')}</Text>
      <Text style={[styles.timer, timeLeft === 0 && styles.timerDone]} testID="day-timer">
        {timeLeft > 0 ? formatTime(timeLeft) : t('day.timeUp')}
      </Text>
      <Text style={styles.subtitle} testID="day-round-subtitle">
        {t('day.roundSubtitle', { round: state.round })}
      </Text>

      <View style={styles.listContainer}>
        <PlayerList players={state.players} t={t} />
      </View>

      <View style={styles.footer}>
        <Button title={t('day.beginVoting')} onPress={() => dispatch({ type: 'START_VOTING' })} testID="begin-voting-button" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  phase: {
    color: Palermo.accent,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 8,
  },
  timer: {
    color: Palermo.text,
    fontSize: 56,
    fontWeight: '300',
    fontFamily: PalermoFonts?.title,
    textAlign: 'center',
    marginBottom: 8,
  },
  timerDone: {
    color: Palermo.danger,
    fontSize: 32,
    fontWeight: '600',
  },
  subtitle: {
    color: Palermo.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  listContainer: {
    flex: 1,
  },
  footer: {
    paddingTop: 16,
  },
});
