import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSessionStore } from '../../store/session';
import { useTheme, Typography, Spacing, Radius } from '../../lib/theme';

export default function Stage0Screen() {
  const theme = useTheme();
  const { words, setStage } = useSessionStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const s = styles(theme);

  if (words.length === 0) return null;

  const word = words[currentIndex];
  const total = words.length;
  const current = currentIndex + 1;
  const isLast = currentIndex === total - 1;
  const progress = current / total;

  function handleNext() {
    if (isLast) {
      setStage(1);
      router.replace('/session/stage1');
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  function handlePrev() {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }

  return (
    <SafeAreaView style={s.container}>
      {/* Progress */}
      <View style={s.progressSection}>
        <Text style={s.progressLabel}>암기</Text>
        <Text style={s.progressCount}>
          <Text style={s.progressCurrent}>{current}</Text>
          <Text style={s.progressTotal}> / {total}</Text>
        </Text>
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${progress * 100}%` }]} />
        </View>
      </View>

      {/* Word card */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.card}>
          <Text style={s.cardLabel}>학습 단어</Text>
          <Text style={s.wordText}>{word.word}</Text>
          <View style={s.divider} />
          <Text style={s.meaningText}>{word.meaning}</Text>
          {!!word.example && (
            <Text style={s.exampleText}>"{word.example}"</Text>
          )}
        </View>
      </ScrollView>

      {/* Buttons */}
      <View style={s.footer}>
        <View style={s.buttonRow}>
          <Pressable
            style={({ pressed }) => [
              s.prevButton,
              currentIndex === 0 && s.hiddenButton,
              pressed && { opacity: 0.7 },
            ]}
            onPress={handlePrev}
            disabled={currentIndex === 0}
          >
            <Text style={s.prevButtonText}>← 이전</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [s.nextButton, pressed && { opacity: 0.85 }]}
            onPress={handleNext}
          >
            <Text style={s.nextButtonText}>
              {isLast ? '테스트 시작' : '다음'}
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = (theme: ReturnType<typeof useTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    /* ── Progress ── */
    progressSection: {
      alignItems: 'center',
      paddingTop: Spacing.xl,
      paddingBottom: Spacing.lg,
      paddingHorizontal: Spacing.margin,
      gap: Spacing.xs,
    },
    progressLabel: {
      ...Typography.labelSm,
      color: theme.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 2,
    },
    progressCount: {
      lineHeight: 36,
    },
    progressCurrent: {
      ...Typography.headlineLg,
      color: theme.primary,
      fontWeight: '700',
    },
    progressTotal: {
      ...Typography.headlineMd,
      color: theme.textSecondary,
    },
    progressTrack: {
      width: 160,
      height: 3,
      backgroundColor: theme.progressTrack,
      borderRadius: Radius.full,
      overflow: 'hidden',
      marginTop: Spacing.xs,
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.primary,
      borderRadius: Radius.full,
    },
    /* ── Card ── */
    scroll: { flex: 1 },
    scrollContent: {
      paddingHorizontal: Spacing.margin,
      paddingVertical: Spacing.sm,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: Radius.xl,
      borderWidth: 1,
      borderColor: theme.border,
      padding: Spacing.xl,
      gap: Spacing.sm,
    },
    cardLabel: {
      ...Typography.labelSm,
      color: theme.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginBottom: Spacing.xs,
    },
    wordText: {
      ...Typography.displayWord,
      color: theme.text,
    },
    divider: {
      height: 1,
      backgroundColor: theme.borderSubtle,
      marginVertical: Spacing.sm,
    },
    meaningText: {
      ...Typography.headlineMd,
      color: theme.primary,
      lineHeight: 30,
    },
    exampleText: {
      ...Typography.bodyMd,
      color: theme.textSecondary,
      fontStyle: 'italic',
      lineHeight: 22,
      marginTop: Spacing.xs,
    },
    /* ── Footer ── */
    footer: {
      paddingHorizontal: Spacing.margin,
      paddingVertical: Spacing.lg,
      paddingBottom: Spacing.xl,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: Spacing.md,
    },
    prevButton: {
      flex: 1,
      borderRadius: Radius.lg,
      paddingVertical: 18,
      alignItems: 'center',
      backgroundColor: theme.buttonSecondary,
    },
    hiddenButton: {
      opacity: 0,
    },
    prevButtonText: {
      ...Typography.headlineMd,
      color: theme.buttonSecondaryText,
    },
    nextButton: {
      flex: 2,
      borderRadius: Radius.lg,
      paddingVertical: 18,
      alignItems: 'center',
      backgroundColor: theme.primary,
    },
    nextButtonText: {
      ...Typography.headlineMd,
      color: theme.onPrimary,
    },
  });
