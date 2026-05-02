import { useState, useRef, useEffect } from 'react';
import {
  View, Text, Pressable, StyleSheet, TextInput,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSessionStore } from '../../store/session';
import { useTheme, Typography, Spacing, Radius } from '../../lib/theme';

function checkAnswer(userInput: string, meaning: string): boolean {
  const norm = (s: string) => s.trim().replace(/\s+/g, '');
  const userNorm = norm(userInput);
  if (userNorm.length === 0) return false;
  const parts = meaning.split(',').map((p) => norm(p));
  return parts.some((p) => p === userNorm) || norm(meaning) === userNorm;
}

export default function Stage1Screen() {
  const theme = useTheme();
  const { words, currentIndex, markCorrect, markWrong, advanceIndex, setStage, getStage2Words } =
    useSessionStore();

  const [userInput, setUserInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const isDone = currentIndex >= words.length;
  const s = styles(theme);

  useEffect(() => {
    if (!isDone || words.length === 0) return;
    const failed = getStage2Words();
    if (failed.length === 0) {
      router.replace('/session/stage5');
    } else {
      setStage(2);
      router.replace('/session/stage2');
    }
  }, [isDone]);

  useEffect(() => {
    if (submitted) return;
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, [currentIndex, submitted]);

  if (isDone || words.length === 0) return null;

  const word = words[currentIndex];
  const total = words.length;
  const current = currentIndex + 1;
  const progress = current / total;

  function handleSubmit() {
    if (submitted || userInput.trim().length === 0) return;
    const correct = checkAnswer(userInput, word.meaning);
    setIsCorrect(correct);
    setSubmitted(true);
    if (correct) markCorrect(); else markWrong();
  }

  function handleNext() {
    setUserInput('');
    setSubmitted(false);
    advanceIndex();
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={s.container}>
        {/* Progress */}
        <View style={s.progressSection}>
          <Text style={s.progressLabel}>테스트</Text>
          <Text style={s.progressCount}>
            <Text style={s.progressCurrent}>{current}</Text>
            <Text style={s.progressTotal}> / {total}</Text>
          </Text>
          <View style={s.progressTrack}>
            <View style={[s.progressFill, { width: `${progress * 100}%` }]} />
          </View>
        </View>

        {!submitted ? (
          /* ── Input phase ── */
          <>
            <View style={s.cardArea}>
              <View style={s.card}>
                <Text style={s.cardLabel}>학습 단어</Text>
                <Text style={s.wordText}>{word.word.toUpperCase()}</Text>
              </View>
            </View>

            <View style={s.footer}>
              <TextInput
                ref={inputRef}
                style={s.input}
                placeholder="한국어 뜻을 입력하세요"
                placeholderTextColor={theme.textSecondary}
                value={userInput}
                onChangeText={setUserInput}
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
                autoCorrect={false}
                autoCapitalize="none"
              />
              <Pressable
                style={({ pressed }) => [
                  s.submitButton,
                  userInput.trim().length === 0 && s.submitDisabled,
                  pressed && { opacity: 0.85 },
                ]}
                onPress={handleSubmit}
                disabled={userInput.trim().length === 0}
              >
                <Text style={s.submitButtonText}>확인</Text>
              </Pressable>
            </View>
          </>
        ) : (
          /* ── Result phase ── */
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={s.resultContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Word card with result */}
            <View style={[s.card, s.resultCard, isCorrect ? s.resultCorrectCard : s.resultWrongCard]}>
              <Text style={[s.resultBadge, isCorrect ? s.badgeCorrect : s.badgeWrong]}>
                {isCorrect ? '정답' : '오답'}
              </Text>
              <Text style={s.wordText}>{word.word.toUpperCase()}</Text>

              <View style={s.divider} />

              {!isCorrect && (
                <View style={s.answerRow}>
                  <Text style={s.answerLabel}>내 답</Text>
                  <Text style={s.wrongAnswer}>{userInput.trim() || '(미입력)'}</Text>
                </View>
              )}
              <View style={s.answerRow}>
                <Text style={s.answerLabel}>정답</Text>
                <Text style={[s.correctAnswer, isCorrect && s.correctAnswerHighlight]}>
                  {word.meaning}
                </Text>
              </View>
              {!!word.example && (
                <Text style={s.exampleText}>"{word.example}"</Text>
              )}
            </View>

            <View style={s.footer}>
              <Pressable
                style={({ pressed }) => [s.submitButton, pressed && { opacity: 0.85 }]}
                onPress={handleNext}
              >
                <Text style={s.submitButtonText}>다음 →</Text>
              </Pressable>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
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
    cardArea: {
      flex: 1,
      paddingHorizontal: Spacing.margin,
      justifyContent: 'center',
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
    resultCard: {
      marginHorizontal: Spacing.margin,
      marginTop: Spacing.sm,
    },
    resultCorrectCard: {
      borderColor: theme.primary,
    },
    resultWrongCard: {
      borderColor: theme.error,
    },
    cardLabel: {
      ...Typography.labelSm,
      color: theme.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 2,
    },
    wordText: {
      ...Typography.displayWord,
      color: theme.text,
    },
    divider: {
      height: 1,
      backgroundColor: theme.borderSubtle,
      marginVertical: Spacing.xs,
    },
    resultBadge: {
      ...Typography.labelSm,
      letterSpacing: 1.5,
    },
    badgeCorrect: { color: theme.primary },
    badgeWrong: { color: theme.error },
    answerRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: Spacing.sm,
    },
    answerLabel: {
      ...Typography.labelMd,
      color: theme.textSecondary,
      width: 36,
      paddingTop: 3,
    },
    wrongAnswer: {
      ...Typography.bodyLg,
      color: theme.error,
      flex: 1,
    },
    correctAnswer: {
      ...Typography.bodyLg,
      color: theme.text,
      flex: 1,
    },
    correctAnswerHighlight: {
      color: theme.primary,
      fontWeight: '600',
    },
    exampleText: {
      ...Typography.bodyMd,
      color: theme.textSecondary,
      fontStyle: 'italic',
      lineHeight: 22,
      marginTop: Spacing.xs,
    },
    /* ── Footer ── */
    resultContent: {
      paddingBottom: Spacing.xl,
    },
    footer: {
      paddingHorizontal: Spacing.margin,
      paddingTop: Spacing.sm,
      paddingBottom: Spacing.xl,
      gap: Spacing.sm,
    },
    input: {
      ...Typography.bodyLg,
      color: theme.text,
      backgroundColor: theme.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.md,
    },
    submitButton: {
      backgroundColor: theme.primary,
      borderRadius: Radius.lg,
      paddingVertical: 18,
      alignItems: 'center',
    },
    submitDisabled: {
      opacity: 0.35,
    },
    submitButtonText: {
      ...Typography.headlineMd,
      color: theme.onPrimary,
    },
  });
