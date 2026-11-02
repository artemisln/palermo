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
