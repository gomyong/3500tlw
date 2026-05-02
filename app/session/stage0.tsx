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
      <Text style={s.counter}>{current} / {total}</Text>
      <Text style={s.stageLabel}>MEMORIZE</Text>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.card}>
          <Text style={s.wordText}>{word.word}</Text>
          <View style={s.divider} />
          <Text style={s.meaningText}>{word.meaning}</Text>
          {!!word.example && (
            <Text style={s.exampleText}>"{word.example}"</Text>
          )}
        </View>
      </ScrollView>

      <View style={s.buttonRow}>
        <Pressable
          style={({ pressed }) => [
            s.prevButton,
            currentIndex === 0 && s.buttonDisabled,
            pressed && { opacity: 0.6 },
          ]}
          onPress={handlePrev}
          disabled={currentIndex === 0}
        >
          <Text style={[s.prevButtonText, currentIndex === 0 && s.buttonDisabled]}>
            ← 이전
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [s.nextButton, pressed && { opacity: 0.8 }]}
          onPress={handleNext}
        >
          <Text style={s.nextButtonText}>
            {isLast ? '테스트 시작 →' : '다음 →'}
          </Text>
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
      marginBottom: Spacing.md,
    },
    scroll: { flex: 1 },
    scrollContent: {
      paddingVertical: Spacing.sm,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
      padding: Spacing.xl,
    },
    wordText: {
      ...Typography.displayLg,
      color: theme.text,
      marginBottom: Spacing.lg,
    },
    divider: {
      height: 1,
      backgroundColor: theme.borderSubtle,
      marginBottom: Spacing.lg,
    },
    meaningText: {
      ...Typography.headlineMd,
      color: theme.primary,
      marginBottom: Spacing.sm,
    },
    exampleText: {
      ...Typography.bodyMd,
      color: theme.textSecondary,
      fontStyle: 'italic',
      marginTop: Spacing.sm,
      lineHeight: 24,
    },
    buttonRow: {
      flexDirection: 'row',
      gap: Spacing.sm,
      paddingVertical: Spacing.md,
    },
    prevButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: Radius.md,
      paddingVertical: Spacing.md,
      alignItems: 'center',
    },
    prevButtonText: {
      ...Typography.bodyLg,
      color: theme.textSecondary,
      fontWeight: '600',
    },
    nextButton: {
      flex: 2,
      backgroundColor: theme.primary,
      borderRadius: Radius.md,
      paddingVertical: Spacing.md,
      alignItems: 'center',
    },
    nextButtonText: {
      ...Typography.bodyLg,
      color: theme.onPrimary,
      fontWeight: '600',
    },
    buttonDisabled: {
      opacity: 0.3,
    },
  });
