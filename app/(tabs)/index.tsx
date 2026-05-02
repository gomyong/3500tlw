import { useCallback, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { getProgressSummary } from '../../lib/db';
import { useTheme, Typography, Spacing, Radius } from '../../lib/theme';

type Summary = { mastered: number; due_today: number };

export default function HomeScreen() {
  const theme = useTheme();
  const [summary, setSummary] = useState<Summary>({ mastered: 0, due_today: 0 });

  useFocusEffect(
    useCallback(() => {
      getProgressSummary().then((s) =>
        setSummary({ mastered: s.mastered, due_today: s.due_today })
      );
    }, [])
  );

  const s = styles(theme);
  const masteredPct = Math.round((summary.mastered / 3500) * 100);

  return (
    <SafeAreaView style={s.container}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.appLabel}>THE LAST WORD</Text>
        <Text style={s.totalCount}>3,500</Text>
      </View>

      {/* Progress bar */}
      <View style={s.progressSection}>
        <View style={s.progressTrack}>
          <View style={[s.progressFill, { width: `${masteredPct}%` }]} />
        </View>
        <Text style={s.progressText}>{summary.mastered} / 3,500 정복</Text>
      </View>

      {/* Stats */}
      <View style={s.statsRow}>
        <View style={s.statBlock}>
          <Text style={s.statValue}>{summary.due_today}</Text>
          <Text style={s.statLabel}>학습 대기</Text>
        </View>
        <View style={s.statDivider} />
        <View style={s.statBlock}>
          <Text style={s.statValue}>{summary.mastered}</Text>
          <Text style={s.statLabel}>정복 완료</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={s.actions}>
        <Pressable
          style={({ pressed }) => [s.primaryButton, pressed && { opacity: 0.85 }]}
          onPress={() => router.push('/session/setup')}
        >
          <Text style={s.primaryButtonText}>오늘 학습 시작</Text>
        </Pressable>

        {summary.due_today > 0 && (
          <Pressable
            style={({ pressed }) => [s.secondaryButton, pressed && { opacity: 0.85 }]}
            onPress={() => router.push('/review')}
          >
            <Text style={s.secondaryButtonText}>복습만 하기</Text>
          </Pressable>
        )}
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
    header: {
      marginTop: Spacing.xl,
      marginBottom: Spacing.lg,
    },
    appLabel: {
      ...Typography.labelSm,
      color: theme.textSecondary,
      letterSpacing: 3,
      marginBottom: Spacing.xs,
    },
    totalCount: {
      fontSize: 56,
      fontWeight: '700',
      color: theme.text,
      letterSpacing: -1.5,
      lineHeight: 64,
    },
    progressSection: {
      marginBottom: Spacing.lg,
      gap: Spacing.xs,
    },
    progressTrack: {
      height: 4,
      backgroundColor: theme.progressTrack,
      borderRadius: Radius.full,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.primary,
      borderRadius: Radius.full,
    },
    progressText: {
      ...Typography.labelMd,
      color: theme.primary,
    },
    statsRow: {
      flexDirection: 'row',
      backgroundColor: theme.surface,
      borderRadius: Radius.xl,
      borderWidth: 1,
      borderColor: theme.border,
      paddingVertical: Spacing.lg,
      marginBottom: Spacing.lg,
    },
    statBlock: {
      flex: 1,
      alignItems: 'center',
      gap: Spacing.xs,
    },
    statDivider: {
      width: 1,
      backgroundColor: theme.border,
    },
    statValue: {
      ...Typography.headlineLg,
      color: theme.primary,
      fontWeight: '700',
    },
    statLabel: {
      ...Typography.labelMd,
      color: theme.textSecondary,
    },
    actions: {
      gap: Spacing.sm,
    },
    primaryButton: {
      backgroundColor: theme.primary,
      borderRadius: Radius.lg,
      paddingVertical: 18,
      alignItems: 'center',
    },
    primaryButtonText: {
      ...Typography.headlineMd,
      color: theme.onPrimary,
    },
    secondaryButton: {
      backgroundColor: theme.buttonSecondary,
      borderRadius: Radius.lg,
      paddingVertical: 18,
      alignItems: 'center',
    },
    secondaryButtonText: {
      ...Typography.headlineMd,
      color: theme.buttonSecondaryText,
    },
  });
