import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSessionStore } from '../../store/session';
import { useTheme, Typography, Spacing, Radius } from '../../lib/theme';

export default function Stage4Screen() {
  const theme = useTheme();
  const { words, setStage } = useSessionStore();
  const stage4Words = words.filter((w) => w.failedInStage3);
  const s = styles(theme);

  function handleNext() {
    setStage(5);
    router.replace('/session/stage5');
  }

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <Text style={s.stageLabel}>DEEP COLLECTION</Text>
        <Text style={s.countText}>{stage4Words.length}개 오답</Text>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.scrollContent}>
        {stage4Words.map((w) => {
          const isDouble = w.failedInStage1 && w.failedInStage3;
          return (
            <View key={w.id} style={[s.card, isDouble && s.cardDouble]}>
              <Text style={[s.wordText, isDouble && s.wordTextDouble]}>
                {w.word}
              </Text>
              <View style={s.divider} />
              <Text style={[s.meaningText, isDouble && s.meaningTextDouble]}>
                {w.meaning}
              </Text>
              {!!w.example && <Text style={s.exampleText}>"{w.example}"</Text>}
            </View>
          );
        })}
      </ScrollView>

      <View style={s.footer}>
        <Pressable
          style={({ pressed }) => [s.confirmButton, pressed && { opacity: 0.85 }]}
          onPress={handleNext}
        >
          <Text style={s.confirmButtonText}>확인 — Final Sweep</Text>
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
    cardDouble: { borderColor: theme.error },
    wordText: { ...Typography.headlineLg, color: theme.text },
    wordTextDouble: { color: theme.error, fontWeight: '700' },
    divider: { height: 1, backgroundColor: theme.borderSubtle },
    meaningText: { ...Typography.bodyLg, color: theme.primary },
    meaningTextDouble: { color: theme.error, fontWeight: '700' },
    exampleText: {
      ...Typography.bodyMd, color: theme.textSecondary, fontStyle: 'italic',
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
