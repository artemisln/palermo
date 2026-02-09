import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GameState, GameAction } from '@/lib/game-types';
import { Palermo, PalermoFonts } from '@/constants/theme';
import { Button } from '@/components/ui/button';
import { PlayerList } from './player-list';

interface VotingPhaseProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export function VotingPhase({ state, dispatch }: VotingPhaseProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = state.players.find((p) => p.id === selectedId);

  return (
    <View style={styles.container}>
      <Text style={styles.phase}>VOTE</Text>
      <Text style={styles.title}>Who is eliminated?</Text>
      <Text style={styles.subtitle}>
        Select the player the group voted to eliminate
      </Text>

      <View style={styles.listContainer}>
        <PlayerList
          players={state.players}
          aliveOnly
          selectable
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </View>

      <View style={styles.footer}>
        <Button
          title={selected ? `Eliminate ${selected.name}` : 'Select a player'}
          onPress={() => {
            if (selectedId) {
              dispatch({ type: 'ELIMINATE_PLAYER', playerId: selectedId });
            }
          }}
          disabled={!selectedId}
          variant="danger"
        />
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
    color: Palermo.danger,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 3,
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    color: Palermo.text,
    fontSize: 28,
    fontWeight: '700',
    fontFamily: PalermoFonts?.title,
    textAlign: 'center',
    marginBottom: 8,
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
