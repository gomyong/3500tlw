import { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSessionStore } from '../../store/session';
import { useTheme, Typography, Spacing, Radius } from '../../lib/theme';

export default function Stage1Screen() {
  const theme = useTheme();
  const { words, currentIndex, markCorrect, markWrong, advanceIndex, setStage, getStage2Words } =
    useSessionStore();

  const isDone = currentIndex >= words.length;
  const s = styles(theme);

  useEffect(() => {
    if (!isDone || words.length === 0) return;
    const failedWords = getStage2Words();
    if (failedWords.length === 0) {
      // All correct — stage5 will detect empty pool and commit+finish
      router.replace('/session/stage5');
    } else {
      setStage(2);
      router.replace('/session/stage2');
    }
  }, [isDone]);

  if (isDone || words.length === 0) return null;

  const word = words[currentIndex];
  const total = words.length;
  const current = currentIndex + 1;

  function handleAnswer(correct: boolean) {
    if (correct) {
      markCorrect();
    } else {
      markWrong();
    }
    advanceIndex();
  }

  return (
    <SafeAreaView style={s.container}>
      <Text style={s.counter}>{current} / {total}</Text>
      <Text style={s.stageLabel}>TEST</Text>

      <View style={s.card}>
        <Text style={s.wordText}>{word.word}</Text>
      </View>

      <View style={s.buttonRow}>
        <Pressable
          style={({ pressed }) => [s.wrongButton, pressed && { opacity: 0.8 }]}
          onPress={() => handleAnswer(false)}
        >
          <Text style={s.wrongButtonText}>몰랐다</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [s.correctButton, pressed && { opacity: 0.8 }]}
          onPress={() => handleAnswer(true)}
        >
          <Text style={s.correctButtonText}>알았다</Text>
        </Pressable>
      </View>
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
      marginBottom: Spacing.xl,
    },
    card: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    wordText: {
      ...Typography.displayLg,
      color: theme.text,
      textAlign: 'center',
    },
    buttonRow: {
      flexDirection: 'row',
      gap: Spacing.sm,
      paddingBottom: Spacing.lg,
    },
    wrongButton: {
      flex: 1,
      borderWidth: 1.5,
      borderColor: theme.error,
      borderRadius: Radius.md,
      paddingVertical: Spacing.md,
      alignItems: 'center',
    },
    wrongButtonText: {
      ...Typography.bodyLg,
      color: theme.error,
      fontWeight: '600',
    },
    correctButton: {
      flex: 1,
      backgroundColor: theme.primary,
      borderRadius: Radius.md,
      paddingVertical: Spacing.md,
      alignItems: 'center',
    },
    correctButtonText: {
      ...Typography.bodyLg,
      color: theme.onPrimary,
      fontWeight: '600',
    },
  });
