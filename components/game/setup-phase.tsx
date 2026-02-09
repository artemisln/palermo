import { Button } from '@/components/ui/button';
import { Palermo, PalermoFonts } from '@/constants/theme';
import { GameAction, GameState, getMinPlayers } from '@/lib/game-types';
import { useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SettingsModal } from './settings-modal';

interface SetupPhaseProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export function SetupPhase({ state, dispatch }: SetupPhaseProps) {
  const [name, setName] = useState('');
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const inputRef = useRef<TextInput>(null);
  const minPlayers = getMinPlayers(state.settings);
  const canStart = state.players.length >= minPlayers;

  function addPlayers() {
    const names = name
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean);
    if (names.length === 0) return;
    for (const n of names) {
      dispatch({ type: 'ADD_PLAYER', name: n });
    }
    setName('');
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function startEditing(id: string, currentName: string) {
    setEditingId(id);
    setEditingName(currentName);
  }

  function finishEditing() {
    if (editingId && editingName.trim()) {
      dispatch({ type: 'RENAME_PLAYER', id: editingId, name: editingName });
    }
    setEditingId(null);
    setEditingName('');
  }

  function handleStart() {
    if (!canStart) {
      Alert.alert(
        'Not enough players',
        `You need at least ${minPlayers} players with the current settings.`
      );
      return;
    }
    dispatch({ type: 'START_GAME' });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PALERMO</Text>
        <Pressable onPress={() => setSettingsVisible(true)} hitSlop={12}>
          <Text style={styles.gear}>&#9881;</Text>
        </Pressable>
      </View>

      <Text style={styles.subtitle}>Add players (comma-separated for multiple)</Text>

      <View style={styles.inputRow}>
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Name"
          placeholderTextColor={Palermo.textDead}
          onSubmitEditing={addPlayers}
          blurOnSubmit={false}
          returnKeyType="done"
          autoCapitalize="words"
        />
        <Pressable
          onPress={addPlayers}
          style={[styles.addButton, !name.trim() && styles.addButtonDisabled]}
          disabled={!name.trim()}
        >
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>

      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      >
        {state.players.map((player, i) => (
          <View key={player.id} style={styles.playerRow}>
            <Text style={styles.playerNumber}>{i + 1}</Text>

            {editingId === player.id ? (
              <TextInput
                style={styles.editInput}
                value={editingName}
                onChangeText={setEditingName}
                onSubmitEditing={finishEditing}
                onBlur={finishEditing}
                autoFocus
                selectTextOnFocus
                returnKeyType="done"
                autoCapitalize="words"
              />
            ) : (
              <Pressable
                style={styles.namePress}
                onPress={() => startEditing(player.id, player.name)}
              >
                <Text style={styles.playerName}>{player.name}</Text>
              </Pressable>
            )}

            <View style={styles.actions}>
              <Pressable
                onPress={() =>
                  dispatch({ type: 'REORDER_PLAYER', id: player.id, direction: 'up' })
                }
                hitSlop={6}
                disabled={i === 0}
                style={i === 0 && styles.actionDisabled}
              >
                <Text style={styles.arrow}>&#9650;</Text>
              </Pressable>
              <Pressable
                onPress={() =>
                  dispatch({
                    type: 'REORDER_PLAYER',
                    id: player.id,
                    direction: 'down',
                  })
                }
                hitSlop={6}
                disabled={i === state.players.length - 1}
                style={i === state.players.length - 1 && styles.actionDisabled}
              >
                <Text style={styles.arrow}>&#9660;</Text>
              </Pressable>
              <Pressable
                onPress={() => dispatch({ type: 'REMOVE_PLAYER', id: player.id })}
                hitSlop={8}
              >
                <Text style={styles.removeButton}>X</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.count}>
          {state.players.length} player{state.players.length !== 1 ? 's' : ''}
          {!canStart ? ` (need ${minPlayers})` : ''}
        </Text>
        <Button title="START GAME" onPress={handleStart} disabled={!canStart} />
      </View>

      <SettingsModal
        visible={settingsVisible}
        settings={state.settings}
        onUpdate={(s) => dispatch({ type: 'UPDATE_SETTINGS', settings: s })}
        onClose={() => setSettingsVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: Palermo.text,
    fontSize: 42,
    fontWeight: '700',
    fontFamily: PalermoFonts?.title,
    letterSpacing: 4,
  },
  gear: {
    color: Palermo.textMuted,
    fontSize: 28,
  },
  subtitle: {
    color: Palermo.textMuted,
    fontSize: 14,
    marginBottom: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    backgroundColor: Palermo.card,
    color: Palermo.text,
    fontSize: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Palermo.border,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: Palermo.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    opacity: 0.4,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: 6,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: Palermo.card,
    borderRadius: 10,
    gap: 10,
  },
  playerNumber: {
    color: Palermo.textDead,
    fontSize: 14,
    width: 20,
    textAlign: 'center',
  },
  namePress: {
    flex: 1,
  },
  playerName: {
    color: Palermo.text,
    fontSize: 18,
    fontWeight: '500',
  },
  editInput: {
    flex: 1,
    height: 36,
    color: Palermo.text,
    fontSize: 18,
    fontWeight: '500',
    backgroundColor: Palermo.backgroundLight,
    borderRadius: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: Palermo.accent,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  arrow: {
    color: Palermo.textMuted,
    fontSize: 12,
  },
  actionDisabled: {
    opacity: 0.2,
  },
  removeButton: {
    color: Palermo.danger,
    fontSize: 16,
    fontWeight: '700',
  },
  footer: {
    gap: 12,
    paddingTop: 16,
  },
  count: {
    color: Palermo.textMuted,
    fontSize: 14,
    textAlign: 'center',
  },
});
