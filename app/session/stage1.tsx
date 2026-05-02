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

  // Focus input on each new word
  useEffect(() => {
    if (submitted) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(timer);
  }, [currentIndex, submitted]);

  if (isDone || words.length === 0) return null;

  const word = words[currentIndex];
  const total = words.length;
  const current = currentIndex + 1;

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
        <Text style={s.counter}>{current} / {total}</Text>
        <Text style={s.stageLabel}>TEST</Text>

        {/* Word card */}
        <View style={s.card}>
          <Text style={s.wordText}>{word.word}</Text>
        </View>

        {!submitted ? (
          /* ── Input phase ── */
          <View style={s.inputArea}>
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
                pressed && { opacity: 0.8 },
              ]}
              onPress={handleSubmit}
              disabled={userInput.trim().length === 0}
            >
              <Text style={s.submitButtonText}>확인</Text>
            </Pressable>
          </View>
        ) : (
          /* ── Result phase ── */
          <ScrollView
            style={s.resultScroll}
            contentContainerStyle={s.resultContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={[s.resultCard, isCorrect ? s.resultCorrectCard : s.resultWrongCard]}>
              <Text style={[s.resultBadge, isCorrect ? s.badgeCorrect : s.badgeWrong]}>
                {isCorrect ? '정답' : '오답'}
              </Text>

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

            <Pressable
              style={({ pressed }) => [s.nextButton, pressed && { opacity: 0.8 }]}
              onPress={handleNext}
            >
              <Text style={s.nextButtonText}>다음 →</Text>
            </Pressable>
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
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: Spacing.xl,
    },
    wordText: {
      ...Typography.displayLg,
      color: theme.text,
      textAlign: 'center',
    },
    /* ── Input phase ── */
    inputArea: {
      gap: Spacing.sm,
    },
    input: {
      ...Typography.bodyLg,
      color: theme.text,
      backgroundColor: theme.surface,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: theme.border,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.md,
    },
    submitButton: {
      backgroundColor: theme.primary,
      borderRadius: Radius.md,
      paddingVertical: Spacing.md,
      alignItems: 'center',
    },
    submitDisabled: {
      opacity: 0.4,
    },
    submitButtonText: {
      ...Typography.bodyLg,
      color: theme.onPrimary,
      fontWeight: '600',
    },
    /* ── Result phase ── */
    resultScroll: { flex: 1 },
    resultContent: { gap: Spacing.sm },
    resultCard: {
      borderRadius: Radius.lg,
      borderWidth: 1,
      padding: Spacing.lg,
      gap: Spacing.sm,
    },
    resultCorrectCard: {
      backgroundColor: theme.surface,
      borderColor: theme.primary,
    },
    resultWrongCard: {
      backgroundColor: theme.surface,
      borderColor: theme.error,
    },
    resultBadge: {
      ...Typography.labelMd,
      fontWeight: '700',
      letterSpacing: 1,
      marginBottom: Spacing.xs,
    },
    badgeCorrect: {
      color: theme.primary,
    },
    badgeWrong: {
      color: theme.error,
    },
    answerRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: Spacing.sm,
    },
    answerLabel: {
      ...Typography.labelMd,
      color: theme.textSecondary,
      width: 36,
      paddingTop: 2,
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
      marginTop: Spacing.xs,
    },
    nextButton: {
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
  });
