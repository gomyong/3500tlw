import { useEffect, useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { getProgressSummary } from '../../lib/db';
import { useTheme, Typography, Spacing, Radius } from '../../lib/theme';

type Summary = {
  mastered: number;
  due_today: number;
};

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

  return (
    <SafeAreaView style={s.container}>
      <View style={s.header}>
        <Text style={s.title}>The Last Word</Text>
        <Text style={s.subtitle}>3,500</Text>
      </View>

      <View style={s.statsRow}>
        <View style={s.statBlock}>
          <Text style={s.statValue}>{summary.due_today}</Text>
          <Text style={s.statLabel}>학습 대기</Text>
        </View>
        <View style={s.divider} />
        <View style={s.statBlock}>
          <Text style={s.statValue}>
            {summary.mastered}
            <Text style={s.statTotal}> / 3,500</Text>
          </Text>
          <Text style={s.statLabel}>정복 완료</Text>
        </View>
      </View>

      <View style={s.actions}>
        <Pressable
          style={({ pressed }) => [s.primaryButton, pressed && s.buttonPressed]}
          onPress={() => router.push('/session/setup')}
        >
          <Text style={s.primaryButtonText}>오늘 학습 시작</Text>
        </Pressable>

        {summary.due_today > 0 && (
          <Pressable
            style={({ pressed }) => [s.secondaryButton, pressed && s.buttonPressed]}
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
      marginBottom: Spacing.xl,
    },
    title: {
      ...Typography.labelMd,
      color: theme.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 2,
      marginBottom: Spacing.xs,
    },
    subtitle: {
      ...Typography.displayLg,
      color: theme.text,
    },
    statsRow: {
      flexDirection: 'row',
      backgroundColor: theme.surface,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: theme.borderSubtle,
      padding: Spacing.lg,
      marginBottom: Spacing.xl,
    },
    statBlock: {
      flex: 1,
      alignItems: 'center',
    },
    divider: {
      width: 1,
      backgroundColor: theme.borderSubtle,
      marginHorizontal: Spacing.md,
    },
    statValue: {
      ...Typography.headlineLg,
      color: theme.text,
      marginBottom: Spacing.xs,
    },
    statTotal: {
      ...Typography.bodyMd,
      color: theme.textSecondary,
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
      borderRadius: Radius.md,
      paddingVertical: Spacing.md,
      alignItems: 'center',
    },
    buttonPressed: {
      opacity: 0.8,
    },
    primaryButtonText: {
      ...Typography.bodyLg,
      color: theme.onPrimary,
      fontWeight: '600',
    },
    secondaryButton: {
      borderWidth: 1.5,
      borderColor: theme.primary,
      borderRadius: Radius.md,
      paddingVertical: Spacing.md,
      alignItems: 'center',
    },
    secondaryButtonText: {
      ...Typography.bodyLg,
      color: theme.primary,
      fontWeight: '600',
    },
  });
