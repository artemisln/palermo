import { Platform } from 'react-native';

export const Palermo = {
  background: '#0B0E14',
  backgroundLight: '#131820',
  card: '#1A1F2B',
  danger: '#B91C1C',
  dangerMuted: '#7F1D1D',
  accent: '#0EA5A4',
  accentMuted: '#0D6B6B',
  text: '#E5E7EB',
  textMuted: '#9CA3AF',
  textDead: '#4B5563',
  border: '#2A2F3A',
  overlay: 'rgba(0,0,0,0.7)',
};

export const PalermoFonts = Platform.select({
  ios: {
    title: 'Georgia',
    body: 'System',
  },
  default: {
    title: 'serif',
    body: 'normal',
  },
});

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#0a7ea4',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0a7ea4',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: '#fff',
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#fff',
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
