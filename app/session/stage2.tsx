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
      <Text style={s.counter}>{words.length}개 오답</Text>
      <Text style={s.stageLabel}>COLLECTION</Text>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}>
        {words.map((w) => (
          <View key={w.id} style={s.card}>
            <Text style={s.wordText}>{w.word}</Text>
            <View style={s.divider} />
            <Text style={s.meaningText}>{w.meaning}</Text>
            {!!w.example && <Text style={s.exampleText}>{w.example}</Text>}
          </View>
        ))}
      </ScrollView>

      <Pressable
        style={({ pressed }) => [s.confirmButton, pressed && { opacity: 0.8 }]}
        onPress={handleNext}
      >
        <Text style={s.confirmButtonText}>확인 — 재시험으로</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: Spacing.margin,
    },
    counter: {
      ...Typography.labelMd,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: Spacing.lg,
    },
    stageLabel: {
      ...Typography.labelSm,
      color: theme.textSecondary,
      textAlign: 'center',
      letterSpacing: 3,
      marginTop: Spacing.xs,
      marginBottom: Spacing.md,
    },
    scroll: { flex: 1 },
    scrollContent: { gap: Spacing.sm, paddingBottom: Spacing.md },
    card: {
      backgroundColor: theme.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
      padding: Spacing.lg,
    },
    wordText: {
      ...Typography.headlineMd,
      color: theme.text,
      marginBottom: Spacing.sm,
    },
    divider: {
      height: 1,
      backgroundColor: theme.borderSubtle,
      marginBottom: Spacing.sm,
    },
    meaningText: {
      ...Typography.bodyLg,
      color: theme.text,
    },
    exampleText: {
      ...Typography.bodyMd,
      color: theme.textSecondary,
      fontStyle: 'italic',
      marginTop: Spacing.xs,
    },
    confirmButton: {
      backgroundColor: theme.primary,
      borderRadius: Radius.md,
      paddingVertical: Spacing.md,
      alignItems: 'center',
      marginTop: Spacing.sm,
      marginBottom: Spacing.md,
    },
    confirmButtonText: {
      ...Typography.bodyLg,
      color: theme.onPrimary,
      fontWeight: '600',
    },
  });
