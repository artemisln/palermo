import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Player, ROLE_INFO } from '@/lib/game-types';
import { Palermo } from '@/constants/theme';

interface PlayerListProps {
  players: Player[];
  showRoles?: boolean;
  selectable?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  aliveOnly?: boolean;
}

export function PlayerList({
  players,
  showRoles = false,
  selectable = false,
  selectedId,
  onSelect,
  aliveOnly = false,
}: PlayerListProps) {
  const list = aliveOnly ? players.filter((p) => p.alive) : players;

  function renderItem({ item }: { item: Player }) {
    const isSelected = selectedId === item.id;
    const dead = !item.alive;

    return (
      <Pressable
        onPress={() => selectable && !dead && onSelect?.(item.id)}
        disabled={!selectable || dead}
        style={[
          styles.row,
          isSelected && styles.rowSelected,
          dead && styles.rowDead,
        ]}
      >
        <View style={styles.nameContainer}>
          <Text style={[styles.name, dead && styles.nameDead]}>
            {item.name}
          </Text>
          {item.isLover && showRoles && (
            <Text style={styles.loverBadge}>Lover</Text>
          )}
        </View>
        {showRoles && item.role && (
          <Text
            style={[
              styles.role,
              ROLE_INFO[item.role].faction === 'killer'
                ? styles.roleKiller
                : styles.roleGood,
            ]}
          >
            {ROLE_INFO[item.role].name}
          </Text>
        )}
        {dead && !showRoles && <Text style={styles.deadMark}>DEAD</Text>}
      </Pressable>
    );
  }

  return (
    <FlatList
      data={list}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: Palermo.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  rowSelected: {
    borderColor: Palermo.accent,
    backgroundColor: Palermo.backgroundLight,
  },
  rowDead: {
    opacity: 0.4,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  name: {
    color: Palermo.text,
    fontSize: 18,
    fontWeight: '500',
  },
  nameDead: {
    textDecorationLine: 'line-through',
    color: Palermo.textDead,
  },
  loverBadge: {
    color: Palermo.danger,
    fontSize: 12,
    fontWeight: '600',
  },
  role: {
    fontSize: 14,
    fontWeight: '600',
  },
  roleKiller: {
    color: Palermo.danger,
  },
  roleGood: {
    color: Palermo.accent,
  },
  deadMark: {
    color: Palermo.textDead,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
});
