import { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSessionStore, SessionWord } from '../../store/session';
import { updateWordAfterSession, getProgressSummary } from '../../lib/db';
import {
  sendMasteredMilestoneNotification,
  sendMissionCompleteNotification,
  scheduleDailyReviewReminder,
} from '../../lib/notifications';
import { useTheme, Typography, Spacing, Radius } from '../../lib/theme';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Stage5Screen() {
  const theme = useTheme();
  const { words, getStage5Words, resetSession } = useSessionStore();
  const [pool, setPool] = useState<SessionWord[]>(() => shuffle(getStage5Words()));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [finishing, setFinishing] = useState(false);
  const finishCalledRef = useRef(false);
  const s = styles(theme);

  async function finishSession() {
    if (finishCalledRef.current) return;
    finishCalledRef.current = true;
    setFinishing(true);

    for (const w of words) {
      const wasCorrect = !w.failedInStage1;
      await updateWordAfterSession(w.id, wasCorrect, w.currentLevel, w.failCount);
    }

    const summary = await getProgressSummary();

    if (summary.mastered >= 3500) {
      await sendMissionCompleteNotification();
      resetSession();
      router.replace('/termination');
      return;
    }

    if (summary.mastered > 0 && summary.mastered % 10 === 0) {
      await sendMasteredMilestoneNotification(summary.mastered);
    }
    await scheduleDailyReviewReminder(summary.due_today);
    resetSession();
    router.replace('/(tabs)');
  }

  // Handle case where there are no wrong words (all correct in stage1)
  useEffect(() => {
    if (pool.length === 0) {
      finishSession();
    }
  }, []);

  function handleAnswer(correct: boolean) {
    if (correct) {
      const newPool = pool.filter((_, i) => i !== currentIndex);
      if (newPool.length === 0) {
        finishSession();
        return;
      }
      setPool(shuffle(newPool));
      setCurrentIndex(0);
    } else {
      setCurrentIndex((i) => (i + 1) % pool.length);
    }
  }

  if (finishing || pool.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  const word = pool[currentIndex];
  if (!word) return null;

  return (
    <SafeAreaView style={s.container}>
      <Text style={s.counter}>{pool.length}개 남음</Text>
      <Text style={s.stageLabel}>FINAL SWEEP</Text>

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
