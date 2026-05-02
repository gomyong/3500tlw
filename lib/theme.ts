import { useColorScheme } from 'react-native';

export const Colors = {
  light: {
    background: '#fbf9f8',
    surface: '#ffffff',
    surfaceContainer: '#f0eded',
    surfaceContainerHigh: '#eae8e7',
    primary: '#1F6F5F',
    primaryDark: '#005648',
    onPrimary: '#ffffff',
    text: '#1b1c1c',
    textSecondary: '#3f4945',
    border: '#e4e2e1',
    borderSubtle: '#eae8e7',
    buttonSecondary: '#eeeeee',
    buttonSecondaryText: '#5d5f5f',
    error: '#ba1a1a',
    errorContainer: '#ffdad6',
    progressTrack: '#e4e2e1',
  },
  dark: {
    background: '#161918',
    surface: '#1e2520',
    surfaceContainer: '#252d29',
    surfaceContainerHigh: '#2e3632',
    primary: '#8ad5c1',
    primaryDark: '#8ad5c1',
    onPrimary: '#003729',
    text: '#e1e3e1',
    textSecondary: '#8c9490',
    border: '#3d4641',
    borderSubtle: '#2e3632',
    buttonSecondary: '#2a3330',
    buttonSecondaryText: '#8c9490',
    error: '#ffb4ab',
    errorContainer: '#93000a',
    progressTrack: '#3d4641',
  },
};

export function useTheme() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? Colors.dark : Colors.light;
}

export const Typography = {
  displayWord: { fontSize: 40, fontWeight: '700' as const, letterSpacing: -0.8, lineHeight: 48 },
  headlineLg: { fontSize: 24, fontWeight: '600' as const, letterSpacing: -0.24, lineHeight: 32 },
  headlineMd: { fontSize: 20, fontWeight: '500' as const, letterSpacing: -0.2, lineHeight: 28 },
  bodyLg: { fontSize: 18, fontWeight: '400' as const, letterSpacing: 0, lineHeight: 28 },
  bodyMd: { fontSize: 16, fontWeight: '400' as const, letterSpacing: 0, lineHeight: 24 },
  labelMd: { fontSize: 13, fontWeight: '500' as const, letterSpacing: 0.26, lineHeight: 18 },
  labelSm: { fontSize: 12, fontWeight: '700' as const, letterSpacing: 0.6, lineHeight: 16 },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 48,
  gutter: 20,
  margin: 20,
};

export const Radius = {
  sm: 2,
  md: 4,
  lg: 8,
  xl: 12,
  full: 9999,
};
