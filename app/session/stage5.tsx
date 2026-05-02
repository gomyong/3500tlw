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
      await updateWordAfterSession(w.id, !w.failedInStage1, w.currentLevel, w.failCount);
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

  useEffect(() => {
    if (pool.length === 0) finishSession();
  }, []);

  function handleAnswer(correct: boolean) {
    if (correct) {
      const newPool = pool.filter((_, i) => i !== currentIndex);
      if (newPool.length === 0) { finishSession(); return; }
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

  const total = pool.length;
  const progress = 1 - total / (getStage5Words().length || 1);

  return (
    <SafeAreaView style={s.container}>
      <View style={s.progressSection}>
        <Text style={s.stageLabel}>FINAL SWEEP</Text>
        <Text style={s.progressCount}>
          <Text style={s.progressCurrent}>{total}</Text>
          <Text style={s.progressTotal}> 개 남음</Text>
        </Text>
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${Math.max(progress, 0.02) * 100}%` }]} />
        </View>
      </View>

      <View style={s.cardArea}>
        <View style={s.card}>
          <Text style={s.cardLabel}>학습 단어</Text>
          <Text style={s.wordText}>{word.word}</Text>
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
      ...Typography.labelSm, color: theme.textSecondary,
      textTransform: 'uppercase', letterSpacing: 2,
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
