import { Modal, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { GameSettings } from '@/lib/game-types';
import { Palermo } from '@/constants/theme';
import { TFunction } from '@/hooks/use-messages';
import { MessageKey } from '@/lib/messages';

interface SettingsModalProps {
  visible: boolean;
  settings: GameSettings;
  onUpdate: (settings: Partial<GameSettings>) => void;
  onClose: () => void;
  t: TFunction;
}

const ROLES: { key: 'doctorEnabled' | 'informantEnabled' | 'loversEnabled'; nameKey: MessageKey; descKey: MessageKey; minKey: MessageKey }[] = [
  {
    key: 'doctorEnabled',
    nameKey: 'settings.doctor',
    descKey: 'settings.doctorDesc',
    minKey: 'settings.doctorMin',
  },
  {
    key: 'informantEnabled',
    nameKey: 'settings.informant',
    descKey: 'settings.informantDesc',
    minKey: 'settings.informantMin',
  },
  {
    key: 'loversEnabled',
    nameKey: 'settings.lovers',
    descKey: 'settings.loversDesc',
    minKey: 'settings.loversMin',
  },
];

export function SettingsModal({ visible, settings, onUpdate, onClose, t }: SettingsModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.card} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('settings.title')}</Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Text style={styles.close}>X</Text>
            </Pressable>
          </View>

          {ROLES.map((role) => (
            <View key={role.key} style={styles.row}>
              <View style={styles.rowText}>
                <Text style={styles.roleName}>{t(role.nameKey)}</Text>
                <Text style={styles.roleDesc}>{t(role.descKey)}</Text>
                <Text style={styles.roleMin}>{t(role.minKey)}</Text>
              </View>
              <Switch
                value={settings[role.key]}
                onValueChange={(v) => onUpdate({ [role.key]: v })}
                trackColor={{ false: Palermo.border, true: Palermo.accentMuted }}
                thumbColor={settings[role.key] ? Palermo.accent : Palermo.textMuted}
              />
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.roleName}>{t('settings.language')}</Text>
            <View style={styles.langRow}>
              <Pressable
                onPress={() => onUpdate({ language: 'el' })}
                style={[
                  styles.langChip,
                  settings.language === 'el' && styles.langChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.langText,
                    settings.language === 'el' && styles.langTextActive,
                  ]}
                >
                  Ελληνικά
                </Text>
              </Pressable>
              <Pressable
                onPress={() => onUpdate({ language: 'en' })}
                style={[
                  styles.langChip,
                  settings.language === 'en' && styles.langChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.langText,
                    settings.language === 'en' && styles.langTextActive,
                  ]}
                >
                  English
                </Text>
              </Pressable>
            </View>
          </View>
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
  divider: {
    height: 1,
    backgroundColor: Palermo.border,
  },
  langRow: {
    flexDirection: 'row',
    gap: 8,
  },
  langChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Palermo.border,
  },
  langChipActive: {
    borderColor: Palermo.accent,
    backgroundColor: Palermo.accentMuted,
  },
  langText: {
    color: Palermo.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  langTextActive: {
    color: '#fff',
  },
});
