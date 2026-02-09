import { Modal, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { GameSettings } from '@/lib/game-types';
import { Palermo } from '@/constants/theme';

interface SettingsModalProps {
  visible: boolean;
  settings: GameSettings;
  onUpdate: (settings: Partial<GameSettings>) => void;
  onClose: () => void;
}

const ROLES = [
  {
    key: 'doctorEnabled' as const,
    name: 'Doctor',
    description: 'Saves one player each night',
    min: '6+ players',
  },
  {
    key: 'informantEnabled' as const,
    name: 'Informant',
    description: 'Receives limited info each night',
    min: '7+ players',
  },
  {
    key: 'loversEnabled' as const,
    name: 'Lovers',
    description: 'Two linked players — if one dies, both die',
    min: '7+ players',
  },
];

export function SettingsModal({ visible, settings, onUpdate, onClose }: SettingsModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.card} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.title}>Optional Roles</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text style={styles.close}>X</Text>
            </Pressable>
          </View>

          {ROLES.map((role) => (
            <View key={role.key} style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.roleName}>{role.name}</Text>
                <Text style={styles.roleDesc}>{role.description}</Text>
                <Text style={styles.roleMin}>{role.min}</Text>
              </View>
              <Switch
                value={settings[role.key]}
                onValueChange={(v) => onUpdate({ [role.key]: v })}
                trackColor={{ false: Palermo.border, true: Palermo.accentMuted }}
                thumbColor={settings[role.key] ? Palermo.accent : Palermo.textMuted}
              />
            </View>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Palermo.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: Palermo.card,
    borderRadius: 16,
    padding: 24,
    gap: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: Palermo.text,
    fontSize: 22,
    fontWeight: '700',
  },
  close: {
    color: Palermo.textMuted,
    fontSize: 18,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  roleName: {
    color: Palermo.text,
    fontSize: 16,
    fontWeight: '600',
  },
  roleDesc: {
    color: Palermo.textMuted,
    fontSize: 13,
  },
  roleMin: {
    color: Palermo.textDead,
    fontSize: 11,
  },
});
