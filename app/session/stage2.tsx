import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSessionStore } from '../../store/session';
import { useTheme, Typography, Spacing, Radius } from '../../lib/theme';

export default function Stage2Screen() {
  const theme = useTheme();
  const { getStage2Words, setStage } = useSessionStore();
  const words = getStage2Words();
  const s = styles(theme);

  function handleNext() {
    setStage(3);
    router.replace('/session/stage3');
  }

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <Text style={s.stageLabel}>COLLECTION</Text>
        <Text style={s.countText}>{words.length}개 오답</Text>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}>
        {words.map((w) => (
          <View key={w.id} style={s.card}>
            <Text style={s.wordText}>{w.word.toUpperCase()}</Text>
            <View style={s.divider} />
            <Text style={s.meaningText}>{w.meaning}</Text>
            {!!w.example && <Text style={s.exampleText}>"{w.example}"</Text>}
          </View>
        ))}
      </ScrollView>

      <View style={s.footer}>
        <Pressable
          style={({ pressed }) => [s.confirmButton, pressed && { opacity: 0.85 }]}
          onPress={handleNext}
        >
          <Text style={s.confirmButtonText}>확인 — 재시험</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: {
      alignItems: 'center',
      paddingTop: Spacing.xl,
      paddingBottom: Spacing.md,
    },
    stageLabel: {
      ...Typography.labelSm,
      color: theme.textSecondary,
      letterSpacing: 3,
      textTransform: 'uppercase',
    },
    countText: {
      ...Typography.headlineLg,
      color: theme.primary,
      fontWeight: '700',
      marginTop: Spacing.xs,
    },
    scroll: { flex: 1 },
    scrollContent: {
      gap: Spacing.sm,
      paddingHorizontal: Spacing.margin,
      paddingBottom: Spacing.md,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: Radius.xl,
      borderWidth: 1,
      borderColor: theme.border,
      padding: Spacing.lg,
      gap: Spacing.sm,
    },
    wordText: { ...Typography.headlineLg, color: theme.text },
    divider: { height: 1, backgroundColor: theme.borderSubtle },
    meaningText: { ...Typography.bodyLg, color: theme.primary },
    exampleText: {
      ...Typography.bodyMd,
      color: theme.textSecondary,
      fontStyle: 'italic',
    },
    footer: {
      paddingHorizontal: Spacing.margin,
      paddingVertical: Spacing.lg,
      paddingBottom: Spacing.xl,
    },
    confirmButton: {
      backgroundColor: theme.primary,
      borderRadius: Radius.lg,
      paddingVertical: 18,
      alignItems: 'center',
    },
    confirmButtonText: { ...Typography.headlineMd, color: theme.onPrimary },
  });
