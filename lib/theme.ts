import { useColorScheme } from 'react-native';

export const Colors = {
  light: {
    background: '#f8f9ff',
    surface: '#ffffff',
    surfaceVariant: '#e5eeff',
    primary: '#005648',
    primaryContainer: '#1f6f5f',
    onPrimary: '#ffffff',
    text: '#0d1c2e',
    textSecondary: '#3f4945',
    border: '#bec9c4',
    borderSubtle: '#dce9ff',
    error: '#E53E3E',
    errorContainer: '#ffdad6',
  },
  dark: {
    background: '#0d1c2e',
    surface: '#162233',
    surfaceVariant: '#1e2f45',
    primary: '#8ad5c1',
    primaryContainer: '#005648',
    onPrimary: '#00201a',
    text: '#eaf1ff',
    textSecondary: '#bec9c4',
    border: '#3f4945',
    borderSubtle: '#223144',
    error: '#ff8c8c',
    errorContainer: '#93000a',
  },
};

export function useTheme() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? Colors.dark : Colors.light;
}

export const Typography = {
  displayLg: { fontSize: 48, fontWeight: '700' as const, letterSpacing: -0.96, lineHeight: 58 },
  headlineLg: { fontSize: 32, fontWeight: '700' as const, letterSpacing: -0.32, lineHeight: 42 },
  headlineMd: { fontSize: 24, fontWeight: '600' as const, letterSpacing: -0.24, lineHeight: 34 },
  bodyLg: { fontSize: 18, fontWeight: '400' as const, letterSpacing: 0, lineHeight: 29 },
  bodyMd: { fontSize: 16, fontWeight: '400' as const, letterSpacing: 0, lineHeight: 26 },
  labelMd: { fontSize: 14, fontWeight: '500' as const, letterSpacing: 0.28, lineHeight: 20 },
  labelSm: { fontSize: 12, fontWeight: '600' as const, letterSpacing: 0.36, lineHeight: 17 },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 48,
  gutter: 20,
  margin: 24,
};

export const Radius = {
  sm: 4,
  md: 6,
  lg: 12,
  full: 9999,
};
