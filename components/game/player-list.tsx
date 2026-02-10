import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Player, getRoleInfo } from '@/lib/game-types';
import { Palermo } from '@/constants/theme';
import { TFunction } from '@/hooks/use-messages';

interface PlayerListProps {
  players: Player[];
  t: TFunction;
  showRoles?: boolean;
  selectable?: boolean;
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  aliveOnly?: boolean;
  language?: 'el' | 'en';
}

export function PlayerList({
  players,
  t,
  showRoles = false,
  selectable = false,
  selectedId,
  onSelect,
  aliveOnly = false,
  language = 'en',
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
        testID={`player-list-item-${item.id}`}
      >
        <View style={styles.nameContainer}>
          <Text style={[styles.name, dead && styles.nameDead]} testID={`player-list-name-${item.id}`}>
            {item.name}
          </Text>
          {item.isLover && showRoles && (
            <Text style={styles.loverBadge} testID={`player-list-lover-${item.id}`}>{t('common.lover')}</Text>
          )}
        </View>
        {showRoles && item.role && (
          <Text
            style={[
              styles.role,
              getRoleInfo(item.role, language).faction === 'killer'
                ? styles.roleKiller
                : styles.roleGood,
            ]}
            testID={`player-list-role-${item.id}`}
          >
            {getRoleInfo(item.role, language).name}
          </Text>
        )}
        {dead && !showRoles && <Text style={styles.deadMark} testID={`player-list-dead-${item.id}`}>{t('common.dead')}</Text>}
      </Pressable>
    );
  }

  return (
    <FlatList
      data={list}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      testID="player-list"
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
