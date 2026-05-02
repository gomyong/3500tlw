import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { getNewWords, getDueWords } from '../../lib/db';
import { useSessionStore, SessionWord } from '../../store/session';
import { useTheme, Typography, Spacing, Radius } from '../../lib/theme';

export default function SessionSetupScreen() {
  const theme = useTheme();
  const [newCount, setNewCount] = useState('20');
  const initSession = useSessionStore((s) => s.initSession);
  const s = styles(theme);

  async function handleStart() {
    const count = Math.min(Math.max(parseInt(newCount, 10) || 20, 1), 100);
    const [newWords, dueWords] = await Promise.all([
      getNewWords(count),
      getDueWords(),
    ]);

    const sessionWords: SessionWord[] = [...dueWords, ...newWords].map((w) => ({
      id: w.id,
      word: w.word,
      meaning: w.meaning,
      example: w.example ?? '',
      currentLevel: 'current_level' in w ? (w as any).current_level : 0,
      failCount: 'fail_count' in w ? (w as any).fail_count : 0,
      wasCorrectInSession: null,
      failedInStage1: false,
      failedInStage3: false,
    }));

    // Shuffle
    for (let i = sessionWords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [sessionWords[i], sessionWords[j]] = [sessionWords[j], sessionWords[i]];
    }

    initSession(sessionWords, false);
    router.replace('/session/stage0');
  }

  return (
    <SafeAreaView style={s.container}>
      <Pressable style={s.closeBtn} onPress={() => router.back()}>
        <Text style={s.closeBtnText}>✕</Text>
      </Pressable>

      <Text style={s.heading}>학습 설정</Text>
      <Text style={s.desc}>신규 단어 수를 설정하세요.</Text>
      <Text style={s.desc2}>복습 대기 단어는 자동으로 포함됩니다.</Text>

      <View style={s.inputRow}>
        <Text style={s.inputLabel}>신규 단어</Text>
        <TextInput
          style={s.input}
          keyboardType="number-pad"
          value={newCount}
          onChangeText={setNewCount}
          maxLength={3}
          selectTextOnFocus
        />
        <Text style={s.inputUnit}>개</Text>
      </View>

      <Pressable
        style={({ pressed }) => [s.startButton, pressed && { opacity: 0.8 }]}
        onPress={handleStart}
      >
        <Text style={s.startButtonText}>시작</Text>
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
    closeBtn: {
      alignSelf: 'flex-end',
      padding: Spacing.sm,
      marginTop: Spacing.sm,
    },
    closeBtnText: {
      ...Typography.bodyLg,
      color: theme.textSecondary,
    },
    heading: {
      ...Typography.headlineLg,
      color: theme.text,
      marginTop: Spacing.lg,
      marginBottom: Spacing.sm,
    },
    desc: {
      ...Typography.bodyMd,
      color: theme.text,
    },
    desc2: {
      ...Typography.bodyMd,
      color: theme.textSecondary,
      marginBottom: Spacing.xl,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.surface,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: theme.border,
      padding: Spacing.md,
      marginBottom: Spacing.xl,
      gap: Spacing.sm,
    },
    inputLabel: {
      ...Typography.bodyMd,
      color: theme.text,
      flex: 1,
    },
    input: {
      ...Typography.headlineMd,
      color: theme.text,
      textAlign: 'right',
      minWidth: 60,
    },
    inputUnit: {
      ...Typography.bodyMd,
      color: theme.textSecondary,
    },
    startButton: {
      backgroundColor: theme.primary,
      borderRadius: Radius.md,
      paddingVertical: Spacing.md,
      alignItems: 'center',
    },
    startButtonText: {
      ...Typography.bodyLg,
      color: theme.onPrimary,
      fontWeight: '600',
    },
  });
