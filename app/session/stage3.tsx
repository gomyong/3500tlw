import { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSessionStore, SessionWord } from '../../store/session';
import { useTheme, Typography, Spacing, Radius } from '../../lib/theme';

export default function Stage3Screen() {
  const theme = useTheme();
  const { getStage3Words, setStage } = useSessionStore();
  const words = getStage3Words();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localWords] = useState<SessionWord[]>(() =>
    words.map((w) => ({ ...w, failedInStage3: false }))
  );
  const [localResults, setLocalResults] = useState<boolean[]>(() => words.map(() => true));
  const s = styles(theme);

  const isDone = currentIndex >= localWords.length;

  useEffect(() => {
    if (!isDone) return;
    const store = useSessionStore.getState();
    const updatedWords = store.words.map((w) => {
      const idx = localWords.findIndex((l) => l.id === w.id);
      if (idx === -1) return w;
      return { ...w, failedInStage3: !localResults[idx] };
    });
    useSessionStore.setState({ words: updatedWords });
    const anyFailed = localResults.some((r) => !r);
    if (anyFailed) {
      setStage(4);
      router.replace('/session/stage4');
    } else {
      setStage(5);
      router.replace('/session/stage5');
    }
  }, [isDone]);

  if (isDone || localWords.length === 0) return null;

  const word = localWords[currentIndex];
  const total = localWords.length;
  const current = currentIndex + 1;
  const progress = current / total;

  function handleAnswer(correct: boolean) {
    setLocalResults((prev) => {
      const updated = [...prev];
      updated[currentIndex] = correct;
      return updated;
    });
    setCurrentIndex((i) => i + 1);
  }

  return (
    <SafeAreaView style={s.container}>
      <View style={s.progressSection}>
        <Text style={s.stageLabel}>RE-TEST</Text>
        <Text style={s.progressCount}>
          <Text style={s.progressCurrent}>{current}</Text>
          <Text style={s.progressTotal}> / {total}</Text>
        </Text>
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      <View style={s.cardArea}>
        <View style={s.card}>
          <Text style={s.cardLabel}>학습 단어</Text>
          <Text style={s.wordText}>{word.word.toUpperCase()}</Text>
        </View>
      </View>

      <View style={s.footer}>
        <View style={s.buttonRow}>
          <Pressable
            style={({ pressed }) => [s.wrongButton, pressed && { opacity: 0.85 }]}
            onPress={() => handleAnswer(false)}
          >
            <Text style={s.wrongButtonText}>몰랐다</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [s.correctButton, pressed && { opacity: 0.85 }]}
            onPress={() => handleAnswer(true)}
          >
            <Text style={s.correctButtonText}>알았다</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    progressSection: {
      alignItems: 'center',
      paddingTop: Spacing.xl,
      paddingBottom: Spacing.lg,
      gap: Spacing.xs,
    },
    stageLabel: {
      ...Typography.labelSm,
      color: theme.textSecondary,
      letterSpacing: 3,
      textTransform: 'uppercase',
    },
    progressCount: { lineHeight: 36 },
    progressCurrent: { ...Typography.headlineLg, color: theme.primary, fontWeight: '700' },
    progressTotal: { ...Typography.headlineMd, color: theme.textSecondary },
    progressTrack: {
      width: 160, height: 3,
      backgroundColor: theme.progressTrack,
      borderRadius: Radius.full, overflow: 'hidden',
      marginTop: Spacing.xs,
    },
    progressFill: {
      height: '100%', backgroundColor: theme.primary, borderRadius: Radius.full,
    },
    cardArea: {
      flex: 1, paddingHorizontal: Spacing.margin, justifyContent: 'center',
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: Radius.xl,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: Spacing.xl,
      paddingVertical: Spacing.xl,
      gap: Spacing.sm,
    },
    cardLabel: {
      ...Typography.labelSm,
      color: theme.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 2,
    },
    wordText: { ...Typography.displayWord, color: theme.text },
    footer: {
      paddingHorizontal: Spacing.margin,
      paddingVertical: Spacing.lg,
      paddingBottom: Spacing.xl,
    },
    buttonRow: { flexDirection: 'row', gap: Spacing.md },
    wrongButton: {
      flex: 1, backgroundColor: theme.buttonSecondary,
      borderRadius: Radius.lg, paddingVertical: 18, alignItems: 'center',
    },
    wrongButtonText: { ...Typography.headlineMd, color: theme.buttonSecondaryText },
    correctButton: {
      flex: 1, backgroundColor: theme.primary,
      borderRadius: Radius.lg, paddingVertical: 18, alignItems: 'center',
    },
    correctButtonText: { ...Typography.headlineMd, color: theme.onPrimary },
  });
