import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSessionStore } from '../../store/session';
import { useTheme, Typography, Spacing, Radius } from '../../lib/theme';

export default function Stage4Screen() {
  const theme = useTheme();
  const { words, setStage } = useSessionStore();
  // Words that failed both stage 1 and stage 3 = double fail (bold + red)
  const doubleFailWords = words.filter((w) => w.failedInStage1 && w.failedInStage3);
  // Words that failed stage 3 only (new fail in re-test)
  const singleFailWords = words.filter((w) => w.failedInStage1 && !w.failedInStage3 === false && w.failedInStage3);
  // All stage 4 words (failed stage 1, then also failed stage 3)
  const stage4Words = words.filter((w) => w.failedInStage3);

  const s = styles(theme);

  function handleNext() {
    setStage(5);
    router.replace('/session/stage5');
  }

  return (
    <SafeAreaView style={s.container}>
      <Text style={s.counter}>{stage4Words.length}개 오답</Text>
      <Text style={s.stageLabel}>DEEP COLLECTION</Text>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}>
        {stage4Words.map((w) => {
          const isDouble = w.failedInStage1 && w.failedInStage3;
          return (
            <View key={w.id} style={s.card}>
              <Text style={[s.wordText, isDouble && s.wordTextDouble]}>{w.word}</Text>
              <View style={s.divider} />
              <Text style={[s.meaningText, isDouble && s.meaningTextDouble]}>{w.meaning}</Text>
              {!!w.example && <Text style={s.exampleText}>{w.example}</Text>}
            </View>
          );
        })}
      </ScrollView>

      <Pressable
        style={({ pressed }) => [s.confirmButton, pressed && { opacity: 0.8 }]}
        onPress={handleNext}
      >
        <Text style={s.confirmButtonText}>확인 — Final Sweep</Text>
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
    wordTextDouble: {
      fontWeight: '700',
      color: theme.error,
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
    meaningTextDouble: {
      fontWeight: '700',
      color: theme.error,
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
