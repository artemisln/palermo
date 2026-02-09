import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GameState, GameAction, getRoleInfo } from '@/lib/game-types';
import { Palermo, PalermoFonts } from '@/constants/theme';
import { Button } from '@/components/ui/button';
import { FadeView } from '@/components/ui/fade-view';
import { TFunction } from '@/hooks/use-messages';

interface RoleRevealPhaseProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  t: TFunction;
}

export function RoleRevealPhase({ state, dispatch, t }: RoleRevealPhaseProps) {
  const [showingRole, setShowingRole] = useState(false);
  const player = state.players[state.currentPlayerIndex];
  const isLast = state.currentPlayerIndex === state.players.length - 1;

  if (!player) return null;

  const role = player.role ? getRoleInfo(player.role, state.settings.language) : null;
  const isKiller = role?.faction === 'killer';

  if (!showingRole) {
    return (
      <FadeView visible style={styles.container}>
        <Text style={styles.instruction}>{t('reveal.passTo')}</Text>
        <Text style={styles.playerName}>{player.name}</Text>
        <View style={styles.buttonContainer}>
          <Button title={t('reveal.seeRole')} onPress={() => setShowingRole(true)} />
        </View>
      </FadeView>
    );
  }

  return (
    <FadeView visible style={styles.container}>
      <Text style={styles.youAre}>{t('reveal.youAre')}</Text>
      <Text style={[styles.roleName, isKiller ? styles.killer : styles.good]}>
        {role?.name}
      </Text>
      <Text style={styles.description}>{role?.description}</Text>
      {player.isLover && (
        <Text style={styles.loverText}>
          {t('reveal.loverNote')}
        </Text>
      )}
      <View style={styles.buttonContainer}>
        <Button
          title={isLast ? t('reveal.beginNight') : t('reveal.nextPlayer')}
          onPress={() => {
            setShowingRole(false);
            dispatch({ type: 'NEXT_PLAYER' });
          }}
        />
      </View>
    </FadeView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  instruction: {
    color: Palermo.textMuted,
    fontSize: 18,
    marginBottom: 8,
  },
  playerName: {
    color: Palermo.text,
    fontSize: 36,
    fontWeight: '700',
    fontFamily: PalermoFonts?.title,
    textAlign: 'center',
  },
  youAre: {
    color: Palermo.textMuted,
    fontSize: 16,
    marginBottom: 4,
  },
  roleName: {
    fontSize: 38,
    fontWeight: '700',
    fontFamily: PalermoFonts?.title,
    marginBottom: 16,
    textAlign: 'center',
  },
  killer: {
    color: Palermo.danger,
  },
  good: {
    color: Palermo.accent,
  },
  description: {
    color: Palermo.textMuted,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  loverText: {
    color: Palermo.danger,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
  },
  buttonContainer: {
    marginTop: 40,
    width: '100%',
  },
});
