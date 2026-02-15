import { Pressable, StyleSheet, Text } from 'react-native';
import { Palermo } from '@/constants/theme';

interface BackButtonProps {
  onPress: () => void;
}

export function BackButton({ onPress }: BackButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      hitSlop={12}
    >
      <Text style={styles.chevron}>{'\u2039'}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: 48,
    left: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    backgroundColor: Palermo.card,
  },
  chevron: {
    color: Palermo.text,
    fontSize: 24,
    lineHeight: 28,
    marginTop: -1,
  },
});
