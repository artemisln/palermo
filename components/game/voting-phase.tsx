import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { GameState, GameAction, Player } from '@/lib/game-types';
import { Palermo, PalermoFonts } from '@/constants/theme';
import { Button } from '@/components/ui/button';
import { FadeView } from '@/components/ui/fade-view';

interface VotingPhaseProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export function VotingPhase({ state, dispatch }: VotingPhaseProps) {
  const alivePlayers = state.players.filter((p) => p.alive);
  const [votes, setVotes] = useState<Record<string, number>>(() =>
    Object.fromEntries(alivePlayers.map((p) => [p.id, 0]))
  );
  const [eliminated, setEliminated] = useState<{
    player: Player;
    voteCount: number;
    wasTie: boolean;
  } | null>(null);
  const totalVotes = Object.values(votes).reduce((a, b) => a + b, 0);

  function addVote(id: string) {
    setVotes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  }

  function removeVote(id: string) {
    setVotes((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) - 1),
    }));
  }

  function endVoting() {
    const maxVotes = Math.max(...Object.values(votes));
    if (maxVotes === 0) return;

    const topPlayers = alivePlayers.filter((p) => (votes[p.id] || 0) === maxVotes);
    const chosen =
      topPlayers.length === 1
        ? topPlayers[0]
        : topPlayers[Math.floor(Math.random() * topPlayers.length)];

    setEliminated({
      player: chosen,
      voteCount: maxVotes,
      wasTie: topPlayers.length > 1,
    });
  }

  function confirmElimination() {
    if (eliminated) {
      dispatch({ type: 'ELIMINATE_PLAYER', playerId: eliminated.player.id });
    }
  }

  // Announcement screen after voting
  if (eliminated) {
    return (
      <View style={styles.container}>
        <FadeView visible style={styles.announcement}>
          <Text style={styles.announcementLabel}>ELIMINATED</Text>
          <Text style={styles.announcementName}>{eliminated.player.name}</Text>
          <Text style={styles.announcementVotes}>
            {eliminated.voteCount} vote{eliminated.voteCount !== 1 ? 's' : ''}
          </Text>
          {eliminated.wasTie && (
            <Text style={styles.tieNote}>Tied vote — selected randomly</Text>
          )}
          <View style={styles.announcementButton}>
            <Button title="Continue" onPress={confirmElimination} variant="danger" />
          </View>
        </FadeView>
      </View>
    );
  }

  function renderItem({ item }: { item: Player }) {
    const count = votes[item.id] || 0;

    return (
      <View style={styles.row}>
        <View style={styles.nameArea}>
          <Text style={styles.playerName}>{item.name}</Text>
        </View>

        <View style={styles.voteArea}>
          <Pressable
            onPress={() => removeVote(item.id)}
            style={[styles.voteButton, count === 0 && styles.voteButtonDisabled]}
            disabled={count === 0}
            hitSlop={4}
          >
            <Text style={styles.voteButtonText}>-</Text>
          </Pressable>

          <Text style={[styles.voteCount, count > 0 && styles.voteCountActive]}>
            {count}
          </Text>

          <Pressable
            onPress={() => addVote(item.id)}
            style={styles.voteButton}
            hitSlop={4}
          >
            <Text style={styles.voteButtonText}>+</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.phase}>VOTE</Text>
      <Text style={styles.title}>Who is eliminated?</Text>
      <Text style={styles.subtitle}>
        Tap + to add votes for each player
      </Text>

      <View style={styles.listContainer}>
        <FlatList
          data={alivePlayers}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.totalVotes}>
          {totalVotes} vote{totalVotes !== 1 ? 's' : ''} cast
        </Text>
        <Button
          title="End Voting"
          onPress={endVoting}
          disabled={totalVotes === 0}
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
  listContent: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Palermo.card,
    borderRadius: 10,
  },
  nameArea: {
    flex: 1,
  },
  playerName: {
    color: Palermo.text,
    fontSize: 18,
    fontWeight: '500',
  },
  voteArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  voteButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: Palermo.backgroundLight,
    borderWidth: 1,
    borderColor: Palermo.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voteButtonDisabled: {
    opacity: 0.25,
  },
  voteButtonText: {
    color: Palermo.text,
    fontSize: 20,
    fontWeight: '600',
  },
  voteCount: {
    color: Palermo.textDead,
    fontSize: 20,
    fontWeight: '700',
    minWidth: 24,
    textAlign: 'center',
  },
  voteCountActive: {
    color: Palermo.danger,
  },
  footer: {
    gap: 10,
    paddingTop: 16,
  },
  totalVotes: {
    color: Palermo.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
  // Announcement screen
  announcement: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  announcementLabel: {
    color: Palermo.danger,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 3,
    marginBottom: 8,
  },
  announcementName: {
    color: Palermo.text,
    fontSize: 42,
    fontWeight: '700',
    fontFamily: PalermoFonts?.title,
    textAlign: 'center',
  },
  announcementVotes: {
    color: Palermo.textMuted,
    fontSize: 18,
  },
  tieNote: {
    color: Palermo.textDead,
    fontSize: 14,
    marginTop: 4,
  },
  announcementButton: {
    marginTop: 40,
    width: '100%',
  },
});
